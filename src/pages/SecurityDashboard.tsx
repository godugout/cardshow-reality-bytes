
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, CheckSquare, AlertTriangle } from 'lucide-react';
import SecurityAuditDashboard from '@/components/admin/SecurityAuditDashboard';
import SecurityChecklist from '@/components/security/SecurityChecklist';

const SecurityDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-[#00C851]" />
            <div>
              <h1 className="text-4xl font-bold text-white">Security Center</h1>
              <p className="text-gray-400 text-lg">
                Comprehensive security management for Cardshow/CRD platform
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-800">
            <TabsTrigger 
              value="audit" 
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4" />
              Security Audit
            </TabsTrigger>
            <TabsTrigger 
              value="checklist"
              className="flex items-center gap-2 data-[state=active]:bg-[#00C851] data-[state=active]:text-white"
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
