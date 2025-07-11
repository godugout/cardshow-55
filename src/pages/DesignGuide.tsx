import React from 'react';
import { ThemedPage } from '@/components/ui/design-system/ThemedLayout';

const DesignGuide = () => {
  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      {/* Top Navigation Header - accounts for fixed navbar */}
      <header className="bg-crd-dark border-b border-crd-mediumGray sticky top-16 z-40">
        <div className="max-w-sm mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-crd-white text-center">
            CRD Design Guide
          </h1>
        </div>
      </header>

      {/* Mobile-first Layout Wrapper */}
      <div className="max-w-sm mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Colors Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Brand Colors</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-blue rounded"></div>
                <span className="text-crd-white text-sm">Primary Blue (#3772FF)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-lightBlue rounded"></div>
                <span className="text-crd-white text-sm">Light Blue (#2D9CDB)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-orange rounded"></div>
                <span className="text-crd-white text-sm">Orange (#F97316)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-green rounded"></div>
                <span className="text-crd-white text-sm">Success Green (#45B26B)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-purple rounded"></div>
                <span className="text-crd-white text-sm">Purple (#9757D7)</span>
              </div>
            </div>
          </section>

          {/* Background Colors */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Background Colors</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-darkest border border-crd-mediumGray rounded"></div>
                <span className="text-crd-white text-sm">Primary (#141416)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-dark rounded"></div>
                <span className="text-crd-white text-sm">Secondary (#1A1D24)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-crd-darkGray rounded"></div>
                <span className="text-crd-white text-sm">Tertiary (#23262F)</span>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Typography</h2>
            
            <div className="space-y-3">
              <div className="text-3xl font-black text-crd-white">Hero Text (3xl/black)</div>
              <div className="text-2xl font-bold text-crd-white">Section Heading (2xl/bold)</div>
              <div className="text-xl font-semibold text-crd-white">Component Heading (xl/semibold)</div>
              <div className="text-base font-normal text-crd-white">Body Text (base/normal)</div>
              <div className="text-sm font-medium text-crd-lightGray">Small Text (sm/medium)</div>
              <div className="text-xs font-normal text-crd-lightGray">Caption (xs/normal)</div>
            </div>
          </section>

          {/* Buttons */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Buttons</h2>
            
            <div className="space-y-3">
              <button className="w-full bg-crd-lightBlue hover:bg-crd-lightBlue/90 text-crd-white text-lg font-extrabold px-8 py-4 rounded-full transition-colors duration-200">
                Primary Button
              </button>
              <button className="w-full border border-crd-mediumGray text-crd-white text-lg font-extrabold px-8 py-4 rounded-full hover:bg-crd-mediumGray/50 transition-colors duration-200">
                Secondary Button
              </button>
              <button className="w-full bg-crd-orange hover:bg-crd-orange/90 text-crd-white text-lg font-extrabold px-8 py-4 rounded-full transition-colors duration-200">
                Orange Button
              </button>
            </div>
          </section>

          {/* Cards */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Cards</h2>
            
            <div className="space-y-4">
              <div className="bg-crd-dark rounded-2xl p-6 hover:bg-crd-darkGray transition-all duration-300 hover:shadow-2xl hover:shadow-crd-blue/5 hover:scale-[1.02]">
                <h3 className="text-lg font-semibold text-crd-white mb-2">Standard Card</h3>
                <p className="text-sm text-crd-lightGray">This is a standard card component with hover effects.</p>
              </div>
              
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-semibold text-crd-white mb-2">Glass Card</h3>
                <p className="text-sm text-crd-lightGray">This is a glass morphism card with blur effects.</p>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Badges</h2>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-gradient-to-r from-crd-green to-crd-green text-white text-xs font-bold uppercase px-3 py-2 rounded-lg">
                Success
              </span>
              <span className="bg-crd-orange text-white text-xs font-bold uppercase px-3 py-2 rounded-lg">
                Warning
              </span>
              <span className="bg-crd-blue text-white text-xs font-bold uppercase px-3 py-2 rounded-lg">
                Info
              </span>
              <span className="bg-crd-purple text-white text-xs font-bold uppercase px-3 py-2 rounded-lg">
                Premium
              </span>
            </div>
          </section>

          {/* Spacing Examples */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Spacing</h2>
            
            <div className="space-y-2">
              <div className="bg-crd-mediumGray/20 p-2 rounded text-xs text-crd-lightGray">2 (8px padding)</div>
              <div className="bg-crd-mediumGray/20 p-4 rounded text-xs text-crd-lightGray">4 (16px padding)</div>
              <div className="bg-crd-mediumGray/20 p-6 rounded text-xs text-crd-lightGray">6 (24px padding)</div>
              <div className="bg-crd-mediumGray/20 p-8 rounded text-xs text-crd-lightGray">8 (32px padding)</div>
            </div>
          </section>

          {/* Border Radius */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-crd-white">Border Radius</h2>
            
            <div className="space-y-3">
              <div className="bg-crd-dark p-4 rounded text-sm text-crd-white">Default (4px)</div>
              <div className="bg-crd-dark p-4 rounded-lg text-sm text-crd-white">Large (8px)</div>
              <div className="bg-crd-dark p-4 rounded-xl text-sm text-crd-white">XL (12px)</div>
              <div className="bg-crd-dark p-4 rounded-2xl text-sm text-crd-white">2XL (16px)</div>
              <div className="bg-crd-dark p-4 rounded-full text-sm text-crd-white text-center">Full (pill)</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DesignGuide;