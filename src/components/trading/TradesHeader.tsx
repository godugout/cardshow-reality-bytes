
import { ArrowLeftRight } from 'lucide-react';

interface TradesHeaderProps {
  totalTrades: number;
}

const TradesHeader = ({ totalTrades }: TradesHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">My Trades</h1>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <ArrowLeftRight className="w-4 h-4" />
        <span>{totalTrades} total trades</span>
      </div>
    </div>
  );
};

export default TradesHeader;
