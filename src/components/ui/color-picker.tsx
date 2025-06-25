
import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#33FF00', '#00FFCC', '#0066FF',
    '#6600FF', '#FF00CC', '#FF3366', '#FF6633', '#FFFF33', '#66FF33',
    '#33FFFF', '#3366FF', '#6633FF', '#FF33CC'
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-1"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 w-full">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono">{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-4">
        <div className="space-y-4">
          {/* Color Input */}
          <div>
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 cursor-pointer"
            />
          </div>

          {/* Hex Input */}
          <div>
            <Input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="font-mono"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <p className="text-sm font-medium mb-2">Preset Colors</p>
            <div className="grid grid-cols-6 gap-1">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => onChange(presetColor)}
                  className={`w-8 h-8 rounded border-2 transition-colors ${
                    color === presetColor ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
