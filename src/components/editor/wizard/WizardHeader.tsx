
import React from 'react';
import { Sparkles, Zap, Settings, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WizardMode } from './UnifiedCardWizard';

interface WizardHeaderProps {
  mode?: WizardMode;
  aiAnalysisComplete: boolean;
}

export const WizardHeader = ({ mode, aiAnalysisComplete }: WizardHeaderProps) => {
  const getModeConfig = () => {
    switch (mode) {
      case 'quick':
        return {
          icon: <Zap className="w-5 h-5" />,
          label: 'Quick Create',
          color: 'bg-crd-green text-black',
          description: 'AI-powered card creation with smart automation'
        };
      case 'advanced':
        return {
          icon: <Settings className="w-5 h-5" />,
          label: 'Advanced Create',
          color: 'bg-crd-blue text-white',
          description: 'Full control with professional tools and customization'
        };
      case 'bulk':
        return {
          icon: <Users className="w-5 h-5" />,
          label: 'Bulk Create',
          color: 'bg-crd-orange text-black',
          description: 'Batch processing for multiple cards at once'
        };
      default:
        return {
          icon: <Sparkles className="w-5 h-5" />,
          label: 'Card Creator',
          color: 'bg-crd-mediumGray text-white',
          description: 'Create your unique trading card'
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Badge className={`${modeConfig.color} px-3 py-1 text-sm font-semibold`}>
          {modeConfig.icon}
          <span className="ml-2">{modeConfig.label}</span>
        </Badge>
        
        {aiAnalysisComplete && (
          <Badge className="bg-crd-green/20 text-crd-green border border-crd-green/30 px-3 py-1">
            <Sparkles className="w-4 h-4 mr-1" />
            AI Enhanced
          </Badge>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-2">
        Create Your Card
      </h1>
      <p className="text-crd-lightGray max-w-2xl mx-auto">
        {modeConfig.description}
      </p>
    </div>
  );
};
