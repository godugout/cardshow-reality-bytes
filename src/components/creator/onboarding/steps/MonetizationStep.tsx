
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, Award } from 'lucide-react';

interface MonetizationStepProps {
  onNext: () => void;
}

const MonetizationStep = ({ onNext }: MonetizationStepProps) => {
  const revenueStreams = [
    {
      icon: DollarSign,
      title: "Card Sales",
      description: "Earn from direct card purchases",
      rate: "70% revenue share",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Marketplace Trading",
      description: "Earn royalties from secondary sales",
      rate: "5% royalty fee",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Template Sales",
      description: "Sell your card templates to other creators",
      rate: "80% revenue share",
      color: "text-purple-600"
    },
    {
      icon: Award,
      title: "Premium Features",
      description: "Offer exclusive content for subscribers",
      rate: "90% revenue share",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Monetization Options</h2>
        <p className="text-muted-foreground mb-6">
          Turn your creativity into income with multiple revenue streams. 
          Start earning from your very first card!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revenueStreams.map((stream, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <stream.icon className={`w-8 h-8 ${stream.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {stream.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {stream.rate}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Getting Started with Payouts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              1
            </div>
            <p className="font-medium">Create Cards</p>
            <p className="text-muted-foreground">Start creating and publishing</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              2
            </div>
            <p className="font-medium">Connect Stripe</p>
            <p className="text-muted-foreground">Set up your payout account</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
              3
            </div>
            <p className="font-medium">Start Earning</p>
            <p className="text-muted-foreground">Receive weekly payouts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationStep;
