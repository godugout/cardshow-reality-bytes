
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface AccountEmptyStateProps {
  searchTerm: string;
  tierFilter: string;
  statusFilter: string;
}

const AccountEmptyState = ({ searchTerm, tierFilter, statusFilter }: AccountEmptyStateProps) => {
  return (
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
  );
};

export default AccountEmptyState;
