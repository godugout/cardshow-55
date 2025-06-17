
import React from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { TemplateSelectionStep } from '@/components/editor/wizard/TemplateSelectionStep';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EnhancedTemplateStepProps {
  mode: 'quick' | 'advanced';
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  aiAnalysisComplete: boolean;
}

export const EnhancedTemplateStep = ({
  mode,
  templates,
  selectedTemplate,
  onTemplateSelect,
  aiAnalysisComplete
}: EnhancedTemplateStepProps) => {
  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'quick' ? 'AI-Suggested Templates' : 'Choose Your Template'}
        </h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Our AI has analyzed your photo and suggests these templates'
            : 'Select from our full collection of professional card templates'
          }
        </p>
      </div>

      {/* AI Suggestions Banner */}
      {aiAnalysisComplete && mode === 'quick' && (
        <div className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 rounded-lg p-4 border border-crd-green/30">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <span className="text-white font-medium">AI Recommendations</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Based on your photo analysis, these templates will work best for your card
          </p>
        </div>
      )}

      {/* Template Selection */}
      <TemplateSelectionStep
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />

      {/* Mode-specific hints */}
      {mode === 'advanced' && (
        <div className="text-center p-4 bg-crd-blue/10 rounded-lg border border-crd-blue/20">
          <div className="flex items-center justify-center gap-2 text-crd-blue mb-2">
            <Crown className="w-4 h-4" />
            <span className="font-medium">Advanced Mode</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            You'll have full control over template customization in the next step
          </p>
        </div>
      )}
    </div>
  );
};
