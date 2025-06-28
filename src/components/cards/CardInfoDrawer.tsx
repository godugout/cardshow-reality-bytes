
import { cn } from '@/lib/utils';
import { useCardFavorites } from '@/hooks/useCards';
import CardBasicInfo from './CardBasicInfo';
import CardExpandedContent from './CardExpandedContent';
import CardEngagementStats from './CardEngagementStats';
import { 
  type CardInfoDrawerProps, 
  DRAWER_STYLES, 
  SIZE_CLASSES 
} from './types/cardInfoDrawer';

const CardInfoDrawer = ({ 
  card, 
  isHovered, 
  isPinned, 
  animationPhase, 
  drawerStyle,
  size 
}: CardInfoDrawerProps) => {
  const { toggleFavorite } = useCardFavorites();
  const showExpanded = isHovered || isPinned;

  const handleFavoriteToggle = () => {
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  return (
    <div 
      className={cn(
        'absolute bottom-0 left-0 right-0 z-20 rounded-b-3xl transform overflow-hidden',
        'transition-all duration-[4000ms] ease-[cubic-bezier(0.05,0.7,0.1,1)]',
        SIZE_CLASSES[size],
        DRAWER_STYLES[drawerStyle as keyof typeof DRAWER_STYLES] || DRAWER_STYLES.default,
        // Extremely slow backdrop animation - ultra premium luxury timing
        showExpanded 
          ? 'backdrop-blur-3xl bg-opacity-98' 
          : 'backdrop-blur-xl bg-opacity-90'
      )}
      style={{
        background: showExpanded 
          ? `linear-gradient(135deg, 
              rgba(0,0,0,0.98) 0%, 
              rgba(30,30,30,0.95) 50%, 
              rgba(0,0,0,0.98) 100%)`
          : undefined,
        transition: 'all 4s cubic-bezier(0.05, 0.7, 0.1, 1), background 4.5s ease-out'
      }}
    >
      {/* Always visible basic info */}
      <CardBasicInfo 
        card={card} 
        showExpanded={showExpanded} 
        size={size} 
      />

      {/* Expanded content */}
      <CardExpandedContent 
        card={card} 
        showExpanded={showExpanded} 
      />

      {/* Engagement Stats */}
      <CardEngagementStats 
        card={card} 
        showExpanded={showExpanded} 
        onFavoriteToggle={handleFavoriteToggle}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default CardInfoDrawer;
