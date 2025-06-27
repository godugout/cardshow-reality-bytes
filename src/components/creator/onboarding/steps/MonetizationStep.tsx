
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Target, CreditCard, Users, Star } from 'lucide-react';

interface MonetizationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const MonetizationStep = ({ onNext }: MonetizationStepProps) => {
  const revenueStreams = [
    {
      title: 'Direct Sales',
      description: 'Sell individual cards at set prices',
      icon: CreditCard,
      potential: '$1-50 per card',
      difficulty: 'Easy',
      color: 'bg-green-500'
    },
    {
      title: 'Card Packs',
      description: 'Bundle cards into themed collections',
      icon: Star,
      potential: '$5-25 per pack',
      difficulty: 'Medium',
      color: 'bg-blue-500'
    },
    {
      title: 'Premium Effects',
      description: 'Charge more for cards with special effects',
      icon: TrendingUp,
      potential: '2-5x base price',
      difficulty: 'Easy',
      color: 'bg-purple-500'
    },
    {
      title: 'Custom Commissions',
      description: 'Create personalized cards for clients',
      icon: Users,
      potential: '$25-200 per card',
      difficulty: 'Advanced',
      color: 'bg-orange-500'
    }
  ];

  const successMetrics = [
    { label: 'Average Card Price', value: '$12', trend: '+23%' },
    { label: 'Monthly Revenue', value: '$847', trend: '+45%' },
    { label: 'Conversion Rate', value: '8.2%', trend: '+12%' },
    { label: 'Return Customers', value: '34%', trend: '+18%' }
  ];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Turn Your Creativity Into Income
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover multiple ways to monetize your card creations. Most creators start earning within their first month!
        </p>
      </div>

      <Tabs defaultValue="streams" className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="success">Success Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${stream.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{stream.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {stream.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {stream.potential}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-lg">Start Simple, Scale Smart</h3>
                  <p className="text-green-700">Begin with direct sales, then expand to other revenue streams</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Week 1</div>
                  <div className="text-sm text-green-700">Set up sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Month 1</div>
                  <div className="text-sm text-green-700">First earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Month 3</div>
                  <div className="text-sm text-green-700">Steady income</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    {metric.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">💡 Pricing Strategy</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Basic Cards:</span>
                    <span className="font-semibold">$3-8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Effects:</span>
                    <span className="font-semibold">$8-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limited Edition:</span>
                    <span className="font-semibold">$15-50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Work:</span>
                    <span className="font-semibold">$25-200</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">📈 Growth Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Month 1-2:</div>
                    <div className="text-muted-foreground">Learn basics, first sales</div>
                  </div>
                  <div>
                    <div className="font-semibold">Month 3-6:</div>
                    <div className="text-muted-foreground">Build audience, consistent income</div>
                  </div>
                  <div>
                    <div className="font-semibold">Month 6+:</div>
                    <div className="text-muted-foreground">Scale operations, premium pricing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button onClick={onNext} size="lg" className="px-8">
          <Target className="w-4 h-4 mr-2" />
          Set Up My Revenue Streams!
        </Button>
      </div>
    </div>
  );
};
