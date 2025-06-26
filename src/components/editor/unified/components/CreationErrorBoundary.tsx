
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CreationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface CreationErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export class CreationErrorBoundary extends React.Component<
  CreationErrorBoundaryProps,
  CreationErrorBoundaryState
> {
  constructor(props: CreationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CreationErrorBoundaryState {
    console.error('🚨 CreationErrorBoundary: Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('💥 CreationErrorBoundary: Component error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState(prev => ({
      ...prev,
      errorInfo
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-crd-white mb-2">
              Card Creation Error
            </h2>
            
            <p className="text-crd-lightGray mb-6">
              We encountered an error while loading the card creator. This might be due to missing components or configuration issues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <CRDButton
                onClick={() => {
                  console.log('🔄 CreationErrorBoundary: Resetting error boundary');
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  this.props.onReset?.();
                }}
                variant="primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </CRDButton>
              
              <CRDButton
                onClick={() => {
                  console.log('🏠 CreationErrorBoundary: Going home');
                  window.location.href = '/';
                }}
                variant="outline"
                className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                Go Home
              </CRDButton>
            </div>
            
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-crd-lightGray cursor-pointer hover:text-crd-white mb-2">
                  Technical Details (Click to expand)
                </summary>
                <div className="text-xs text-red-300 bg-red-900/20 p-3 rounded border border-red-500/30 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
