
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  badge?: {
    icon: LucideIcon;
    text: string;
  };
  title: string;
  subtitle?: string;
  description: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

const PageHeader = ({
  badge,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  stats
}: PageHeaderProps) => {
  const BadgeIcon = badge?.icon;

  return (
    <div className="section">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <div className="mb-8">
              <Badge className="bg-primary/20 text-primary border-0 px-6 py-2">
                {BadgeIcon && <BadgeIcon className="w-4 h-4 mr-2" />}
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title */}
          <div className="space-y-6 mb-12">
            <h1 className="text-display">
              <span className="text-white">{title}</span>
              {subtitle && (
                <>
                  <br />
                  <span style={{ color: 'var(--primary)' }}>{subtitle}</span>
                </>
              )}
            </h1>
            
            <p className="text-body text-secondary max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {primaryAction && (
                <Button 
                  className="btn btn-primary btn-lg"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.text}
                </Button>
              )}
              
              {secondaryAction && (
                <Button 
                  className="btn btn-ghost btn-lg"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="flex gap-8 justify-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-title" style={{ color: 'var(--primary)' }}>
                    {stat.value}
                  </div>
                  <div className="text-caption">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
