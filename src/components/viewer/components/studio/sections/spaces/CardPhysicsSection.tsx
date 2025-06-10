
import React from 'react';
import { RotateCcw, MousePointer2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
        <MousePointer2 className="w-4 h-4 mr-2" />
        Card Controls
        <span className="ml-2 text-xs text-white/60">(Simple & Direct)</span>
      </h4>

      {/* Control Description */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-blue-300 text-xs">
          Card stays perfectly centered. Drag to rotate, double-click to flip. Always responsive!
        </p>
      </div>

      {/* Auto Rotate Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">Auto Rotate</span>
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
          Gentle automatic rotation when not interacting
        </p>
      </div>

      {/* Interaction Guide */}
      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <div className="space-y-1 text-xs">
          <div className="text-purple-300 font-medium">Interaction Guide:</div>
          <div className="text-purple-200">• Drag anywhere to rotate freely</div>
          <div className="text-purple-200">• Double-click to flip front/back</div>
          <div className="text-purple-200">• Use controls to stop or reset</div>
          <div className="text-purple-200">• Card always stays centered</div>
        </div>
      </div>
    </div>
  );
};
