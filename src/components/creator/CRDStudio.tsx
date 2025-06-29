
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContextualButton } from '@/components/ui/contextual-button';
import { ContextualBadge } from '@/components/ui/contextual-badge';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Cards-themed background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cards/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cards/3 rounded-full blur-3xl" />
      </div>

      {/* Studio Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl relative">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <ContextualButton 
                context="cards"
                variant="ghost" 
                onClick={onBack} 
                className="text-muted-foreground hover:text-foreground rounded-3xl h-12 px-6 font-bold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Exit Studio
              </ContextualButton>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-cards to-cards/80 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">CRD Studio</h1>
                  <ContextualBadge 
                    context="cards" 
                    variant="primary" 
                    className="text-xs font-bold rounded-3xl"
                  >
                    PRO
                  </ContextualBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-8 py-8 relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-xl max-w-lg mx-auto rounded-3xl p-2 border-0 shadow-card">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-3 rounded-2xl font-bold data-[state=active]:bg-cards/20 data-[state=active]:text-cards transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="designer" 
                className="flex items-center gap-3 rounded-2xl font-bold data-[state=active]:bg-cards/20 data-[state=active]:text-cards transition-all duration-200"
              >
                <Palette className="w-5 h-5" />
                Create
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-3 rounded-2xl font-bold data-[state=active]:bg-cards/20 data-[state=active]:text-cards transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <ModernCardDesigner />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cards/20 to-cards/10 flex items-center justify-center shadow-card">
                <BarChart3 className="w-10 h-10 text-cards" />
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
