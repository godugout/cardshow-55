
import React, { useState, useRef } from 'react';
import { Camera, Upload, Palette, Type, Sparkles, Undo2, Redo2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  name: string;
  category: 'sports' | 'fantasy' | 'gaming' | 'custom';
  thumbnail: string;
  preview: string;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'image' | 'text' | 'effects' | 'actions';
}

const templates: Template[] = [
  { id: '1', name: 'Classic Sports', category: 'sports', thumbnail: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png', preview: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png' },
  { id: '2', name: 'Fantasy Warrior', category: 'fantasy', thumbnail: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png', preview: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png' },
  { id: '3', name: 'Gaming Hero', category: 'gaming', thumbnail: '/lovable-uploads/2406a214-0403-4ff0-af81-3aae1a790c62.png', preview: '/lovable-uploads/2406a214-0403-4ff0-af81-3aae1a790c62.png' },
];

const tools: Tool[] = [
  { id: 'camera', name: 'Camera', icon: Camera, category: 'image' },
  { id: 'upload', name: 'Upload', icon: Upload, category: 'image' },
  { id: 'text', name: 'Text', icon: Type, category: 'text' },
  { id: 'colors', name: 'Colors', icon: Palette, category: 'effects' },
  { id: 'effects', name: 'Effects', icon: Sparkles, category: 'effects' },
  { id: 'undo', name: 'Undo', icon: Undo2, category: 'actions' },
  { id: 'redo', name: 'Redo', icon: Redo2, category: 'actions' },
  { id: 'save', name: 'Save', icon: Save, category: 'actions' },
];

export const MobileCreationStudio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('sports');
  const [activeTool, setActiveTool] = useState<string>('camera');
  const [toolPaletteVisible, setToolPaletteVisible] = useState(true);
  const [toolPalettePosition, setToolPalettePosition] = useState({ x: 20, y: 100 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['sports', 'fantasy', 'gaming', 'custom'];
  const filteredTemplates = templates.filter(t => t.category === activeCategory);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  };

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    
    // Handle specific tool actions
    switch (toolId) {
      case 'camera':
        handleCameraCapture();
        break;
      case 'upload':
        fileInputRef.current?.click();
        break;
      case 'save':
        handleSave();
        break;
      default:
        break;
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([15]);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element for camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // This would typically open a camera overlay
      console.log('Camera stream ready');
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `card-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Create Card</h1>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Template Categories */}
          <div className="flex space-x-1 bg-[#2d2d2d] rounded-lg p-1 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors touch-target ${
                  activeCategory === category 
                    ? 'bg-[#00C851] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group relative bg-[#2d2d2d] rounded-lg overflow-hidden hover:bg-[#3d3d3d] transition-all duration-300 touch-target"
              >
                <div className="aspect-[2.5/3.5] overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-white font-medium text-sm">{template.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={420}
            className="bg-[#2d2d2d] rounded-lg border-2 border-gray-600"
            style={{
              backgroundImage: `url(${selectedTemplate.preview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </div>

      {/* Floating Tool Palette */}
      {toolPaletteVisible && (
        <div
          className="fixed bg-[#2d2d2d] rounded-2xl p-3 shadow-2xl border border-gray-600 z-50"
          style={{
            left: `${toolPalettePosition.x}px`,
            top: `${toolPalettePosition.y}px`,
          }}
        >
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
              categoryTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    className={`p-3 rounded-lg transition-all duration-200 touch-target ${
                      activeTool === tool.id
                        ? 'bg-[#00C851] text-black'
                        : 'bg-[#3d3d3d] text-white hover:bg-[#4d4d4d]'
                    }`}
                    title={tool.name}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })
            ))}
          </div>

          {/* Palette Controls */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
            <button
              onClick={() => setToolPaletteVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-4 h-4 bg-[#00C851] rounded-full opacity-50" />
          </div>
        </div>
      )}

      {/* Show Palette Button */}
      {!toolPaletteVisible && (
        <button
          onClick={() => setToolPaletteVisible(true)}
          className="fixed bottom-24 right-4 bg-[#00C851] text-black p-4 rounded-full shadow-lg z-50 touch-target"
        >
          <Palette className="w-6 h-6" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2d2d2d] border-t border-gray-600 p-4 pb-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setSelectedTemplate(null)}
            className="text-gray-400 hover:text-white"
          >
            Back to Templates
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#00C851] text-black hover:bg-[#00C851]/90"
            >
              Save Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
