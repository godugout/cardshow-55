
import React, { useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

interface CanvasBackgroundInfoProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const CanvasBackgroundInfo: React.FC<CanvasBackgroundInfoProps> = React.memo(({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  isHovering
}) => {
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // Cache active effects calculation
  const activeEffects = useMemo(() => {
    return Object.entries(effectValues || {})
      .filter(([_, params]) => params && typeof params.intensity === 'number' && params.intensity > 0)
      .map(([effectId, params]) => ({
        id: effectId,
        name: effectId.charAt(0).toUpperCase() + effectId.slice(1),
        intensity: params.intensity as number
      }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 4);
  }, [effectValues]);

  // Cache parallax calculations
  const parallaxOffset = useMemo(() => ({
    x: (mousePosition.x - 0.5) * 20,
    y: (mousePosition.y - 0.5) * 10
  }), [mousePosition.x, mousePosition.y]);

  // Cache material display values
  const materialDisplayValues = useMemo(() => ({
    roughness: Math.round(materialSettings.roughness * 100),
    metalness: Math.round(materialSettings.metalness * 100),
    clearcoat: Math.round(materialSettings.clearcoat * 100),
    reflectivity: Math.round(materialSettings.reflectivity * 100)
  }), [materialSettings]);

  // Cache selected material display
  const materialOpacity = useMemo(() => Math.round(selectedMaterial.opacity * 100), [selectedMaterial.opacity]);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `perspective(1000px) translateZ(-200px) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px)`,
        opacity: isHovering ? 0.9 : 0.7,
        transition: 'opacity 0.3s ease, transform 0.1s ease'
      }}
    >
      {/* Left Side - Active Effects */}
      <div 
        className="absolute left-8 top-1/2 transform -translate-y-1/2"
        style={{
          transform: 'perspective(800px) rotateY(15deg) translateZ(-50px)',
          filter: 'blur(0.5px)'
        }}
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
          <h4 className="text-blue-400 font-medium mb-3 text-sm flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            Active Effects
          </h4>
          {activeEffects.length > 0 ? (
            <div className="space-y-2">
              {activeEffects.map(effect => (
                <div key={effect.id} className="flex items-center justify-between text-xs">
                  <span className="text-white/80">{effect.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 transition-all duration-300"
                        style={{ width: `${effect.intensity}%` }}
                      />
                    </div>
                    <span className="text-blue-300 w-6 text-right">{effect.intensity}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs">No effects active</p>
          )}
        </div>
      </div>

      {/* Right Side - Environment & Material Properties */}
      <div 
        className="absolute right-8 top-1/3 transform -translate-y-1/2"
        style={{
          transform: 'perspective(800px) rotateY(-15deg) translateZ(-30px)',
          filter: 'blur(0.3px)'
        }}
      >
        {/* Environment Section */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30 mb-4">
          <h4 className="text-green-400 font-medium mb-2 text-sm">Environment</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Scene:</span>
              <span className="text-green-300">{selectedScene.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Lighting:</span>
              <span className="text-green-300">{selectedLighting.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Brightness:</span>
              <span className="text-white/60">{overallBrightness[0]}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Interactive:</span>
              <div className="flex items-center">
                {interactiveLighting ? (
                  <Eye className="w-3 h-3 text-green-400" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Material Properties Section */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-orange-400/30">
          <h4 className="text-orange-400 font-medium mb-2 text-sm">Material</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Roughness:</span>
              <span className="text-white/60">{materialDisplayValues.roughness}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Metalness:</span>
              <span className="text-white/60">{materialDisplayValues.metalness}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Clearcoat:</span>
              <span className="text-white/60">{materialDisplayValues.clearcoat}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Reflectivity:</span>
              <span className="text-white/60">{materialDisplayValues.reflectivity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center - Card Back Material */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{
          transform: 'perspective(600px) rotateX(25deg) translateZ(-80px)',
          filter: 'blur(0.4px)'
        }}
      >
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
          <h4 className="text-purple-400 font-medium mb-2 text-sm text-center">Card Back Material</h4>
          <div className="space-y-1 text-xs text-center">
            <div className="text-purple-300 font-medium">{selectedMaterial.name}</div>
            <div className="flex justify-center space-x-4">
              <div className="text-white/60">
                Opacity: {materialOpacity}%
              </div>
              {selectedMaterial.blur && (
                <div className="text-white/60">
                  Blur: {selectedMaterial.blur}px
                </div>
              )}
            </div>
            {selectedMaterial.texture && (
              <div className="text-white/60 capitalize">
                Texture: {selectedMaterial.texture}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Center - Real-time Status */}
      <div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2"
        style={{
          transform: 'perspective(600px) rotateX(-20deg) translateZ(-60px)',
          filter: 'blur(0.2px)'
        }}
      >
        <div className="bg-black/15 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-white/70">Studio Active</span>
            </div>
            <div className="text-white/50">|</div>
            <div className="text-white/70">
              {activeEffects.length} Effect{activeEffects.length !== 1 ? 's' : ''} Applied
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 400px 200px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(59, 130, 246, 0.03) 0%, 
              rgba(16, 185, 129, 0.02) 40%,
              transparent 80%)
          `,
          filter: 'blur(2px)',
          opacity: isHovering ? 0.8 : 0.4,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.selectedScene.id === nextProps.selectedScene.id &&
    prevProps.selectedLighting.id === nextProps.selectedLighting.id &&
    prevProps.overallBrightness[0] === nextProps.overallBrightness[0] &&
    prevProps.interactiveLighting === nextProps.interactiveLighting &&
    prevProps.isHovering === nextProps.isHovering &&
    Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) < 0.01 &&
    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) < 0.01 &&
    JSON.stringify(prevProps.effectValues) === JSON.stringify(nextProps.effectValues) &&
    JSON.stringify(prevProps.materialSettings) === JSON.stringify(nextProps.materialSettings)
  );
});

CanvasBackgroundInfo.displayName = 'CanvasBackgroundInfo';
