import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { 
  Wand2, Zap, Gamepad2, Clock, Volume2, Users, 
  Dna, TestTube, QrCode, Cpu, Eye, Sparkles 
} from 'lucide-react';
import { InteractiveCardData, CardState, CardBehaviorRule } from '@/types/interactiveCard';
import { VisualProgrammingCanvas } from './components/VisualProgrammingCanvas';
import { ParticleSystemDesigner } from './components/ParticleSystemDesigner';
import { KineticTextEditor } from './components/KineticTextEditor';
import { MediaImportHub } from './components/MediaImportHub';
import { StateManager } from './components/StateManager';
import { EnvironmentalControls } from './components/EnvironmentalControls';
import { BiometricIntegration } from './components/BiometricIntegration';
import { CollaborativeFusion } from './components/CollaborativeFusion';
import { TestingArena } from './components/TestingArena';
import { DistributionHub } from './components/DistributionHub';
import { LivePreview } from './components/LivePreview';

interface RevolutionaryCardCreatorProps {
  initialCard?: Partial<InteractiveCardData>;
  onSave: (card: InteractiveCardData) => void;
  onPreview: (card: InteractiveCardData) => void;
}

export const RevolutionaryCardCreator: React.FC<RevolutionaryCardCreatorProps> = ({
  initialCard,
  onSave,
  onPreview
}) => {
  const [cardData, setCardData] = useState<InteractiveCardData>({
    id: initialCard?.id || `card_${Date.now()}`,
    title: initialCard?.title || 'Untitled Card',
    description: initialCard?.description || '',
    rarity: initialCard?.rarity || 'common',
    creator_id: initialCard?.creator_id || 'current_user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    
    // Revolutionary features
    is_interactive: true,
    default_state_id: 'default',
    states: [{
      id: 'default',
      name: 'Default State',
      description: 'The card\'s initial appearance',
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
      genetic_code: generateGeneticCode(),
      remix_permissions: {
        allow_visual_remix: true,
        allow_behavior_remix: true,
        allow_audio_remix: true,
        require_attribution: true,
        commercial_use: false
      },
      inheritance_traits: [],
      generation: 0,
      parent_cards: []
    },
    
    fusion_history: [],
    
    platform_optimizations: {
      discord: { animated: true, size_limit: 8 },
      twitter: { gif_preview: '', static_fallback: '' },
      instagram: { story_format: '', post_format: '' },
      tiktok: { vertical_format: '', effects_enabled: true }
    },
    
    performance_profile: {
      target_fps: 60,
      memory_budget: 128,
      battery_impact: 'low',
      network_requirements: 'minimal'
    },
    
    api_endpoints: [],
    version: 1,
    edit_history: []
  });

  const [activeTab, setActiveTab] = useState('states');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'test'>('edit');

  const updateCardData = useCallback((updates: Partial<InteractiveCardData>) => {
    setCardData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
      version: prev.version + 1
    }));
  }, []);

  const addState = useCallback((state: CardState) => {
    updateCardData({
      states: [...cardData.states, state]
    });
  }, [cardData.states, updateCardData]);

  const updateState = useCallback((stateId: string, updates: Partial<CardState>) => {
    updateCardData({
      states: cardData.states.map(state => 
        state.id === stateId ? { ...state, ...updates } : state
      )
    });
  }, [cardData.states, updateCardData]);

  const addBehaviorRule = useCallback((rule: CardBehaviorRule) => {
    updateCardData({
      behavior_rules: [...cardData.behavior_rules, rule]
    });
  }, [cardData.behavior_rules, updateCardData]);

  const handleSave = useCallback(() => {
    onSave(cardData);
  }, [cardData, onSave]);

  const handlePreview = useCallback(() => {
    onPreview(cardData);
    setPreviewMode('preview');
  }, [cardData, onPreview]);

  return (
    <div className="h-screen w-full flex flex-col bg-crd-darkest">
      {/* Header */}
      <div className="flex-shrink-0 h-16 px-6 border-b border-crd-mediumGray/20 bg-crd-darker/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-crd-green" />
            <h1 className="text-2xl font-bold text-crd-white">Revolutionary Card Creator</h1>
          </div>
          <div className="text-xs text-crd-lightGray bg-crd-mediumGray/20 px-2 py-1 rounded">
            v{cardData.version} • {cardData.states.length} states • {cardData.behavior_rules.length} behaviors
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('edit')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                previewMode === 'edit' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('preview')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                previewMode === 'preview' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setPreviewMode('test')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                previewMode === 'test' 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white'
              }`}
            >
              Test
            </button>
          </div>
          
          <CRDButton onClick={handleSave} variant="secondary" size="sm">
            Save
          </CRDButton>
          <CRDButton onClick={handlePreview} variant="primary" size="sm">
            Launch Preview
          </CRDButton>
        </div>
      </div>

      {/* Main Content - Responsive 3-Panel Layout */}
      <div className="flex-1 flex min-h-0 w-full">
        {/* Left Panel - Tools (responsive width) */}
        <div className="hidden lg:flex lg:w-80 xl:w-96 2xl:w-[420px] border-r border-crd-mediumGray/20 bg-crd-darker/30 overflow-y-auto flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-3 w-full bg-crd-mediumGray/20 p-1 mx-3 mt-3 mb-0">
              <TabsTrigger value="states" className="text-xs">States</TabsTrigger>
              <TabsTrigger value="behaviors" className="text-xs">Behaviors</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
            </TabsList>
            
            <div className="p-3 space-y-4 flex-1 overflow-y-auto">
              <TabsContent value="states" className="mt-0">
                <StateManager
                  states={cardData.states}
                  defaultStateId={cardData.default_state_id}
                  onAddState={addState}
                  onUpdateState={updateState}
                  onSetDefault={(stateId) => updateCardData({ default_state_id: stateId })}
                />
              </TabsContent>
              
              <TabsContent value="behaviors" className="mt-0">
                <VisualProgrammingCanvas
                  behaviorRules={cardData.behavior_rules}
                  onAddRule={addBehaviorRule}
                  onUpdateRule={(ruleId, updates) => {
                    updateCardData({
                      behavior_rules: cardData.behavior_rules.map(rule =>
                        rule.id === ruleId ? { ...rule, ...updates } : rule
                      )
                    });
                  }}
                />
              </TabsContent>
              
              <TabsContent value="effects" className="mt-0">
                <div className="space-y-4">
                  <ParticleSystemDesigner
                    systems={cardData.particle_systems}
                    onUpdate={(systems) => updateCardData({ particle_systems: systems })}
                  />
                  
                  <KineticTextEditor
                    textConfigs={cardData.kinetic_text}
                    onUpdate={(configs) => updateCardData({ kinetic_text: configs })}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Center Panel - Canvas/Preview (MAIN FOCUS - Full screen on mobile) */}
        <div className="flex-1 min-w-0 bg-crd-darkest flex flex-col w-full">
          <LivePreview
            cardData={cardData}
            mode={previewMode}
            onUpdate={updateCardData}
          />
        </div>

        {/* Right Panel - Advanced Features (responsive width) */}
        <div className="hidden xl:flex xl:w-80 2xl:w-96 border-l border-crd-mediumGray/20 bg-crd-darker/30 overflow-y-auto flex-col">
          <Tabs defaultValue="media" className="h-full">
            <TabsList className="grid grid-cols-2 w-full bg-crd-mediumGray/20 p-1 mx-3 mt-3 mb-0">
              <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
            
            <div className="p-3 space-y-4 flex-1 overflow-y-auto">
              <TabsContent value="media" className="mt-0">
                <MediaImportHub
                  assets={cardData.assets}
                  onAssetsUpdate={(assets) => updateCardData({ assets })}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-4">
                  <EnvironmentalControls
                    config={cardData.environmental_config}
                    onUpdate={(config) => updateCardData({ environmental_config: config })}
                  />
                  
                  <BiometricIntegration
                    triggers={cardData.biometric_triggers}
                    onUpdate={(triggers) => updateCardData({ biometric_triggers: triggers })}
                  />
                  
                  <CollaborativeFusion
                    cardDna={cardData.card_dna}
                    onUpdate={(dna) => updateCardData({ card_dna: dna })}
                  />
                  
                  <TestingArena
                    cardData={cardData}
                    onRunTest={(results) => console.log('Test results:', results)}
                  />
                  
                  <DistributionHub
                    cardData={cardData}
                    onPlatformUpdate={(platform, config) => {
                      updateCardData({
                        platform_optimizations: {
                          ...cardData.platform_optimizations,
                          [platform]: config
                        }
                      });
                    }}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate unique genetic code for Card DNA
function generateGeneticCode(): string {
  const traits = ['visual', 'behavior', 'audio', 'interactive', 'temporal'];
  const codes = traits.map(() => Math.random().toString(36).substr(2, 4));
  return codes.join('-').toUpperCase();
}