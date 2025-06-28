import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import EnhancedCRDCard from './EnhancedCRDCard';
import { cardStyleVariations } from './cardStyleVariations';
import type { Card as CardType } from '@/types/card';

interface CardShowcaseProps {
  cards: CardType[];
}

// Sample cards with placeholder images for demonstration
const sampleCards: CardType[] = [
  {
    id: '1',
    title: 'Cyber Warrior',
    description: 'A legendary digital warrior from the neon-lit streets of Neo Tokyo',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'legendary',
    serial_number: 1,
    total_supply: 100,
    current_market_value: 299.99,
    view_count: 1250,
    favorite_count: 89,
    creator: { id: 'demo', username: 'CyberArtist', avatar_url: undefined }
  },
  {
    id: '2',
    title: 'Forest Guardian',
    description: 'Ancient protector of the mystical woodland realm',
    image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'epic',
    serial_number: 15,
    total_supply: 500,
    current_market_value: 149.99,
    view_count: 890,
    favorite_count: 67,
    creator: { id: 'demo', username: 'NatureMage', avatar_url: undefined }
  },
  {
    id: '3',
    title: 'Code Matrix',
    description: 'The digital essence of pure programming energy',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'rare',
    serial_number: 42,
    total_supply: 1000,
    current_market_value: 89.99,
    view_count: 2340,
    favorite_count: 156,
    creator: { id: 'demo', username: 'DigitalMind', avatar_url: undefined }
  },
  {
    id: '4',
    title: 'Tech Innovation',
    description: 'Revolutionary breakthrough in quantum computing visualization',
    image_url: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'uncommon',
    serial_number: 128,
    total_supply: 2500,
    current_market_value: 45.99,
    view_count: 567,
    favorite_count: 34,
    creator: { id: 'demo', username: 'TechVision', avatar_url: undefined }
  },
  {
    id: '5',
    title: 'Ocean Depths',
    description: 'Majestic creature from the deepest blue waters',
    image_url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'mythic',
    serial_number: 3,
    total_supply: 50,
    current_market_value: 599.99,
    view_count: 3456,
    favorite_count: 234,
    creator: { id: 'demo', username: 'OceanMystic', avatar_url: undefined }
  },
  {
    id: '6',
    title: 'Wild Spirit',
    description: 'Untamed essence of the wilderness in digital form',
    image_url: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'rare',
    serial_number: 67,
    total_supply: 750,
    current_market_value: 119.99,
    view_count: 1890,
    favorite_count: 98,
    creator: { id: 'demo', username: 'WildCrafter', avatar_url: undefined }
  },
  {
    id: '7',
    title: 'Tiny Explorer',
    description: 'Small but mighty, this little adventurer conquers all',
    image_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'common',
    serial_number: 456,
    total_supply: 5000,
    current_market_value: 19.99,
    view_count: 234,
    favorite_count: 12,
    creator: { id: 'demo', username: 'CuteCrafter', avatar_url: undefined }
  },
  {
    id: '8',
    title: 'Golden Swarm',
    description: 'Magnificent display of nature\'s perfect synchronization',
    image_url: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'epic',
    serial_number: 88,
    total_supply: 300,
    current_market_value: 189.99,
    view_count: 1567,
    favorite_count: 123,
    creator: { id: 'demo', username: 'NatureSync', avatar_url: undefined }
  },
  {
    id: '9',
    title: 'Code Warrior',
    description: 'Master of digital realms and programming excellence',
    image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'legendary',
    serial_number: 7,
    total_supply: 150,
    current_market_value: 399.99,
    view_count: 2890,
    favorite_count: 187,
    creator: { id: 'demo', username: 'CodeMaster', avatar_url: undefined }
  },
  {
    id: '10',
    title: 'Digital Workspace',
    description: 'The perfect harmony of technology and creativity',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'uncommon',
    serial_number: 234,
    total_supply: 1500,
    current_market_value: 67.99,
    view_count: 789,
    favorite_count: 45,
    creator: { id: 'demo', username: 'WorkspaceWiz', avatar_url: undefined }
  },
  {
    id: '11',
    title: 'Neon Dreams',
    description: 'Electric visions from a cyberpunk future',
    image_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'rare',
    serial_number: 99,
    total_supply: 800,
    current_market_value: 159.99,
    view_count: 1234,
    favorite_count: 78,
    creator: { id: 'demo', username: 'NeonArtist', avatar_url: undefined }
  },
  {
    id: '12',
    title: 'Vintage Code',
    description: 'Classic programming aesthetics meet modern design',
    image_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'uncommon',
    serial_number: 321,
    total_supply: 2000,
    current_market_value: 79.99,
    view_count: 567,
    favorite_count: 29,
    creator: { id: 'demo', username: 'VintageCode', avatar_url: undefined }
  }
];

const CardShowcase = ({ cards }: CardShowcaseProps) => {
  // Use sample cards if no cards provided, otherwise use provided cards
  const displayCards = cards.length > 0 ? cards.slice(0, 10) : sampleCards;

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Enhanced CRD Style Showcase
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-2">Interactive Card Variations</h2>
        <p className="text-muted-foreground">
          Hover over cards to see the interactive drawer system - Each card maintains 2.5:3.5 aspect ratio
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-start">
        {displayCards.map((card, index) => {
          const styleVariant = cardStyleVariations[index % cardStyleVariations.length];

          return (
            <div key={card.id} className="space-y-3 flex flex-col items-center">
              {/* Style Label */}
              <Badge variant="outline" className="text-xs font-medium">
                {styleVariant.name}
              </Badge>

              {/* Enhanced CRD Card */}
              <EnhancedCRDCard
                card={card}
                size="md"
                styleVariant={styleVariant}
              />
            </div>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          Hover over cards to see the interactive drawer animation
        </div>
      </div>
    </div>
  );
};

export default CardShowcase;
