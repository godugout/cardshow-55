
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Sparkles, Target, Wand2, Zap } from 'lucide-react';
import { CRDButton, CRDCard, Typography } from '@/components/ui/design-system';

export const CreateChoiceSection: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="section" className="mb-4">
            Choose Your Creation Path
          </Typography>
          <Typography variant="large-body" className="text-crd-lightGray max-w-3xl mx-auto">
            Two powerful approaches to digital card creation. Start with CRD Collectibles for professional-grade cards, 
            or join the waitlist for STRY Capsules with advanced interactive features.
          </Typography>
        </div>

        {/* Choice Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* CRD Collectibles Card */}
          <CRDCard 
            variant="interactive" 
            className="relative overflow-hidden bg-gradient-to-br from-crd-blue/10 via-crd-purple/10 to-crd-blue/5 border-crd-blue/30 hover:border-crd-blue/50"
          >
            {/* Active Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-crd-green text-black px-3 py-1 rounded-full text-xs font-bold">
                ACTIVE
              </div>
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-crd-blue to-crd-purple rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="card" className="text-white">
                      CRD Collectibles
                    </Typography>
                    <Typography variant="small-body" className="text-crd-lightGray">
                      Professional card creation
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-crd-green flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray">
                    Print-ready high resolution output
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-crd-green flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray">
                    Professional templates and layouts
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-crd-green flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray">
                    CRD standard compliance built-in
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-crd-green flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray">
                    Optimized for physical production
                  </Typography>
                </div>
              </div>

              {/* CTA Button */}
              <Link to="/create/crd" className="block">
                <CRDButton 
                  variant="primary" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-crd-blue to-crd-purple hover:from-crd-blue/90 hover:to-crd-purple/90"
                >
                  Create CRD Collectible
                  <ArrowRight className="w-5 h-5" />
                </CRDButton>
              </Link>
            </div>
          </CRDCard>

          {/* STRY Capsules Card */}
          <CRDCard 
            variant="default" 
            className="relative overflow-hidden bg-crd-mediumGray/20 border-crd-mediumGray/20 opacity-75"
          >
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-crd-mediumGray text-crd-lightGray px-3 py-1 rounded-full text-xs font-bold">
                COMING SOON
              </div>
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-crd-mediumGray/50 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-crd-lightGray" />
                  </div>
                  <div>
                    <Typography variant="card" className="text-crd-lightGray">
                      STRY Capsules
                    </Typography>
                    <Typography variant="small-body" className="text-crd-lightGray/70">
                      Interactive card experiences
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-crd-lightGray/50 flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray/70">
                    Advanced animation & particle systems
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-crd-lightGray/50 flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray/70">
                    Visual programming & scripting
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-crd-lightGray/50 flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray/70">
                    Interactive behaviors & states
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-crd-lightGray/50 flex-shrink-0" />
                  <Typography variant="small-body" className="text-crd-lightGray/70">
                    Environmental & biometric triggers
                  </Typography>
                </div>
              </div>

              {/* Disabled CTA Button */}
              <CRDButton 
                variant="ghost" 
                size="lg" 
                className="w-full bg-crd-mediumGray/30 text-crd-lightGray/70 cursor-not-allowed hover:bg-crd-mediumGray/30"
                disabled
              >
                Join Waitlist
                <Zap className="w-5 h-5" />
              </CRDButton>
            </div>
          </CRDCard>
        </div>

        {/* Bottom Description */}
        <div className="text-center">
          <Typography variant="body" className="text-crd-lightGray max-w-4xl mx-auto leading-relaxed">
            Both creation paths harness the power of <span className="gradient-text-green-blue-purple font-semibold">CRD:DNA</span> technology 
            to deliver cards that transcend traditional boundaries. Whether you're creating professional collectibles or interactive experiences, 
            every card becomes a gateway to deeper engagement and lasting memories.
          </Typography>
        </div>
      </div>
    </div>
  );
};
