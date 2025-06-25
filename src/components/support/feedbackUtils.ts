
import { Bug, Lightbulb, Star, MessageSquare } from 'lucide-react';

export const getFeedbackIcon = (type: string) => {
  switch (type) {
    case 'bug': return <Bug className="w-4 h-4" />;
    case 'feature': return <Lightbulb className="w-4 h-4" />;
    case 'improvement': return <Star className="w-4 h-4" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
};

export const captureBrowserInfo = () => {
  return {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
};
