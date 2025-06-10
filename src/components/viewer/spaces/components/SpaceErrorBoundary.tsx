
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Environment } from '@react-three/drei';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  spaceName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SpaceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('SpaceErrorBoundary: Caught error in 3D space:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`SpaceErrorBoundary: Error in space "${this.props.spaceName}":`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      console.log(`SpaceErrorBoundary: Rendering fallback for space "${this.props.spaceName}"`);
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback environment
      return (
        <>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
        </>
      );
    }

    return this.props.children;
  }
}
