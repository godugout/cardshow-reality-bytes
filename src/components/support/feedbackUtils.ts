
import { Bug, Lightbulb, Star, MessageSquare, LucideIcon } from 'lucide-react';

export const getFeedbackIcon = (type: string): LucideIcon => {
  switch (type) {
    case 'bug': return Bug;
    case 'feature': return Lightbulb;
    case 'improvement': return Star;
    default: return MessageSquare;
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
