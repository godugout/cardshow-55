
import React from 'react';
import { Typography } from '@/components/ui/design-system/Typography';
import { CRDButton } from '@/components/ui/design-system/Button';
import { InteractiveElement } from '@/components/global/InteractiveElement';
import { useGlobalSecretEffects } from '@/contexts/GlobalSecretEffectsContext';
import { Settings, Sparkles, Palette, Wand2 } from 'lucide-react';

const DesignGuide: React.FC = () => {
  const { isEnabled, toggleEnabled, openMenu, interactiveMode } = useGlobalSecretEffects();

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Effects Toggle */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <InteractiveElement elementId="design-guide-title" effectType="text">
              <Typography variant="display" className="text-crd-white mb-4">
                Design Guide
              </Typography>
            </InteractiveElement>
            <InteractiveElement elementId="design-guide-subtitle" effectType="text">
              <Typography variant="large-body" className="text-crd-lightGray">
                Explore CRD's design system and visual effects
              </Typography>
            </InteractiveElement>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Effects Toggle */}
            <div className="flex items-center gap-3 p-4 bg-crd-darker rounded-lg border border-crd-border">
              <Sparkles className="w-5 h-5 text-crd-green" />
              <div>
                <div className="text-sm font-medium text-crd-white">Effects Lab</div>
                <div className="text-xs text-crd-lightGray">
                  {isEnabled ? 'Active' : 'Inactive'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => toggleEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  isEnabled ? 'bg-crd-green' : 'bg-crd-mediumGray'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </label>
            </div>

            {/* Open Effects Menu Button */}
            {isEnabled && (
              <CRDButton onClick={openMenu} variant="outline" size="sm">
                <Wand2 className="w-4 h-4 mr-2" />
                Open Effects Lab
              </CRDButton>
            )}
          </div>
        </div>

        {/* Interactive Mode Status */}
        {isEnabled && interactiveMode && (
          <div className="mb-8 p-4 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-crd-green" />
              <Typography variant="caption" className="text-crd-green">
                Interactive mode is active! Hover over elements to see customization options.
              </Typography>
            </div>
          </div>
        )}

        {/* Typography Section */}
        <section className="mb-12">
          <InteractiveElement elementId="typography-heading" effectType="text">
            <Typography variant="h2" className="text-crd-white mb-6">
              Typography
            </Typography>
          </InteractiveElement>
          
          <div className="grid gap-6">
            <InteractiveElement elementId="display-text" effectType="text" className="p-4 bg-crd-darker rounded-lg">
              <Typography variant="display" className="text-crd-white">
                Display Text - Hero Headlines
              </Typography>
            </InteractiveElement>
            
            <InteractiveElement elementId="h1-text" effectType="text" className="p-4 bg-crd-darker rounded-lg">
              <Typography variant="h1" className="text-crd-white">
                Heading 1 - Primary Section Headers
              </Typography>
            </InteractiveElement>
            
            <InteractiveElement elementId="h2-text" effectType="text" className="p-4 bg-crd-darker rounded-lg">
              <Typography variant="h2" className="text-crd-white">
                Heading 2 - Secondary Headers
              </Typography>
            </InteractiveElement>
            
            <InteractiveElement elementId="body-text" effectType="text" className="p-4 bg-crd-darker rounded-lg">
              <Typography variant="body" className="text-crd-lightGray">
                Body text for general content and descriptions. This text should be easy to read and comfortable for extended reading sessions.
              </Typography>
            </InteractiveElement>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <InteractiveElement elementId="buttons-heading" effectType="text">
            <Typography variant="h2" className="text-crd-white mb-6">
              Interactive Elements
            </Typography>
          </InteractiveElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InteractiveElement elementId="primary-button" effectType="visual">
              <CRDButton variant="primary" className="w-full">
                Primary Button
              </CRDButton>
            </InteractiveElement>
            
            <InteractiveElement elementId="secondary-button" effectType="visual">
              <CRDButton variant="secondary" className="w-full">
                Secondary Button
              </CRDButton>
            </InteractiveElement>
            
            <InteractiveElement elementId="outline-button" effectType="visual">
              <CRDButton variant="outline" className="w-full">
                Outline Button
              </CRDButton>
            </InteractiveElement>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <InteractiveElement elementId="cards-heading" effectType="text">
            <Typography variant="h2" className="text-crd-white mb-6">
              Card Components
            </Typography>
          </InteractiveElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InteractiveElement elementId="sample-card-1" effectType="both" className="p-6 bg-crd-darker rounded-lg border border-crd-border">
              <Typography variant="h3" className="text-crd-white mb-2">
                Interactive Card
              </Typography>
              <Typography variant="body" className="text-crd-lightGray">
                This card demonstrates how visual effects can be applied to content areas.
              </Typography>
            </InteractiveElement>
            
            <InteractiveElement elementId="sample-card-2" effectType="both" className="p-6 bg-crd-darker rounded-lg border border-crd-border">
              <Typography variant="h3" className="text-crd-white mb-2">
                Effect Preview
              </Typography>
              <Typography variant="body" className="text-crd-lightGray">
                Hover over this card when interactive mode is enabled to see effects in action.
              </Typography>
            </InteractiveElement>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <InteractiveElement elementId="instructions-heading" effectType="text">
            <Typography variant="h2" className="text-crd-white mb-6">
              How to Use Effects Lab
            </Typography>
          </InteractiveElement>
          
          <div className="p-6 bg-crd-darker rounded-lg border border-crd-border">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center text-black text-sm font-bold">1</div>
                <div>
                  <Typography variant="body" className="text-crd-white font-medium">
                    Enable Effects Lab
                  </Typography>
                  <Typography variant="caption" className="text-crd-lightGray">
                    Toggle the Effects Lab switch to activate the customization system
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center text-black text-sm font-bold">2</div>
                <div>
                  <Typography variant="body" className="text-crd-white font-medium">
                    Open the Effects Menu
                  </Typography>
                  <Typography variant="caption" className="text-crd-lightGray">
                    Use Ctrl+Shift+3+D or click "Open Effects Lab" to access customization options
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center text-black text-sm font-bold">3</div>
                <div>
                  <Typography variant="body" className="text-crd-white font-medium">
                    Enable Interactive Mode
                  </Typography>
                  <Typography variant="caption" className="text-crd-lightGray">
                    Turn on interactive mode to hover over elements and see live customization
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignGuide;
