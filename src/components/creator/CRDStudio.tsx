
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CardDesigner } from './CardDesigner';
import { CRDElementsMarketplace } from './CRDElementsMarketplace';
import { CRDElementCreator } from './CRDElementCreator';
import { CreatorDashboard } from './CreatorDashboard';
import { RevenueAnalytics } from './RevenueAnalytics';
import { AdvancedAnalytics } from '@/components/advanced-creator/AdvancedAnalytics';
import { AutomationDashboard } from '@/components/advanced-creator/AutomationDashboard';
import { DesignAssetsLibrary } from '@/components/advanced-creator/DesignAssetsLibrary';
import { 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  ShoppingBag, 
  BarChart3,
  Settings,
  Layers,
  Zap
} from 'lucide-react';

interface CRDStudioProps {
  onBack: () => void;
}

export const CRDStudio = ({ onBack }: CRDStudioProps) => {
  const [activeTab, setActiveTab] = useState('designer');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Studio Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Studio
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#00C851]" />
                <h1 className="text-2xl font-bold text-white">CRD Studio</h1>
                <span className="px-2 py-1 bg-gradient-to-r from-[#00C851] to-[#00A543] text-xs font-semibold rounded-full text-white">PRO</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Studio Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-900">
            <TabsTrigger value="designer" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Designer
            </TabsTrigger>
            <TabsTrigger value="elements" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="elements">
            <CRDElementCreator />
          </TabsContent>

          <TabsContent value="marketplace">
            <CRDElementsMarketplace />
          </TabsContent>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="assets">
            <DesignAssetsLibrary />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
