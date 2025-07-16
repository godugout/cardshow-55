
import React, { useState, useEffect } from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';

const AnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="text-4xl md:text-6xl italic text-center text-crd-orange animate-fade-in font-caveat">
        "No glue needed."
      </p>
    </div>
  );
};

export const CreatePageHero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-crd-darkest overflow-hidden">
      {/* Dynamic decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-green/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-crd-orange/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute bottom-1/3 left-1/6 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
      
      {/* Floating glowing dots */}
      <div className="absolute top-16 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee,0_0_20px_#22d3ee] animate-[sparkle-float_4s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-[0_0_8px_#f472b6,0_0_16px_#f472b6] animate-[sparkle-float_3s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute bottom-1/2 left-1/4 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399,0_0_12px_#34d399] animate-[sparkle-float_5s_ease-in-out_infinite]"></div>
      
      {/* Star emojis with glow */}
      <div className="absolute top-20 left-10 text-yellow-400 text-lg animate-[twinkle_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
        ⭐
      </div>
      <div className="absolute top-32 right-20 text-white text-2xl animate-[twinkle_1.5s_ease-in-out_infinite_reverse] drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
        ⭐
      </div>
      <div className="absolute top-60 left-1/3 text-yellow-300 text-xl animate-[sparkle-float_3s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]">
        ✨
      </div>
      <div className="absolute bottom-40 right-10 text-purple-300 text-lg animate-[twinkle_2.5s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(196,181,253,0.8)]">
        ⭐
      </div>
      <div className="absolute bottom-20 left-1/5 text-cyan-300 text-xl animate-[sparkle-float_4s_ease-in-out_infinite_reverse] drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]">
        ✨
      </div>
      <div className="absolute top-3/4 right-1/4 text-pink-300 text-lg animate-[twinkle_1.8s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(249,168,212,0.8)]">
        ⭐
      </div>
      
      {/* Traditional sparkly dots */}
      <div className="absolute top-1/2 left-10 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_6px_#fbbf24,0_0_12px_#fbbf24] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa,0_0_16px_#60a5fa] animate-pulse delay-700"></div>
      <div className="absolute top-1/6 right-1/2 w-1 h-1 bg-green-400 rounded-full shadow-[0_0_6px_#4ade80,0_0_12px_#4ade80] animate-pulse delay-300"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center pb-4 pt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
            CUT, CRAFT & CREATE DIGITALLY
          </div>
          
          {/* Main Heading */}
          <div className="mb-4">
             <h1 className="leading-tight text-crd-white drop-shadow-lg">
               <div className="flex justify-center items-center mb-2 text-5xl md:text-6xl lg:text-7xl">
                 <span className="text-gray-400 font-light">From paper scraps and cardboard to</span>
               </div>
               <div className="flex justify-center items-center text-6xl md:text-7xl lg:text-8xl">
                 <span className="font-bold">
                   <PixelDigital className="inline" animationType="scanning">digital</PixelDigital>
                   <span className="text-white"> art that comes alive!</span>
                 </span>
               </div>
             </h1>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center my-12">
            <Link to="/create/new">
              <CRDButton 
                size="lg" 
                variant="primary"
                className="min-w-[200px]"
              >
                Start Creating
              </CRDButton>
            </Link>
            <Link to="/templates">
              <CRDButton 
                variant="outline" 
                size="lg" 
                className="min-w-[200px]"
              >
                Browse Templates
              </CRDButton>
            </Link>
          </div>
          
          {/* Animated Tagline */}
          <AnimatedTagline />
        </div>
      </div>
      
      {/* Cards Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            What do you feel like creating today?
          </h2>
          
          {/* Moved description */}
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
    </div>
  );
};
