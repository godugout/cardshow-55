
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Upload, 
  Users, 
  Zap, 
  Settings, 
  ArrowRight 
} from 'lucide-react';

type CreationMode = 'quick' | 'advanced' | 'bulk';

interface CreationModeSelectorProps {
  onModeSelect: (mode: CreationMode) => void;
}

export const CreationModeSelector = ({ onModeSelect }: CreationModeSelectorProps) => {
  const modes = [
    {
      id: 'quick' as const,
      title: 'Quick Create',
      description: 'AI-powered card creation with smart templates and automatic analysis',
      icon: Zap,
      features: [
        'AI photo analysis',
        'Smart template matching',
        'Automatic card details',
        'One-click creation'
      ],
      color: 'crd-green',
      recommended: true
    },
    {
      id: 'advanced' as const,
      title: 'Advanced Create',
      description: 'Full control with advanced cropping, custom templates, and detailed editing',
      icon: Settings,
      features: [
        'Advanced photo cropping',
        'Custom template design',
        'Detailed manual editing',
        'Professional effects'
      ],
      color: 'crd-blue'
    },
    {
      id: 'bulk' as const,
      title: 'Bulk Upload',
      description: 'Upload multiple images and create many cards at once with smart detection',
      icon: Users,
      features: [
        'Multi-image upload',
        'Smart card detection',
        'Batch processing',
        'Collection creation'
      ],
      color: 'crd-orange'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className={`relative bg-crd-darkGray border-crd-mediumGray/30 hover:border-${mode.color}/50 transition-all duration-300 cursor-pointer group`}
            onClick={() => onModeSelect(mode.id)}
          >
            {mode.recommended && (
              <div className="absolute -top-3 left-4 right-4">
                <div className="bg-crd-green text-black px-3 py-1 rounded-full text-xs font-semibold text-center">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Recommended
                </div>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-12 h-12 bg-${mode.color}/20 rounded-lg flex items-center justify-center`}>
                  <mode.icon className={`w-6 h-6 text-${mode.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{mode.title}</h3>
                  <p className="text-crd-lightGray text-sm">{mode.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-crd-lightGray text-sm">
                    <div className={`w-1.5 h-1.5 bg-${mode.color} rounded-full mr-3`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full bg-${mode.color} hover:bg-${mode.color}/90 text-black font-semibold group-hover:bg-${mode.color}/90 transition-colors`}
              >
                Choose {mode.title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-crd-lightGray text-sm">
          Not sure which to choose? Start with <strong className="text-crd-green">Quick Create</strong> - 
          you can always switch to advanced editing later.
        </p>
      </div>
    </div>
  );
};
