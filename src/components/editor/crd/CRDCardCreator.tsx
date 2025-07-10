import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Layers, Image, Type, Palette, Settings, Eye, Save, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InteractiveCardData, CardState } from '@/types/interactiveCard';
import { CRDLayoutTab } from './tabs/CRDLayoutTab';
import { CRDDesignTab } from './tabs/CRDDesignTab';
import { CRDContentTab } from './tabs/CRDContentTab';
import { CRDExportTab } from './tabs/CRDExportTab';
import { CRDCanvas } from './canvas/CRDCanvas';
import { CRDSidebar } from './sidebar/CRDSidebar';
interface CRDCardCreatorProps {
  initialCard?: Partial<InteractiveCardData>;
  onSave: (card: InteractiveCardData) => void;
  onPreview: (card: InteractiveCardData) => void;
}
export const CRDCardCreator: React.FC<CRDCardCreatorProps> = ({
  initialCard,
  onSave,
  onPreview
}) => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<InteractiveCardData>({
    id: initialCard?.id || `crd_${Date.now()}`,
    title: initialCard?.title || 'Untitled CRDMKR Card',
    description: initialCard?.description || '',
    rarity: initialCard?.rarity || 'common',
    creator_id: initialCard?.creator_id || 'current_user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // CRD-specific features
    is_interactive: false,
    default_state_id: 'default',
    states: [{
      id: 'default',
      name: 'Default State',
      description: 'The card\'s standard appearance',
      visual_properties: {
        opacity: 1,
        scale: 1,
        rotation: 0
      },
      transition_rules: []
    }],
    behavior_rules: [],
    assets: {
      images: [],
      audio: [],
      videos: [],
      models_3d: []
    },
    particle_systems: [],
    mini_games: [],
    kinetic_text: [],
    biometric_triggers: [],
    environmental_config: {
      weather_enabled: false,
      time_enabled: false,
      location_enabled: false,
      device_sensors_enabled: false,
      weather_effects: [],
      time_effects: []
    },
    card_dna: {
      genetic_code: generateCRDCode(),
      remix_permissions: {
        allow_visual_remix: true,
        allow_behavior_remix: false,
        allow_audio_remix: false,
        require_attribution: true,
        commercial_use: true
      },
      inheritance_traits: [],
      generation: 0,
      parent_cards: []
    },
    fusion_history: [],
    platform_optimizations: {
      discord: {
        animated: false,
        size_limit: 8
      },
      twitter: {
        gif_preview: '',
        static_fallback: ''
      },
      instagram: {
        story_format: '',
        post_format: ''
      },
      tiktok: {
        vertical_format: '',
        effects_enabled: false
      }
    },
    performance_profile: {
      target_fps: 60,
      memory_budget: 64,
      battery_impact: 'low',
      network_requirements: 'minimal'
    },
    api_endpoints: [],
    version: 1,
    edit_history: []
  });

  // CRDMKR State
  const [activeTab, setActiveTab] = useState('layout');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'print'>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('baseball-classic');
  const [colorPalette, setColorPalette] = useState('classic');
  const [typography, setTypography] = useState('modern');
  const [effects, setEffects] = useState<string[]>([]);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<Record<string, string>>({});
  const [showGuides, setShowGuides] = useState(false);
  const updateCardData = useCallback((updates: Partial<InteractiveCardData>) => {
    setCardData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
      version: prev.version + 1
    }));
  }, []);
  const handleSave = useCallback(() => {
    onSave(cardData);
  }, [cardData, onSave]);
  const handlePreview = useCallback(() => {
    onPreview(cardData);
    setPreviewMode('preview');
  }, [cardData, onPreview]);
  const handleExport = useCallback((format: string, options: any) => {
    console.log('Exporting CRDMKR card:', {
      format,
      options,
      cardData
    });
    // Implementation for actual export functionality
  }, [cardData]);
  return <div className="h-screen w-full flex flex-col bg-crd-darkest pt-16">
      {/* Header */}
      <div className="flex-shrink-0 h-16 px-6 border-b border-crd-mediumGray/20 bg-crd-darker/50 flex items-center justify-between">
        {/* Left: CRD Logo, Title, and Tags */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/create')}
            className="hover:bg-crd-mediumGray/20 p-1 rounded transition-colors"
            title="Back to Create"
          >
            <Layers className="w-6 h-6 text-crd-blue hover:text-crd-lightBlue transition-colors" />
          </button>
          
          <input 
            type="text"
            value={cardData.title}
            onChange={(e) => updateCardData({ title: e.target.value })}
            className="text-2xl font-bold text-crd-white bg-transparent border-none outline-none focus:bg-crd-darker/30 focus:px-2 focus:py-1 focus:rounded transition-all"
            placeholder="Enter CRD name..."
          />
          
          <div className="flex items-center gap-2 text-xs text-crd-lightGray">
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              v{cardData.version}
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              {cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)}
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              Print Ready
            </div>
            <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
              {cardData.card_dna?.genetic_code?.split('-')[0] || 'CRD'}
            </div>
          </div>
        </div>
        
        {/* Right: Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
            <button onClick={() => setPreviewMode('edit')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'edit' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => setPreviewMode('preview')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'preview' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
              Preview
            </button>
            <button onClick={() => setPreviewMode('print')} className={`px-3 py-1 text-sm rounded transition-colors ${previewMode === 'print' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'}`}>
              Print
            </button>
          </div>
          
          <CRDButton onClick={handleSave} variant="secondary" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </CRDButton>
          <CRDButton onClick={handlePreview} variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </CRDButton>
        </div>
      </div>

      {/* Main Content - CRD-focused 3-Panel Layout */}
      <div className="flex-1 flex min-h-0 w-full">
        {/* Left Panel - CRD Tools */}
        <div className="hidden lg:flex lg:w-80 xl:w-96 border-r border-crd-mediumGray/20 bg-crd-darker/30 overflow-y-auto flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-4 w-full bg-crd-mediumGray/20 p-1 mx-3 mt-3 mb-0">
              <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
              <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
            </TabsList>
            
            <div className="p-3 space-y-4 flex-1 overflow-y-auto">
              <TabsContent value="layout" className="mt-0">
                <CRDLayoutTab selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
              </TabsContent>
              
              <TabsContent value="design" className="mt-0">
                <CRDDesignTab colorPalette={colorPalette} onColorPaletteChange={setColorPalette} typography={typography} onTypographyChange={setTypography} effects={effects} onEffectsChange={setEffects} />
              </TabsContent>
              
              <TabsContent value="content" className="mt-0">
                <CRDContentTab cardTitle={cardData.title} onCardTitleChange={title => updateCardData({
                title
              })} cardDescription={cardData.description || ''} onCardDescriptionChange={description => updateCardData({
                description
              })} playerImage={playerImage} onPlayerImageChange={setPlayerImage} playerStats={playerStats} onPlayerStatsChange={setPlayerStats} />
              </TabsContent>
              
              <TabsContent value="export" className="mt-0">
                <CRDExportTab onExport={handleExport} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center Panel - Card Canvas */}
        <div className="flex-1 min-w-0 bg-crd-darkest flex flex-col w-full">
          <CRDCanvas 
            template={selectedTemplate} 
            colorPalette={colorPalette} 
            typography={typography} 
            effects={effects} 
            cardTitle={cardData.title} 
            cardDescription={cardData.description || ''} 
            playerImage={playerImage} 
            playerStats={playerStats} 
            previewMode={previewMode}
            onImageUpload={(files) => {
              if (files.length > 0) {
                const file = files[0];
                const imageUrl = URL.createObjectURL(file);
                setPlayerImage(imageUrl);
              }
            }}
          />
        </div>

        {/* Right Panel - Dusty + Properties */}
        <div className="hidden xl:flex xl:w-96 border-l border-crd-mediumGray/20 bg-crd-darker/30 backdrop-blur-sm overflow-y-auto flex-col">
          <CRDSidebar cardData={cardData} onCardDataUpdate={updateCardData} cardTitle={cardData.title} playerImage={playerImage} selectedTemplate={selectedTemplate} colorPalette={colorPalette} effects={effects} previewMode={previewMode} />
        </div>
      </div>
    </div>;
};

// Helper function to generate CRD-specific codes
function generateCRDCode(): string {
  const prefixes = ['CRD', 'TCD', 'PRO', 'STD', 'PRE'];
  const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const suffix = Math.random().toString(36).substr(2, 2).toUpperCase();
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${numbers}-${suffix}`;
}