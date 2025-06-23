
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  useTradeMessages, 
  useTradeParticipants, 
  useSendMessage,
  useUpdateTradeStatus,
  useTradePresence
} from '@/hooks/useTrading';
import TradeDetails from './room/TradeDetails';
import TradeActions from './room/TradeActions';
import ChatHeader from './room/ChatHeader';
import ChatMessages from './room/ChatMessages';
import ChatInput from './room/ChatInput';
import type { TradeOffer } from '@/types/trading';

interface TradingRoomProps {
  trade: TradeOffer;
  onClose: () => void;
}

const TradingRoom = ({ trade, onClose }: TradingRoomProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { messages } = useTradeMessages(trade.id);
  const { participants } = useTradeParticipants(trade.id);
  const { mutate: sendMessage } = useSendMessage();
  const { mutate: updateTradeStatus } = useUpdateTradeStatus();
  const { setTyping, markOnline } = useTradePresence(trade.id);

  const isInitiator = user?.id === trade.initiator_id;
  const otherUser = isInitiator ? trade.recipient : trade.initiator;

  useEffect(() => {
    markOnline();
  }, [markOnline]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage({
      trade_id: trade.id,
      message: message.trim(),
    });

    setMessage('');
    setIsTyping(false);
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      setTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
      setTyping(false);
    }
  };

  const handleAcceptTrade = () => {
    updateTradeStatus({ tradeId: trade.id, status: 'accepted' });
  };

  const handleRejectTrade = () => {
    updateTradeStatus({ tradeId: trade.id, status: 'rejected' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isAnyoneTyping = participants.some(p => p.is_typing && p.user_id !== user?.id);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Trade Details Sidebar */}
      <div className="w-1/3 border-r border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trade Details</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <TradeDetails 
          trade={trade}
          otherUser={otherUser}
          getStatusColor={getStatusColor}
          formatCurrency={formatCurrency}
        />

        <div className="mt-4">
          <TradeActions
            trade={trade}
            isInitiator={isInitiator}
            onAccept={handleAcceptTrade}
            onReject={handleRejectTrade}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader participantCount={participants.length} />
        
        <ChatMessages 
          messages={messages}
          userId={user?.id}
          isTyping={isAnyoneTyping}
        />

        <ChatInput
          message={message}
          onMessageChange={handleInputChange}
          onSendMessage={handleSendMessage}
          disabled={trade.status !== 'pending'}
        />
      </div>
    </div>
  );
};

export default TradingRoom;
