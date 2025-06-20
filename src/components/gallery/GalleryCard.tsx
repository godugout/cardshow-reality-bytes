
import { Group } from 'three';
import Card3DViewerPremium from '@/components/cards/Card3DViewerPremium';
import type { CardPosition } from '@/utils/galleryLayouts';

interface GalleryCardProps {
  cardPosition: CardPosition;
  isSelected: boolean;
  onClick: () => void;
}

const GalleryCard = ({ cardPosition, isSelected, onClick }: GalleryCardProps) => {
  return (
    <group
      position={cardPosition.position}
      rotation={cardPosition.rotation}
      scale={cardPosition.scale}
      onClick={onClick}
    >
      <Card3DViewerPremium
        card={cardPosition.card}
        interactive={true}
        className={isSelected ? 'ring-2 ring-[#00C851]' : ''}
      />
      
      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0, 0.1]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#00C851" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

export default GalleryCard;
