
import React from 'react';
import { Sparkles, Zap, Settings } from 'lucide-react';
import type { WizardMode } from '../UnifiedCardWizard';

interface WizardModeHeaderProps {
  mode: WizardMode;
  isAnalyzing: boolean;
}

export const WizardModeHeader = ({ mode, isAnalyzing }: WizardModeHeaderProps) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-4 h-4 text-crd-green" />;
      case 'advanced': return <Settings className="w-4 h-4 text-crd-blue" />;
      default: return null;
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {getModeIcon()}
        <h2 className="text-2xl font-bold text-white">Create Your Card</h2>
      </div>
      <p className="text-crd-lightGray">
        {mode === 'quick' 
          ? 'Upload your photo and see it transformed into a professional card instantly'
          : 'Upload your photo and choose from our complete frame collection'
        }
      </p>

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <div className="mt-4 p-4 rounded-lg bg-crd-green/20 border border-crd-green/40">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-crd-green" />
            <span className="text-white font-medium">
              AI is analyzing your image and suggesting the perfect setup...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
