
import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Compass, BarChart3 } from 'lucide-react';
import type { Card } from '@/types/card';

interface SpatialUIProps {
  selectedCard?: Card;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLayoutChange: (layout: string) => void;
  collectionStats: {
    totalCards: number;
    uniqueRarities: number;
    totalValue: number;
  };
}

const SpatialUI = ({ 
  selectedCard, 
  searchQuery, 
  onSearchChange, 
  onLayoutChange,
  collectionStats 
}: SpatialUIProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      {/* Floating Search Interface */}
      <Html position={[-8, 4, 0]} transform occlude>
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 min-w-[300px]">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-[#00C851]" />
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLayoutChange('circular')}
              className="text-xs"
            >
              Circle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLayoutChange('gallery_wall')}
              className="text-xs"
            >
              Wall
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLayoutChange('spiral')}
              className="text-xs"
            >
              Spiral
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLayoutChange('grid')}
              className="text-xs"
            >
              Grid
            </Button>
          </div>
        </div>
      </Html>

      {/* Card Info Panel */}
      {selectedCard && (
        <Html position={[8, 2, 0]} transform occlude>
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 min-w-[280px]">
            <h3 className="text-white font-bold text-lg mb-2">{selectedCard.title}</h3>
            
            {selectedCard.description && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                {selectedCard.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              {selectedCard.rarity && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCard.rarity}
                </Badge>
              )}
              {selectedCard.serial_number && (
                <Badge variant="outline" className="text-xs">
                  #{selectedCard.serial_number}
                </Badge>
              )}
            </div>
            
            {selectedCard.current_market_value && (
              <div className="text-[#00C851] font-semibold">
                ${selectedCard.current_market_value.toFixed(2)}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Navigation Compass */}
      <Html position={[0, -6, 0]} center transform>
        <div className="bg-black/70 rounded-full p-3">
          <Compass className="w-8 h-8 text-[#00C851]" />
        </div>
      </Html>

      {/* Collection Stats */}
      <Html position={[-8, -3, 0]} transform occlude>
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 min-w-[250px]">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-[#00C851]" />
            <span className="text-white font-semibold">Collection Stats</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Total Cards:</span>
              <span className="text-white">{collectionStats.totalCards}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Rarities:</span>
              <span className="text-white">{collectionStats.uniqueRarities}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Value:</span>
              <span className="text-[#00C851]">${collectionStats.totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Html>

      {/* Voice Commands Hint */}
      <Html position={[8, -4, 0]} transform occlude>
        <div className="bg-black/60 rounded-lg p-2 text-xs text-gray-400">
          <div>🎤 Voice: "Next card", "Previous card"</div>
          <div>⌨️ Keys: WASD, Arrow keys</div>
        </div>
      </Html>
    </>
  );
};

export default SpatialUI;
