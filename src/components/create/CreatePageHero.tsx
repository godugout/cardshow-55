
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';

// Supporting Components
const Hero3DText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative perspective-1000 transform-style-preserve-3d">
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const BuildingBlocksAnimation: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mt-12 opacity-0 animate-fade-in mx-auto" 
         style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
      {/* Base Layer */}
      <div className="absolute inset-0 transform animate-float">
        <div className="w-full h-full bg-gradient-to-br from-crd-darker to-crd-dark rounded-lg shadow-2xl" 
             style={{ transform: 'rotateX(15deg) rotateY(15deg)' }} />
      </div>
      
      {/* Image Layer */}
      <div className="absolute inset-4 transform animate-float" 
           style={{ transform: 'rotateX(15deg) rotateY(15deg) translateZ(20px)', animationDelay: '0.2s' }}>
        <div className="w-full h-full bg-gradient-to-br from-crd-purple to-crd-blue rounded-lg opacity-80" />
      </div>
      
      {/* Effects Layer */}
      <div className="absolute inset-8 transform animate-float" 
           style={{ transform: 'rotateX(15deg) rotateY(15deg) translateZ(40px)', animationDelay: '0.4s' }}>
        <div className="w-full h-full bg-gradient-to-br from-crd-green to-crd-blue rounded-lg opacity-60 blur-sm" />
      </div>
      
      {/* Final Card Preview */}
      <div className="absolute inset-12 transform animate-pulse" 
           style={{ transform: 'rotateX(15deg) rotateY(15deg) translateZ(60px)' }}>
        <div className="w-full h-full rounded-lg shadow-lg flex items-center justify-center bg-crd-dark border border-crd-green/30">
          <span className="text-2xl animate-pulse">✨</span>
        </div>
      </div>
    </div>
  );
};

const CraftingStep: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <div className="crafting-step p-6 rounded-lg opacity-0 animate-fade-in hover:scale-105 transition-all duration-300" 
         style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-crd-white mb-2">{title}</h3>
      <p className="text-crd-lightGray">{description}</p>
    </div>
  );
};

const craftingSteps = [
  {
    icon: '🎨',
    title: 'Design',
    description: 'Start with templates or upload your art'
  },
  {
    icon: '📐',
    title: 'Layer',
    description: 'Stack elements in 3D space'
  },
  {
    icon: '✨',
    title: 'Enhance',
    description: 'Add effects that bring depth to life'
  },
  {
    icon: '🎯',
    title: 'Perfect',
    description: 'Fine-tune every dimension'
  }
];

export const CreatePageHero: React.FC = () => {
  // Create 3D layered heading
  const enhanced3DHeading = (
    <div className="mb-4 leading-tight text-crd-white drop-shadow-lg text-5xl md:text-6xl lg:text-7xl">
      <Hero3DText>
        <span 
          className="block text-crd-mediumGray text-5xl md:text-7xl opacity-80" 
          style={{ transform: 'translateZ(-40px)' }}
        >
          Build in layers
        </span>
        <span 
          className="block text-crd-green text-6xl md:text-8xl font-black animate-pulse" 
          style={{ transform: 'translateZ(0px)' }}
        >
          craft in 3D
        </span>
        <span 
          className="block text-crd-white text-5xl md:text-7xl" 
          style={{ 
            transform: 'translateZ(40px)',
            textShadow: '0 0 20px rgba(0, 200, 81, 0.4)'
          }}
        >
          create legends
        </span>
      </Hero3DText>
    </div>
  );

  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title="Build in layers, craft in 3D, create legends"
      titleEffects={enhanced3DHeading}
      tagline="Stack. Shape. Sculpt. Watch your cards come alive."
      description="Professional tools meet digital craftsmanship. Experience the freedom of digital crafting where every cut, layer, and blend creates immersive cards that viewers can explore from every angle."
      primaryCta={{
        text: "Start Crafting",
        link: "/create/new",
        variant: "create"
      }}
      secondaryCta={{
        text: "Explore Templates",
        link: "/templates"
      }}
      showDecorations={true}
      fullWidth={true}
      heroVariant="hero"
    >
      {/* Visual Building Blocks Animation */}
      <BuildingBlocksAnimation />
      
      {/* Crafting Process Section */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-crd-white">
          Your digital workshop awaits
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {craftingSteps.map((step, index) => (
            <CraftingStep key={index} {...step} delay={index * 0.2 + 3} />
          ))}
        </div>
      </section>
    </StandardHero>
  );
};
