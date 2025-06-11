
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
  errorStack?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary - getDerivedStateFromError:', error);
    return { 
      hasError: true, 
      error, 
      errorCount: 0,
      errorStack: error?.stack
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', {
      error: error,
      message: error?.message,
      stack: error?.stack,
      errorInfo: errorInfo,
      componentStack: errorInfo?.componentStack
    });
    
    // Handle Supabase subscription errors specifically
    const errorMessage = error?.message || '';
    if (errorMessage.includes('subscribe multiple times')) {
      console.warn('Supabase subscription error detected, attempting recovery...');
      // Force a page reload for subscription errors to reset state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }
    
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    const newCount = this.state.errorCount + 1;
    
    console.log('ErrorBoundary retry attempt:', newCount);
    
    // If we've retried multiple times, suggest a page reload
    if (newCount >= 3) {
      console.log('Too many retries, forcing page reload');
      window.location.reload();
      return;
    }
    
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorCount: newCount,
      errorStack: undefined
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || '';
      const isSubscriptionError = errorMessage.includes('subscribe multiple times');

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              {isSubscriptionError 
                ? 'Connection issue detected. The page will reload automatically...'
                : errorMessage || 'An unexpected error occurred'
              }
            </p>
            {this.state.errorStack && (
              <details className="text-left mb-4">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">Error Details</summary>
                <pre className="text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-auto max-h-32">
                  {this.state.errorStack}
                </pre>
              </details>
            )}
            {!isSubscriptionError && (
              <Button onClick={this.handleRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {this.state.errorCount >= 2 ? 'Reload Page' : 'Try Again'}
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
