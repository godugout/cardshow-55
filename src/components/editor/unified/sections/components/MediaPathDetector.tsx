
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, Layers, Zap, Sparkles, Eye, Play, Star } from 'lucide-react';

interface MediaPath {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: string[];
  capabilities: string[];
  recommended: boolean;
}

interface MediaPathDetectorProps {
  detectedFormat: string;
  fileSize: number;
  fileName: string;
  onPathSelect: (pathId: string) => void;
  selectedPath?: string;
}

export const MediaPathDetector: React.FC<MediaPathDetectorProps> = ({
  detectedFormat,
  fileSize,
  fileName,
  onPathSelect,
  selectedPath
}) => {
  const getMediaPaths = (): MediaPath[] => {
    const format = detectedFormat.toLowerCase();
    
    if (format.includes('psd')) {
      return [
        {
          id: 'psd-professional',
          name: 'Professional PSD Workflow',
          icon: Layers,
          description: 'Extract layers, create custom templates, and enable advanced editing',
          features: ['Layer extraction', 'Custom regions', 'Team variations', 'Export templates'],
          capabilities: ['Multi-layer editing', 'Region mapping', 'Color theming', 'Batch generation'],
          recommended: true
        },
        {
          id: 'psd-simple',
          name: 'Quick PSD Conversion',
          icon: FileImage,
          description: 'Convert PSD to static image and use standard card workflow',
          features: ['Flatten layers', 'Standard frames', 'Basic editing'],
          capabilities: ['Frame selection', 'Text overlay', 'Basic effects'],
          recommended: false
        }
      ];
    }
    
    if (format.includes('gif') || fileName.toLowerCase().includes('.gif')) {
      return [
        {
          id: 'gif-animated',
          name: 'Animated Card Experience',
          icon: Play,
          description: 'Create interactive animated cards with motion effects',
          features: ['Animation timeline', 'Interactive triggers', 'Motion effects', 'Frame control'],
          capabilities: ['Hover animations', 'Click interactions', 'Loop control', 'Transition effects'],
          recommended: true
        },
        {
          id: 'gif-static',
          name: 'Use First Frame Only',
          icon: FileImage,
          description: 'Extract first frame and create standard card',
          features: ['Frame extraction', 'Standard editing', 'Static output'],
          capabilities: ['Basic card creation', 'Frame selection', 'Text overlay'],
          recommended: false
        }
      ];
    }
    
    // Default PNG/JPG paths
    return [
      {
        id: 'standard-card',
        name: 'Standard Card Creation',
        icon: FileImage,
        description: 'Perfect for photos and artwork with frame integration',
        features: ['Background removal', 'Frame selection', 'Text overlay', 'Basic effects'],
        capabilities: ['Smart cropping', 'Color matching', 'Template application', 'Export options'],
        recommended: true
      },
      {
        id: 'interactive-card',
        name: 'Interactive Card Experience',
        icon: Sparkles,
        description: 'Add engagement features and interactive elements',
        features: ['Hover effects', 'Click interactions', '3D transforms', 'Reveal animations'],
        capabilities: ['Motion effects', 'Touch interactions', 'Progressive reveal', 'Engagement tracking'],
        recommended: false
      },
      {
        id: 'quick-frame',
        name: 'Quick Frame Application',
        icon: Zap,
        description: 'Fast workflow with automatic frame selection',
        features: ['Auto-frame selection', 'Quick processing', 'Instant preview'],
        capabilities: ['Speed optimization', 'Smart defaults', 'One-click creation'],
        recommended: false
      }
    ];
  };

  const mediaPaths = getMediaPaths();

  return (
    <div className="space-y-6">
      {/* Detection Summary */}
      <div className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-crd-green" />
          </div>
          <div>
            <h4 className="text-crd-white font-medium">Smart Detection Results</h4>
            <p className="text-crd-lightGray text-sm">Analyzed your file to recommend the best workflow</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-crd-lightGray">Format:</span>
            <div className="text-crd-white font-medium">{detectedFormat}</div>
          </div>
          <div>
            <span className="text-crd-lightGray">Size:</span>
            <div className="text-crd-white font-medium">{(fileSize / 1024 / 1024).toFixed(1)} MB</div>
          </div>
          <div>
            <span className="text-crd-lightGray">Filename:</span>
            <div className="text-crd-white font-medium truncate">{fileName}</div>
          </div>
        </div>
      </div>

      {/* Path Selection */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-crd-white mb-2">Choose Your Workflow</h4>
          <p className="text-crd-lightGray">Select the best approach for your card creation goals</p>
        </div>

        <div className="grid gap-4">
          {mediaPaths.map((path) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.id;
            
            return (
              <Card
                key={path.id}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected 
                    ? 'ring-2 ring-crd-green bg-crd-green/5 border-crd-green/30' 
                    : 'bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50'
                }`}
                onClick={() => onPathSelect(path.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      path.recommended ? 'bg-crd-green/20' : 'bg-crd-mediumGray/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        path.recommended ? 'text-crd-green' : 'text-crd-lightGray'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-crd-white">{path.name}</h5>
                        {path.recommended && (
                          <Badge variant="outline" className="bg-crd-green/10 text-crd-green border-crd-green/30">
                            <Star className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-crd-lightGray text-sm mb-4">{path.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-crd-white font-medium text-sm mb-2">Key Features</h6>
                          <ul className="space-y-1">
                            {path.features.map((feature, index) => (
                              <li key={index} className="text-xs text-crd-lightGray flex items-center gap-1">
                                <div className="w-1 h-1 bg-crd-green rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="text-crd-white font-medium text-sm mb-2">Capabilities</h6>
                          <ul className="space-y-1">
                            {path.capabilities.map((capability, index) => (
                              <li key={index} className="text-xs text-crd-lightGray flex items-center gap-1">
                                <div className="w-1 h-1 bg-crd-mediumGray rounded-full" />
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
