
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Layers, 
  Lightbulb, 
  Globe, 
  Sliders, 
  Eye,
  Maximize2,
  RotateCw,
  Sparkles,
  Chrome,
  Gem,
  Zap
} from 'lucide-react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { MaterialsTab } from '../components/MaterialsTab';
import { FoilsTab } from '../components/FoilsTab';
import { HologramsTab } from '../components/HologramsTab';
import { LightingTab } from '../components/LightingTab';
import { EnvironmentTab } from '../components/EnvironmentTab';
import { FineTuneTab } from '../components/FineTuneTab';
import { Canvas2DPreview } from '../components/Canvas2DPreview';
import type { DesignTemplate, CardData } from '@/hooks/useCardEditor';

interface AdvancedEffectsStudioProps {
  selectedTemplate: DesignTemplate | null;
  selectedPhoto: string;
  cardData?: Partial<CardData>;
  onEffectsUpdate: (effects: AdvancedCardEffects) => void;
  initialEffects?: AdvancedCardEffects;
}

interface AdvancedCardEffects {
  // Material Properties
  material: {
    type: 'matte' | 'glossy' | 'satin' | 'metallic' | 'chrome' | 'glass';
    roughness: number;
    metalness: number;
    clearcoat: number;
    reflectivity: number;
    opacity: number;
  };
  
  // Surface Effects
  surface: {
    holographic: { enabled: boolean; intensity: number; pattern: string };
    foil: { enabled: boolean; type: string; intensity: number };
    prism: { enabled: boolean; dispersion: number; refraction: number };
    interference: { enabled: boolean; frequency: number; amplitude: number };
  };
  
  // Lighting
  lighting: {
    environment: string;
    preset: string;
    ambient: number;
    directional: number;
    colorTemp: number;
    interactive: boolean;
  };
  
  // Advanced
  physics: {
    float: number;
    autoRotate: boolean;
    gravity: number;
  };
  
  // Color Adjustments
  color: {
    saturation: number;
    contrast: number;
    brightness: number;
    hue: number;
  };
}

