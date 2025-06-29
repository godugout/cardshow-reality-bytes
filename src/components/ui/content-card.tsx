
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning';
  };
  icon?: LucideIcon;
  action?: {
    text: string;
    onClick: () => void;
  };
  stats?: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
}

const ContentCard = ({
  title,
  description,
  badge,
  icon: Icon,
  action,
  stats,
  className = ''
}: ContentCardProps) => {
  return (
    <div className={`card card-premium hover-lift p-8 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-14 h-14 rounded-2xl glass-morphism flex items-center justify-center border-glow">
                <Icon className="w-7 h-7 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-headline mb-3" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
              {badge && (
                <Badge 
                  variant={badge.variant || 'default'} 
                  className="bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm"
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-body-large leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-title gradient-text-primary font-bold">
                  {stat.value}
                </div>
                <div className="text-caption font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        {action && (
          <div className="pt-6">
            <Button 
              className="w-full btn btn-primary btn-lg"
              onClick={action.onClick}
            >
              {action.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
