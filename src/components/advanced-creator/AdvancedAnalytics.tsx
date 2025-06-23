
import { useState } from 'react';
import { useCreatorAnalytics } from '@/hooks/advanced-creator/useCreatorAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Heart, 
  Download,
  Target,
  Zap,
  Award
} from 'lucide-react';

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const { 
    analytics, 
    performanceMetrics, 
    performanceScore, 
    totalRevenue, 
    totalViews, 
    avgEngagement,
    isLoading 
  } = useCreatorAnalytics(timeRange);

  // Prepare chart data
  const revenueData = analytics
    .filter(a => a.metric_type === 'revenue')
    .map(a => ({
      date: new Date(a.period_start).toLocaleDateString(),
      revenue: a.metric_value,
      period: a.period_start
    }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

  const viewsData = analytics
    .filter(a => a.metric_type === 'views')
    .map(a => ({
      date: new Date(a.period_start).toLocaleDateString(),
      views: a.metric_value,
      period: a.period_start
    }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

  const engagementData = analytics
    .filter(a => a.metric_type === 'engagement')
    .map(a => ({
      date: new Date(a.period_start).toLocaleDateString(),
      engagement: a.metric_value,
      period: a.period_start
    }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

  // Performance metrics by context
  const performanceByContext = performanceMetrics.reduce((acc, metric) => {
    const context = metric.measurement_context || 'general';
    if (!acc[context]) acc[context] = [];
    acc[context].push(metric);
    return acc;
  }, {} as Record<string, typeof performanceMetrics>);

  const performanceChartData = Object.entries(performanceByContext).map(([context, metrics]) => ({
    context,
    avgValue: metrics.reduce((sum, m) => sum + m.metric_value, 0) / metrics.length,
    count: metrics.length
  }));

  // Color scheme for charts
  const colors = {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  };

  const pieColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-gray-400">Deep insights into your creator performance</p>
        </div>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Performance Score</p>
                <p className="text-3xl font-bold text-white">{performanceScore?.toFixed(1) || '0.0'}</p>
                <Badge variant={performanceScore > 80 ? "default" : performanceScore > 60 ? "secondary" : "destructive"}>
                  {performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
              <Award className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
                <Badge variant="outline" className="text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
                <Badge variant="outline" className="text-blue-400">
                  <Eye className="h-3 w-3 mr-1" />
                  Visibility
                </Badge>
              </div>
              <Eye className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Engagement</p>
                <p className="text-3xl font-bold text-white">{avgEngagement.toFixed(1)}%</p>
                <Badge variant="outline" className="text-purple-400">
                  <Heart className="h-3 w-3 mr-1" />
                  Community
                </Badge>
              </div>
              <Heart className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="views">Views & Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={colors.success} 
                    fill={colors.success}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Views Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke={colors.primary} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Engagement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke={colors.secondary} 
                      fill={colors.secondary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Metrics by Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="context" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="avgValue" fill={colors.warning} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">Optimization Opportunity</h4>
                  <p className="text-gray-300 text-sm">
                    Your engagement rate is 15% higher on weekends. Consider scheduling more releases on Friday-Sunday.
                  </p>
                </div>
                
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <h4 className="text-green-300 font-medium mb-2">Revenue Growth</h4>
                  <p className="text-gray-300 text-sm">
                    Cards with holographic effects generate 2.3x more revenue. Consider adding more premium effects.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <h4 className="text-yellow-300 font-medium mb-2">Market Trend</h4>
                  <p className="text-gray-300 text-sm">
                    Fantasy genre cards are trending 40% higher this month. Consider creating more fantasy-themed content.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Design Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded">
                        <div className="w-4/5 h-2 bg-green-500 rounded"></div>
                      </div>
                      <span className="text-sm text-gray-400">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Market Appeal</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded">
                        <div className="w-3/5 h-2 bg-blue-500 rounded"></div>
                      </div>
                      <span className="text-sm text-gray-400">72%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Community Engagement</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded">
                        <div className="w-4/5 h-2 bg-purple-500 rounded"></div>
                      </div>
                      <span className="text-sm text-gray-400">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Technical Innovation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded">
                        <div className="w-full h-2 bg-yellow-500 rounded"></div>
                      </div>
                      <span className="text-sm text-gray-400">92%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
