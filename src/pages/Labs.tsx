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
  const [activePads, setActivePads] = useState<number[]>([]);
  const [animationSync, setAnimationSync] = useState(false);

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

      {/* Main Content Area */}
      <div className="flex flex-col h-screen">
        {/* Enhanced Controls Panel - Compact */}
        <div className="px-4 py-4">
          <Card className="bg-crd-dark/50 border-crd-mediumGray/20">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-crd-lightGray whitespace-nowrap">
                    {currentVariation.name}
                  </label>
                  <Slider
                    value={selectedVariation}
                    onValueChange={setSelectedVariation}
                    max={8}
                    min={0}
                    step={1}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-crd-lightGray whitespace-nowrap">Zoom</label>
                  <Slider
                    value={cameraZoom}
                    onValueChange={setCameraZoom}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-20"
                  />
                </div>
                
                <Button
                  onClick={() => setShowSandwichEffect(!showSandwichEffect)}
                  variant={showSandwichEffect ? "default" : "outline"}
                  size="sm"
                >
                  {showSandwichEffect ? 'Hide' : 'Show'} Effects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive 3D Canvas - Full Width & Height */}
        <div 
          className="relative flex-1 w-full bg-gradient-to-r from-crd-dark/30 to-crd-darkest/30 border-t border-crd-mediumGray/20 overflow-hidden cursor-grab"
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
              transform: `rotateX(${cameraRotation.x}deg) rotateY(${cameraRotation.y}deg)`
            }}
          >
            {sandwichVariations.map((variation, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const xOffset = (col - 1) * 400;
              const yOffset = (row - 1) * 300;
              const isSelected = selectedVariation[0] === index;
              const isActive = activePads.includes(index);
              
              // Unique effects for each card
              const getCardEffects = (cardIndex: number) => {
                const effects = [
                  { filter: 'hue-rotate(0deg) saturate(1.2)', animation: 'none' },
                  { filter: 'hue-rotate(45deg) saturate(1.5) brightness(1.1)', animation: 'pulse 2s infinite' },
                  { filter: 'hue-rotate(90deg) contrast(1.3)', animation: 'none' },
                  { filter: 'hue-rotate(135deg) saturate(1.8) brightness(0.9)', animation: 'none' },
                  { filter: 'hue-rotate(180deg) invert(0.1)', animation: 'pulse 3s infinite' },
                  { filter: 'hue-rotate(225deg) sepia(0.3)', animation: 'none' },
                  { filter: 'hue-rotate(270deg) saturate(2) brightness(1.2)', animation: 'pulse 1.5s infinite' },
                  { filter: 'hue-rotate(315deg) contrast(1.5)', animation: 'none' },
                  { filter: 'hue-rotate(360deg) saturate(1.3) brightness(1.1)', animation: 'pulse 2.5s infinite' }
                ];
                return effects[cardIndex];
              };
              
              const cardEffect = getCardEffects(index);
              
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ${isSelected || isActive ? 'z-20 shadow-2xl' : 'z-10'}`}
                  style={{
                    transform: `
                      translate3d(${xOffset}px, ${yOffset}px, ${isSelected ? 50 : isActive ? 30 : 0}px)
                      scale(${isSelected ? 1.2 : isActive ? 1.1 : 0.8})
                    `,
                    transformStyle: 'preserve-3d',
                    filter: isActive ? cardEffect.filter : 'none',
                    animation: isActive ? cardEffect.animation : 'none'
                  }}
                  onClick={() => setSelectedVariation([index])}
                >
                  {/* Left Card */}
                  <div 
                    className="absolute w-32 h-48 rounded-lg shadow-xl transform-gpu transition-all duration-700 overflow-hidden"
                    style={{
                      transform: `translateX(-${variation.spacing / 3}px) translateZ(15px) rotateY(90deg)`,
                      filter: isSelected ? 'brightness(1.1)' : 'brightness(0.9)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Front Face */}
                    <div 
                      className="absolute inset-0 backface-hidden"
                      style={{
                        background: `linear-gradient(135deg, 
                          hsl(${index * 40}, 70%, 50%) 0%, 
                          hsl(${index * 40 + 60}, 80%, 60%) 100%)`,
                        backgroundImage: `
                          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
                          linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
                        `
                      }}
                    >
                      <div className="p-2 h-full flex flex-col justify-between text-white">
                        <div>
                          <h4 className="font-bold text-xs mb-1">{variation.name}</h4>
                          <div className="text-xs opacity-80">Card #{index + 1}</div>
                        </div>
                        <div className="text-xs opacity-60">CRD Labs</div>
                      </div>
                    </div>
                    
                    {/* Back Face */}
                    <div 
                      className="absolute inset-0 backface-hidden flex items-center justify-center"
                      style={{
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
                      }}
                    >
                      <img 
                        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
                        alt="CRD Logo" 
                        className="w-16 h-auto opacity-80"
                        style={{ filter: 'brightness(1.2)' }}
                      />
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
                    className="absolute w-32 h-48 rounded-lg shadow-xl transform-gpu transition-all duration-700 overflow-hidden"
                    style={{
                      transform: `translateX(${variation.spacing / 3}px) translateZ(15px) rotateY(-90deg)`,
                      filter: isSelected ? 'brightness(1.1)' : 'brightness(0.9)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Front Face */}
                    <div 
                      className="absolute inset-0 backface-hidden"
                      style={{
                        background: `linear-gradient(135deg, 
                          hsl(${(index + 5) * 40}, 65%, 45%) 0%, 
                          hsl(${(index + 5) * 40 + 80}, 75%, 55%) 100%)`,
                        backgroundImage: `
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 60%),
                          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 40%),
                          linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)
                        `
                      }}
                    >
                      <div className="p-2 h-full flex flex-col justify-between text-white">
                        <div>
                          <h4 className="font-bold text-xs mb-1">{variation.name}</h4>
                          <div className="text-xs opacity-80">Card #{index + 1}B</div>
                        </div>
                        <div className="text-xs opacity-60">CRD Labs</div>
                      </div>
                    </div>
                    
                    {/* Back Face */}
                    <div 
                      className="absolute inset-0 backface-hidden flex items-center justify-center"
                      style={{
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
                      }}
                    >
                      <img 
                        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
                        alt="CRD Logo" 
                        className="w-16 h-auto opacity-80"
                        style={{ filter: 'brightness(1.2)' }}
                      />
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

        {/* Drum Pad Controller - Bottom Fixed */}
        <div className="px-4 py-2 bg-crd-darkest/95 backdrop-blur-sm border-t border-crd-mediumGray/20">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-2">
              {sandwichVariations.slice(0, 3).map((variation, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActivePads(prev => 
                      prev.includes(index) 
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                    );
                  }}
                  className={`
                    relative aspect-square rounded-lg border-2 transition-all duration-300 
                    flex flex-col items-center justify-center p-2 text-xs font-medium
                    ${activePads.includes(index) 
                      ? 'border-crd-green bg-crd-green/20 text-crd-green shadow-lg' 
                      : 'border-crd-mediumGray/40 bg-crd-darkest/60 text-crd-lightGray hover:border-crd-green/50'
                    }
                  `}
                  style={{
                    boxShadow: activePads.includes(index) 
                      ? `0 0 15px hsl(var(--crd-green) / 0.3)` 
                      : 'none'
                  }}
                >
                  <div className={`text-sm mb-1 ${activePads.includes(index) ? 'animate-pulse' : ''}`}>
                    {index + 1}
                  </div>
                  <div className="text-center leading-tight text-xs">
                    {variation.name}
                  </div>
                  {activePads.includes(index) && (
                    <div className="absolute inset-0 rounded-lg bg-crd-green/10 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2 justify-center">
              <Button
                onClick={() => setActivePads([])}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1"
              >
                Clear
              </Button>
              <Button
                onClick={() => setActivePads([0, 1, 2, 3, 4, 5, 6, 7, 8])}
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1"
              >
                All
              </Button>
              <Button
                onClick={() => setAnimationSync(!animationSync)}
                variant={animationSync ? "default" : "outline"}
                size="sm"
                className="text-xs px-2 py-1"
              >
                Sync: {animationSync ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labs;