
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface TradeActionsProps {
  trade: any;
  isInitiator: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const TradeActions = ({ trade, isInitiator, onAccept, onReject }: TradeActionsProps) => {
  if (trade.status !== 'pending' || isInitiator) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={onAccept}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Accept Trade
      </Button>
      <Button 
        onClick={onReject}
        variant="destructive"
        className="w-full"
      >
        <XCircle className="w-4 h-4 mr-2" />
        Reject Trade
      </Button>
    </div>
  );
};

export default TradeActions;
