
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Minus, DollarSign, X } from 'lucide-react';
import { useCreateTradeOffer } from '@/hooks/useTrading';
import { useCards } from '@/hooks/useCards';
import type { Card as CardType } from '@/types/card';

interface TradeOfferBuilderProps {
  recipientId: string;
  recipientUsername: string;
  recipientAvatar?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const TradeOfferBuilder = ({ 
  recipientId, 
  recipientUsername, 
  recipientAvatar,
  onClose,
  onSuccess 
}: TradeOfferBuilderProps) => {
  const [offeredCards, setOfferedCards] = useState<Array<{ card: CardType; quantity: number }>>([]);
  const [requestedCards, setRequestedCards] = useState<Array<{ card: CardType; quantity: number }>>([]);
  const [cashIncluded, setCashIncluded] = useState(0);
  const [tradeNote, setTradeNote] = useState('');
  const [showCardSelector, setShowCardSelector] = useState<'offered' | 'requested' | null>(null);

  const { data: userCards = [] } = useCards();
  const { mutate: createOffer, isLoading } = useCreateTradeOffer();

  const handleAddCard = (card: CardType, type: 'offered' | 'requested') => {
    const setter = type === 'offered' ? setOfferedCards : setRequestedCards;
    const current = type === 'offered' ? offeredCards : requestedCards;
    
    const existing = current.find(item => item.card.id === card.id);
    if (existing) {
      setter(current.map(item => 
        item.card.id === card.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setter([...current, { card, quantity: 1 }]);
    }
    setShowCardSelector(null);
  };

  const handleRemoveCard = (cardId: string, type: 'offered' | 'requested') => {
    const setter = type === 'offered' ? setOfferedCards : setRequestedCards;
    const current = type === 'offered' ? offeredCards : requestedCards;
    
    setter(current.filter(item => item.card.id !== cardId));
  };

  const handleQuantityChange = (cardId: string, quantity: number, type: 'offered' | 'requested') => {
    if (quantity < 1) return;
    
    const setter = type === 'offered' ? setOfferedCards : setRequestedCards;
    const current = type === 'offered' ? offeredCards : requestedCards;
    
    setter(current.map(item => 
      item.card.id === cardId ? { ...item, quantity } : item
    ));
  };

  const calculateTotalValue = (cards: Array<{ card: CardType; quantity: number }>) => {
    return cards.reduce((total, item) => {
      const value = item.card.base_price || 0;
      return total + (value * item.quantity);
    }, 0);
  };

  const offeredValue = calculateTotalValue(offeredCards);
  const requestedValue = calculateTotalValue(requestedCards);
  const valueDifference = offeredValue - requestedValue + cashIncluded;

  const handleCreateOffer = () => {
    if (offeredCards.length === 0 && requestedCards.length === 0) return;

    createOffer({
      recipient_id: recipientId,
      offered_cards: offeredCards.map(item => ({
        id: item.card.id,
        quantity: item.quantity,
      })),
      requested_cards: requestedCards.map(item => ({
        id: item.card.id,
        quantity: item.quantity,
      })),
      cash_included: cashIncluded,
      trade_note: tradeNote || undefined,
    }, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (showCardSelector) {
    return (
      <div className="bg-gray-900 text-white p-6 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            Select Cards to {showCardSelector === 'offered' ? 'Offer' : 'Request'}
          </h3>
          <Button variant="ghost" onClick={() => setShowCardSelector(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCards.map((card) => (
            <Card key={card.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700">
              <CardContent className="p-4" onClick={() => handleAddCard(card, showCardSelector)}>
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
  }

  return (
    <div className="bg-gray-900 text-white p-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Create Trade Offer</h2>
        <Button variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Trading Partner */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle>Trading With</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={recipientAvatar} />
              <AvatarFallback>{recipientUsername.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{recipientUsername}</p>
              <p className="text-sm text-gray-400">Trade Partner</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Offered Cards */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Cards</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCardSelector('offered')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offeredCards.map((item) => (
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
                      onClick={() => handleQuantityChange(item.card.id, item.quantity - 1, 'offered')}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.card.id, item.quantity + 1, 'offered')}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCard(item.card.id, 'offered')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="text-sm text-gray-400">
                Total Value: {formatCurrency(offeredValue)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requested Cards */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Requested Cards</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCardSelector('requested')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Request
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requestedCards.map((item) => (
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
                      onClick={() => handleQuantityChange(item.card.id, item.quantity - 1, 'requested')}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.card.id, item.quantity + 1, 'requested')}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCard(item.card.id, 'requested')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="text-sm text-gray-400">
                Total Value: {formatCurrency(requestedValue)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cash Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={cashIncluded}
              onChange={(e) => setCashIncluded(Number(e.target.value))}
              placeholder="0.00"
              className="bg-gray-700 border-gray-600"
              min="0"
              step="0.01"
            />
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span>Value Difference:</span>
                <span className={valueDifference >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatCurrency(Math.abs(valueDifference))}
                  {valueDifference >= 0 ? ' in your favor' : ' against you'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Trade Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={tradeNote}
              onChange={(e) => setTradeNote(e.target.value)}
              placeholder="Add a message to your trade offer..."
              className="bg-gray-700 border-gray-600 min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleCreateOffer}
          disabled={isLoading || (offeredCards.length === 0 && requestedCards.length === 0)}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Creating...' : 'Send Trade Offer'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TradeOfferBuilder;
