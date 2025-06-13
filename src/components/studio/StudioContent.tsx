
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Palette, Zap, Sparkles } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface StudioContentProps {
  selectedCard: CardData | null;
}

export const StudioContent: React.FC<StudioContentProps> = ({
  selectedCard
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-crd-blue" />
          <h3 className="text-lg font-semibold text-crd-white">Effects Studio</h3>
        </div>
        <p className="text-sm text-crd-lightGray">
          Adjust 3D effects and visual properties in real-time
        </p>
      </div>

      {/* Holographic Effects */}
      <Card className="bg-crd-dark border-crd-lightGray">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Holographic</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-crd-lightGray">Enable Effect</span>
            <Switch defaultChecked />
          </div>
          <div>
            <label className="text-sm text-crd-lightGray block mb-2">Intensity</label>
            <Slider
              defaultValue={[80]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-crd-lightGray block mb-2">Speed</label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chrome Effects */}
      <Card className="bg-crd-dark border-crd-lightGray">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Chrome</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-crd-lightGray">Enable Effect</span>
            <Switch defaultChecked />
          </div>
          <div>
            <label className="text-sm text-crd-lightGray block mb-2">Reflectivity</label>
            <Slider
              defaultValue={[60]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3D Settings */}
      <Card className="bg-crd-dark border-crd-lightGray">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white flex items-center space-x-2">
            <Palette className="w-4 h-4 text-green-400" />
            <span>3D Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-crd-lightGray block mb-2">Card Depth</label>
            <Slider
              defaultValue={[15]}
              max={30}
              min={5}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-crd-lightGray block mb-2">Edge Glow</label>
            <Slider
              defaultValue={[70]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-crd-lightGray">Auto Rotate</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
