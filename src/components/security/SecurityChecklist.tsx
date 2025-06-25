
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Users,
  Database,
  CreditCard,
  Server,
  FileText,
  Lock
} from 'lucide-react';

interface SecurityChecklistItem {
  id: string;
  category: 'authentication' | 'data_protection' | 'payment_security' | 'infrastructure' | 'compliance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
  evidence?: string[];
  complianceStandards: string[];
}

const securityChecklist: SecurityChecklistItem[] = [
  // Critical Priority Items
  {
    id: 'AUTH-001',
    category: 'authentication',
    priority: 'critical',
    title: 'Implement Strong Password Policy',
    description: 'Enforce minimum 12 characters, complexity requirements, and password history',
    completed: false,
    complianceStandards: ['ISO27001', 'NIST'],
  },
  {
    id: 'AUTH-002',
    category: 'authentication',
    priority: 'critical',
    title: 'Secure Session Management',
    description: 'Implement proper session timeout, rotation, and secure storage',
    completed: false,
    complianceStandards: ['GDPR', 'ISO27001'],
  },
  {
    id: 'DATA-001',
    category: 'data_protection',
    priority: 'critical',
    title: 'Audit Row Level Security Policies',
    description: 'Review and strengthen RLS policies for all Supabase tables',
    completed: false,
    complianceStandards: ['GDPR', 'ISO27001'],
  },
  {
    id: 'DATA-002',
    category: 'data_protection',
    priority: 'critical',
    title: 'Implement Field-Level Encryption',
    description: 'Encrypt sensitive user data fields at application level',
    completed: false,
    complianceStandards: ['GDPR', 'PCI DSS'],
  },
  
  // High Priority Items
  {
    id: 'AUTH-003',
    category: 'authentication',
    priority: 'high',
    title: 'Implement Two-Factor Authentication',
    description: 'Add TOTP/SMS-based MFA for all user accounts',
    completed: false,
    complianceStandards: ['ISO27001', 'NIST'],
  },
  {
    id: 'DATA-003',
    category: 'data_protection',
    priority: 'high',
    title: 'GDPR Compliance Implementation',
    description: 'Implement data portability, right to be forgotten, and consent management',
    completed: false,
    complianceStandards: ['GDPR'],
  },
  {
    id: 'PAYMENT-001',
    category: 'payment_security',
    priority: 'high',
    title: 'Secure Stripe Webhook Endpoints',
    description: 'Implement webhook signature verification and secure processing',
    completed: false,
    complianceStandards: ['PCI DSS'],
  },
  {
    id: 'INFRA-001',
    category: 'infrastructure',
    priority: 'high',
    title: 'Implement Rate Limiting',
    description: 'Add rate limiting to all API endpoints to prevent abuse',
    completed: false,
    complianceStandards: ['ISO27001', 'NIST'],
  },
  
  // Medium Priority Items
  {
    id: 'INFRA-002',
    category: 'infrastructure',
    priority: 'medium',
    title: 'Configure Security Headers',
    description: 'Implement CSP, HSTS, X-Frame-Options, and other security headers',
    completed: false,
    complianceStandards: ['OWASP', 'ISO27001'],
  },
  {
    id: 'DATA-004',
    category: 'data_protection',
    priority: 'medium',
    title: 'Implement Audit Logging',
    description: 'Log all security-relevant events and user actions',
    completed: false,
    complianceStandards: ['ISO27001', 'SOC2'],
  },
  {
    id: 'AUTH-004',
    category: 'authentication',
    priority: 'medium',
    title: 'Account Lockout Protection',
    description: 'Implement account lockout after failed login attempts',
    completed: false,
    complianceStandards: ['NIST', 'ISO27001'],
  },
  
  // Low Priority Items
  {
    id: 'INFRA-003',
    category: 'infrastructure',
    priority: 'low',
    title: 'Implement Content Security Policy',
    description: 'Configure comprehensive CSP to prevent XSS attacks',
    completed: false,
    complianceStandards: ['OWASP'],
  },
  {
    id: 'COMPLIANCE-001',
    category: 'compliance',
    priority: 'low',
    title: 'Regular Security Training',
    description: 'Conduct security awareness training for all team members',
    completed: false,
    complianceStandards: ['ISO27001', 'SOC2'],
  },
];

const SecurityChecklist = () => {
  const [checklistItems, setChecklistItems] = useState(securityChecklist);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const filteredItems = checklistItems.filter(item => {
    if (filterPriority && item.priority !== filterPriority) return false;
    if (filterCategory && item.category !== filterCategory) return false;
    return true;
  });

  const completedItems = checklistItems.filter(item => item.completed).length;
  const totalItems = checklistItems.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const priorityCounts = {
    critical: checklistItems.filter(item => item.priority === 'critical' && !item.completed).length,
    high: checklistItems.filter(item => item.priority === 'high' && !item.completed).length,
    medium: checklistItems.filter(item => item.priority === 'medium' && !item.completed).length,
    low: checklistItems.filter(item => item.priority === 'low' && !item.completed).length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Users className="w-4 h-4" />;
      case 'data_protection': return <Database className="w-4 h-4" />;
      case 'payment_security': return <CreditCard className="w-4 h-4" />;
      case 'infrastructure': return <Server className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00C851]" />
            Security Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Overall Progress</span>
            <span className="text-white font-semibold">{completedItems}/{totalItems} completed</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-800">
              <div className="text-2xl font-bold text-red-400">{priorityCounts.critical}</div>
              <div className="text-sm text-red-300">Critical</div>
            </div>
            <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-800">
              <div className="text-2xl font-bold text-orange-400">{priorityCounts.high}</div>
              <div className="text-sm text-orange-300">High</div>
            </div>
            <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
              <div className="text-2xl font-bold text-yellow-400">{priorityCounts.medium}</div>
              <div className="text-sm text-yellow-300">Medium</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-800">
              <div className="text-2xl font-bold text-blue-400">{priorityCounts.low}</div>
              <div className="text-sm text-blue-300">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-400 mr-2">Filter by priority:</span>
            <Button
              variant={filterPriority === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPriority(null)}
            >
              All
            </Button>
            {['critical', 'high', 'medium', 'low'].map(priority => (
              <Button
                key={priority}
                variant={filterPriority === priority ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority(priority)}
              >
                {priority}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 mr-2">Filter by category:</span>
            <Button
              variant={filterCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              All
            </Button>
            {['authentication', 'data_protection', 'payment_security', 'infrastructure', 'compliance'].map(category => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300">
                          {item.id}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400">
                          {getCategoryIcon(item.category)}
                          <span className="text-sm">{item.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <h3 className={`font-semibold mb-1 ${item.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-2">
                        {item.description}
                      </p>
                      
                      <div className="flex gap-1 flex-wrap">
                        {item.complianceStandards.map(standard => (
                          <Badge key={standard} variant="secondary" className="text-xs">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : item.priority === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No items match the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityChecklist;
