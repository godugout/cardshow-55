import React, { useEffect, useRef } from 'react';
import { CRDCardCreatorWrapper } from './CRDCardCreatorWrapper';
import { useCRDEditor } from '@/contexts/CRDEditorContext';
import { useCRDAssetPreloader } from '@/hooks/useCRDAssetPreloader';
import type { CardData } from '@/hooks/useCardEditor';

interface PreloadedCRDEditorProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
  isVisible?: boolean;
}

export const PreloadedCRDEditor: React.FC<PreloadedCRDEditorProps> = ({
  onComplete,
  onCancel,
  isVisible = false
}) => {
  const { setPreloaded, setEditorInstance } = useCRDEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const { isComplete: assetsLoaded, progress } = useCRDAssetPreloader();

  useEffect(() => {
    // Mark as preloaded when both component mounts and assets are loaded
    if (assetsLoaded) {
      const timer = setTimeout(() => {
        setPreloaded(true);
        setEditorInstance(editorRef);
        console.log('✅ CRD Editor pre-loaded successfully with all assets');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [setPreloaded, setEditorInstance, assetsLoaded]);

  // Log preloading progress
  useEffect(() => {
    console.log(`🔄 CRD Asset preloading: ${progress}%`);
  }, [progress]);

  return (
    <div 
      ref={editorRef}
      className={`${
        isVisible 
          ? 'fixed inset-0 z-50 bg-crd-darkest' 
          : 'fixed -top-[200vh] -left-[200vw] w-screen h-screen pointer-events-none opacity-0'
      }`}
      style={{
        // Ensure the hidden editor doesn't interfere with layout
        ...(isVisible ? {} : {
          position: 'fixed',
          top: '-200vh',
          left: '-200vw',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          opacity: 0,
          overflow: 'hidden'
        })
      }}
    >
      <CRDCardCreatorWrapper 
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </div>
  );
};