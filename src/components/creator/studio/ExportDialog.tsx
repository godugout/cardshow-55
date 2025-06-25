
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Settings } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'png' | 'jpg' | 'svg' | 'pdf', quality: number) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  onExport
}) => {
  const [format, setFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');
  const [quality, setQuality] = useState([100]);
  const [includeTransparency, setIncludeTransparency] = useState(true);
  const [resolution, setResolution] = useState('300');

  const handleExport = () => {
    onExport(format, quality[0] / 100);
    onOpenChange(false);
  };

  const formatOptions = [
    { value: 'png', label: 'PNG', description: 'Best for graphics with transparency' },
    { value: 'jpg', label: 'JPG', description: 'Smaller file size, no transparency' },
    { value: 'svg', label: 'SVG', description: 'Vector format, scalable' },
    { value: 'pdf', label: 'PDF', description: 'Print-ready format' }
  ];

  const resolutionOptions = [
    { value: '72', label: '72 DPI - Web' },
    { value: '150', label: '150 DPI - Medium' },
    { value: '300', label: '300 DPI - Print' },
    { value: '600', label: '600 DPI - High Quality' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format</Label>
            <div className="grid grid-cols-1 gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as any)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    format === option.value
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-300">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          {(format === 'jpg' || format === 'png') && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quality</Label>
              <div className="space-y-2">
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Lower file size</span>
                  <span>{quality[0]}%</span>
                  <span>Higher quality</span>
                </div>
              </div>
            </div>
          )}

          {/* Resolution Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {resolutionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="space-y-2">
              {format === 'png' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transparency"
                    checked={includeTransparency}
                    onCheckedChange={setIncludeTransparency}
                  />
                  <Label htmlFor="transparency" className="text-sm">
                    Include transparency
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* File Size Estimate */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Estimated file size:</span>
              <span className="text-gray-300">
                {format === 'svg' ? '< 100 KB' : `${Math.round(quality[0] / 10)} MB`}
              </span>
            </div>
          </div>

          {/* Export Button */}
          <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export {format.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
