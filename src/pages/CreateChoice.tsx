import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton, Typography } from '@/components/ui/design-system';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';

export const CreateChoice: React.FC = () => {
  const { isMobile } = useResponsiveLayout();
  
  return (
    <NavbarAwareContainer className="h-screen bg-crd-darkest overflow-hidden">
      <div className={`h-full max-w-6xl mx-auto ${isMobile ? 'px-5 py-8' : 'px-8 py-16'} overflow-y-auto`}>
        {/* Header */}
        <div className="text-center mb-16">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-4 text-crd-lightGray"
          >
            CHOOSE YOUR CREATION MODE
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mb-6 max-md:text-3xl"
          >
            What type of card do you want to create?
          </Typography>
          <Typography 
            variant="body" 
            className="text-crd-lightGray text-lg max-w-3xl mx-auto"
          >
            Choose between traditional CRD cards optimized for collecting and trading, or interactive story cards with advanced animations and scripting.
          </Typography>
        </div>

        {/* Creation Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* CRD Cards */}
          <div className="bg-gradient-to-br from-crd-blue/20 to-crd-blue/10 border border-crd-blue/30 rounded-2xl p-8 hover:border-crd-blue/50 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crd-blue/20 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-crd-blue" />
              </div>
              <div>
                <Typography variant="h2" className="text-crd-white text-xl font-bold">
                  CRDMKR Cards
                </Typography>
                <Typography variant="body" className="text-crd-lightGray text-sm">
                  Traditional Trading Cards
                </Typography>
              </div>
            </div>
            
            <Typography variant="body" className="text-crd-lightGray mb-6 leading-relaxed">
              Professional card creation optimized for collecting, trading, and printing. Perfect for sports cards, gaming cards, and traditional collectibles.
            </Typography>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-blue rounded-full"></div>
                Print-ready high resolution output
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-blue rounded-full"></div>
                Professional templates and layouts
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-blue rounded-full"></div>
                CRDMKR standard compliance built-in
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-blue rounded-full"></div>
                Optimized for physical production
              </div>
            </div>
            
            <Link to="/create/crd" className="block">
              <CRDButton 
                variant="primary" 
                className="w-full bg-crd-blue hover:bg-crd-blue/80 text-white group-hover:scale-105 transition-transform"
              >
                Create CRDMKR Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </Link>
          </div>

          {/* Story Cards */}
          <div className="bg-gradient-to-br from-crd-green/20 to-crd-green/10 border border-crd-green/30 rounded-2xl p-8 hover:border-crd-green/50 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crd-green/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-crd-green" />
              </div>
              <div>
                <Typography variant="h2" className="text-crd-white text-xl font-bold">
                  Story Cards
                </Typography>
                <Typography variant="body" className="text-crd-lightGray text-sm">
                  Interactive & Animated
                </Typography>
              </div>
            </div>
            
            <Typography variant="body" className="text-crd-lightGray mb-6 leading-relaxed">
              Advanced interactive cards with animations, scripting, and dynamic behaviors. Perfect for storytelling, gaming, and digital art experiences.
            </Typography>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-green rounded-full"></div>
                Advanced animation & particle systems
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-green rounded-full"></div>
                Visual programming & scripting
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-green rounded-full"></div>
                Interactive behaviors & states
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-green rounded-full"></div>
                Environmental & biometric triggers
              </div>
            </div>
            
            <Link to="/create/story" className="block">
              <CRDButton 
                variant="secondary" 
                className="w-full border-crd-green/30 text-crd-green hover:bg-crd-green/10 group-hover:scale-105 transition-transform"
              >
                Create Story Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Typography variant="body" className="text-crd-lightGray text-sm">
            Not sure which to choose? Start with CRDMKR cards for traditional collecting, or Story cards for interactive experiences.
          </Typography>
        </div>
      </div>
    </NavbarAwareContainer>
  );
};