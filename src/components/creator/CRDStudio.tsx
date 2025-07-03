
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ModernCardDesigner } from './ModernCardDesigner';
import { CreatorDashboard } from './CreatorDashboard';
import { CardCreationWizard } from './wizard/CardCreationWizard';
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
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <CardCreationWizard onBack={() => setShowWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Studio Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={onBack} 
                className="text-muted-foreground hover:text-foreground rounded-3xl h-12 px-6 font-bold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Exit Studio
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">CRD Studio</h1>
                  <span className="px-4 py-1 bg-gradient-to-r from-primary to-primary/80 text-xs font-bold rounded-3xl text-white">PRO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-xl max-w-lg mx-auto rounded-3xl p-2 border-0 shadow-soft">
              <TabsTrigger value="dashboard" className="flex items-center gap-3 rounded-2xl font-bold">
                <Home className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="designer" className="flex items-center gap-3 rounded-2xl font-bold">
                <Palette className="w-5 h-5" />
                Create
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-3 rounded-2xl font-bold">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <CardCreationWizard onBack={() => setActiveTab('dashboard')} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Card Analytics
              </h3>
              <p className="text-lg text-muted-foreground">
                Coming soon - Track your card performance and earnings
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
