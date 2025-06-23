
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { useCreateTradeOffer } from '@/hooks/useTrading';
import { useCards } from '@/hooks/useCards';
import CardSelector from './builder/CardSelector';
import CardList from './builder/CardList';
import TradeValueSection from './builder/TradeValueSection';
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

  const { cards: userCards = [] } = useCards();
  const createOfferMutation = useCreateTradeOffer();

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

    createOfferMutation.mutate({
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

  if (showCardSelector) {
    return (
      <CardSelector
        cards={userCards}
        type={showCardSelector}
        onAddCard={handleAddCard}
        onClose={() => setShowCardSelector(null)}
      />
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
        <CardList
          title="Your Cards"
          cards={offeredCards}
          onAddCard={() => setShowCardSelector('offered')}
          onQuantityChange={(cardId, quantity) => handleQuantityChange(cardId, quantity, 'offered')}
          onRemoveCard={(cardId) => handleRemoveCard(cardId, 'offered')}
        />

        <CardList
          title="Requested Cards"
          cards={requestedCards}
          onAddCard={() => setShowCardSelector('requested')}
          onQuantityChange={(cardId, quantity) => handleQuantityChange(cardId, quantity, 'requested')}
          onRemoveCard={(cardId) => handleRemoveCard(cardId, 'requested')}
        />
      </div>

      <div className="mb-6">
        <TradeValueSection
          cashIncluded={cashIncluded}
          onCashChange={setCashIncluded}
          tradeNote={tradeNote}
          onNoteChange={setTradeNote}
          valueDifference={valueDifference}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleCreateOffer}
          disabled={createOfferMutation.isPending || (offeredCards.length === 0 && requestedCards.length === 0)}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {createOfferMutation.isPending ? 'Creating...' : 'Send Trade Offer'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TradeOfferBuilder;
