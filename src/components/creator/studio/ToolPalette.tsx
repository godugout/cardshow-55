
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Hand, 
  Pencil, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Image, 
  Palette, 
  Layers,
  Move,
  RotateCw
} from 'lucide-react';
import type { DesignTool } from '@/types/creator';

interface ToolPaletteProps {
  activeTool: DesignTool | null;
  onToolSelect: (tool: DesignTool | null) => void;
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: (shapeType: 'rectangle' | 'circle') => void;
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  activeTool,
  onToolSelect,
  onAddText,
  onAddImage,
  onAddShape
}) => {
  const tools: DesignTool[] = [
    {
      id: 'select',
      name: 'Select',
      icon: 'MousePointer',
      category: 'selection',
      shortcut: 'V',
      properties: {}
    },
    {
      id: 'move',
      name: 'Move',
      icon: 'Move',
      category: 'selection',
      shortcut: 'M',
      properties: {}
    },
    {
      id: 'pan',
      name: 'Pan',
      icon: 'Hand',
      category: 'navigation',
      shortcut: 'Space',
      properties: {}
    },
    {
      id: 'pencil',
      name: 'Pencil',
      icon: 'Pencil',
      category: 'drawing',
      shortcut: 'P',
      properties: {
        brushSize: 5,
        opacity: 1,
        color: '#000000'
      }
    },
    {
      id: 'eraser',
      name: 'Eraser',
      icon: 'Eraser',
      category: 'drawing',
      shortcut: 'E',
      properties: {
        brushSize: 10
      }
    }
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      MousePointer,
      Move,
      Hand,
      Pencil,
      Eraser,
      Type,
      Square,
      Circle,
      Image,
      Palette,
      Layers,
      RotateCw
    };
    
    const IconComponent = icons[iconName] || MousePointer;
    return <IconComponent className="w-4 h-4" />;
  };

  const isToolActive = (toolId: string) => {
    return activeTool?.id === toolId;
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Selection and Navigation Tools */}
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={isToolActive(tool.id) ? 'default' : 'ghost'}
          size="sm"
          className={`w-12 h-12 p-0 ${
            isToolActive(tool.id) 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'text-white hover:bg-gray-700'
          }`}
          onClick={() => onToolSelect(tool)}
          title={`${tool.name} (${tool.shortcut})`}
        >
          {getIcon(tool.icon)}
        </Button>
      ))}

      {/* Separator */}
      <div className="w-8 h-px bg-gray-600 mx-auto my-2" />

      {/* Content Tools */}
      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 text-white hover:bg-gray-700"
        onClick={onAddText}
        title="Add Text (T)"
      >
        <Type className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 text-white hover:bg-gray-700"
        onClick={onAddImage}
        title="Add Image (I)"
      >
        <Image className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 text-white hover:bg-gray-700"
        onClick={() => onAddShape('rectangle')}
        title="Add Rectangle (R)"
      >
        <Square className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 text-white hover:bg-gray-700"
        onClick={() => onAddShape('circle')}
        title="Add Circle (C)"
      >
        <Circle className="w-4 h-4" />
      </Button>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-600 mx-auto my-2" />

      {/* Additional Tools */}
      <Button
        variant="ghost"
        size="sm"
        className="w-12 h-12 p-0 text-white hover:bg-gray-700"
        title="Color Picker"
      >
        <Palette className="w-4 h-4" />
      </Button>
    </div>
  );
};
