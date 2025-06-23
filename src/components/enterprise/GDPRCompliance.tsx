
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Trash2, 
  Shield, 
  FileText, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { useGDPRRequests } from '@/hooks/enterprise/useGDPR';

const GDPRCompliance = () => {
  const { requests, requestDataExport, requestDataDeletion, isProcessing } = useGDPRRequests();
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);

  const handleDataExport = () => {
    requestDataExport();
  };

  const handleDataDeletion = () => {
    if (showDeletionWarning) {
      requestDataDeletion();
      setShowDeletionWarning(false);
    } else {
      setShowDeletionWarning(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Data Privacy & GDPR</h1>
        <p className="text-gray-400">
          Manage your data privacy preferences and exercise your rights under GDPR
        </p>
      </div>

      {/* Data Rights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Data Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Download a complete copy of your personal data, including your profile, 
              cards, collections, and activity history.
            </p>
            <Button 
              onClick={handleDataExport} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Request Data Export'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Data Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              Permanently delete your account and all associated data. 
              This action cannot be undone.
            </p>
            
            {showDeletionWarning && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will permanently delete all your data including cards, collections, 
                  and account information. This action cannot be undone. Click again to confirm.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              variant={showDeletionWarning ? "destructive" : "outline"}
              onClick={handleDataDeletion} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 
               showDeletionWarning ? 'Confirm Deletion' : 'Request Data Deletion'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Your Privacy Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Right to Access</h4>
              <p className="text-gray-400 text-sm">
                You have the right to request access to your personal data and 
                receive a copy of the personal data we process about you.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Right to Rectification</h4>
              <p className="text-gray-400 text-sm">
                You can update and correct your personal information through 
                your account settings at any time.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Right to Erasure</h4>
              <p className="text-gray-400 text-sm">
                You have the right to request deletion of your personal data 
                under certain circumstances.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Data Portability</h4>
              <p className="text-gray-400 text-sm">
                You can export your data in a structured, commonly used format 
                to transfer to another service.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Request History</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No privacy requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <div className="font-medium text-white capitalize">
                        {request.request_type} Request
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'processing' ? 'secondary' :
                        request.status === 'failed' ? 'destructive' : 'outline'
                      }
                    >
                      {request.status}
                    </Badge>
                    
                    {request.status === 'completed' && request.data_package_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(request.data_package_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Data Protection Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-400">
              For any questions about your privacy rights or data processing, 
              please contact our Data Protection Officer:
            </p>
            <div className="text-white">
              <p>Email: privacy@cardshow.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRCompliance;
