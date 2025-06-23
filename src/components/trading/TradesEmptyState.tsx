
import { ArrowLeftRight } from 'lucide-react';

interface TradesEmptyStateProps {
  activeTab: string;
}

const TradesEmptyState = ({ activeTab }: TradesEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <ArrowLeftRight className="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-400 mb-2">
        No trades found
      </h3>
      <p className="text-gray-500">
        {activeTab === 'all' 
          ? 'You haven\'t made any trades yet.' 
          : `No ${activeTab} trades to display.`
        }
      </p>
    </div>
  );
};

export default TradesEmptyState;
