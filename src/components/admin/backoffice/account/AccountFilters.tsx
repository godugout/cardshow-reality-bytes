
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { subscriptionTiers, statusOptions } from './types';

interface AccountFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tierFilter: string;
  setTierFilter: (tier: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredCount: number;
}

const AccountFilters = ({
  searchTerm,
  setSearchTerm,
  tierFilter,
  setTierFilter,
  statusFilter,
  setStatusFilter,
  filteredCount
}: AccountFiltersProps) => {
  return (
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
              {filteredCount} users
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountFilters;
