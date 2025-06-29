
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
    <div className={`card card-glass p-8 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
            )}
            <div>
              <h3 className="text-headline text-white mb-2">{title}</h3>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="bg-primary/20 text-primary border-0">
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-body text-secondary leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-headline" style={{ color: 'var(--primary)' }}>
                  {stat.value}
                </div>
                <div className="text-caption">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        {action && (
          <div className="pt-4">
            <Button 
              className="w-full btn btn-primary"
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
