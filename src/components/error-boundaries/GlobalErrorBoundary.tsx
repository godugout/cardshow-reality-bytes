
import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log comprehensive error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Global Error Boundary caught error:', errorDetails);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error reporting service integration
      // e.g., Sentry, LogRocket, etc.
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: Math.random().toString(36).substr(2, 9)
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report - Error ID: ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message: ${this.state.error?.message || 'Unknown error'}

Steps to reproduce:
1. 
2. 
3. 

Additional context:

    `);
    window.open(`mailto:support@cardshow.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Application Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Something went wrong with the application. We're sorry for the inconvenience.
              </p>
              
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Error ID: {this.state.errorId}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                    Error Details (Development Mode)
                  </summary>
                  <div className="space-y-2">
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                      <strong>Message:</strong> {this.state.error.message}
                    </pre>
                    {this.state.error.stack && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                        <strong>Stack:</strong> {this.state.error.stack}
                      </pre>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                        <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleRetry} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="default" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
                <Button onClick={this.handleReportBug} variant="ghost" size="sm">
                  <Bug className="w-4 h-4 mr-2" />
                  Report Bug
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