export const AdvancedEffectsStudio = ({
  selectedTemplate,
  selectedPhoto,
  cardData,
  onEffectsUpdate,
  initialEffects
}: AdvancedEffectsStudioProps) => {
  const [effects, setEffects] = useState<AdvancedCardEffects>(
    initialEffects || {
      material: {
        type: 'glossy',
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5,
        reflectivity: 0.8,
        opacity: 1.0
      },
      surface: {
        holographic: { enabled: false, intensity: 0, pattern: 'rainbow' },
        foil: { enabled: false, type: 'silver', intensity: 0 },
        prism: { enabled: false, dispersion: 0, refraction: 0 },
        interference: { enabled: false, frequency: 8, amplitude: 30 }
      },
      lighting: {
        environment: 'studio',
        preset: 'natural',
        ambient: 50,
        directional: 70,
        colorTemp: 5500,
        interactive: true
      },
      physics: {
        float: 0,
        autoRotate: false,
        gravity: 0
      },
      color: {
        saturation: 0,
        contrast: 0,
        brightness: 0,
        hue: 0
      }
    }
  );

  const [activeTab, setActiveTab] = useState('materials');
  const [viewMode, setViewMode] = useState<'split' | '2d' | '3d'>('split');
  const [fullscreen3D, setFullscreen3D] = useState(false);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);

  const updateEffects = (updates: Partial<AdvancedCardEffects>) => {
    const newEffects = { ...effects, ...updates };
    setEffects(newEffects);
    onEffectsUpdate(newEffects);
  };

  const getActiveEffectsCount = () => {
    let count = 0;
    if (effects.surface.holographic.enabled) count++;
    if (effects.surface.foil.enabled) count++;
    if (effects.surface.prism.enabled) count++;
    if (effects.surface.interference.enabled) count++;
    return count;
  };

  // Convert to temporary card data for 3D viewer
  const tempCardData: CardData = {
    id: 'temp-preview',
    title: 'Preview Card',
    image_url: selectedPhoto,
    template_id: selectedTemplate?.id || '',
    design_metadata: selectedTemplate?.template_data || {},
    rarity: 'common', // Set required rarity property
    tags: [],
    visibility: 'private',
    creator_attribution: {
      creator_name: 'Preview',
      creator_id: 'preview'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    },
    ...cardData
  };

  if (!selectedPhoto || !selectedTemplate) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray">Please complete previous steps first</p>
      </div>
    );
  }

  if (fullscreen3D) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setFullscreen3D(false)}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white hover:bg-white/10"
          >
            Exit Fullscreen
          </Button>
        </div>
        <ImmersiveCardViewer
          card={tempCardData}
          isOpen={true}
          onClose={() => setFullscreen3D(false)}
          allowRotation={true}
          showStats={false}
          ambient={true}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-[800px]">
      {/* Left Panel - Controls */}
      <div className="col-span-1 bg-crd-darkGray rounded-lg border border-crd-mediumGray/30">
        <div className="p-4 border-b border-crd-mediumGray/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-crd-green" />
              Effects Studio
            </h3>
            <Badge variant="outline" className="border-crd-green text-crd-green">
              {getActiveEffectsCount()} Active
            </Badge>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex gap-1 bg-crd-mediumGray/20 rounded-lg p-1">
            {[
              { id: 'split', label: '2D+3D', icon: Layers },
              { id: '2d', label: '2D', icon: Eye },
              { id: '3d', label: '3D', icon: Gem }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-crd-green text-black'
                    : 'text-crd-lightGray hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-crd-mediumGray/20 m-4 mb-0">
            <TabsTrigger value="materials" className="text-xs">
              <Chrome className="w-3 h-3 mr-1" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="lighting" className="text-xs">
              <Lightbulb className="w-3 h-3 mr-1" />
              Lighting
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto h-[calc(100%-120px)] p-4">
            <TabsContent value="materials" className="space-y-4 mt-0">
              <MaterialsTab
                material={effects.material}
                onUpdate={(material) => updateEffects({ material })}
              />
            </TabsContent>

            <TabsContent value="effects" className="space-y-4 mt-0">
              <div className="space-y-4">
                <FoilsTab
                  surface={effects.surface}
                  onUpdate={(surface) => updateEffects({ surface })}
                />
                <HologramsTab
                  surface={effects.surface}
                  onUpdate={(surface) => updateEffects({ surface })}
                />
              </div>
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4 mt-0">
              <div className="space-y-4">
                <LightingTab
                  lighting={effects.lighting}
                  onUpdate={(lighting) => updateEffects({ lighting })}
                />
                <EnvironmentTab
                  lighting={effects.lighting}
                  physics={effects.physics}
                  onLightingUpdate={(lightingUpdates) => 
                    updateEffects({ lighting: { ...effects.lighting, ...lightingUpdates } })
                  }
                  onPhysicsUpdate={(physicsUpdates) => 
                    updateEffects({ physics: { ...effects.physics, ...physicsUpdates } })
                  }
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Right Panel - Preview */}
      <div className="col-span-2 space-y-4">
        {/* Preview Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Live Preview</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setFullscreen3D(true)}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Full 3D
            </Button>
          </div>
        </div>

        {/* Dual Viewport */}
        <div className={`grid gap-4 h-[720px] ${
          viewMode === 'split' ? 'grid-cols-2' :
          viewMode === '2d' ? 'grid-cols-1' :
          'grid-cols-1'
        }`}>
          {/* 2D Canvas Preview */}
          {(viewMode === 'split' || viewMode === '2d') && (
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 h-full">
              <CardContent className="p-4 h-full">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">2D Render</h4>
                  <Badge variant="outline" className="text-xs">
                    High Quality
                  </Badge>
                </div>
                <Canvas2DPreview
                  ref={canvas2DRef}
                  selectedPhoto={selectedPhoto}
                  selectedTemplate={selectedTemplate}
                  effects={effects}
                  className="w-full h-[calc(100%-40px)] rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          )}

          {/* 3D Interactive Preview */}
          {(viewMode === 'split' || viewMode === '3d') && (
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 h-full">
              <CardContent className="p-4 h-full">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">3D Interactive</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                    <Button
                      onClick={() => {/* Reset 3D view */}}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-crd-lightGray hover:text-white"
                    >
                      <RotateCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="w-full h-[calc(100%-40px)] rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
                  <ImmersiveCardViewer
                    card={tempCardData}
                    isOpen={true}
                    onClose={() => {}}
                    allowRotation={true}
                    showStats={false}
                    ambient={effects.lighting.interactive}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm text-crd-lightGray bg-crd-darkGray rounded-lg p-3 border border-crd-mediumGray/30">
          <div className="flex items-center gap-4">
            <span>Material: {effects.material.type}</span>
            <span>Effects: {getActiveEffectsCount()}</span>
            <span>Environment: {effects.lighting.environment}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
            <span>Live Preview Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
