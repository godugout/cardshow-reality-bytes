
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';

interface TradeValueSectionProps {
  cashIncluded: number;
  onCashChange: (amount: number) => void;
  tradeNote: string;
  onNoteChange: (note: string) => void;
  valueDifference: number;
}

const TradeValueSection = ({ 
  cashIncluded, 
  onCashChange, 
  tradeNote, 
  onNoteChange, 
  valueDifference 
}: TradeValueSectionProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            onChange={(e) => onCashChange(Number(e.target.value))}
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
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add a message to your trade offer..."
            className="bg-gray-700 border-gray-600 min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeValueSection;
