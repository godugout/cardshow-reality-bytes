
import { Plus, Search, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const QuickActionButtons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      icon: Plus,
      label: 'Create Card',
      description: 'Design your first trading card',
      onClick: () => navigate(user ? '/creator' : '/auth'),
      primary: true,
    },
    {
      icon: Search,
      label: 'Browse Cards',
      description: 'Discover amazing creations',
      onClick: () => navigate('/cards'),
      primary: false,
    },
    {
      icon: TrendingUp,
      label: 'Marketplace',
      description: 'Trade and collect cards',
      onClick: () => navigate('/marketplace'),
      primary: false,
    },
    {
      icon: Users,
      label: 'Community',
      description: 'Connect with creators',
      onClick: () => navigate('/community'),
      primary: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Button
          key={action.label}
          onClick={action.onClick}
          variant={action.primary ? "default" : "outline"}
          className={`h-auto p-6 flex flex-col items-center space-y-3 ${
            action.primary
              ? 'bg-[#00C851] hover:bg-[#00A543] text-white'
              : 'border-gray-600 text-gray-300 hover:bg-gray-800'
          }`}
        >
          <action.icon className="w-8 h-8" />
          <div className="text-center">
            <div className="font-semibold">{action.label}</div>
            <div className="text-xs opacity-80">{action.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActionButtons;
