
import React from 'react';
import { Sparkles, Wand2, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StudioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-crd-green mr-3" />
            <h1 className="text-2xl font-bold text-white">Studio</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Advanced Card Creation Studio
          </h2>
          <p className="text-xl text-crd-lightGray max-w-3xl mx-auto">
            Unlock professional-grade tools for creating stunning trading cards with advanced effects, 
            3D rendering, and AI-powered enhancements.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-crd-darker rounded-xl p-6 border border-crd-mediumGray/20">
            <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-crd-green" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Enhancement</h3>
            <p className="text-crd-lightGray">
              Automatically enhance your card images with AI-powered upscaling, background removal, and effect generation.
            </p>
          </div>

          <div className="bg-crd-darker rounded-xl p-6 border border-crd-mediumGray/20">
            <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-crd-green" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Effects</h3>
            <p className="text-crd-lightGray">
              Apply professional holographic, foil, and metallic effects with precise control over intensity and patterns.
            </p>
          </div>

          <div className="bg-crd-darker rounded-xl p-6 border border-crd-mediumGray/20">
            <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-crd-green" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">3D Customization</h3>
            <p className="text-crd-lightGray">
              Fine-tune 3D rendering settings, lighting, and environmental effects for the perfect card presentation.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-crd-green/20 to-crd-green/10 rounded-2xl p-8 border border-crd-green/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Create Professional Cards?
            </h3>
            <p className="text-crd-lightGray mb-6 max-w-2xl mx-auto">
              Access the full power of our creation tools and take your card designs to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Launch Advanced Editor
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-crd-green text-crd-green hover:bg-crd-green/10"
              >
                View Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
