
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, X } from 'lucide-react';
import type { Card as CardType } from '@/types/card';

interface CardListProps {
  title: string;
  cards: Array<{ card: CardType; quantity: number }>;
  onAddCard: () => void;
  onQuantityChange: (cardId: string, quantity: number) => void;
  onRemoveCard: (cardId: string) => void;
}

const CardList = ({ title, cards, onAddCard, onQuantityChange, onRemoveCard }: CardListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalValue = cards.reduce((total, item) => {
    const value = item.card.base_price || 0;
    return total + (value * item.quantity);
  }, 0);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCard}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cards.map((item) => (
            <div key={item.card.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
              <img
                src={item.card.image_url || '/placeholder.svg'}
                alt={item.card.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.card.title}</p>
                <p className="text-xs text-gray-400">{item.card.rarity}</p>
                {item.card.base_price && (
                  <p className="text-xs text-green-400">
                    {formatCurrency(item.card.base_price)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuantityChange(item.card.id, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuantityChange(item.card.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCard(item.card.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <div className="text-sm text-gray-400">
            Total Value: {formatCurrency(totalValue)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardList;
