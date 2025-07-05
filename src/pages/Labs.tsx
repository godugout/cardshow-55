import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Labs = () => {
  const [cardSpacing, setCardSpacing] = useState([150]);
  const [effectIntensity, setEffectIntensity] = useState([50]);
  const [showSandwichEffect, setShowSandwichEffect] = useState(true);
  const [cameraRotation, setCameraRotation] = useState({ x: 15, y: 25 });
  const [cameraZoom, setCameraZoom] = useState([1]);
  const [selectedVariation, setSelectedVariation] = useState([0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // 9 different sandwich variations
  const sandwichVariations = [
    { name: "Classic", spacing: 150, intensity: 50, color: "emerald", glowSize: 80 },
    { name: "Tight", spacing: 80, intensity: 70, color: "blue", glowSize: 60 },
    { name: "Wide", spacing: 220, intensity: 40, color: "purple", glowSize: 100 },
    { name: "Intense", spacing: 120, intensity: 90, color: "red", glowSize: 90 },
    { name: "Subtle", spacing: 180, intensity: 25, color: "cyan", glowSize: 70 },
    { name: "Compact", spacing: 60, intensity: 80, color: "orange", glowSize: 50 },
    { name: "Expanded", spacing: 280, intensity: 35, color: "pink", glowSize: 120 },
    { name: "Balanced", spacing: 140, intensity: 60, color: "yellow", glowSize: 85 },
    { name: "Dynamic", spacing: 100, intensity: 75, color: "indigo", glowSize: 95 }
  ];

  const currentVariation = sandwichVariations[selectedVariation[0]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darkest/80 backdrop-blur-sm border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-crd-lightGray mb-2">🧪 CRD Labs</h1>
          <p className="text-crd-mediumGray">Experimental 3D card effects and immersive experiences</p>
        </div>
      </div>

      {/* Enhanced Controls Panel */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-crd-dark/50 border-crd-mediumGray/20 mb-8">
          <CardHeader>
            <CardTitle className="text-crd-lightGray">Interactive 3D Sandwich Lab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Variation Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-crd-lightGray">Sandwich Variation ({currentVariation.name})</label>
              <Slider
                value={selectedVariation}
                onValueChange={setSelectedVariation}
                max={8}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {sandwichVariations.map((variation, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedVariation([index])}
                    variant={selectedVariation[0] === index ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    {variation.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-crd-lightGray">Camera Zoom</label>
                <Slider
                  value={cameraZoom}
                  onValueChange={setCameraZoom}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-crd-mediumGray">{cameraZoom[0].toFixed(1)}x</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-crd-lightGray">Card Spacing</label>
                <Slider
                  value={[currentVariation.spacing]}
                  onValueChange={(value) => {
                    const newVariations = [...sandwichVariations];
                    newVariations[selectedVariation[0]].spacing = value[0];
                  }}
                  max={300}
                  min={30}
                  step={10}
                  className="w-full"
                />
                <span className="text-xs text-crd-mediumGray">{currentVariation.spacing}px</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-crd-lightGray">Glow Intensity</label>
                <Slider
                  value={[currentVariation.intensity]}
                  onValueChange={(value) => {
                    const newVariations = [...sandwichVariations];
                    newVariations[selectedVariation[0]].intensity = value[0];
                  }}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-crd-mediumGray">{currentVariation.intensity}%</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowSandwichEffect(!showSandwichEffect)}
                  variant={showSandwichEffect ? "default" : "outline"}
                  className="w-full"
                >
                  {showSandwichEffect ? 'Hide' : 'Show'} Effects
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive 3D Canvas */}
        <div 
          className="relative w-full h-[800px] bg-gradient-to-r from-crd-dark/30 to-crd-darkest/30 rounded-lg border border-crd-mediumGray/20 overflow-hidden cursor-grab"
          onMouseDown={(e) => {
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const deltaX = e.clientX - lastMousePos.x;
              const deltaY = e.clientY - lastMousePos.y;
              setCameraRotation(prev => ({
                x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
                y: prev.y + deltaX * 0.5
              }));
              setLastMousePos({ x: e.clientX, y: e.clientY });
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onWheel={(e) => {
            e.preventDefault();
            setCameraZoom(prev => [Math.max(0.3, Math.min(3, prev[0] + (e.deltaY > 0 ? -0.1 : 0.1)))]);
          }}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* 3D Environment Background */}
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
                linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)
              `,
              transform: `scale(${1 + cameraZoom[0] * 0.2}) rotateX(${cameraRotation.x * 0.1}deg) rotateY(${cameraRotation.y * 0.1}deg)`
            }}
          />

          {/* 9 Sandwich Variations Grid */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: `${1000 * cameraZoom[0]}px`,
              transformStyle: 'preserve-3d',
              transform: `rotateX(${cameraRotation.x}deg) rotateY(${cameraRotation.y}deg) scale(${cameraZoom[0]})`
            }}
          >
            {sandwichVariations.map((variation, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const xOffset = (col - 1) * 400;
              const yOffset = (row - 1) * 300;
              const isSelected = selectedVariation[0] === index;
              
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ${isSelected ? 'z-20 shadow-2xl' : 'z-10'}`}
                  style={{
                    transform: `
                      translate3d(${xOffset}px, ${yOffset}px, ${isSelected ? 50 : 0}px)
                      scale(${isSelected ? 1.2 : 0.8})
                    `,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={() => setSelectedVariation([index])}
                >
                  {/* Left Card */}
                  <div 
                    className="absolute w-32 h-48 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-xl transform-gpu transition-all duration-700"
                    style={{
                      transform: `translateX(-${variation.spacing / 3}px) translateZ(15px) rotateY(90deg)`,
                      filter: isSelected ? 'brightness(1.1)' : 'brightness(0.9)'
                    }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className={`w-full h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-2`}></div>
                      <h4 className="font-bold text-gray-800 text-xs mb-1">{variation.name} A</h4>
                      <p className="text-xs text-gray-600 flex-1">Sample card</p>
                    </div>
                  </div>

                  {/* 3D Glow Plane */}
                  {showSandwichEffect && (
                    <div 
                      className="absolute transform-gpu transition-all duration-700"
                      style={{
                        width: `${variation.glowSize}px`,
                        height: '200px',
                        transform: `translateX(-${variation.glowSize / 2}px) translateY(-100px) rotateY(0deg)`,
                        background: `linear-gradient(
                          to bottom,
                          transparent 0%,
                          hsl(var(--${variation.color}-500) / ${variation.intensity / 100 * 0.8}) 20%,
                          hsl(var(--${variation.color}-400) / ${variation.intensity / 100}) 50%,
                          hsl(var(--${variation.color}-500) / ${variation.intensity / 100 * 0.8}) 80%,
                          transparent 100%
                        )`,
                        boxShadow: `
                          0 0 ${variation.intensity / 2}px hsl(var(--${variation.color}-500) / ${variation.intensity / 100}),
                          0 0 ${variation.intensity}px hsl(var(--${variation.color}-400) / ${variation.intensity / 200}),
                          0 0 ${variation.intensity * 2}px hsl(var(--${variation.color}-300) / ${variation.intensity / 400})
                        `,
                        filter: `blur(${Math.max(1, 3 - variation.intensity / 30)}px)`,
                        transformStyle: 'preserve-3d'
                      }}
                    />
                  )}

                  {/* Right Card */}
                  <div 
                    className="absolute w-32 h-48 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-xl transform-gpu transition-all duration-700"
                    style={{
                      transform: `translateX(${variation.spacing / 3}px) translateZ(15px) rotateY(-90deg)`,
                      filter: isSelected ? 'brightness(1.1)' : 'brightness(0.9)'
                    }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className={`w-full h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded mb-2`}></div>
                      <h4 className="font-bold text-gray-800 text-xs mb-1">{variation.name} B</h4>
                      <p className="text-xs text-gray-600 flex-1">Sample card</p>
                    </div>
                  </div>

                  {/* Variation Label */}
                  <div 
                    className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 z-30"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      isSelected 
                        ? 'bg-crd-green text-crd-darkest shadow-lg' 
                        : 'bg-crd-darkest/80 text-crd-lightGray border border-crd-mediumGray/20'
                    }`}>
                      {variation.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Instructions */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-crd-darkest/90 backdrop-blur-sm rounded-lg p-4 border border-crd-mediumGray/20">
              <h4 className="text-crd-green font-semibold mb-2">🎮 Interactive 3D Sandwich Lab</h4>
              <p className="text-sm text-crd-mediumGray">
                <strong>Mouse:</strong> Drag to rotate • Scroll to zoom • Click variations to select
                <br />
                <strong>Variations:</strong> {sandwichVariations.length} different sandwich arrangements with unique glow effects
              </p>
            </div>
          </div>

          {/* Current Variation Info */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-crd-darkest/90 backdrop-blur-sm rounded-lg p-4 border border-crd-mediumGray/20">
              <h5 className="text-crd-green font-semibold mb-1">Selected: {currentVariation.name}</h5>
              <div className="text-xs text-crd-mediumGray space-y-1">
                <div>Spacing: {currentVariation.spacing}px</div>
                <div>Intensity: {currentVariation.intensity}%</div>
                <div>Glow: {currentVariation.color}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-crd-dark/30 border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-lightGray text-lg">🌟 Premium Visual Styles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-crd-mediumGray mb-4">
                20 proprietary photorealistic visual effects for CRD rendering.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark/30 border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-lightGray text-lg">🔄 360° Photography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-crd-mediumGray mb-4">
                Immersive 360-degree environments for card viewing.
              </p>
              <Button variant="outline" size="sm" disabled>
                In Development
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark/30 border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-lightGray text-lg">⚡ WebGL Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-crd-mediumGray mb-4">
                Real-time shader effects and particle systems.
              </p>
              <Button variant="outline" size="sm" disabled>
                Experimental
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Labs;