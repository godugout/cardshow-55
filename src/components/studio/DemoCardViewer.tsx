
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Simple360Environment } from '../viewer/spaces/environments/Simple360Environment';
import { PANORAMIC_360_ENVIRONMENTS } from '../viewer/spaces/environments/Panoramic360Library';
import { 
  X, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  MousePointer, 
  Settings,
  Palette,
  Sparkles,
  Camera
} from 'lucide-react';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';

interface DemoCardViewerProps {
  onClose: () => void;
}

export const DemoCardViewer: React.FC<DemoCardViewerProps> = ({ onClose }) => {
  const { cardData } = useSimpleCardEditor();
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState('modern-studio');
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  console.log('🎮 DemoCardViewer rendering with card:', cardData.title);

  // Sample card data for demo
  const demoCard = {
    ...cardData,
    id: 'demo-card',
    title: cardData.title || 'Cyber Knight Demo',
    description: cardData.description || 'An interactive 3D demo showcasing CSS-based 360° environments',
    image_url: cardData.image_url || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
    rarity: cardData.rarity || 'epic'
  };

  // Mouse tracking
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!viewerRef.current) return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  }, []);

  const resetView = () => {
    setZoom(1);
    setMousePosition({ x: 0.5, y: 0.5 });
    setAutoRotate(false);
  };

  const handleCardClick = () => {
    console.log('🎯 Demo card clicked!');
  };

  return (
    <div className="flex h-full bg-crd-dark">
      {/* Main Viewer Area */}
      <div className="flex-1 relative">
        <div 
          ref={viewerRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Simple360Environment
            card={demoCard}
            environmentId={selectedEnvironmentId}
            mousePosition={mousePosition}
            isHovering={isHovering}
            autoRotate={autoRotate}
            zoom={zoom}
            onCardClick={handleCardClick}
          />
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <h2 className="text-lg font-bold text-white mb-1">3D Card Viewer Demo</h2>
            <p className="text-sm text-gray-300">CSS-based 360° panoramic environments</p>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="bg-black/50 backdrop-blur-sm border-gray-600 hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
                className="bg-black/30 border-gray-600"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
              
              <div className="flex items-center space-x-2">
                <ZoomOut className="w-3 h-3 text-gray-400" />
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-20"
                />
                <ZoomIn className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center space-x-2 text-white text-sm">
              <MousePointer className="w-3 h-3" />
              <span>Mouse: {Math.round(mousePosition.x * 100)}%, {Math.round(mousePosition.y * 100)}%</span>
              {isHovering && <Badge variant="secondary" className="text-xs">Hovering</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-80 bg-crd-mediumGray border-l border-crd-lightGray p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Card Info */}
          <Card className="bg-crd-dark border-crd-lightGray">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Demo Card</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-crd-white font-medium">{demoCard.title}</h4>
                <Badge variant="secondary">{demoCard.rarity}</Badge>
                <p className="text-sm text-crd-lightGray">{demoCard.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Environment Selection */}
          <Card className="bg-crd-dark border-crd-lightGray">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span>Environment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {PANORAMIC_360_ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvironmentId(env.id)}
                    className={`p-2 rounded-lg text-left transition-colors ${
                      selectedEnvironmentId === env.id
                        ? 'bg-crd-blue text-white'
                        : 'bg-crd-lightGray/20 text-crd-lightGray hover:bg-crd-lightGray/30'
                    }`}
                  >
                    <div className="text-xs font-medium">{env.name}</div>
                    <div className="text-xs opacity-70">{env.category}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3D Controls */}
          <Card className="bg-crd-dark border-crd-lightGray">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center space-x-2">
                <Settings className="w-4 h-4 text-green-400" />
                <span>3D Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-crd-lightGray">Auto Rotate</span>
                <Switch
                  checked={autoRotate}
                  onCheckedChange={setAutoRotate}
                />
              </div>
              
              <div>
                <label className="text-sm text-crd-lightGray block mb-2">Zoom Level</label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-crd-lightGray mt-1">{Math.round(zoom * 100)}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <Card className="bg-crd-blue/20 border-crd-blue/40">
            <CardContent className="p-4">
              <div className="text-center text-crd-white">
                <Palette className="w-8 h-8 mx-auto mb-2 text-crd-blue" />
                <h3 className="font-semibold mb-1">CSS 3D Demo</h3>
                <p className="text-sm text-crd-lightGray">
                  This demo showcases our new CSS-based 360° panoramic background system 
                  with interactive 3D card rendering.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
