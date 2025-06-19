
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Move, Sparkles } from 'lucide-react';

interface CardBackDesignerProps {
  selectedTemplate: any;
  onBackDesignUpdate: (backDesign: any) => void;
  className?: string;
}

// Logo variations from the uploaded images
const LOGO_VARIATIONS = [
  {
    id: 'crd-gradient-center',
    name: 'CRD Gradient Center',
    url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
    placement: 'center',
    description: 'Rainbow gradient logo centered'
  },
  {
    id: 'crd-minimal-top',
    name: 'CRD Minimal Top',
    url: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    placement: 'top-left',
    description: 'Clean minimal logo top left'
  },
  {
    id: 'crd-chrome-bottom',
    name: 'CRD Chrome Bottom',
    url: '/lovable-uploads/2406a214-0403-4ff0-af81-3aae1a790c62.png',
    placement: 'bottom-right',
    description: 'Chrome finish bottom right'
  },
  {
    id: 'crd-holographic-center',
    name: 'CRD Holographic',
    url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    placement: 'center',
    description: 'Holographic effect centered'
  },
  {
    id: 'crd-neon-corner',
    name: 'CRD Neon Corner',
    url: '/lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png',
    placement: 'top-right',
    description: 'Neon style corner placement'
  }
];

const BACKGROUND_PATTERNS = [
  {
    id: 'solid',
    name: 'Solid Color',
    preview: 'bg-crd-darkGray'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    preview: 'bg-gradient-to-br from-crd-darkGray to-crd-mediumGray'
  },
  {
    id: 'texture',
    name: 'Textured',
    preview: 'bg-crd-darkGray bg-opacity-90'
  },
  {
    id: 'minimal',
    name: 'Minimal Lines',
    preview: 'bg-crd-darkGray'
  }
];

export const CardBackDesigner = ({
  selectedTemplate,
  onBackDesignUpdate,
  className = ""
}: CardBackDesignerProps) => {
  const [selectedLogo, setSelectedLogo] = useState(LOGO_VARIATIONS[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_PATTERNS[0]);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(40);

  const handleLogoSelect = (logo: typeof LOGO_VARIATIONS[0]) => {
    setSelectedLogo(logo);
    
    // Set default position based on logo's suggested placement
    switch (logo.placement) {
      case 'center':
        setLogoPosition({ x: 50, y: 50 });
        break;
      case 'top-left':
        setLogoPosition({ x: 20, y: 20 });
        break;
      case 'top-right':
        setLogoPosition({ x: 80, y: 20 });
        break;
      case 'bottom-right':
        setLogoPosition({ x: 80, y: 80 });
        break;
      default:
        setLogoPosition({ x: 50, y: 50 });
    }
    
    updateBackDesign();
  };

  const updateBackDesign = () => {
    const backDesign = {
      logo: selectedLogo,
      background: selectedBackground,
      logoPosition,
      logoSize,
      template: selectedTemplate?.id
    };
    
    onBackDesignUpdate(backDesign);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-white font-medium mb-2">Design Card Back</h3>
        <p className="text-crd-lightGray text-sm">
          Choose logo placement and background style
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h4 className="text-white font-medium">Card Back Preview</h4>
            </div>
            
            <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden mx-auto max-w-48">
              {/* Background */}
              <div className={`w-full h-full ${selectedBackground.preview}`}>
                {selectedBackground.id === 'minimal' && (
                  <div className="w-full h-full border border-crd-mediumGray/30 relative">
                    {/* Minimal line pattern */}
                    <div className="absolute inset-4 border border-crd-mediumGray/20" />
                    <div className="absolute inset-8 border border-crd-mediumGray/10" />
                  </div>
                )}
                
                {selectedBackground.id === 'texture' && (
                  <div className="w-full h-full bg-gradient-to-br from-transparent via-crd-mediumGray/10 to-transparent" />
                )}
              </div>
              
              {/* Logo */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${logoPosition.x}%`,
                  top: `${logoPosition.y}%`,
                  width: `${logoSize}%`,
                  aspectRatio: '1'
                }}
              >
                <img
                  src={selectedLogo.url}
                  alt={selectedLogo.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="space-y-6">
          {/* Logo Selection */}
          <Card className="bg-crd-darkGray border-crd-mediumGray/30">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Choose Logo</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {LOGO_VARIATIONS.map((logo) => (
                  <button
                    key={logo.id}
                    onClick={() => handleLogoSelect(logo)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedLogo.id === logo.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/50 bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40'
                    }`}
                  >
                    <div className="w-full aspect-square mb-2 bg-crd-mediumGray/30 rounded flex items-center justify-center">
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <p className="text-xs text-white text-center font-medium">
                      {logo.name}
                    </p>
                    <Badge className="mt-1 text-xs bg-crd-blue/20 text-crd-blue">
                      {logo.placement}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Background Selection */}
          <Card className="bg-crd-darkGray border-crd-mediumGray/30">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Background Style</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUND_PATTERNS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setSelectedBackground(bg);
                      updateBackDesign();
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedBackground.id === bg.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/50 bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40'
                    }`}
                  >
                    <div className={`w-full aspect-square mb-2 rounded ${bg.preview}`} />
                    <p className="text-xs text-white text-center">
                      {bg.name}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Positioning */}
          <Card className="bg-crd-darkGray border-crd-mediumGray/30">
            <CardContent className="p-4">
              <h4 className="text-white font-medium mb-3">Logo Position</h4>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Top Left', x: 25, y: 25 },
                  { name: 'Top Center', x: 50, y: 25 },
                  { name: 'Top Right', x: 75, y: 25 },
                  { name: 'Center Left', x: 25, y: 50 },
                  { name: 'Center', x: 50, y: 50 },
                  { name: 'Center Right', x: 75, y: 50 },
                  { name: 'Bottom Left', x: 25, y: 75 },
                  { name: 'Bottom Center', x: 50, y: 75 },
                  { name: 'Bottom Right', x: 75, y: 75 }
                ].map((pos) => (
                  <Button
                    key={pos.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogoPosition({ x: pos.x, y: pos.y });
                      updateBackDesign();
                    }}
                    className={`text-xs ${
                      logoPosition.x === pos.x && logoPosition.y === pos.y
                        ? 'bg-crd-green/20 border-crd-green text-crd-green'
                        : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40'
                    }`}
                  >
                    {pos.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
