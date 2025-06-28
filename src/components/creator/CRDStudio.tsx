
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ModernCardDesigner } from './ModernCardDesigner';
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
  const [activeTab, setActiveTab] = useState('designer');

  return (
    <div className="min-h-screen bg-background">
      {/* Studio Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="text-muted-foreground hover:text-foreground rounded-2xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Studio
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">CRD Studio</h1>
                <span className="px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-xs font-semibold rounded-2xl text-white">PRO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm max-w-md mx-auto rounded-3xl p-2 border-0">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-2xl">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex items-center gap-2 rounded-2xl">
              <Palette className="w-4 h-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-2xl">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <ModernCardDesigner />
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
