import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@/components/ui/design-system/Typography';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDContainer, CRDSection } from '@/components/layout/CRDContainer';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

export const CreatePageHero: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <CRDSection spacing="large" className="text-center">
        <CRDContainer size="narrow">
          <div className="flex flex-col items-center">
            {/* Main Heading */}
            <Typography 
              as="h1" 
              variant="h1"
              className="text-crd-white mb-6"
            >
              Create CRD Collectibles
            </Typography>
            
            {/* CTA Button */}
            <Link to="/create/crd">
              <CRDButton 
                variant="primary"
                size="lg"
                className="mb-8"
              >
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </Link>
          </div>
        </CRDContainer>
      </CRDSection>

      {/* Feature Cards Section */}
      <CRDSection spacing="default">
        <CRDContainer size="full">
          {/* Question Text */}
          <Typography 
            variant="h2" 
            className="text-crd-white mb-12 text-center"
          >
            What do you feel like creating today?
          </Typography>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* CRD Collectibles Card */}
            <div className="relative p-8 bg-gradient-to-br from-blue-600/90 to-blue-700/90 rounded-2xl border border-blue-500/30 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <Typography variant="h2" className="text-white mb-1">
                    CRD Collectibles
                  </Typography>
                  <Typography variant="caption" className="text-blue-200">
                    Digital Trading Cards
                  </Typography>
                </div>
              </div>

              <Typography variant="body" className="text-blue-100 mb-6 leading-relaxed">
                Professional card creation optimized for collecting, trading, and printing. Perfect for sports cards, gaming cards, and traditional collectibles.
              </Typography>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-blue-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <Typography variant="caption">Print-ready high resolution output</Typography>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <Typography variant="caption">Professional templates and layouts</Typography>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <Typography variant="caption">CRD standard compliance built-in</Typography>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <Typography variant="caption">Optimized for physical production</Typography>
                </div>
              </div>

              <Link to="/create/crd">
                <CRDButton 
                  variant="secondary" 
                  className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  Create CRD Collectible
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CRDButton>
              </Link>
            </div>

            {/* STRY Capsules Card */}
            <div className="relative p-8 bg-crd-darker rounded-2xl border border-crd-border text-left opacity-60">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Coming Soon
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-crd-mediumGray/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-crd-mediumGray" />
                </div>
                <div>
                  <Typography variant="h2" className="text-crd-mediumGray mb-1">
                    STRY Capsules
                  </Typography>
                  <Typography variant="caption" className="text-crd-mediumGray">
                    Interactive & Animated Stories
                  </Typography>
                </div>
              </div>

              <Typography variant="body" className="text-crd-mediumGray mb-6 leading-relaxed">
                Advanced interactive cards with animations, scripting, and dynamic behaviors. Perfect for storytelling, gaming, and digital art experiences.
              </Typography>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-crd-mediumGray">
                  <div className="w-1.5 h-1.5 bg-crd-mediumGray rounded-full"></div>
                  <Typography variant="caption">Advanced animation & particle systems</Typography>
                </div>
                <div className="flex items-center gap-2 text-crd-mediumGray">
                  <div className="w-1.5 h-1.5 bg-crd-mediumGray rounded-full"></div>
                  <Typography variant="caption">Visual programming & scripting</Typography>
                </div>
                <div className="flex items-center gap-2 text-crd-mediumGray">
                  <div className="w-1.5 h-1.5 bg-crd-mediumGray rounded-full"></div>
                  <Typography variant="caption">Interactive behaviors & states</Typography>
                </div>
                <div className="flex items-center gap-2 text-crd-mediumGray">
                  <div className="w-1.5 h-1.5 bg-crd-mediumGray rounded-full"></div>
                  <Typography variant="caption">Environmental & biometric triggers</Typography>
                </div>
              </div>

              <CRDButton 
                variant="outline" 
                className="w-full opacity-50 cursor-not-allowed"
                disabled
              >
                Create STRY Capsule
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="mt-12 text-center">
            <Typography variant="caption" className="text-crd-lightGray">
              New to card creation? Start with CRD Collectibles to master the fundamentals, then explore STRY Capsules for advanced interactive experiences.
            </Typography>
          </div>
        </CRDContainer>
      </CRDSection>
    </>
  );
};