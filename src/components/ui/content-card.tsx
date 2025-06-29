
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
    <div className={`
      bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 
      hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300
      hover:transform hover:-translate-y-1 hover:shadow-2xl
      ${className}
    `}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-400/30">
                <Icon className="w-7 h-7 text-blue-400" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {title}
              </h3>
              {badge && (
                <Badge 
                  variant={badge.variant || 'default'} 
                  className="bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm"
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg leading-relaxed text-slate-300">
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-600">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-400">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
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
