import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface MobileErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface MobileErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

export class MobileErrorBoundary extends React.Component<
  MobileErrorBoundaryProps,
  MobileErrorBoundaryState
> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MobileErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <MobileFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const MobileFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({
  error,
  resetError
}) => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className={`flex flex-col items-center justify-center ${
      isMobile ? 'p-4 min-h-screen' : 'p-8'
    } text-center`}>
      <AlertTriangle className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-red-500 mb-4`} />
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-crd-white mb-2`}>
        Something went wrong
      </h2>
      <p className={`text-crd-lightGray mb-4 ${isMobile ? 'text-sm px-2' : ''}`}>
        {error?.message || 'An unexpected error occurred'}
      </p>
      <Button 
        onClick={resetError} 
        className={`bg-crd-green hover:bg-crd-green/90 ${isMobile ? 'text-sm px-4 py-2' : ''}`}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};