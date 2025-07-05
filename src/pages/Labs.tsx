import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Labs = () => {
  const [cardSpacing, setCardSpacing] = useState([150]);
  const [effectIntensity, setEffectIntensity] = useState([50]);
  const [showSandwichEffect, setShowSandwichEffect] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darkest/80 backdrop-blur-sm border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-crd-lightGray mb-2">🧪 CRD Labs</h1>
          <p className="text-crd-mediumGray">Experimental 3D card effects and immersive experiences</p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-crd-dark/50 border-crd-mediumGray/20 mb-8">
          <CardHeader>
            <CardTitle className="text-crd-lightGray">Sandwich Effect Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-crd-lightGray">Card Spacing</label>
                <Slider
                  value={cardSpacing}
                  onValueChange={setCardSpacing}
                  max={300}
                  min={50}
                  step={10}
                  className="w-full"
                />
                <span className="text-xs text-crd-mediumGray">{cardSpacing[0]}px</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-crd-lightGray">Effect Intensity</label>
                <Slider
                  value={effectIntensity}
                  onValueChange={setEffectIntensity}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <span className="text-xs text-crd-mediumGray">{effectIntensity[0]}%</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowSandwichEffect(!showSandwichEffect)}
                  variant={showSandwichEffect ? "default" : "outline"}
                  className="w-full"
                >
                  {showSandwichEffect ? 'Hide' : 'Show'} Sandwich Effect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Area */}
        <div className="relative w-full h-[600px] bg-gradient-to-r from-crd-dark/30 to-crd-darkest/30 rounded-lg border border-crd-mediumGray/20 overflow-hidden">
          {/* Simulated 3D Environment */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-800/10 to-teal-900/20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
              `
            }}
          />

          {/* Card Demo Container */}
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {/* Left Card */}
            <div 
              className="absolute w-48 h-72 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-2xl transform-gpu transition-all duration-700"
              style={{
                transform: `translateX(-${cardSpacing[0] / 2}px) translateZ(20px) rotateY(5deg)`
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-4"></div>
                <h3 className="font-bold text-gray-800 mb-2">Demo Card A</h3>
                <p className="text-sm text-gray-600 flex-1">This is a sample card for testing the sandwich effect.</p>
                <div className="text-xs text-gray-500">★★★★☆</div>
              </div>
            </div>

            {/* Sandwich Effect Layer */}
            {showSandwichEffect && (
              <div 
                className="absolute w-2 h-80 transform-gpu transition-all duration-700"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    rgba(34, 197, 94, ${effectIntensity[0] / 100 * 0.8}) 20%,
                    rgba(16, 185, 129, ${effectIntensity[0] / 100}) 50%,
                    rgba(34, 197, 94, ${effectIntensity[0] / 100 * 0.8}) 80%,
                    transparent 100%
                  )`,
                  boxShadow: `
                    0 0 ${effectIntensity[0] / 2}px rgba(34, 197, 94, ${effectIntensity[0] / 100}),
                    0 0 ${effectIntensity[0]}px rgba(16, 185, 129, ${effectIntensity[0] / 200})
                  `,
                  filter: `blur(${2 - effectIntensity[0] / 50}px)`
                }}
              />
            )}

            {/* Right Card */}
            <div 
              className="absolute w-48 h-72 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-2xl transform-gpu transition-all duration-700"
              style={{
                transform: `translateX(${cardSpacing[0] / 2}px) translateZ(20px) rotateY(-5deg)`
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="w-full h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded mb-4"></div>
                <h3 className="font-bold text-gray-800 mb-2">Demo Card B</h3>
                <p className="text-sm text-gray-600 flex-1">Another sample card to demonstrate the effect.</p>
                <div className="text-xs text-gray-500">★★★★★</div>
              </div>
            </div>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-crd-darkest/80 backdrop-blur-sm rounded-lg p-4 border border-crd-mediumGray/20">
              <h4 className="text-crd-green font-semibold mb-2">🎯 Sandwich Effect Demo</h4>
              <p className="text-sm text-crd-mediumGray">
                Cards are positioned on the same center axis with interactive effects layered between them. 
                Adjust spacing and intensity to see how the effect changes.
              </p>
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