
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar, Download, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface PayoutRecord {
  id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  source_type: string;
  status: string;
  transaction_date: string;
  payout_date: string | null;
  stripe_transfer_id: string | null;
  tax_document_id: string | null;
  metadata: Record<string, any>;
}

const PayoutDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>('30');
  const [payoutFilter, setPayoutFilter] = useState<string>('all');

  const { data: creatorProfile } = useQuery({
    queryKey: ['creator-profile-payout', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: payoutHistory, isLoading } = useQuery({
    queryKey: ['creator-payouts', creatorProfile?.id, timeRange, payoutFilter],
    queryFn: async () => {
      if (!creatorProfile?.id) return [];
      
      let query = supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('transaction_date', { ascending: false });

      // Apply time filter
      if (timeRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
        query = query.gte('transaction_date', daysAgo.toISOString());
      }

      // Apply status filter
      if (payoutFilter !== 'all') {
        query = query.eq('status', payoutFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PayoutRecord[];
    },
    enabled: !!creatorProfile?.id,
  });

  const { data: payoutSummary } = useQuery({
    queryKey: ['creator-payout-summary', creatorProfile?.id],
    queryFn: async () => {
      if (!creatorProfile?.id) return null;
      
      const { data, error } = await supabase.rpc('calculate_creator_earnings', {
        creator_uuid: creatorProfile.id
      });
      
      if (error) throw error;
      return data[0];
    },
    enabled: !!creatorProfile?.id,
  });

  const generateTaxReport = async () => {
    if (!creatorProfile?.id) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-tax-report', {
        body: { creator_id: creatorProfile.id, year: new Date().getFullYear() }
      });
      
      if (error) throw error;
      
      // Download the tax report
      const blob = new Blob([data.report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${new Date().getFullYear()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating tax report:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600 text-white">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'ready_for_payout':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Ready</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payout Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${payoutSummary?.total_earnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-400">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending Payouts
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${payoutSummary?.pending_earnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-400">
              Awaiting payout
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Paid Out
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${payoutSummary?.paid_earnings?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-400">
              Successfully paid
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Transaction Count
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {payoutSummary?.transaction_count || 0}
            </div>
            <p className="text-xs text-gray-400">
              Total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Payout History
            <div className="flex gap-2">
              <Button
                onClick={generateTaxReport}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tax Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={payoutFilter} onValueChange={setPayoutFilter}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="ready_for_payout">Ready</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payout History Table */}
          <div className="space-y-4">
            {payoutHistory?.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-white capitalize">
                      {payout.source_type.replace('_', ' ')}
                    </span>
                    {getStatusBadge(payout.status)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {format(new Date(payout.transaction_date), 'MMM dd, yyyy')}
                    {payout.payout_date && (
                      <span className="ml-2">
                        • Paid: {format(new Date(payout.payout_date), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    ${payout.net_amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Fee: ${payout.platform_fee.toFixed(2)}
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {!payoutHistory?.length && (
              <div className="text-center py-8">
                <p className="text-gray-400">No payout history found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutDashboard;
