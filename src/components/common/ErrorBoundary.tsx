
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Report to error tracking service if available
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.toString(),
          fatal: true
        });
      }
    } catch (e) {
      console.warn('Failed to report error to analytics:', e);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-8">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              
              <p className="text-crd-lightGray mb-6">
                We encountered an unexpected error. This has been reported to our team.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-[#00C851] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00a844] transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="w-full bg-crd-mediumGray text-white font-medium py-3 px-4 rounded-lg hover:bg-crd-lightGray transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-crd-lightGray cursor-pointer hover:text-white">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-crd-darkest rounded border border-red-500/20 text-xs font-mono text-red-400 overflow-auto max-h-48">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
