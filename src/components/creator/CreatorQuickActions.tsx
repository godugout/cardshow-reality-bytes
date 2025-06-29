
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Rocket, Users } from 'lucide-react';

interface CreatorQuickActionsProps {
  onEnterStudio: () => void;
  onShowOnboarding: () => void;
}

export const CreatorQuickActions = ({ onEnterStudio, onShowOnboarding }: CreatorQuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onEnterStudio}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Enter Studio</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Access the full creator toolkit with advanced design features
          </p>
          <Button className="w-full">
            <Rocket className="w-4 h-4 mr-2" />
            Launch Studio
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Join Community</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with other creators and share your work
          </p>
          <Button variant="outline" className="w-full">
            Explore Community
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Quick Tutorial</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Learn the basics or refresh your skills
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onShowOnboarding}
          >
            Start Tutorial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
