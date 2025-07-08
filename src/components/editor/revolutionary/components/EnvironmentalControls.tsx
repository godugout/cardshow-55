import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cloud, Sun, Clock, MapPin, Smartphone } from 'lucide-react';
import { EnvironmentalConfig } from '@/types/interactiveCard';

interface EnvironmentalControlsProps {
  config: EnvironmentalConfig;
  onUpdate: (config: EnvironmentalConfig) => void;
}

export const EnvironmentalControls: React.FC<EnvironmentalControlsProps> = ({
  config,
  onUpdate
}) => {
  const updateConfig = (updates: Partial<EnvironmentalConfig>) => {
    onUpdate({ ...config, ...updates });
  };

  return (
    <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white text-base flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          Environmental Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-crd-lightGray" />
              <Label className="text-crd-white text-sm">Weather Effects</Label>
            </div>
            <Switch
              checked={config.weather_enabled}
              onCheckedChange={(checked) => updateConfig({ weather_enabled: checked })}
            />
          </div>
          <p className="text-crd-lightGray text-xs pl-6">
            Card reacts to current weather conditions
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-crd-lightGray" />
              <Label className="text-crd-white text-sm">Time of Day</Label>
            </div>
            <Switch
              checked={config.time_enabled}
              onCheckedChange={(checked) => updateConfig({ time_enabled: checked })}
            />
          </div>
          <p className="text-crd-lightGray text-xs pl-6">
            Visual changes based on morning, noon, evening, night
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-crd-lightGray" />
              <Label className="text-crd-white text-sm">Location Aware</Label>
            </div>
            <Switch
              checked={config.location_enabled}
              onCheckedChange={(checked) => updateConfig({ location_enabled: checked })}
            />
          </div>
          <p className="text-crd-lightGray text-xs pl-6">
            Adapt to user's geographic location
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-crd-lightGray" />
              <Label className="text-crd-white text-sm">Device Sensors</Label>
            </div>
            <Switch
              checked={config.device_sensors_enabled}
              onCheckedChange={(checked) => updateConfig({ device_sensors_enabled: checked })}
            />
          </div>
          <p className="text-crd-lightGray text-xs pl-6">
            Use accelerometer, gyroscope, and other sensors
          </p>
        </div>

        {config.weather_enabled && (
          <div className="mt-4 p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <h4 className="text-crd-white text-sm font-medium mb-2">Weather Effects</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span>🌧️</span>
                <span className="text-crd-lightGray">Rain particles</span>
              </div>
              <div className="flex items-center gap-1">
                <span>☀️</span>
                <span className="text-crd-lightGray">Warm lighting</span>
              </div>
              <div className="flex items-center gap-1">
                <span>❄️</span>
                <span className="text-crd-lightGray">Snow overlay</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⛈️</span>
                <span className="text-crd-lightGray">Lightning flashes</span>
              </div>
            </div>
          </div>
        )}

        {config.time_enabled && (
          <div className="mt-4 p-3 bg-crd-blue/10 border border-crd-blue/30 rounded-lg">
            <h4 className="text-crd-white text-sm font-medium mb-2">Time-Based Changes</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span>🌅</span>
                <span className="text-crd-lightGray">Dawn colors</span>
              </div>
              <div className="flex items-center gap-1">
                <span>☀️</span>
                <span className="text-crd-lightGray">Bright lighting</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🌆</span>
                <span className="text-crd-lightGray">Sunset hues</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🌙</span>
                <span className="text-crd-lightGray">Dark mode</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};