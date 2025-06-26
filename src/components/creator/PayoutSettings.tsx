
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

const PayoutSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [payoutSchedule, setPayoutSchedule] = useState<string>('weekly');
  const [minimumPayout, setMinimumPayout] = useState<string>('25');
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState<boolean>(true);

  const { data: creatorProfile, isLoading } = useQuery({
    queryKey: ['creator-profile-settings', user?.id],
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

  const updatePayoutSettings = useMutation({
    mutationFn: async (settings: any) => {
      if (!creatorProfile) throw new Error('Creator profile not found');
      
      const { error } = await supabase
        .from('creator_profiles')
        .update({
          payout_schedule: settings.schedule,
          minimum_payout_amount: parseFloat(settings.minimumAmount),
          auto_payout_enabled: settings.autoEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', creatorProfile.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Settings Updated',
        description: 'Your payout settings have been saved successfully',
      });
      queryClient.invalidateQueries(['creator-profile-settings']);
    },
    onError: (error: any) => {
      toast({
        title: 'Error Updating Settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const requestInstantPayout = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('request-instant-payout', {
        body: { creator_id: creatorProfile?.id }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Payout Requested',
        description: 'Your instant payout request has been submitted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Payout Request Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSaveSettings = () => {
    updatePayoutSettings.mutate({
      schedule: payoutSchedule,
      minimumAmount: minimumPayout,
      autoEnabled: autoPayoutEnabled,
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const canReceivePayouts = creatorProfile?.verification_status === 'verified' && 
                           creatorProfile?.payout_enabled;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!canReceivePayouts && (
            <div className="flex items-start gap-3 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-100 font-medium">Payouts Not Available</p>
                <p className="text-yellow-200 text-sm mt-1">
                  Complete your Stripe Connect setup and verification to enable payouts.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-payout" className="text-white font-medium">
                  Automatic Payouts
                </Label>
                <p className="text-sm text-gray-400 mt-1">
                  Automatically process payouts based on your schedule
                </p>
              </div>
              <Switch
                id="auto-payout"
                checked={autoPayoutEnabled}
                onCheckedChange={setAutoPayoutEnabled}
                disabled={!canReceivePayouts}
              />
            </div>

            <Separator className="bg-gray-700" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Payout Schedule</Label>
                <Select 
                  value={payoutSchedule} 
                  onValueChange={setPayoutSchedule}
                  disabled={!canReceivePayouts || !autoPayoutEnabled}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly (Mondays)</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Minimum Payout Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    min="1"
                    max="1000"
                    step="0.01"
                    disabled={!canReceivePayouts}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Minimum: $1.00, Maximum: $1,000.00
                </p>
              </div>
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={updatePayoutSettings.isPending || !canReceivePayouts}
              className="w-full bg-[#00C851]"
            >
              {updatePayoutSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Instant Payout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Request an instant payout of your available balance. Instant payouts may include 
            additional fees and are subject to daily limits.
          </p>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Available Balance:</span>
              <span className="text-white font-semibold text-lg">
                ${creatorProfile?.available_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          <Button
            onClick={() => requestInstantPayout.mutate()}
            disabled={
              requestInstantPayout.isPending || 
              !canReceivePayouts || 
              (creatorProfile?.available_balance || 0) < 1
            }
            variant="outline"
            className="w-full"
          >
            {requestInstantPayout.isPending ? 'Processing...' : 'Request Instant Payout'}
          </Button>
          
          <p className="text-xs text-gray-400">
            Instant payouts typically arrive within 30 minutes and may include a 1% fee.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutSettings;
