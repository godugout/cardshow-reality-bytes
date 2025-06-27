
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CardDesigner } from './CardDesigner';
import { CreatorDashboard } from './CreatorDashboard';
import { 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  BarChart3,
  Home
} from 'lucide-react';

interface CRDStudioProps {
  onBack: () => void;
}

export const CRDStudio = ({ onBack }: CRDStudioProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
          </div>
        </div>
      </div>

      {/* Card-Centric Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Card Analytics
              </h3>
              <p className="text-muted-foreground">
                Coming soon - Track your card performance and earnings
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
