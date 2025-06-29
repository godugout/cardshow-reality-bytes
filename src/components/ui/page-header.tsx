
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
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl blur-3xl -z-10" />
          
          {/* Badge */}
          {badge && (
            <div className="mb-10">
              <Badge className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 px-8 py-3 text-lg font-semibold text-slate-200">
                {BadgeIcon && <BadgeIcon className="w-5 h-5 mr-3" />}
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title Section */}
          <div className="space-y-8 mb-16">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-none">
              <span className="text-white">{title}</span>
              {subtitle && (
                <>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {subtitle}
                  </span>
                </>
              )}
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {primaryAction && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.text}
                </Button>
              )}
              
              {secondaryAction && (
                <Button 
                  className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 text-white hover:bg-slate-600/50 hover:border-slate-500 py-4 px-8 rounded-xl text-lg hover:transform hover:-translate-y-1 transition-all duration-300"
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
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-400">
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
