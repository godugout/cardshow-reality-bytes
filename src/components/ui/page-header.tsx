
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
      <div className="container-2xl">
        <div className="text-center max-w-5xl mx-auto relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl -z-10" />
          
          {/* Badge */}
          {badge && (
            <div className="mb-10">
              <Badge className="glass-morphism border-glow px-8 py-3 text-lg font-semibold">
                {BadgeIcon && <BadgeIcon className="w-5 h-5 mr-3" />}
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title Section */}
          <div className="space-y-8 mb-16">
            <h1 className="text-display leading-none">
              <span style={{ color: 'var(--text-primary)' }}>{title}</span>
              {subtitle && (
                <>
                  <br />
                  <span className="gradient-text-primary">{subtitle}</span>
                </>
              )}
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-body-large leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            </div>
          </div>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {primaryAction && (
                <Button 
                  className="btn btn-primary btn-xl hover-glow"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.text}
                </Button>
              )}
              
              {secondaryAction && (
                <Button 
                  className="btn btn-ghost btn-xl hover-lift"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-3">
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
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
