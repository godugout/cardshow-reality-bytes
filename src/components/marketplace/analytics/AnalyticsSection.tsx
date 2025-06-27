
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketAnalytics, useMarketMetrics } from '@/hooks/useMarketAnalytics';
import { BarChart3, TrendingUp, DollarSign, Activity, Users } from 'lucide-react';
import PriceChart from './PriceChart';
import VolumeChart from './VolumeChart';

const AnalyticsSection = () => {
  const [timeframe, setTimeframe] = useState('30');
  const { analytics, isLoading: analyticsLoading } = useMarketAnalytics(undefined, parseInt(timeframe));
  const { metrics, isLoading: metricsLoading } = useMarketMetrics();

  const isLoading = analyticsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Market Analytics
        </h3>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
            <SelectItem value="365">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalVolume?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalTransactions?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.avgPrice?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeCards?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChart data={analytics} timeframe={parseInt(timeframe)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChart data={analytics} timeframe={parseInt(timeframe)} />
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Bullish Trend
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Market showing consistent growth with increasing transaction volume
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  High Activity
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Peak trading hours observed between 2-6 PM EST
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800 dark:text-purple-200">
                  New Users
                </span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                25% increase in new marketplace participants this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
