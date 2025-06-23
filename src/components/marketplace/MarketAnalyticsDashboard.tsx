
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Users } from 'lucide-react';
import { useMarketMetrics, useTrendingCards, useMarketAnalytics } from '@/hooks/useMarketAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MarketAnalyticsDashboard = () => {
  const { metrics, isLoading: metricsLoading } = useMarketMetrics();
  const { trendingCards, isLoading: trendingLoading } = useTrendingCards();
  const { analytics } = useMarketAnalytics(undefined, 30);

  // Process analytics data for charts
  const chartData = analytics.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.avg_price,
    volume: item.volume,
    transactions: item.transactions
  }));

  if (metricsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-800 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-[#00C851]">
                  {metrics?.totalVolume || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-[#00C851]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-[#00C851]">
                  {metrics?.totalTransactions || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#00C851]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Price</p>
                <p className="text-2xl font-bold text-[#00C851]">
                  ${metrics?.avgPrice?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-[#00C851]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Cards</p>
                <p className="text-2xl font-bold text-[#00C851]">
                  {metrics?.activeCards || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#00C851]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Price Trends (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00C851" 
                  strokeWidth={2}
                  dot={{ fill: '#00C851' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Trading Volume (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="volume" fill="#00C851" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trending Cards */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00C851]" />
            Trending Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendingCards.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                  {item.card && (
                    <>
                      <img 
                        src={item.card.image_url || '/placeholder.svg'} 
                        alt={item.card.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h3 className="font-medium text-sm mb-1 truncate">
                        {item.card.title}
                      </h3>
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="outline" className="text-xs">
                          {item.card.rarity}
                        </Badge>
                        <span className="text-[#00C851] font-bold">
                          ${item.avg_price}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>{item.volume} vol</span>
                        <span className="flex items-center gap-1">
                          {item.price_change_24h && item.price_change_24h > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-green-500">
                                +{item.price_change_24h.toFixed(1)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-red-500" />
                              <span className="text-red-500">
                                {item.price_change_24h?.toFixed(1) || 0}%
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalyticsDashboard;
