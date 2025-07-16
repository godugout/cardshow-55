
import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';

export const CreatePageHero: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <div className="container mx-auto px-5 md:px-10">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center max-w-[1200px] mx-auto">
          {/* Main Headlines */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <div className="text-gray-400 mb-2">From paper scraps and cardboard</div>
              <div>
                <span className="text-white">create </span>
                <span className="text-[#00C851]">digital art</span>
                <span className="text-white"> that comes alive!</span>
              </div>
            </h1>
          </div>
          
          {/* Subheadline */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xl text-gray-400">
              Transform your ideas into interactive 3D collectibles. No glue needed.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/create/new">
              <CRDButton 
                variant="primary" 
                size="lg"
                className="bg-[#00C851] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#00a844] transition-colors duration-300"
              >
                Start Creating
              </CRDButton>
            </Link>
            <Link to="/templates">
              <CRDButton 
                variant="outline" 
                size="lg"
                className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-lg hover:border-[#00C851] transition-colors duration-300"
              >
                Browse Templates
              </CRDButton>
            </Link>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What do you feel like creating today?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* CRD Collectibles Card */}
              <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 hover:border-[#00C851] transition-colors duration-300">
                <h3 className="text-xl font-semibold mb-4">CRD Collectibles</h3>
                <p className="text-gray-400 mb-4">
                  Create premium digital trading cards with advanced 3D effects, holographic finishes, and interactive elements that collectors will treasure.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Professional • Interactive • Collectible</span>
                </div>
              </div>
              
              {/* STRY Capsules Card */}
              <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 hover:border-[#00C851] transition-colors duration-300">
                <h3 className="text-xl font-semibold mb-4">STRY Capsules</h3>
                <p className="text-gray-400 mb-4">
                  Design immersive story cards that reveal narratives through layers, animations, and interactive discoveries. Perfect for digital storytelling.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Narrative • Immersive • Interactive</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
