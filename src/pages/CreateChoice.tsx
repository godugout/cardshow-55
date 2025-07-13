
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CRDButton, Typography, CRDBadge } from '@/components/ui/design-system';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
import { CRDEditorProvider, useCRDEditor } from '@/contexts/CRDEditorContext';
import { PreloadedCRDEditor } from '@/components/editor/crd/PreloadedCRDEditor';
import { CreatePageHero } from '@/components/create/CreatePageHero';
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
        {/* New Hero Section */}
        <CreatePageHero />

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

          {/* STRY Capsules - Enhanced hover effects */}
          <div className="relative bg-gradient-to-br from-crd-mediumGray/10 to-crd-mediumGray/5 border border-crd-mediumGray/20 rounded-2xl p-8 cursor-not-allowed transition-all duration-300 hover:from-crd-mediumGray/25 hover:to-crd-mediumGray/15 hover:border-crd-mediumGray/50 hover:brightness-125 group">
            {/* Coming Soon Badge with Enhanced Glow Effect */}
            <div className="absolute -top-2 -right-2 z-10">
              <CRDBadge 
                variant="warning" 
                className="bg-crd-orange text-white font-semibold transition-all duration-300 group-hover:brightness-125 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 0 8px transparent)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.6))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(0 0 8px transparent)';
                }}
              >
                Coming Soon
              </CRDBadge>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crd-mediumGray/20 rounded-xl flex items-center justify-center group-hover:bg-crd-mediumGray/40 transition-colors">
                <Sparkles className="w-6 h-6 text-crd-mediumGray group-hover:text-crd-lightGray transition-colors" />
              </div>
              <div>
                <Typography variant="h2" className="text-crd-mediumGray group-hover:text-crd-lightGray transition-colors text-xl font-bold">
                  STRY Capsules
                </Typography>
                <Typography variant="body" className="text-crd-mediumGray group-hover:text-crd-lightGray transition-colors text-sm">
                  Interactive & Animated Stories
                </Typography>
              </div>
            </div>
            
            <Typography variant="body" className="text-crd-mediumGray group-hover:text-crd-lightGray transition-colors mb-6 leading-relaxed">
              Advanced interactive cards with animations, scripting, and dynamic behaviors. Perfect for storytelling, gaming, and digital art experiences.
            </Typography>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-crd-mediumGray group-hover:text-crd-lightGray transition-colors">
                <div className="w-1.5 h-1.5 bg-crd-mediumGray group-hover:bg-crd-lightGray transition-colors rounded-full"></div>
                Advanced animation & particle systems
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-mediumGray group-hover:text-crd-lightGray transition-colors">
                <div className="w-1.5 h-1.5 bg-crd-mediumGray group-hover:bg-crd-lightGray transition-colors rounded-full"></div>
                Visual programming & scripting
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-mediumGray group-hover:text-crd-lightGray transition-colors">
                <div className="w-1.5 h-1.5 bg-crd-mediumGray group-hover:bg-crd-lightGray transition-colors rounded-full"></div>
                Interactive behaviors & states
              </div>
              <div className="flex items-center gap-2 text-sm text-crd-mediumGray group-hover:text-crd-lightGray transition-colors">
                <div className="w-1.5 h-1.5 bg-crd-mediumGray group-hover:bg-crd-lightGray transition-colors rounded-full"></div>
                Environmental & biometric triggers
              </div>
            </div>
            
            <div className="block">
              <CRDButton 
                variant="outline" 
                className="w-full border-crd-mediumGray/30 text-crd-mediumGray bg-transparent cursor-not-allowed group-hover:border-crd-mediumGray/50 group-hover:text-crd-lightGray transition-colors"
                disabled
              >
                Create STRY Capsule
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Typography variant="body" className="text-crd-lightGray text-sm">
            New to card creation? Start with CRD Collectibles to master the fundamentals, then explore STRY Capsules for advanced interactive experiences.
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
