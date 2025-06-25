
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PreviewCard {
  id: string;
  title: string;
  imageUrl: string;
  rarity: string;
  creator: string;
}

const sampleCards: PreviewCard[] = [
  {
    id: '1',
    title: 'Legendary Dragon',
    imageUrl: '/placeholder.svg',
    rarity: 'legendary',
    creator: 'ArtMaster3D',
  },
  {
    id: '2',
    title: 'Cyber Warrior',
    imageUrl: '/placeholder.svg',
    rarity: 'epic',
    creator: 'NeonDesigner',
  },
  {
    id: '3',
    title: 'Mystic Forest',
    imageUrl: '/placeholder.svg',
    rarity: 'rare',
    creator: 'NatureCrafter',
  },
  {
    id: '4',
    title: 'Space Explorer',
    imageUrl: '/placeholder.svg',
    rarity: 'uncommon',
    creator: 'CosmicArt',
  },
];

const rarityColors = {
  legendary: 'from-yellow-400 to-orange-500',
  epic: 'from-purple-400 to-pink-500',
  rare: 'from-blue-400 to-cyan-500',
  uncommon: 'from-green-400 to-emerald-500',
  common: 'from-gray-400 to-slate-500',
};

const InteractiveCardPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sampleCards.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleCards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length);
  };

  const currentCard = sampleCards[currentIndex];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="relative overflow-hidden bg-[#1a1a1a] border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[currentCard.rarity as keyof typeof rarityColors]} opacity-20`} />
          
          <div className="relative p-6">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img
                src={currentCard.imageUrl}
                alt={currentCard.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{currentCard.title}</h3>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${rarityColors[currentCard.rarity as keyof typeof rarityColors]} text-white`}>
                  {currentCard.rarity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">by {currentCard.creator}</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevCard}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextCard}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
        
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {sampleCards.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#00C851]' : 'bg-gray-600'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveCardPreview;
