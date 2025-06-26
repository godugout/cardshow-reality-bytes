
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, ExternalLink, CreditCard } from 'lucide-react';

const StripeConnectOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [businessType, setBusinessType] = useState<string>('individual');

  const { data: creatorProfile, isLoading } = useQuery({
    queryKey: ['creator-profile-stripe', user?.id],
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

  const createStripeAccount = useMutation({
    mutationFn: async ({ business_type }: { business_type: string }) => {
      const { data, error } = await supabase.functions.invoke('create-stripe-connect-account', {
        body: { business_type }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.onboarding_url) {
        window.open(data.onboarding_url, '_blank');
        toast({
          title: 'Stripe Connect Account Created',
          description: 'Complete your onboarding to start receiving payouts',
        });
      }
      queryClient.invalidateQueries(['creator-profile-stripe']);
    },
    onError: (error: any) => {
      toast({
        title: 'Error Creating Stripe Account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const checkAccountStatus = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-stripe-account-status');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['creator-profile-stripe']);
      toast({
        title: 'Account Status Updated',
        description: 'Your Stripe account status has been refreshed',
      });
    },
  });

  const handleCreateAccount = () => {
    createStripeAccount.mutate({ business_type: businessType });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (!creatorProfile?.stripe_account_id) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Not Connected</Badge>;
    }
    
    switch (creatorProfile.verification_status) {
      case 'verified':
        return <Badge className="bg-green-600 text-white">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Pending Verification</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown Status</Badge>;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Stripe Connect Setup
          </span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!creatorProfile?.stripe_account_id ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-100 font-medium">Connect Your Stripe Account</p>
                <p className="text-blue-200 text-sm mt-1">
                  To receive payouts from card sales, you need to connect your Stripe account.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Business Type</label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateAccount}
              disabled={createStripeAccount.isPending}
              className="w-full bg-[#00C851]"
            >
              {createStripeAccount.isPending ? 'Creating Account...' : 'Connect Stripe Account'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-100 font-medium">Stripe Account Connected</p>
                <p className="text-green-200 text-sm mt-1">
                  Your Stripe account is connected and ready for payouts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Account ID</p>
                <p className="text-white font-mono text-sm">{creatorProfile.stripe_account_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Payout Status</p>
                <p className="text-white">
                  {creatorProfile.payout_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => checkAccountStatus.mutate()}
                disabled={checkAccountStatus.isPending}
                variant="outline"
                size="sm"
              >
                {checkAccountStatus.isPending ? 'Checking...' : 'Refresh Status'}
              </Button>
              
              <Button
                onClick={() => window.open(`https://dashboard.stripe.com/accounts/${creatorProfile.stripe_account_id}`, '_blank')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Stripe Dashboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;
