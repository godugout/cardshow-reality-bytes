
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Card as CardType } from '@/types/card';

interface CardSelectorProps {
  cards: CardType[];
  type: 'offered' | 'requested';
  onAddCard: (card: CardType, type: 'offered' | 'requested') => void;
  onClose: () => void;
}

const CardSelector = ({ cards, type, onAddCard, onClose }: CardSelectorProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-gray-900 text-white p-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">
          Select Cards to {type === 'offered' ? 'Offer' : 'Request'}
        </h3>
        <Button variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700">
            <CardContent className="p-4" onClick={() => onAddCard(card, type)}>
              <img
                src={card.image_url || '/placeholder.svg'}
                alt={card.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h4 className="font-semibold text-sm mb-1">{card.title}</h4>
              <p className="text-xs text-gray-400 mb-2">{card.rarity}</p>
              {card.base_price && (
                <p className="text-sm font-semibold text-green-400">
                  {formatCurrency(card.base_price)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
