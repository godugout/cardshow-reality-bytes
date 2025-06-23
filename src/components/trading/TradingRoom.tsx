
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useTradeMessages, 
  useTradeParticipants, 
  useSendMessage,
  useUpdateTradeStatus,
  useTradePresence
} from '@/hooks/useTrading';
import { formatDistanceToNow } from 'date-fns';
import type { TradeOffer } from '@/types/trading';

interface TradingRoomProps {
  trade: TradeOffer;
  onClose: () => void;
}

const TradingRoom = ({ trade, onClose }: TradingRoomProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage({
      trade_id: trade.id,
      message: message.trim(),
    });

    setMessage('');
    setTyping(false);
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

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Trade Details Sidebar */}
      <div className="w-1/3 border-r border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trade Details</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Trade Status</CardTitle>
              <Badge className={`text-white ${getStatusColor(trade.status)}`}>
                {trade.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDistanceToNow(new Date(trade.created_at))} ago</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{formatDistanceToNow(new Date(trade.expires_at))} left</span>
              </div>
              {trade.cash_included && trade.cash_included > 0 && (
                <div className="flex justify-between">
                  <span>Cash Included:</span>
                  <span>{formatCurrency(trade.cash_included)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trading Partner */}
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Trading With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherUser?.avatar_url || undefined} />
                <AvatarFallback>
                  {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{otherUser?.username || 'Unknown User'}</p>
                <p className="text-sm text-gray-400">
                  {participants.find(p => p.user_id === otherUser?.id)?.presence_status || 'offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Actions */}
        {trade.status === 'pending' && !isInitiator && (
          <div className="space-y-2">
            <Button 
              onClick={handleAcceptTrade}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept Trade
            </Button>
            <Button 
              onClick={handleRejectTrade}
              variant="destructive"
              className="w-full"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Trade
            </Button>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Trade Chat</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{participants.length} online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    {!isOwn && (
                      <div className="text-xs text-gray-300 mb-1">
                        {msg.sender?.username || 'Unknown'}
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {formatDistanceToNow(new Date(msg.timestamp))} ago
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {participants.some(p => p.is_typing && p.user_id !== user?.id) && (
              <div className="flex justify-start">
                <div className="bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400">typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border-gray-600"
              disabled={trade.status !== 'pending'}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || trade.status !== 'pending'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingRoom;
