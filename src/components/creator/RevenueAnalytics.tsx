
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Clock, 
  Target,
  Calendar 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const RevenueAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");

  const { data: creatorProfile } = useQuery({
    queryKey: ["creator-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: earnings } = useQuery({
    queryKey: ["creator-earnings-analytics", creatorProfile?.id, timeRange],
    queryFn: async () => {
      if (!creatorProfile?.id) return [];
      
      const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data, error } = await supabase
        .from("creator_earnings")
        .select("*")
        .eq("creator_id", creatorProfile.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at");
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorProfile?.id,
  });

  const { data: templates } = useQuery({
    queryKey: ["creator-templates-analytics", creatorProfile?.id],
    queryFn: async () => {
      if (!creatorProfile?.id) return [];
      const { data, error } = await supabase
        .from("card_templates_creator")
        .select("*")
        .eq("creator_id", creatorProfile.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorProfile?.id,
  });

  // Process earnings data for charts
  const processEarningsData = () => {
    if (!earnings) return [];
    
    const groupedData: { [key: string]: number } = {};
    earnings.forEach(earning => {
      const date = new Date(earning.created_at).toISOString().split('T')[0];
      groupedData[date] = (groupedData[date] || 0) + Number(earning.net_amount);
    });

    return Object.entries(groupedData).map(([date, amount]) => ({
      date,
      amount: Number(amount.toFixed(2)),
      formatted: new Date(date).toLocaleDateString()
    }));
  };

  // Process source type data for pie chart
  const processSourceData = () => {
    if (!earnings) return [];
    
    const sourceData: { [key: string]: number } = {};
    earnings.forEach(earning => {
      sourceData[earning.source_type] = (sourceData[earning.source_type] || 0) + Number(earning.net_amount);
    });

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return Object.entries(sourceData).map(([source, amount], index) => ({
      name: source.replace('_', ' ').toUpperCase(),
      value: Number(amount.toFixed(2)),
      color: colors[index % colors.length]
    }));
  };

  // Process template performance data
  const processTemplateData = () => {
    if (!templates) return [];
    
    return templates
      .sort((a, b) => b.revenue_generated - a.revenue_generated)
      .slice(0, 10)
      .map(template => ({
        name: template.name.length > 15 ? template.name.substring(0, 15) + "..." : template.name,
        revenue: Number(template.revenue_generated),
        sales: template.sales_count
      }));
  };

  const earningsChartData = processEarningsData();
  const sourceChartData = processSourceData();
  const templateChartData = processTemplateData();

  const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.net_amount), 0) || 0;
  const pendingEarnings = earnings?.filter(e => e.status === "pending")
    .reduce((sum, earning) => sum + Number(earning.net_amount), 0) || 0;
  const avgTransactionValue = earnings?.length ? totalEarnings / earnings.length : 0;

  if (!creatorProfile) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">Please complete your creator profile setup to view analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              {earnings?.filter(e => e.status === "pending").length || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${avgTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              Per sale
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {templates?.reduce((sum, template) => sum + template.sales_count, 0) || 0}
            </div>
            <p className="text-xs text-gray-400">
              All templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="formatted" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Source */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {sourceChartData.map((entry, index) => (
                <Badge key={index} variant="outline" className="border-gray-600">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Templates Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Top Template Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={templateChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1F2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
              />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings?.slice(0, 10).map((earning) => (
              <div key={earning.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{earning.source_type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(earning.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${Number(earning.net_amount).toFixed(2)}</p>
                  <Badge 
                    variant="outline"
                    className={
                      earning.status === "paid" 
                        ? "border-green-500 text-green-500" 
                        : "border-yellow-500 text-yellow-500"
                    }
                  >
                    {earning.status}
                  </Badge>
                </div>
              </div>
            ))}
            {!earnings?.length && (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
