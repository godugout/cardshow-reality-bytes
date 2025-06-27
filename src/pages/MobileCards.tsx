
import { useState } from 'react';
import { useCards } from '@/hooks/useCards';
import { useCardFavorites } from '@/hooks/useCards';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/mobile/MobileLayout';
import MobileCardGrid from '@/components/mobile/MobileCardGrid';
import { toast } from 'sonner';
import type { Card } from '@/types/card';

const MobileCards = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { cards, isLoading } = useCards({});
  const { toggleFavorite } = useCardFavorites();

  const handleCardSelect = (card: Card, index: number) => {
    console.log('Selected card:', card.title, 'at index:', index);
  };

  const handleFavorite = (card: Card) => {
    if (!user) {
      toast.error('Please sign in to favorite cards');
      return;
    }

    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });

    toast.success(
      card.is_favorited ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const handleShare = (card: Card) => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description || `Check out this card: ${card.title}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Redirect to desktop version if not mobile
  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mobile Experience</h1>
          <p className="text-muted-foreground">
            This page is designed for mobile devices. 
            Please use the main cards page on desktop.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileCardGrid
        cards={cards}
        onCardSelect={handleCardSelect}
        onFavorite={handleFavorite}
        onShare={handleShare}
      />
    </MobileLayout>
  );
};

export default MobileCards;
