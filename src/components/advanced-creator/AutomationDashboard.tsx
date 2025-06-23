
import { useState } from 'react';
import { useCreatorAutomation, useMarketplaceOptimization } from '@/hooks/advanced-creator/useCreatorAutomation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Settings, 
  Play, 
  Pause,
  Plus,
  Search
} from 'lucide-react';
import type { CreatorAutomationRule } from '@/types/advanced-creator';

export const AutomationDashboard = () => {
  const { 
    automationRules, 
    isLoading, 
    createAutomationRule, 
    updateAutomationRule, 
    deleteAutomationRule,
    isCreating 
  } = useCreatorAutomation();
  
  const { 
    optimizePricing, 
    optimizeSEO, 
    isOptimizingPrice, 
    isOptimizingSEO 
  } = useMarketplaceOptimization();

  const [newRule, setNewRule] = useState<Partial<CreatorAutomationRule>>({
    rule_type: 'pricing_optimization',
    conditions: {},
    actions: {},
    is_active: true
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateRule = () => {
    if (newRule.rule_type && newRule.conditions && newRule.actions) {
      createAutomationRule(newRule as any);
      setShowCreateDialog(false);
      setNewRule({
        rule_type: 'pricing_optimization',
        conditions: {},
        actions: {},
        is_active: true
      });
    }
  };

  const toggleRule = (ruleId: string, isActive: boolean) => {
    updateAutomationRule({ id: ruleId, updates: { is_active: isActive } });
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing_optimization': return <DollarSign className="h-4 w-4" />;
      case 'design_assistance': return <Bot className="h-4 w-4" />;
      case 'quality_check': return <Search className="h-4 w-4" />;
      case 'promotion': return <TrendingUp className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const formatRuleType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg h-64 animate-pulse" />
        <div className="bg-gray-800 rounded-lg h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">AI Pricing</p>
                <Button 
                  size="sm" 
                  onClick={() => optimizePricing('sample-listing-id')}
                  disabled={isOptimizingPrice}
                  className="mt-2"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {isOptimizingPrice ? 'Optimizing...' : 'Optimize'}
                </Button>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">SEO Boost</p>
                <Button 
                  size="sm" 
                  onClick={() => optimizeSEO('sample-listing-id')}
                  disabled={isOptimizingSEO}
                  className="mt-2"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isOptimizingSEO ? 'Optimizing...' : 'Optimize'}
                </Button>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Rules</p>
                <p className="text-2xl font-bold text-white">
                  {automationRules.filter(r => r.is_active).length}
                </p>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {automationRules.length > 0 
                    ? Math.round(automationRules.reduce((sum, r) => sum + r.success_rate, 0) / automationRules.length)
                    : 0}%
                </p>
              </div>
              <Settings className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Automation Rules
            </CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Automation Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Rule Type</Label>
                    <Select 
                      value={newRule.rule_type} 
                      onValueChange={(value) => setNewRule({...newRule, rule_type: value as any})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pricing_optimization">Pricing Optimization</SelectItem>
                        <SelectItem value="design_assistance">Design Assistance</SelectItem>
                        <SelectItem value="quality_check">Quality Check</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Conditions (JSON)</Label>
                    <Textarea
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder='{"min_views": 100, "price_range": {"min": 10, "max": 100}}'
                      value={JSON.stringify(newRule.conditions, null, 2)}
                      onChange={(e) => {
                        try {
                          setNewRule({...newRule, conditions: JSON.parse(e.target.value)});
                        } catch {}
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Actions (JSON)</Label>
                    <Textarea
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder='{"adjust_price": "market_average", "notify": true}'
                      value={JSON.stringify(newRule.actions, null, 2)}
                      onChange={(e) => {
                        try {
                          setNewRule({...newRule, actions: JSON.parse(e.target.value)});
                        } catch {}
                      }}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateRule} 
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? 'Creating...' : 'Create Rule'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {getRuleTypeIcon(rule.rule_type)}
                  <div>
                    <h4 className="text-white font-medium">{formatRuleType(rule.rule_type)}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {rule.execution_count} executions
                      </Badge>
                      <Badge variant={rule.success_rate > 80 ? "default" : "secondary"} className="text-xs">
                        {rule.success_rate}% success
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                  />
                  {rule.is_active ? (
                    <Play className="h-4 w-4 text-green-500" />
                  ) : (
                    <Pause className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
            ))}

            {automationRules.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No automation rules configured yet</p>
                <p className="text-sm text-gray-500">Create your first rule to start automating your workflow</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
