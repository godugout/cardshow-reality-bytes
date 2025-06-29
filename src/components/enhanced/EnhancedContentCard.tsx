
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EnhancedContentCardProps {
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

const EnhancedContentCard = ({
  title,
  description,
  badge,
  icon: Icon,
  action,
  stats,
  className
}: EnhancedContentCardProps) => {
  return (
    <ModernCard 
      variant="glass" 
      interactive={!!action}
      className={`glass-card-premium hover-lift-enhanced p-8 ${className || ''}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="headline-3 text-white mb-2">{title}</h3>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="badge-premium">
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="body-text text-muted-foreground/80 leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="headline-3 gradient-text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        {action && (
          <div className="pt-4">
            <Button 
              className="w-full btn-primary-enhanced"
              onClick={action.onClick}
            >
              {action.text}
            </Button>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

export default EnhancedContentCard;
