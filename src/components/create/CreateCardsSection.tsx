import React from 'react';

export const CreateCardsSection: React.FC = () => {
  return (
    <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 min-h-screen bg-crd-darkest">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          What do you feel like creating today?
        </h2>
        
        <p className="text-lg md:text-xl text-crd-lightGray max-w-2xl mx-auto leading-relaxed text-center mb-12">
          Transform your ideas into interactive 3D collectibles.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* CRD Collectibles Card */}
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 hover:border-[#00C851] transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-4 text-white">CRD Collectibles</h3>
            <p className="text-gray-400 mb-4">
              Create premium digital trading cards with advanced 3D effects, holographic finishes, and interactive elements that collectors will treasure.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Professional • Interactive • Collectible</span>
            </div>
          </div>
          
          {/* STRY Capsules Card */}
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 hover:border-[#00C851] transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-4 text-white">STRY Capsules</h3>
            <p className="text-gray-400 mb-4">
              Design immersive story cards that reveal narratives through layers, animations, and interactive discoveries. Perfect for digital storytelling.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Narrative • Immersive • Interactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};