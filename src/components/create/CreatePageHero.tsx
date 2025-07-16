
import React, { useState, useEffect } from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';

const AnimatedTagline: React.FC = () => {
  const fonts = [
    'font-fredoka',
    'font-comic',
    'font-playful',
    'font-bouncy',
    'font-fun'
  ];
  
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFontIndex((prev) => (prev + 1) % fonts.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mt-8 text-center">
      <p className={`text-2xl md:text-3xl italic text-crd-orange transition-all duration-500 ${fonts[currentFontIndex]} animate-pulse`}>
        "No glue needed."
      </p>
    </div>
  );
};

export const CreatePageHero: React.FC = () => {
  return (
    <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-crd-darkest"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-green/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Sparkly Stars */}
      <div className="absolute top-20 left-10 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_6px_#fbbf24,0_0_12px_#fbbf24] animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#ffffff,0_0_16px_#ffffff] animate-pulse delay-500"></div>
      <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_10px_#fde047,0_0_20px_#fde047] animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff,0_0_12px_#ffffff] animate-pulse delay-300"></div>
      <div className="absolute bottom-20 left-1/5 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_#fbbf24,0_0_24px_#fbbf24] animate-pulse delay-700"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider text-sm uppercase">
            CUT, CRAFT & CREATE DIGITALLY
          </div>
          
          {/* Main Heading */}
          <div className="mb-4">
            <h1 className="leading-tight text-crd-white drop-shadow-lg text-5xl md:text-6xl lg:text-7xl">
              <div className="flex justify-center items-center mb-2">
                <span className="text-gray-400">From paper scraps and cardboard</span>
              </div>
              <div className="flex justify-center items-center">
                <span>
                  <span className="text-white">to </span>
                  <span className="text-[#00C851]">digital art</span>
                  <span className="text-white"> that comes alive!</span>
                </span>
              </div>
            </h1>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
