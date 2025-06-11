
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
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Handle Supabase subscription errors specifically
    if (error.message.includes('subscribe multiple times')) {
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
    
    // If we've retried multiple times, suggest a page reload
    if (newCount >= 3) {
      window.location.reload();
      return;
    }
    
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorCount: newCount
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isSubscriptionError = this.state.error?.message.includes('subscribe multiple times');

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              {isSubscriptionError 
                ? 'Connection issue detected. The page will reload automatically...'
                : this.state.error?.message || 'An unexpected error occurred'
              }
            </p>
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
