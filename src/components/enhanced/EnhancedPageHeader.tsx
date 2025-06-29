
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EnhancedPageHeaderProps {
  badge: {
    icon: LucideIcon;
    text: string;
  };
  title: string;
  subtitle?: string;
  description: string;
  primaryAction: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

const EnhancedPageHeader = ({
  badge,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  stats
}: EnhancedPageHeaderProps) => {
  const BadgeIcon = badge.icon;

  return (
    <div className="relative section-padding">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0F0F0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,200,81,0.12)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />

      <div className="relative z-10 container-enhanced">
        <div className="text-center max-w-4xl mx-auto">
          {/* Enhanced Badge */}
          <div className="mb-8">
            <Badge className="badge-premium px-6 py-3">
              <BadgeIcon className="w-5 h-5 mr-2" />
              {badge.text}
            </Badge>
          </div>

          {/* Enhanced Typography */}
          <div className="space-y-6 mb-12">
            <h1 className="hero-text">
              <span className="text-white">{title}</span>
              {subtitle && (
                <>
                  <br />
                  <span className="gradient-text-enhanced">{subtitle}</span>
                </>
              )}
            </h1>
            
            <p className="body-large text-muted-foreground/90 max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Enhanced Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="btn-primary-enhanced"
              onClick={primaryAction.onClick}
            >
              {primaryAction.text}
            </Button>
            
            {secondaryAction && (
              <Button 
                className="btn-outline-enhanced"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.text}
              </Button>
            )}
          </div>

          {/* Enhanced Stats */}
          {stats && (
            <div className="flex gap-8 justify-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="display-text gradient-text-enhanced">{stat.value}</div>
                  <div className="body-text text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPageHeader;
