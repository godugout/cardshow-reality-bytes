
import { MessageCircle, Users } from 'lucide-react';

interface ChatHeaderProps {
  participantCount: number;
}

const ChatHeader = ({ participantCount }: ChatHeaderProps) => {
  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Trade Chat</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{participantCount} online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
