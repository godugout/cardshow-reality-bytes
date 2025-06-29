
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Mail,
  Shield,
  Ban,
  Crown,
  Calendar
} from 'lucide-react';
import { UserAccount } from './types';

interface UserCardProps {
  user: UserAccount;
  onToggleStatus: (userId: string, suspended: boolean) => void;
  onToggleVerification: (userId: string, verified: boolean) => void;
  onUpdateSubscriptionTier: (userId: string, tier: string) => void;
}

const UserCard = ({ 
  user, 
  onToggleStatus, 
  onToggleVerification, 
  onUpdateSubscriptionTier 
}: UserCardProps) => {
  const getTierColor = (tier: string) => {
    const colors = {
      free: 'bg-gray-600',
      collector: 'bg-blue-600',
      creator_pro: 'bg-purple-600',
      enterprise: 'bg-yellow-600'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-600';
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Users className="w-6 h-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">{user.username}</h3>
                {user.is_verified && (
                  <Badge className="bg-blue-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {user.is_suspended && (
                  <Badge variant="destructive">
                    <Ban className="w-3 h-3 mr-1" />
                    Suspended
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Level {user.level} ({user.experience_points} XP)</span>
                  <span>{user.total_followers} followers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <Badge className={`${getTierColor(user.subscription_tier)} text-white mb-2`}>
                <Crown className="w-3 h-3 mr-1" />
                {user.subscription_tier.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="space-y-2">
                <select
                  value={user.subscription_tier}
                  onChange={(e) => onUpdateSubscriptionTier(user.id, e.target.value)}
                  className="text-xs p-1 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="free">Free</option>
                  <option value="collector">Collector</option>
                  <option value="creator_pro">Creator Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Verified</span>
                <Switch
                  checked={user.is_verified}
                  onCheckedChange={(checked) => onToggleVerification(user.id, checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Suspended</span>
                <Switch
                  checked={user.is_suspended}
                  onCheckedChange={(checked) => onToggleStatus(user.id, checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
