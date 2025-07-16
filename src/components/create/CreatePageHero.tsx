
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { PixelDigital } from '@/components/ui/PixelDigital';
import { FloatingCard3D } from '@/components/ui/FloatingCard3D';

const AnimatedTagline: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <p className="font-caveat text-6xl md:text-8xl italic text-center text-crd-orange animate-fade-in">
        "No glue needed."
      </p>
    </div>
  );
};

export const CreatePageHero: React.FC = () => {
  return (
    <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden">
      {/* Space background with gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-900/30 via-blue-900/20 to-black"></div>
      
      {/* Animated stars throughout the background */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const opacity = Math.random() * 0.8 + 0.2;
          const animationDelay = Math.random() * 3;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-green/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
                   <PixelDigital className="inline">digital</PixelDigital>
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
          
          {/* 3D Trading Card */}
          <div className="mt-16 mb-32">
            <FloatingCard3D />
          </div>
        </div>
      </div>
      
      {/* Cards Section - Below the fold */}
      <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 min-h-screen">
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
