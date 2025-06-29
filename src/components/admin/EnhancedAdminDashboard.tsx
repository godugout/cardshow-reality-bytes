
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Flag, 
  Palette, 
  Link2, 
  Image, 
  Users, 
  Monitor,
  BarChart3
} from 'lucide-react';
import FeatureFlagManager from './backoffice/FeatureFlagManager';
import BrandingManager from './backoffice/BrandingManager';
import IntegrationManager from './backoffice/IntegrationManager';
import ImageAssetManager from './backoffice/ImageAssetManager';
import UXSettingsManager from './backoffice/UXSettingsManager';
import AccountManager from './backoffice/AccountManager';
import AdminDashboard from './AdminDashboard';

const EnhancedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'feature-flags', label: 'Feature Flags', icon: Flag },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'images', label: 'Image Assets', icon: Image },
    { id: 'ux', label: 'UX Settings', icon: Monitor },
    { id: 'accounts', label: 'Account Management', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your platform settings, features, and user experience</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-900 p-1">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="feature-flags" className="space-y-6">
            <FeatureFlagManager />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <BrandingManager />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationManager />
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <ImageAssetManager />
          </TabsContent>

          <TabsContent value="ux" className="space-y-6">
            <UXSettingsManager />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <AccountManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
