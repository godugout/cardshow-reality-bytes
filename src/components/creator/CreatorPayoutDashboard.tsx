
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StripeConnectOnboarding from './StripeConnectOnboarding';
import PayoutDashboard from './PayoutDashboard';
import PayoutSettings from './PayoutSettings';
import { CreditCard, BarChart3, Settings } from 'lucide-react';

const CreatorPayoutDashboard = () => {
  const [activeTab, setActiveTab] = useState('connect');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Creator Payouts</h1>
        <p className="text-gray-400">
          Manage your Stripe Connect account, view earnings, and configure payout settings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connect" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Connect Account
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connect">
          <StripeConnectOnboarding />
        </TabsContent>

        <TabsContent value="dashboard">
          <PayoutDashboard />
        </TabsContent>

        <TabsContent value="settings">
          <PayoutSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorPayoutDashboard;
