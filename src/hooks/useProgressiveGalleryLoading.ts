
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CardPosition } from '@/utils/galleryLayouts';

interface LoadingState {
  phase: 'initializing' | 'loading-visible' | 'loading-background' | 'complete';
  loadedCards: Set<string>;
  totalCards: number;
  visibleCards: number;
  backgroundCards: number;
  progress: number;
}

interface ProgressiveLoadingConfig {
  initialBatchSize: number;
  batchSize: number;
  loadingDelay: number;
  prioritizeVisible: boolean;
}

const DEFAULT_CONFIG: ProgressiveLoadingConfig = {
  initialBatchSize: 5,
  batchSize: 3,
  loadingDelay: 100,
  prioritizeVisible: true
};

export const useProgressiveGalleryLoading = (
  cardPositions: CardPosition[], 
  visibleCardIds: string[],
  config: Partial<ProgressiveLoadingConfig> = {}
) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [loadingState, setLoadingState] = useState<LoadingState>({
    phase: 'initializing',
    loadedCards: new Set(),
    totalCards: 0,
    visibleCards: 0,
    backgroundCards: 0,
    progress: 0
  });

  // Prioritize cards for loading
  const cardLoadingQueue = useMemo(() => {
    const visible = cardPositions.filter(pos => visibleCardIds.includes(pos.card.id));
    const background = cardPositions.filter(pos => !visibleCardIds.includes(pos.card.id));
    
    return {
      visible: visible.map(pos => pos.card.id),
      background: background.map(pos => pos.card.id)
    };
  }, [cardPositions, visibleCardIds]);

  const loadCardBatch = useCallback(async (cardIds: string[], batchSize: number) => {
    const batches = [];
    for (let i = 0; i < cardIds.length; i += batchSize) {
      batches.push(cardIds.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      // Simulate loading delay (replace with actual texture loading)
      await new Promise(resolve => setTimeout(resolve, finalConfig.loadingDelay));
      
      setLoadingState(prev => {
        const newLoadedCards = new Set(prev.loadedCards);
        batch.forEach(id => newLoadedCards.add(id));
        
        const visibleLoaded = Array.from(newLoadedCards).filter(id => 
          cardLoadingQueue.visible.includes(id)
        ).length;
        
        const backgroundLoaded = Array.from(newLoadedCards).filter(id => 
          cardLoadingQueue.background.includes(id)
        ).length;

        return {
          ...prev,
          loadedCards: newLoadedCards,
          visibleCards: visibleLoaded,
          backgroundCards: backgroundLoaded,
          progress: (newLoadedCards.size / cardPositions.length) * 100
        };
      });
    }
  }, [finalConfig.loadingDelay, cardLoadingQueue, cardPositions.length]);

  // Start progressive loading
  useEffect(() => {
    if (cardPositions.length === 0) return;

    const runProgressiveLoading = async () => {
      setLoadingState(prev => ({
        ...prev,
        phase: 'initializing',
        totalCards: cardPositions.length,
        progress: 0
      }));

      // Phase 1: Load initial batch of visible cards
      setLoadingState(prev => ({ ...prev, phase: 'loading-visible' }));
      const initialVisible = cardLoadingQueue.visible.slice(0, finalConfig.initialBatchSize);
      await loadCardBatch(initialVisible, finalConfig.batchSize);

      // Phase 2: Load remaining visible cards
      const remainingVisible = cardLoadingQueue.visible.slice(finalConfig.initialBatchSize);
      if (remainingVisible.length > 0) {
        await loadCardBatch(remainingVisible, finalConfig.batchSize);
      }

      // Phase 3: Load background cards
      if (cardLoadingQueue.background.length > 0) {
        setLoadingState(prev => ({ ...prev, phase: 'loading-background' }));
        await loadCardBatch(cardLoadingQueue.background, finalConfig.batchSize);
      }

      // Phase 4: Complete
      setLoadingState(prev => ({ ...prev, phase: 'complete', progress: 100 }));
    };

    runProgressiveLoading();
  }, [cardPositions, cardLoadingQueue, finalConfig, loadCardBatch]);

  const isCardLoaded = useCallback((cardId: string) => {
    return loadingState.loadedCards.has(cardId);
  }, [loadingState.loadedCards]);

  const shouldRenderCard = useCallback((cardId: string) => {
    // Always render visible cards that are loaded
    if (visibleCardIds.includes(cardId)) {
      return isCardLoaded(cardId);
    }
    
    // For background cards, only render if we're in background loading phase and they're loaded
    return loadingState.phase === 'complete' || 
           (loadingState.phase === 'loading-background' && isCardLoaded(cardId));
  }, [visibleCardIds, isCardLoaded, loadingState.phase]);

  return {
    loadingState,
    isCardLoaded,
    shouldRenderCard,
    isLoadingComplete: loadingState.phase === 'complete',
    loadingProgress: loadingState.progress
  };
};
