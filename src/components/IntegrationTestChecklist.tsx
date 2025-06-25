
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';

interface TestCase {
  id: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
  expected: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'running' | 'passed' | 'failed';
  automated: boolean;
}

const testCases: TestCase[] = [
  {
    id: 'auth-001',
    category: 'Authentication',
    title: 'User Registration Flow',
    description: 'Complete user registration from signup to first login',
    steps: [
      'Navigate to /auth',
      'Fill out registration form',
      'Submit form',
      'Verify email confirmation message',
      'Check email for verification link',
      'Click verification link',
      'Login with new credentials'
    ],
    expected: 'User successfully registered and can access protected routes',
    priority: 'critical',
    status: 'pending',
    automated: false
  },
  {
    id: 'auth-002',
    category: 'Authentication',
    title: 'Login Flow',
    description: 'User login and session persistence',
    steps: [
      'Navigate to /auth',
      'Enter valid credentials',
      'Submit login form',
      'Verify redirect to dashboard',
      'Refresh page',
      'Verify session persists'
    ],
    expected: 'User remains authenticated after page refresh',
    priority: 'critical',
    status: 'pending',
    automated: true
  },
  {
    id: 'cards-001',
    category: 'Card Management',
    title: 'Card Creation Flow',
    description: 'Create new card with image upload',
    steps: [
      'Navigate to /creator',
      'Click "Create New Card"',
      'Upload card image',
      'Fill out card details',
      'Preview 3D card',
      'Save card',
      'Verify card appears in collection'
    ],
    expected: 'Card created successfully with 3D preview',
    priority: 'critical',
    status: 'pending',
    automated: false
  },
  {
    id: 'marketplace-001',
    category: 'Marketplace',
    title: 'Card Purchase Flow',
    description: 'Purchase card through Stripe integration',
    steps: [
      'Navigate to /marketplace',
      'Select card to purchase',
      'Click "Buy Now"',
      'Complete Stripe checkout',
      'Verify payment confirmation',
      'Check card ownership transfer'
    ],
    expected: 'Card purchased and ownership transferred',
    priority: 'critical',
    status: 'pending',
    automated: false
  },
  {
    id: 'realtime-001',
    category: 'Real-time Features',
    title: 'Trading Chat',
    description: 'Real-time messaging in trading room',
    steps: [
      'Open two browser windows',
      'Login as different users',
      'Start trade conversation',
      'Send messages from both sides',
      'Verify real-time message delivery'
    ],
    expected: 'Messages appear instantly in both windows',
    priority: 'high',
    status: 'pending',
    automated: false
  },
  {
    id: 'mobile-001',
    category: 'Mobile Experience',
    title: 'Mobile Navigation',
    description: 'Test core features on mobile devices',
    steps: [
      'Open app on mobile device',
      'Test navigation menu',
      'Test card viewing',
      'Test collection browsing',
      'Test authentication flows'
    ],
    expected: 'All features work smoothly on mobile',
    priority: 'medium',
    status: 'pending',
    automated: false
  }
];

const IntegrationTestChecklist = () => {
  const [tests, setTests] = useState<TestCase[]>(testCases);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(tests.map(t => t.category)))];

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: TestCase['priority']) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
    }
  };

  const updateTestStatus = (testId: string, status: TestCase['status']) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status } : test
    ));
  };

  const runAutomatedTest = async (test: TestCase) => {
    if (!test.automated) return;
    
    updateTestStatus(test.id, 'running');
    
    // Simulate automated test execution
    setTimeout(() => {
      // For demo purposes, randomly pass/fail
      const passed = Math.random() > 0.3;
      updateTestStatus(test.id, passed ? 'passed' : 'failed');
    }, 2000 + Math.random() * 3000);
  };

  const stats = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    pending: tests.filter(t => t.status === 'pending').length,
    running: tests.filter(t => t.status === 'running').length,
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Integration Test Checklist</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{stats.passed}/{stats.total} Passed</Badge>
            <Badge variant="destructive">{stats.failed} Failed</Badge>
            <Badge variant="secondary">{stats.pending} Pending</Badge>
            {stats.running > 0 && <Badge variant="default">{stats.running} Running</Badge>}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
            >
              {category === 'all' ? 'All Tests' : category}
            </Button>
          ))}
        </div>

        {/* Test Cases */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredTests.map(test => (
              <Card key={test.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <h4 className="font-medium">{test.title}</h4>
                      <Badge variant={getPriorityColor(test.priority)}>
                        {test.priority}
                      </Badge>
                      {test.automated && (
                        <Badge variant="outline">Automated</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {test.automated && test.status === 'pending' && (
                        <Button
                          onClick={() => runAutomatedTest(test)}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Run
                        </Button>
                      )}
                      
                      <Checkbox
                        checked={test.status === 'passed'}
                        onCheckedChange={(checked) => 
                          updateTestStatus(test.id, checked ? 'passed' : 'pending')
                        }
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">Test Steps</summary>
                    <ol className="mt-2 ml-4 space-y-1">
                      {test.steps.map((step, index) => (
                        <li key={index} className="list-decimal">
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <strong>Expected Result:</strong> {test.expected}
                    </div>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IntegrationTestChecklist;
