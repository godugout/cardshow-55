
import React from 'react';
import { RotateCcw, Target, StopCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EnhancedColoredSlider } from '../../../EnhancedColoredSlider';
import type { SpaceControls } from '../../../../spaces/types';

interface CardPhysicsSectionProps {
  spaceControls: SpaceControls;
  onControlsChange: (controls: SpaceControls) => void;
}

export const CardPhysicsSection: React.FC<CardPhysicsSectionProps> = ({
  spaceControls,
  onControlsChange
}) => {
  const updateControl = (key: keyof SpaceControls, value: number | boolean) => {
    onControlsChange({
      ...spaceControls,
      [key]: value
    });
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <h4 className="text-white font-medium flex items-center">
        Card Physics
        <span className="ml-2 text-xs text-white/60">(Centered & Bounded)</span>
      </h4>

      {/* Motion Description */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-blue-300 text-xs">
          Card stays centered with automatic snap-back. Use motion controls to stop/center anytime.
        </p>
      </div>

      {/* Float Intensity */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Float Intensity: {spaceControls.floatIntensity.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.floatIntensity]}
          onValueChange={([value]) => updateControl('floatIntensity', value)}
          min={0}
          max={2}
          step={0.1}
          isActive={spaceControls.floatIntensity > 0}
          styleColor="#F59E0B"
          effectName="Float Intensity"
        />
        <p className="text-white/60 text-xs mt-2">
          Controls gentle floating motion around center point
        </p>
      </div>

      {/* Gravity Effect */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Gravity Effect: {spaceControls.gravityEffect.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.gravityEffect]}
          onValueChange={([value]) => updateControl('gravityEffect', value)}
          min={0}
          max={1.5}
          step={0.1}
          isActive={spaceControls.gravityEffect > 0}
          styleColor="#10B981"
          effectName="Gravity Effect"
        />
        <p className="text-white/60 text-xs mt-2">
          Adds downward pull with automatic bounce-back
        </p>
      </div>

      {/* Auto Rotate Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">Auto Rotate Card</span>
          </div>
          <Button
            onClick={() => updateControl('autoRotate', !spaceControls.autoRotate)}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs transition-all",
              spaceControls.autoRotate 
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600" 
                : "bg-transparent text-white border-white/20 hover:border-white/40"
            )}
          >
            {spaceControls.autoRotate ? 'On' : 'Off'}
          </Button>
        </div>
        <p className="text-white/60 text-xs">
          Smooth rotation with subtle wobble effect
        </p>
      </div>

      {/* Movement Boundaries Info */}
      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-center space-x-2 mb-1">
          <Target className="w-3 h-3 text-purple-400" />
          <span className="text-purple-300 text-xs font-medium">Movement Boundaries</span>
        </div>
        <p className="text-purple-200 text-xs">
          Card is constrained within 1.5 units of center and automatically returns when idle.
        </p>
      </div>
    </div>
  );
};
