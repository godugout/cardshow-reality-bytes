import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Users, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Database,
  Globe
} from 'lucide-react';
import { useAdminMetrics, useModerationQueue, useSystemHealth, useUserManagement } from '@/hooks/enterprise/useAdminDashboard';
import PerformanceDashboard from './PerformanceDashboard';

const AdminDashboard = () => {
  const { metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { queue, isLoading: queueLoading } = useModerationQueue();
  const { health, isLoading: healthLoading } = useSystemHealth();
  const { users, isLoading: usersLoading } = useUserManagement();

  const criticalHealth = health.filter(h => h.status === 'critical');
  const warningHealth = health.filter(h => h.status === 'warning');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant={criticalHealth.length > 0 ? 'destructive' : 'secondary'}>
            System Status: {criticalHealth.length > 0 ? 'Critical' : 'Healthy'}
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalHealth.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalHealth.length} critical system issue(s) detected. Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users.length.toLocaleString()}
            </div>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Moderation Queue</CardTitle>
            <Shield className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{queue.length}</div>
            <p className="text-xs text-gray-400">Items pending review</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(((health.length - criticalHealth.length - warningHealth.length) / health.length) * 100)}%
            </div>
            <p className="text-xs text-green-500">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$127,430</div>
            <p className="text-xs text-green-500">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 bg-gray-900">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics?.map((metric) => (
                    <div key={metric.metric_type} className="space-y-2">
                      <div className="text-sm text-gray-400 capitalize">
                        {metric.metric_type.replace('_', ' ')}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {metric.current_value.toLocaleString()}
                      </div>
                      <div className={`text-sm ${metric.change_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change_percentage >= 0 ? '+' : ''}{metric.change_percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{user.username || 'Anonymous'}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Content Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : queue.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No items in moderation queue
                </div>
              ) : (
                <div className="space-y-4">
                  {queue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-white capitalize">{item.content_type}</div>
                        <div className="text-sm text-gray-400">{item.reason}</div>
                        <div className="text-xs text-gray-500">
                          Priority: {item.priority} | {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">System Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {health.map((metric) => (
                    <Card key={metric.id} className="bg-gray-800 border-gray-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">{metric.metric_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-semibold text-white">
                          {metric.metric_value.toFixed(2)}
                        </div>
                        <Badge 
                          variant={
                            metric.status === 'critical' ? 'destructive' : 
                            metric.status === 'warning' ? 'secondary' : 'default'
                          }
                          className="mt-2"
                        >
                          {metric.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Enterprise Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">White Label Solutions</h3>
                  <p className="text-gray-400">Configure custom branding for enterprise clients</p>
                  <Button className="w-full">Manage White Label</Button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Custom Domains</h3>
                  <p className="text-gray-400">Set up custom domains with SSL certificates</p>
                  <Button className="w-full">Configure Domains</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Business Intelligence Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Revenue Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  User Analytics
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Database className="h-6 w-6 mb-2" />
                  Platform Usage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
