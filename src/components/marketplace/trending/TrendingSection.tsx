import { useMarketAnalytics, useTrendingCards } from '@/hooks/useMarketAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import MarketplaceCard from '../MarketplaceCard';

const TrendingSection = () => {
  const { trendingCards, isLoading } = useTrendingCards();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const topGainer = trendingCards.reduce((prev, current) => 
    (current.avg_price > prev.avg_price) ? current : prev, trendingCards[0] || null
  );

  const totalVolume = trendingCards.reduce((sum, card) => sum + (card.volume || 0), 0);
  const avgPriceChange = trendingCards.length > 0 
    ? trendingCards.reduce((sum, card) => sum + (card.avg_price || 0), 0) / trendingCards.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Trending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgPriceChange.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across trending cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topGainer?.card?.title || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${topGainer?.avg_price?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Trending Cards</h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Last 7 days
          </Badge>
        </div>

        {trendingCards.length > 0 ? (
          <div className="space-y-4">
            {/* Top Trending Card - Featured */}
            {trendingCards[0] && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      #1 Trending
                    </CardTitle>
                    <Badge className="bg-primary">Hot</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg">
                        {trendingCards[0].card?.title}
                      </h4>
                      <p className="text-muted-foreground">
                        Volume: {trendingCards[0].volume?.toLocaleString()} transactions
                      </p>
                      <p className="text-muted-foreground">
                        Average Price: ${trendingCards[0].avg_price?.toFixed(2)}
                      </p>
                    </div>
                    {trendingCards[0].card?.image_url && (
                      <div className="flex justify-center">
                        <img 
                          src={trendingCards[0].card.image_url} 
                          alt={trendingCards[0].card.title}
                          className="w-32 h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Trending Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingCards.slice(1, 7).map((trend, index) => (
                <Card key={trend.card?.id || index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        #{index + 2}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h5 className="font-medium">{trend.card?.title || 'Unknown Card'}</h5>
                        <p className="text-sm text-muted-foreground">
                          ${trend.avg_price?.toFixed(2) || '0.00'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Activity className="w-3 h-3" />
                          {trend.volume || 0} transactions
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-lg font-medium mb-2">No Trending Data</h4>
              <p className="text-muted-foreground">
                Trending data will appear here as marketplace activity increases
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrendingSection;
