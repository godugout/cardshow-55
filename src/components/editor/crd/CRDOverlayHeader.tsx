import React from 'react';
import { ArrowLeft, Save, Share, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDOverlayHeaderProps {
  onSave?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
}

export const CRDOverlayHeader: React.FC<CRDOverlayHeaderProps> = ({
  onSave,
  onShare,
  onExport,
  isSaving = false
}) => {
  const navigate = useNavigate();
  const { isVisible, isScrolled } = useScrollHeader({ threshold: 20, hideOffset: 80 });

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 h-16
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled 
          ? 'bg-crd-darkest/95 backdrop-blur-lg border-b border-crd-mediumGray/20 shadow-lg' 
          : 'bg-crd-darkest/80 backdrop-blur-sm'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Back button and title */}
          <div className="flex items-center space-x-4">
            <CRDButton
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-crd-lightGray hover:text-crd-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </CRDButton>
            <div className="w-px h-6 bg-crd-mediumGray/30" />
            <h1 className="text-lg font-semibold text-crd-white">
              CRDMKR
            </h1>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-2">
            {onSave && (
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="text-crd-lightGray hover:text-crd-white transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </CRDButton>
            )}
            
            {onShare && (
              <CRDButton
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-crd-lightGray hover:text-crd-white transition-colors"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </CRDButton>
            )}
            
            {onExport && (
              <CRDButton
                variant="primary"
                size="sm"
                onClick={onExport}
                className="bg-crd-blue hover:bg-crd-blue/90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </CRDButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};