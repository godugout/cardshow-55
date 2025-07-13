
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton, Typography, Hero3 } from '@/components/ui/design-system';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { CRDEditorProvider, useCRDEditor } from '@/contexts/CRDEditorContext';
import { PreloadedCRDEditor } from '@/components/editor/crd/PreloadedCRDEditor';
import type { CardData } from '@/hooks/useCardEditor';

const CreateChoiceContent: React.FC = () => {
  const { isMobile } = useResponsiveLayout();
  const navigate = useNavigate();
  const { state } = useCRDEditor();
  const [showPreloadedEditor, setShowPreloadedEditor] = useState(false);

  const handleCRDComplete = (cardData: CardData) => {
    console.log('CRD Collectible created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCRDCancel = () => {
    console.log('CRD creation cancelled');
    setShowPreloadedEditor(false);
  };

  const handleCreateCRD = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.isPreloaded) {
      console.log('🚀 Using pre-loaded CRD editor - instant open!');
      setShowPreloadedEditor(true);
    } else {
      console.log('⏳ CRD editor not pre-loaded, falling back to navigation');
      navigate('/create/crd');
    }
  };
  
  return (
    <NavbarAwareContainer className="h-screen bg-crd-darkest overflow-hidden">
      <div className={`h-full max-w-7xl mx-auto ${isMobile ? 'px-5 py-8' : 'px-12 py-16'} overflow-y-auto`}>
        {/* Hero Section with Background Illustration */}
        <div className="relative mb-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center&auto=format"
              alt="Creative workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-crd-darkest/50 via-crd-darkest/30 to-crd-darkest/70"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10">
            <Hero3
              caption="CHOOSE YOUR CREATION MODE"
              heading="What type of card do you want to create?"
              bodyText="Choose between traditional CRD Collectibles optimized for collecting and trading, or interactive story cards with advanced animations and scripting."
              ctaText="Start Creating"
              ctaLink="/create/crd"
              className="!pt-0 !px-0"
            />
          </div>
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
                  CRD Collectibles
                </Typography>
                <Typography variant="body" className="text-crd-lightGray text-sm">
                  Digital Trading Cards
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
                CRD standard compliance built-in
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                <div className="w-1.5 h-1.5 bg-crd-blue rounded-full"></div>
                Optimized for physical production
              </div>
            </div>
            
            <div className="block">
              <CRDButton 
                variant="primary" 
                className="w-full bg-crd-blue hover:bg-crd-blue/80 text-white group-hover:scale-105 transition-transform"
                onClick={handleCreateCRD}
              >
                Create CRD Collectible
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </div>
          </div>

          {/* STRY Capsules */}
          <div className="bg-gradient-to-br from-crd-green/20 to-crd-green/10 border border-crd-green/30 rounded-2xl p-8 hover:border-crd-green/50 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crd-green/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-crd-green" />
              </div>
              <div>
                <Typography variant="h2" className="text-crd-white text-xl font-bold">
                  STRY Capsules
                </Typography>
                <Typography variant="body" className="text-crd-lightGray text-sm">
                  Interactive & Animated Stories
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
                Create STRY Capsule
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Typography variant="body" className="text-crd-lightGray text-sm">
            Not sure which to choose? Start with CRD Collectibles for traditional collecting, or STRY Capsules for interactive experiences.
          </Typography>
        </div>

        {/* Pre-loaded CRD Editor (hidden until needed) */}
        <PreloadedCRDEditor
          onComplete={handleCRDComplete}
          onCancel={handleCRDCancel}
          isVisible={showPreloadedEditor}
        />
      </div>
    </NavbarAwareContainer>
  );
};

export const CreateChoice: React.FC = () => {
  return (
    <CRDEditorProvider>
      <CreateChoiceContent />
    </CRDEditorProvider>
  );
};
