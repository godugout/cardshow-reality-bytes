
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Shield,
  Ban,
  Crown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string;
  subscription_tier: string;
  experience_points: number;
  level: number;
  total_followers: number;
  total_following: number;
  created_at: string;
  last_active: string;
  is_verified: boolean;
  is_suspended: boolean;
}

const AccountManager = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const subscriptionTiers = ['all', 'free', 'collector', 'creator_pro', 'enterprise'];
  const statusOptions = ['all', 'active', 'suspended', 'verified'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user accounts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, suspended: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_suspended: suspended })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_suspended: suspended } : user
      ));

      toast({
        title: 'Success',
        description: `User ${suspended ? 'suspended' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  const toggleVerification = async (userId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_verified: verified })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_verified: verified } : user
      ));

      toast({
        title: 'Success',
        description: `User ${verified ? 'verified' : 'unverified'} successfully`,
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive'
      });
    }
  };

  const updateSubscriptionTier = async (userId: string, tier: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, subscription_tier: tier } : user
      ));

      toast({
        title: 'Success',
        description: 'Subscription tier updated successfully',
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription tier',
        variant: 'destructive'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === 'all' || user.subscription_tier === tierFilter;
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'suspended' && user.is_suspended) ||
                         (statusFilter === 'verified' && user.is_verified) ||
                         (statusFilter === 'active' && !user.is_suspended);
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierColor = (tier: string) => {
    const colors = {
      free: 'bg-gray-600',
      collector: 'bg-blue-600',
      creator_pro: 'bg-purple-600',
      enterprise: 'bg-yellow-600'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Account Management</h2>
        <p className="text-gray-400">Manage user accounts, subscriptions, and permissions</p>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                {subscriptionTiers.map(tier => (
                  <option key={tier} value={tier}>
                    {tier === 'all' ? 'All Tiers' : tier.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-white">
                {filteredUsers.length} users
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-gray-900 border-gray-700">
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
                        onChange={(e) => updateSubscriptionTier(user.id, e.target.value)}
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
                        onCheckedChange={(checked) => toggleVerification(user.id, checked)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Suspended</span>
                      <Switch
                        checked={user.is_suspended}
                        onCheckedChange={(checked) => toggleUserStatus(user.id, checked)}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Users Found</h3>
            <p className="text-gray-400">
              {searchTerm || tierFilter !== 'all' || statusFilter !== 'all'
                ? 'No users match your search criteria'
                : 'No users in the system'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountManager;
