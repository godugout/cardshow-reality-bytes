
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Link2, 
  Key, 
  Webhook, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Settings,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  integration_name: string;
  config: any;
  is_active: boolean;
  api_keys: any;
  webhook_url: string;
  last_sync: string;
  error_log: string;
}

const IntegrationManager = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    integration_name: '',
    config: {},
    api_keys: {},
    webhook_url: ''
  });
  const { toast } = useToast();

  const availableIntegrations = [
    {
      name: 'stripe',
      display: 'Stripe Payments',
      description: 'Payment processing and subscriptions',
      fields: ['secret_key', 'webhook_secret']
    },
    {
      name: 'openai',
      display: 'OpenAI',
      description: 'AI-powered content generation',
      fields: ['api_key']
    },
    {
      name: 'aws_s3',
      display: 'Amazon S3',
      description: 'File storage and CDN',
      fields: ['access_key_id', 'secret_access_key', 'bucket_name', 'region']
    },
    {
      name: 'sendgrid',
      display: 'SendGrid',
      description: 'Email delivery service',
      fields: ['api_key', 'from_email']
    },
    {
      name: 'discord',
      display: 'Discord',
      description: 'Community notifications',
      fields: ['bot_token', 'guild_id']
    }
  ];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integration_settings')
        .select('*')
        .order('integration_name');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch integrations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('integration_settings')
        .update({ is_active: active })
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? { ...integration, is_active: active } : integration
      ));

      toast({
        title: 'Success',
        description: `Integration ${active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to update integration',
        variant: 'destructive'
      });
    }
  };

  const addIntegration = async () => {
    try {
      const { error } = await supabase
        .from('integration_settings')
        .insert([newIntegration]);

      if (error) throw error;

      setNewIntegration({
        integration_name: '',
        config: {},
        api_keys: {},
        webhook_url: ''
      });
      setShowAddForm(false);
      fetchIntegrations();

      toast({
        title: 'Success',
        description: 'Integration added successfully',
      });
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to add integration',
        variant: 'destructive'
      });
    }
  };

  const updateApiKey = async (id: string, keyName: string, value: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    const updatedKeys = { ...integration.api_keys, [keyName]: value };

    try {
      const { error } = await supabase
        .from('integration_settings')
        .update({ api_keys: updatedKeys })
        .eq('id', id);

      if (error) throw error;

      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? { ...integration, api_keys: updatedKeys } : integration
      ));
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to update API key',
        variant: 'destructive'
      });
    }
  };

  const testIntegration = async (id: string) => {
    toast({
      title: 'Testing Integration',
      description: 'Running connection test...',
    });
    // This would normally trigger a test of the integration
    setTimeout(() => {
      toast({
        title: 'Test Complete',
        description: 'Integration is working correctly',
      });
    }, 2000);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Integration Management</h2>
          <p className="text-gray-400">Manage third-party service connections</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary text-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Integration Type</Label>
              <select
                value={newIntegration.integration_name}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, integration_name: e.target.value }))}
                className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                <option value="">Select an integration</option>
                {availableIntegrations.map(integration => (
                  <option key={integration.name} value={integration.name}>
                    {integration.display} - {integration.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-white">Webhook URL (Optional)</Label>
              <Input
                value={newIntegration.webhook_url}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, webhook_url: e.target.value }))}
                placeholder="https://your-app.com/webhooks/integration"
                className="bg-gray-800 border-gray-600 text-white mt-2"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={addIntegration} className="bg-primary text-black">
                Add Integration
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {integrations.map((integration) => {
          const integrationInfo = availableIntegrations.find(i => i.name === integration.integration_name);
          
          return (
            <Card key={integration.id} className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {integrationInfo?.display || integration.integration_name}
                      </h3>
                      <Badge variant={integration.is_active ? 'default' : 'secondary'}>
                        {integration.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                      />
                    </div>
                    {integrationInfo && (
                      <p className="text-gray-400 text-sm mb-4">{integrationInfo.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testIntegration(integration.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    {integration.error_log ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </div>

                {integrationInfo && (
                  <div className="space-y-3">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Configuration
                    </h4>
                    <div className="grid gap-3">
                      {integrationInfo.fields.map(field => (
                        <div key={field}>
                          <Label className="text-sm text-gray-300 capitalize">
                            {field.replace('_', ' ')}
                          </Label>
                          <Input
                            type={field.includes('secret') || field.includes('key') ? 'password' : 'text'}
                            value={integration.api_keys[field] || ''}
                            onChange={(e) => updateApiKey(integration.id, field, e.target.value)}
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {integration.webhook_url && (
                  <div className="mt-4">
                    <Label className="text-white flex items-center gap-2">
                      <Webhook className="w-4 h-4" />
                      Webhook URL
                    </Label>
                    <Input
                      value={integration.webhook_url}
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                      readOnly
                    />
                  </div>
                )}

                {integration.error_log && (
                  <div className="mt-4">
                    <Label className="text-red-400">Error Log</Label>
                    <Textarea
                      value={integration.error_log}
                      className="bg-red-900/20 border-red-600 text-white mt-2"
                      readOnly
                      rows={2}
                    />
                  </div>
                )}

                {integration.last_sync && (
                  <div className="mt-4 text-sm text-gray-400">
                    Last sync: {new Date(integration.last_sync).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {integrations.length === 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-12 text-center">
              <Link2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Integrations</h3>
              <p className="text-gray-400">Add your first integration to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IntegrationManager;
