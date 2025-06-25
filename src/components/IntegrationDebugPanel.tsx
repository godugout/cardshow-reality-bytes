
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Database, 
  Shield, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { useIntegrationHealthCheck } from '@/hooks/useIntegrationHealthCheck';
import { auditor } from '@/utils/integrationAudit';

const IntegrationDebugPanel = () => {
  const { health, isChecking, runHealthChecks, generateReport } = useIntegrationHealthCheck();
  const [showReport, setShowReport] = useState(false);

  const getStatusIcon = (status: 'healthy' | 'degraded' | 'down' | null) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'degraded' | 'down' | null) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Integration Debug Panel
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={health.overall === 'healthy' ? 'default' : 'destructive'}>
              {health.overall.toUpperCase()}
            </Badge>
            <Button
              onClick={runHealthChecks}
              disabled={isChecking}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Check Health
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="issues">Known Issues</TabsTrigger>
            <TabsTrigger value="report">Full Report</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Health */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span className="text-sm font-medium">Database</span>
                    </div>
                    {getStatusIcon(health.database?.status || null)}
                  </div>
                  <div className="mt-2">
                    <div className={`h-2 rounded-full ${getStatusColor(health.database?.status || null)}`} />
                    {health.database?.latency && (
                      <p className="text-xs text-gray-500 mt-1">
                        {health.database.latency}ms
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Auth Health */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Auth</span>
                    </div>
                    {getStatusIcon(health.auth?.status || null)}
                  </div>
                  <div className="mt-2">
                    <div className={`h-2 rounded-full ${getStatusColor(health.auth?.status || null)}`} />
                    {health.auth?.latency && (
                      <p className="text-xs text-gray-500 mt-1">
                        {health.auth.latency}ms
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Realtime Health */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm font-medium">Realtime</span>
                    </div>
                    {getStatusIcon(health.realtime?.status || null)}
                  </div>
                  <div className="mt-2">
                    <div className={`h-2 rounded-full ${getStatusColor(health.realtime?.status || null)}`} />
                    {health.realtime?.latency && (
                      <p className="text-xs text-gray-500 mt-1">
                        {health.realtime.latency}ms
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Overall Health */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium">Overall</span>
                    </div>
                    {getStatusIcon(health.overall)}
                  </div>
                  <div className="mt-2">
                    <div className={`h-2 rounded-full ${getStatusColor(health.overall)}`} />
                    <p className="text-xs text-gray-500 mt-1">
                      System Status
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {auditor.getCriticalIssues().map((issue, index) => (
                  <Card key={index} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="destructive" className="mb-2">
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <h4 className="font-medium">{issue.system}</h4>
                          <p className="text-sm text-gray-600 mt-1">{issue.issue}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Location: {issue.location}
                          </p>
                        </div>
                        <Badge variant={issue.tested ? 'default' : 'secondary'}>
                          {issue.tested ? 'Tested' : 'Untested'}
                        </Badge>
                      </div>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <strong>Solution:</strong> {issue.solution}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Integration Audit Report</h3>
              <Button onClick={downloadReport} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
            <ScrollArea className="h-96">
              <pre className="text-xs bg-gray-50 p-4 rounded whitespace-pre-wrap">
                {generateReport()}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationDebugPanel;
