
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Layers, Sparkles, Wand2 } from 'lucide-react';

interface DesignToolsStepProps {
  onNext: () => void;
}

const DesignToolsStep = ({ onNext }: DesignToolsStepProps) => {
  const tools = [
    {
      icon: Palette,
      title: "Color & Design",
      description: "Customize colors, fonts, and layouts",
      features: ["Color picker", "Font selection", "Layout templates"]
    },
    {
      icon: Layers,
      title: "Layers & Effects",
      description: "Add depth and visual effects to your cards",
      features: ["Layer management", "Shadow effects", "Transparency"]
    },
    {
      icon: Sparkles,
      title: "Premium Effects",
      description: "Holographic, foil, and chrome effects",
      features: ["Holographic shine", "Foil textures", "Chrome reflection"],
      premium: true
    },
    {
      icon: Wand2,
      title: "AI Assistance",
      description: "Get AI-powered design suggestions",
      features: ["Smart layouts", "Color harmony", "Style matching"],
      premium: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Design Tools Overview</h2>
        <p className="text-muted-foreground mb-6">
          Explore the powerful design tools available to create stunning cards. 
          Start with basic tools and upgrade to premium features as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6">
              {tool.premium && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                  Premium
                </Badge>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <tool.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tool.description}
                  </p>
                  <div className="space-y-1">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> You can switch between Basic Mode (quick creation) and 
          Studio Mode (advanced tools) anytime while creating cards.
        </p>
      </div>
    </div>
  );
};

export default DesignToolsStep;
