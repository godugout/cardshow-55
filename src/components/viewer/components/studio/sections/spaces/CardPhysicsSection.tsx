
import React from 'react';
import { RotateCcw } from 'lucide-react';
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
      </h4>

      {/* Float Intensity */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <Label className="text-white text-sm mb-3 block font-medium">
          Float Intensity: {spaceControls.floatIntensity.toFixed(1)}
        </Label>
        <EnhancedColoredSlider
          value={[spaceControls.floatIntensity]}
          onValueChange={([value]) => updateControl('floatIntensity', value)}
          min={0}
          max={3}
          step={0.1}
          isActive={spaceControls.floatIntensity > 0}
          styleColor="#F59E0B"
          effectName="Float Intensity"
        />
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
          max={2}
          step={0.1}
          isActive={spaceControls.gravityEffect > 0}
          styleColor="#10B981"
          effectName="Gravity Effect"
        />
      </div>

      {/* Auto Rotate Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
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
      </div>
    </div>
  );
};
