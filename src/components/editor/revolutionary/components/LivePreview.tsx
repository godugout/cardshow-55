import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, RotateCcw, Maximize, 
  Smartphone, Tablet, Monitor, 
  Eye, Settings, Layers, Zap 
} from 'lucide-react';
import { InteractiveCardData } from '@/types/interactiveCard';

interface LivePreviewProps {
  cardData: InteractiveCardData;
  mode: 'edit' | 'preview' | 'test';
  onUpdate: (updates: Partial<InteractiveCardData>) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  cardData,
  mode,
  onUpdate
}) => {
  const [currentState, setCurrentState] = useState(cardData.default_state_id);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedTrigger, setSimulatedTrigger] = useState<string>('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const deviceSizes = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 }
  };

  const currentStateData = cardData.states.find(s => s.id === currentState);
  const deviceSize = deviceSizes[deviceType];

  const triggerSimulation = (trigger: string) => {
    setSimulatedTrigger(trigger);
    
    // Find matching behavior rules
    const matchingRules = cardData.behavior_rules.filter(rule => rule.trigger === trigger);
    
    if (matchingRules.length > 0) {
      const rule = matchingRules[0]; // Use first matching rule
      
      // Simulate state change if there's a state_change action
      const stateChangeAction = rule.actions.find(action => action.type === 'state_change');
      if (stateChangeAction && stateChangeAction.parameters.target_state) {
        setCurrentState(stateChangeAction.parameters.target_state);
      }
    }
    
    // Clear trigger after simulation
    setTimeout(() => setSimulatedTrigger(''), 2000);
  };

  const resetPreview = () => {
    setCurrentState(cardData.default_state_id);
    setIsPlaying(false);
    setSimulatedTrigger('');
  };

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="flex-shrink-0 p-4 border-b border-crd-mediumGray/20 bg-crd-darker/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
              {(['mobile', 'tablet', 'desktop'] as const).map((device) => {
                const Icon = deviceIcons[device];
                return (
                  <button
                    key={device}
                    onClick={() => setDeviceType(device)}
                    className={`p-2 rounded transition-colors ${
                      deviceType === device 
                        ? 'bg-crd-green text-black' 
                        : 'text-crd-lightGray hover:text-crd-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <CRDButton
                onClick={() => setIsPlaying(!isPlaying)}
                variant="secondary"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </CRDButton>
              
              <CRDButton onClick={resetPreview} variant="secondary" size="sm">
                <RotateCcw className="w-4 h-4" />
              </CRDButton>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className={`p-2 rounded transition-colors ${
                showDebugInfo 
                  ? 'bg-crd-green text-black' 
                  : 'text-crd-lightGray hover:text-crd-white'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <CRDButton variant="secondary" size="sm">
              <Maximize className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>

        {/* Test Controls */}
        {mode === 'test' && (
          <div className="flex items-center gap-2">
            <span className="text-crd-lightGray text-sm">Simulate:</span>
            {['tap', 'hover', 'swipe', 'weather_rain', 'time_evening'].map((trigger) => (
              <CRDButton
                key={trigger}
                onClick={() => triggerSimulation(trigger)}
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                {trigger.replace('_', ' ')}
              </CRDButton>
            ))}
          </div>
        )}
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 bg-crd-darkest/50 p-2 sm:p-4 lg:p-6 xl:p-8">
        <div className="h-full flex items-center justify-center">
          <div 
            className="bg-crd-darker/80 border border-crd-mediumGray/30 rounded-xl shadow-2xl transition-all duration-300 relative overflow-hidden w-full max-w-none"
            style={{ 
              width: deviceType === 'mobile' ? 'min(375px, 90vw)' : 
                     deviceType === 'tablet' ? 'min(768px, 85vw)' : 
                     'min(100%, 1400px)',
              height: deviceType === 'mobile' ? 'min(667px, 80vh)' : 
                      deviceType === 'tablet' ? 'min(1024px, 85vh)' : 
                      'min(85vh, 900px)',
              aspectRatio: deviceType === 'mobile' ? '9/16' : deviceType === 'tablet' ? '3/4' : '16/10'
            }}
          >
            {/* Card Preview Area */}
            <div className="w-full h-full relative">
              {/* Background */}
              <div 
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: currentStateData?.visual_properties.background || 
                    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  opacity: currentStateData?.visual_properties.opacity || 1,
                  transform: `scale(${currentStateData?.visual_properties.scale || 1}) rotate(${currentStateData?.visual_properties.rotation || 0}deg)`,
                  filter: currentStateData?.visual_properties.filter || 'none'
                }}
              />

              {/* Card Content */}
              <div className="absolute inset-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/40 flex items-center justify-center">
                {cardData.assets.images.length > 0 ? (
                  <img
                    src={cardData.assets.images[0].url}
                    alt="Card preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-crd-lightGray opacity-50" />
                    <h3 className="text-crd-white text-xl font-bold mb-2">{cardData.title}</h3>
                    <p className="text-crd-lightGray text-sm">{cardData.description || 'Interactive card preview'}</p>
                  </div>
                )}
              </div>

              {/* Particle Effects Simulation */}
              {isPlaying && cardData.particle_systems.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {cardData.particle_systems.map((system) => (
                    <div
                      key={system.id}
                      className="absolute w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{
                        color: system.color_start,
                        top: '20%',
                        left: '50%',
                        animationDuration: '2s',
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Kinetic Text Preview */}
              {cardData.kinetic_text.map((text) => (
                <div
                  key={text.id}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    fontSize: `${text.font_size}px`,
                    fontWeight: text.font_weight,
                    fontFamily: text.font_family,
                    color: text.color_scheme[0] || '#ffffff',
                    animation: isPlaying ? `${text.animation_type} ${text.animation_speed}s infinite` : 'none'
                  }}
                >
                  {text.text}
                </div>
              ))}

              {/* Trigger Feedback */}
              {simulatedTrigger && (
                <div className="absolute top-4 left-4 bg-crd-green/90 text-black px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {simulatedTrigger.replace('_', ' ')} triggered
                </div>
              )}

              {/* State Indicator */}
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="bg-crd-mediumGray/80 text-crd-white">
                  {currentStateData?.name || 'Unknown State'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {showDebugInfo && (
        <div className="flex-shrink-0 p-4 border-t border-crd-mediumGray/20 bg-crd-darker/30">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="text-crd-white font-medium mb-2 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                States
              </h4>
              <div className="space-y-1">
                {cardData.states.map((state) => (
                  <div 
                    key={state.id}
                    className={`text-crd-lightGray ${currentState === state.id ? 'text-crd-green' : ''}`}
                  >
                    • {state.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-crd-white font-medium mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Behaviors
              </h4>
              <div className="space-y-1">
                {cardData.behavior_rules.map((rule) => (
                  <div key={rule.id} className="text-crd-lightGray">
                    • {rule.trigger} → {rule.actions.length} actions
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-crd-white font-medium mb-2">Performance</h4>
              <div className="space-y-1 text-crd-lightGray">
                <div>Target FPS: {cardData.performance_profile.target_fps}</div>
                <div>Memory: {cardData.performance_profile.memory_budget}MB</div>
                <div>Battery: {cardData.performance_profile.battery_impact}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};