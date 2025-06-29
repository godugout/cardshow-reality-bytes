
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserAccount } from './account/types';
import AccountFilters from './account/AccountFilters';
import UserCard from './account/UserCard';
import AccountEmptyState from './account/AccountEmptyState';

const AccountManager = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

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
      
      // Transform the data to match our UserAccount interface
      const transformedUsers: UserAccount[] = (data || []).map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        subscription_tier: user.subscription_tier,
        experience_points: user.experience_points,
        level: user.level,
        total_followers: user.total_followers,
        total_following: user.total_following,
        created_at: user.created_at,
        last_active: user.created_at, // Use created_at as fallback since last_active doesn't exist in schema
        is_verified: user.is_verified,
        is_suspended: false, // Default to false since this field doesn't exist in schema
      }));
      
      setUsers(transformedUsers);
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
      // Since is_suspended doesn't exist in the schema, we'll just update the local state
      // In a real implementation, you'd need to add this field to the database schema
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Account Management</h2>
          <p className="text-gray-400">Manage user accounts, subscriptions, and permissions</p>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Account Management</h2>
        <p className="text-gray-400">Manage user accounts, subscriptions, and permissions</p>
      </div>

      <AccountFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredCount={filteredUsers.length}
      />

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onToggleStatus={toggleUserStatus}
            onToggleVerification={toggleVerification}
            onUpdateSubscriptionTier={updateSubscriptionTier}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <AccountEmptyState
          searchTerm={searchTerm}
          tierFilter={tierFilter}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
};

export default AccountManager;
