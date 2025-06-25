
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { securityAuditor, SecurityAuditReport, SecurityIssue } from '@/utils/securityAudit';

const SecurityAuditDashboard = () => {
  const [auditReport, setAuditReport] = useState<SecurityAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const runSecurityAudit = useCallback(async () => {
    setIsAuditing(true);
    try {
      const report = await securityAuditor.generateAuditReport();
      setAuditReport(report);
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'non_compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'non_compliant': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const exportReport = () => {
    if (!auditReport) return;
    
    const reportData = JSON.stringify(auditReport, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-audit-${auditReport.audit_date.toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues = selectedCategory 
    ? auditReport?.issues.filter(issue => issue.category === selectedCategory) || []
    : auditReport?.issues || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#00C851]" />
            <div>
              <h1 className="text-3xl font-bold text-white">Security Audit Dashboard</h1>
              <p className="text-gray-400">Comprehensive security assessment for Cardshow/CRD</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={runSecurityAudit} 
              disabled={isAuditing}
              className="bg-[#00C851] hover:bg-[#00a844]"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Security Audit
                </>
              )}
            </Button>
            
            {auditReport && (
              <Button onClick={exportReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </div>

        {/* Audit Results */}
        {auditReport && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Critical Issues</p>
                      <p className="text-2xl font-bold text-red-400">{auditReport.summary.critical}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">High Priority</p>
                      <p className="text-2xl font-bold text-orange-400">{auditReport.summary.high}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Medium Priority</p>
                      <p className="text-2xl font-bold text-yellow-400">{auditReport.summary.medium}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Issues</p>
                      <p className="text-2xl font-bold text-white">{auditReport.summary.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Status */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(auditReport.compliance_status.gdpr)}
                      <span className="font-medium text-white">GDPR</span>
                    </div>
                    <Badge className={getComplianceColor(auditReport.compliance_status.gdpr)}>
                      {auditReport.compliance_status.gdpr.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(auditReport.compliance_status.pci_dss)}
                      <span className="font-medium text-white">PCI DSS</span>
                    </div>
                    <Badge className={getComplianceColor(auditReport.compliance_status.pci_dss)}>
                      {auditReport.compliance_status.pci_dss.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(auditReport.compliance_status.iso27001)}
                      <span className="font-medium text-white">ISO 27001</span>
                    </div>
                    <Badge className={getComplianceColor(auditReport.compliance_status.iso27001)}>
                      {auditReport.compliance_status.iso27001.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            {auditReport.summary.critical > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Critical Security Issues Detected</AlertTitle>
                <AlertDescription className="text-red-700">
                  {auditReport.summary.critical} critical security issues require immediate attention. 
                  These vulnerabilities pose significant risk to user data and platform security.
                </AlertDescription>
              </Alert>
            )}

            {/* Security Issues */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Security Issues</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All ({auditReport.issues.length})
                  </Button>
                  {['authentication', 'data_protection', 'input_validation', 'payment_security', 'infrastructure'].map(category => {
                    const count = auditReport.issues.filter(i => i.category === category).length;
                    return (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.replace('_', ' ')} ({count})
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <div key={issue.id} className="border border-gray-700 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-gray-300">
                              {issue.id}
                            </Badge>
                            <Badge variant="outline" className="text-gray-300">
                              {issue.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-white mb-1">{issue.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{issue.description}</p>
                          <div className="text-sm space-y-1">
                            <p><span className="text-red-400">Impact:</span> {issue.impact}</p>
                            <p><span className="text-green-400">Recommendation:</span> {issue.recommendation}</p>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {issue.compliance.map(comp => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-[#00C851] mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Initial State */}
        {!auditReport && !isAuditing && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Security Audit Not Run</h3>
              <p className="text-gray-400 mb-6">
                Run a comprehensive security audit to identify vulnerabilities and compliance issues.
              </p>
              <Button onClick={runSecurityAudit} className="bg-[#00C851] hover:bg-[#00a844]">
                <Shield className="w-4 h-4 mr-2" />
                Start Security Audit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SecurityAuditDashboard;
