
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  disabled: boolean;
}

const ChatInput = ({ message, onMessageChange, onSendMessage, disabled }: ChatInputProps) => {
  return (
    <div className="border-t border-gray-700 p-4">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border-gray-600"
          disabled={disabled}
        />
        <Button 
          onClick={onSendMessage}
          disabled={!message.trim() || disabled}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
