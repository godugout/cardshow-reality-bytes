
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, CheckSquare, AlertTriangle } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import SecurityAuditDashboard from '@/components/admin/SecurityAuditDashboard';
import SecurityChecklist from '@/components/security/SecurityChecklist';

const SecurityDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-display-lg text-foreground">Security Center</h1>
              <p className="text-body-lg text-muted-foreground">
                Comprehensive security management for Cardshow/CRD platform
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="audit" 
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Security Audit
            </TabsTrigger>
            <TabsTrigger 
              value="checklist"
              className="flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              Compliance Checklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-6">
            <SecurityAuditDashboard />
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <SecurityChecklist />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityDashboard;
