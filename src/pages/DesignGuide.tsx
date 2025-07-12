import React, { useState } from 'react';
import { Code2, Palette, Type, MousePointer, Layout, Paintbrush, Sparkles, Image } from 'lucide-react';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { CRDButton, CRDCard, CRDBadge, TeamThemeShowcase, PalettePreview, Typography } from '@/components/ui/design-system';
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';
import { CardshowBasicLogo } from '@/components/home/navbar/CardshowBasicLogo';
import { CardshowBlueLogo } from '@/components/home/navbar/CardshowBlueLogo';
import { CardshowOrangeLogo } from '@/components/home/navbar/CardshowOrangeLogo';
import { CardshowModernLogo } from '@/components/home/navbar/CardshowModernLogo';
import { CardshowRetroLogo } from '@/components/home/navbar/CardshowRetroLogo';
import { CardshowVintageLogo } from '@/components/home/navbar/CardshowVintageLogo';
import { CardshowRedBlueLogo } from '@/components/home/navbar/CardshowRedBlueLogo';
import { CardshowBlockLettersLogo } from '@/components/home/navbar/CardshowBlockLettersLogo';
import { CardshowGreenLogo } from '@/components/home/navbar/CardshowGreenLogo';
import { CardshowGreenSparklesLogo } from '@/components/home/navbar/CardshowGreenSparklesLogo';

const DesignGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentPalette, availablePalettes, setTheme } = useTeamTheme();

  const sidebarSections = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'brand-assets', label: 'Brand & Visual Assets', icon: Image },
    { id: 'color-palette', label: 'Color Palette', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing & Layout', icon: Layout },
    { id: 'glass-effects', label: 'Glass Morphism', icon: Sparkles },
    { id: 'animations', label: 'Animations & Timing', icon: MousePointer },
    { id: 'mobile', label: 'Mobile Components', icon: MousePointer },
    { id: 'team-themes', label: 'Team Themes', icon: Sparkles },
    { id: 'buttons', label: 'Buttons', icon: MousePointer },
    { id: 'cards', label: 'Cards', icon: Layout },
    { id: 'backgrounds', label: 'Backgrounds', icon: Paintbrush },
  ];

  return (
    <div className="min-h-screen bg-crd-darkest pt-16 transition-all duration-500">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-crd-darkGray border-r border-crd-mediumGray/30 overflow-y-auto transition-all duration-500">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-crd-white mb-6">Design System</h2>
            <nav className="space-y-2">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-crd-blue text-crd-white border border-crd-blue/50 shadow-lg'
                        : 'text-crd-lightGray hover:bg-crd-mediumGray/50 hover:text-crd-white hover:shadow-md'
                    }`}
                  >
                    <Icon size={16} className={activeSection === section.id ? 'text-crd-white' : 'text-crd-lightGray'} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 transition-all duration-500">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="text-xs font-semibold text-crd-lightGray uppercase tracking-wide mb-2 transition-colors duration-300">
                DESIGN SYSTEM
              </div>
              <h1 className="text-4xl font-bold text-crd-white mb-4">
                CRD Design Guide
              </h1>
              <p className="text-crd-lightGray max-w-2xl mx-auto transition-colors duration-300">
                Comprehensive documentation of Cardshow's design system, components, and patterns. Built
                for consistency, accessibility, and exceptional user experiences.
              </p>
            </div>

            {activeSection === 'overview' && (
              <div className="space-y-12">
                {/* Design System Overview */}
                <section>
                  <h2 className="text-2xl font-bold text-crd-white mb-6 transition-colors duration-300">Design System Overview</h2>
                  <p className="text-crd-lightGray mb-8 transition-colors duration-300">
                    The CRD Design System is built on modern web technologies with a focus on dark aesthetics, glass morphism,
                    and premium user experiences. Every component follows consistent patterns for spacing, typography, and
                    interaction design.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Color System */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-crd-mediumGray rounded-lg flex items-center justify-center shadow-lg">
                          <Palette size={20} className="text-crd-blue" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Color System</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Comprehensive color palette with semantic tokens, gradients, and accessibility considerations.
                      </p>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-crd-blue rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-crd-orange rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-crd-green rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-crd-purple rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-crd-mediumGray rounded-lg flex items-center justify-center shadow-lg">
                          <Type size={20} className="text-crd-orange" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Typography</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Consistent type scale, font weights, and text hierarchy for optimal readability.
                      </p>
                      <div className="space-y-1">
                        <div className="w-12 h-3 bg-crd-lightGray/30 rounded"></div>
                        <div className="w-16 h-2 bg-crd-lightGray/20 rounded"></div>
                        <div className="w-20 h-2 bg-crd-lightGray/20 rounded"></div>
                      </div>
                    </div>

                    {/* Interactive Elements */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-green/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-crd-green to-crd-blue rounded-lg flex items-center justify-center shadow-lg">
                          <MousePointer size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Interactive Elements</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Buttons, links, and form controls with consistent states and animations.
                      </p>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-crd-blue rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-crd-green rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-crd-orange rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Card Components */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-purple/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-crd-purple to-crd-blue rounded-lg flex items-center justify-center shadow-lg">
                          <Layout size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Card Components</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Glass morphism cards, creator boxes, and collection displays with depth and elegance.
                      </p>
                      <div className="space-y-2">
                        <div className="h-3 bg-crd-lightGray/20 rounded shadow-sm"></div>
                        <div className="h-2 bg-crd-lightGray/15 rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Background Patterns */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-orange/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-crd-orange to-crd-purple rounded-lg flex items-center justify-center shadow-lg">
                          <Paintbrush size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Background Patterns</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Floating elements, gradients, and animated patterns that create visual depth.
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="w-full h-3 bg-gradient-to-r from-crd-blue to-crd-green rounded shadow-sm"></div>
                        <div className="w-full h-3 bg-gradient-to-r from-crd-green to-crd-orange rounded shadow-sm"></div>
                        <div className="w-full h-3 bg-gradient-to-r from-crd-orange to-crd-purple rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Code Examples */}
                    <div className="bg-crd-darkGray rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-crd-blue to-crd-purple rounded-lg flex items-center justify-center shadow-lg">
                          <Code2 size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-crd-white">Code Examples</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Ready-to-use code snippets with TypeScript support and best practices.
                      </p>
                      <div className="space-y-1">
                        <div className="flex space-x-1">
                          <div className="w-6 h-2 bg-crd-blue rounded shadow-sm"></div>
                          <div className="w-6 h-2 bg-crd-green rounded shadow-sm"></div>
                          <div className="w-6 h-2 bg-crd-orange rounded shadow-sm"></div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-crd-lightGray/30 rounded shadow-sm"></div>
                          <div className="w-8 h-2 bg-crd-lightGray/30 rounded shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Principles */}
                <section>
                  <h2 className="text-2xl font-bold text-crd-white mb-8 transition-colors duration-300">Key Principles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-crd-blue mb-3">Consistency</h3>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        Uniform patterns across all components and interactions.
                      </p>
                    </div>
                    <div className="text-center bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 hover:border-crd-orange/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-crd-orange mb-3">Accessibility</h3>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        WCAG compliant with proper contrast and keyboard navigation.
                      </p>
                    </div>
                    <div className="text-center bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 hover:border-crd-green/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-crd-green mb-3">Performance</h3>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        Optimized components with minimal bundle impact.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'brand-assets' && (
              <div className="space-y-12">
                <h2 className="text-2xl font-bold text-crd-white">Brand & Visual Assets</h2>
                
                {/* CRD Brand Identity */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">CRD Brand Identity</h3>
                  <div className="bg-crd-darkGray rounded-2xl p-8 border border-crd-mediumGray/30">
                    <div className="text-center mb-6">
                      <CRDGradientLogo className="mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-crd-white mb-2">Primary CRD Logo</h4>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        The CRD gradient logo with "MKR" suffix. This is our primary brand mark for the CRD platform.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-crd-dark rounded-lg p-4 text-center border border-crd-mediumGray/20">
                        <div className="text-crd-lightGray mb-1 font-medium">File Path</div>
                        <div className="font-mono text-crd-blue text-xs">/lovable-uploads/7697ffa5...</div>
                      </div>
                      <div className="bg-crd-dark rounded-lg p-4 text-center border border-crd-mediumGray/20">
                        <div className="text-crd-lightGray mb-1 font-medium">Component</div>
                        <div className="font-mono text-crd-green text-xs">CRDGradientLogo</div>
                      </div>
                      <div className="bg-crd-dark rounded-lg p-4 text-center border border-crd-mediumGray/20">
                        <div className="text-crd-lightGray mb-1 font-medium">Usage</div>
                        <div className="text-crd-orange text-xs">Primary branding</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cardshow Logo Collection */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Cardshow Logo Collection</h3>
                  
                  {/* Basic/Classic Collection */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Basic & Classic Logos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowBasicLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Basic Logo</div>
                        <div className="text-xs text-crd-lightGray">Clean, minimal design</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowGreenLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Green Logo</div>
                        <div className="text-xs text-crd-lightGray">Nature-inspired variant</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowGreenSparklesLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Green Sparkles</div>
                        <div className="text-xs text-crd-lightGray">Magical green variant</div>
                      </CRDCard>
                    </div>
                  </div>

                  {/* Modern Collection */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Modern Collection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowModernLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Modern</div>
                        <div className="text-xs text-crd-lightGray">Contemporary style</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowBlueLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Blue</div>
                        <div className="text-xs text-crd-lightGray">Professional blue</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowOrangeLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Orange</div>
                        <div className="text-xs text-crd-lightGray">Energetic orange</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowBlockLettersLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Block Letters</div>
                        <div className="text-xs text-crd-lightGray">Bold typography</div>
                      </CRDCard>
                    </div>
                  </div>

                  {/* Vintage Collection */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Vintage Collection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowVintageLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Vintage</div>
                        <div className="text-xs text-crd-lightGray">Classic nostalgia</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowRetroLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Retro</div>
                        <div className="text-xs text-crd-lightGray">80s/90s aesthetic</div>
                      </CRDCard>
                      <CRDCard variant="flat" padding="default" className="text-center hover:border-crd-blue transition-all duration-300">
                        <CardshowRedBlueLogo className="mx-auto mb-4 h-12" />
                        <div className="text-sm font-medium text-crd-white mb-1">Red Blue</div>
                        <div className="text-xs text-crd-lightGray">Patriotic colors</div>
                      </CRDCard>
                    </div>
                  </div>
                </section>

                {/* Usage Guidelines */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Usage Guidelines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">When to Use CRD Logo</h4>
                      <ul className="text-crd-lightGray text-sm space-y-2 leading-relaxed">
                        <li>• Platform-wide branding</li>
                        <li>• Technical documentation</li>
                        <li>• Developer tools</li>
                        <li>• API integrations</li>
                        <li>• System architecture</li>
                      </ul>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">When to Use Cardshow Logos</h4>
                      <ul className="text-crd-lightGray text-sm space-y-2 leading-relaxed">
                        <li>• User-facing applications</li>
                        <li>• Marketing materials</li>
                        <li>• Social media content</li>
                        <li>• Community features</li>
                        <li>• Creator tools</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Technical Specifications */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Technical Specifications</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-crd-white mb-3">Logo Sizing</h4>
                        <div className="text-sm text-crd-lightGray space-y-1 leading-relaxed">
                          <div>Minimum: 24px height</div>
                          <div>Standard: 48-64px height</div>
                          <div>Large: 96px+ height</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-crd-white mb-3">File Formats</h4>
                        <div className="text-sm text-crd-lightGray space-y-1 leading-relaxed">
                          <div>PNG (web optimized)</div>
                          <div>React components</div>
                          <div>Responsive scaling</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-crd-white mb-3">Accessibility</h4>
                        <div className="text-sm text-crd-lightGray space-y-1 leading-relaxed">
                          <div>Alt text included</div>
                          <div>High contrast ready</div>
                          <div>Screen reader friendly</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Code Example */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Implementation Example</h3>
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <pre className="text-crd-lightGray text-sm overflow-x-auto leading-relaxed">
                      <code>{`// Import the logo component
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';
import { CardshowBasicLogo } from '@/components/home/navbar/CardshowBasicLogo';

// Use in your component
<CRDGradientLogo className="h-16" />
<CardshowBasicLogo className="h-12" />`}</code>
                    </pre>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'color-palette' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Color Palette</h2>
                
                {/* Color System Comparison */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">CRD vs Team Colors</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CRD Brand Colors */}
                    <div>
                      <h4 className="text-lg font-medium text-crd-white mb-4">CRD Brand Colors</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="w-full h-20 bg-crd-blue rounded-lg mb-2"></div>
                          <div className="text-sm font-medium text-crd-white">Primary Blue</div>
                          <div className="text-xs text-crd-lightGray">#3772FF</div>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-20 bg-crd-orange rounded-lg mb-2"></div>
                          <div className="text-sm font-medium text-crd-white">Orange</div>
                          <div className="text-xs text-crd-lightGray">#EA6E48</div>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-20 bg-crd-green rounded-lg mb-2"></div>
                          <div className="text-sm font-medium text-crd-white">Success Green</div>
                          <div className="text-xs text-crd-lightGray">#45B26B</div>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-20 bg-crd-purple rounded-lg mb-2"></div>
                          <div className="text-sm font-medium text-crd-white">Purple</div>
                          <div className="text-xs text-crd-lightGray">#9757D7</div>
                        </div>
                      </div>
                    </div>

                    {/* Current Team Colors */}
                    <div>
                      <h4 className="text-lg font-medium text-crd-white mb-4">
                        Current Team Colors
                        {currentPalette && (
                          <span className="text-sm text-crd-lightGray ml-2">({currentPalette.name})</span>
                        )}
                      </h4>
                      {currentPalette ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.primary }}
                            ></div>
                            <div className="text-sm font-medium text-crd-white">Primary</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.primary}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.secondary }}
                            ></div>
                            <div className="text-sm font-medium text-crd-white">Secondary</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.secondary}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.accent }}
                            ></div>
                            <div className="text-sm font-medium text-crd-white">Accent</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.accent}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.neutral }}
                            ></div>
                            <div className="text-sm font-medium text-crd-white">Neutral</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.neutral}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-crd-lightGray">No team theme selected</div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Themed CSS Variables */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Themed CSS Variables</h3>
                  <div className="bg-crd-dark rounded-lg p-6 border border-crd-mediumGray/30">
                    <p className="text-crd-lightGray mb-4">
                      Use these CSS classes to apply team colors dynamically:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <div className="text-themed-primary mb-1">text-themed-primary</div>
                        <div className="text-themed-secondary mb-1">text-themed-secondary</div>
                        <div className="accent-themed mb-1">accent-themed</div>
                      </div>
                      <div>
                        <div className="bg-themed-subtle text-crd-white px-2 py-1 rounded mb-1">bg-themed-subtle</div>
                        <div className="bg-themed-light text-crd-white px-2 py-1 rounded mb-1">bg-themed-light</div>
                        <div className="border border-themed-strong rounded px-2 py-1 text-crd-white">border-themed-strong</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Neutral Colors */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Neutral Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-full h-20 bg-crd-darkest border border-crd-mediumGray rounded-lg mb-2"></div>
                      <div className="text-sm font-medium text-crd-white">Darkest</div>
                      <div className="text-xs text-crd-lightGray">#121212</div>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-crd-dark rounded-lg mb-2"></div>
                      <div className="text-sm font-medium text-crd-white">Dark</div>
                      <div className="text-xs text-crd-lightGray">#1A1A1A</div>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-crd-darkGray rounded-lg mb-2"></div>
                      <div className="text-sm font-medium text-crd-white">Dark Gray</div>
                      <div className="text-xs text-crd-lightGray">#23262F</div>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-crd-mediumGray rounded-lg mb-2"></div>
                      <div className="text-sm font-medium text-crd-white">Medium Gray</div>
                      <div className="text-xs text-crd-lightGray">#353945</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'team-themes' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Team Themes</h2>
                
                {/* Team Theme Showcase */}
                <section>
                  <TeamThemeShowcase />
                </section>

                {/* Component Examples with Theme */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Themed Component Examples</h3>
                  
                  {/* Buttons */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Buttons</h4>
                    <div className="flex gap-4 flex-wrap">
                      <CRDButton variant="primary">Primary Button</CRDButton>
                      <CRDButton variant="secondary">Secondary Button</CRDButton>
                      <CRDButton variant="ghost">Ghost Button</CRDButton>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Badges</h4>
                    <div className="flex gap-3 flex-wrap">
                      <CRDBadge variant="primary">Primary Badge</CRDBadge>
                      <CRDBadge variant="secondary">Secondary Badge</CRDBadge>
                      <CRDBadge variant="success">Success Badge</CRDBadge>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Cards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CRDCard variant="default" className="p-6">
                        <h5 className="text-lg font-semibold text-crd-white mb-2">Themed Card</h5>
                        <p className="text-crd-lightGray">This card uses the current team theme colors automatically.</p>
                      </CRDCard>
                      <CRDCard variant="interactive" className="p-6">
                        <h5 className="text-lg font-semibold text-crd-white mb-2">Interactive Themed Card</h5>
                        <p className="text-crd-lightGray">Hover effects with team colors.</p>
                      </CRDCard>
                    </div>
                  </div>

                  {/* Text Styles */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Text Styles</h4>
                    <div className="space-y-3">
                      <div className="text-crd-white text-xl font-semibold">Primary themed text</div>
                      <div className="text-crd-lightGray">Secondary themed text</div>
                      <div className="text-crd-blue font-medium">Accent themed text</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Typography System</h2>
                
                {/* Font Families */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Font Families</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="font-dm-sans text-lg font-semibold text-crd-white mb-4">DM Sans (Primary)</h4>
                      <div className="space-y-2 font-dm-sans">
                        <div className="text-2xl font-bold text-crd-white">Bold Headers</div>
                        <div className="text-lg font-semibold text-crd-white">Semibold Subheaders</div>
                        <div className="text-base font-medium text-crd-white">Medium Labels</div>
                        <div className="text-base text-crd-lightGray">Regular body text for readability</div>
                      </div>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="font-roboto-mono text-lg font-semibold text-crd-white mb-4">Roboto Mono (Code)</h4>
                      <div className="space-y-2 font-roboto-mono">
                        <div className="text-sm text-crd-blue">import { Typography } from '@/components';</div>
                        <div className="text-sm text-crd-green">const theme = 'crd-system';</div>
                        <div className="text-sm text-crd-orange">export default Component;</div>
                        <div className="text-sm text-crd-lightGray">// Monospace for code</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Complete Type Scale */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Complete Type Scale</h3>
                  <div className="space-y-8">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <div className="text-display text-crd-white mb-2">Display Heading</div>
                      <div className="text-sm text-crd-lightGray mb-4">48px • 3rem • Font Weight: 800 (Extrabold)</div>
                      
                      <div className="text-section text-crd-white mb-2">Section Heading</div>
                      <div className="text-sm text-crd-lightGray mb-4">36px • 2.25rem • Font Weight: 800 (Extrabold)</div>
                      
                      <div className="text-page-title text-crd-white mb-2">Page Title</div>
                      <div className="text-sm text-crd-lightGray mb-4">30px • 1.875rem • Font Weight: 700 (Bold)</div>
                      
                      <div className="text-component text-crd-white mb-2">Component Heading</div>
                      <div className="text-sm text-crd-lightGray mb-4">24px • 1.5rem • Font Weight: 700 (Bold)</div>
                      
                      <div className="text-card text-crd-white mb-2">Card Heading</div>
                      <div className="text-sm text-crd-lightGray mb-4">20px • 1.25rem • Font Weight: 600 (Semibold)</div>
                      
                      <div className="text-small-heading text-crd-white mb-2">Small Heading</div>
                      <div className="text-sm text-crd-lightGray mb-4">18px • 1.125rem • Font Weight: 600 (Semibold)</div>
                      
                      <div className="text-large-body text-crd-white mb-2">Large Body Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">18px • 1.125rem • Font Weight: 400 (Normal)</div>
                      
                      <div className="text-body text-crd-white mb-2">Body Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">16px • 1rem • Font Weight: 400 (Normal)</div>
                      
                      <div className="text-small-body text-crd-lightGray mb-2">Small Body Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">14px • 0.875rem • Font Weight: 400 (Normal)</div>
                      
                      <div className="text-caption text-crd-lightGray mb-2">Caption Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">12px • 0.75rem • Font Weight: 400 (Normal)</div>
                      
                      <div className="text-button text-crd-white mb-2">Button Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">18px • 1.125rem • Font Weight: 800 (Extrabold)</div>
                      
                      <div className="text-link text-crd-blue hover:text-crd-orange transition-colors mb-2 cursor-pointer">Link Text</div>
                      <div className="text-sm text-crd-lightGray mb-4">16px • 1rem • Font Weight: 500 (Medium)</div>
                      
                      <div className="text-label text-crd-lightGray mb-2">LABEL TEXT</div>
                      <div className="text-sm text-crd-lightGray">12px • 0.75rem • Font Weight: 600 (Semibold) • Uppercase • Letter Spacing: 0.05em</div>
                    </div>
                  </div>
                </section>

                {/* Usage Examples */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Usage Examples</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <pre className="text-sm text-crd-lightGray overflow-x-auto leading-relaxed">
                      <code>{`// Using Typography component with new variants
import { Typography } from '@/components/ui/design-system';

// Display heading for hero sections
<Typography variant="display">Welcome to CRD</Typography>

// Section headings for major content areas  
<Typography variant="section">Features</Typography>

// Page titles for individual pages
<Typography variant="page-title">Design Guide</Typography>`}</code>
                    </pre>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'spacing' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Spacing & Layout</h2>
                
                {/* Base Spacing Unit */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Base Spacing Unit</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <div className="text-lg text-crd-white mb-4">Base Unit: <span className="text-crd-blue font-mono">4px (0.25rem)</span></div>
                    <p className="text-crd-lightGray">All spacing values are multiples of our 4px base unit for consistent visual rhythm and precise layouts.</p>
                  </div>
                </section>

                {/* Spacing Scale */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Spacing Scale</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'xs', value: '8px', rem: '0.5rem', class: 'spacing-xs' },
                      { name: 'sm', value: '12px', rem: '0.75rem', class: 'spacing-sm' },
                      { name: 'md', value: '16px', rem: '1rem', class: 'spacing-md' },
                      { name: 'lg', value: '24px', rem: '1.5rem', class: 'spacing-lg' },
                      { name: 'xl', value: '32px', rem: '2rem', class: 'spacing-xl' },
                      { name: '2xl', value: '48px', rem: '3rem', class: 'spacing-2xl' },
                      { name: '3xl', value: '64px', rem: '4rem', class: 'spacing-3xl' },
                    ].map((item) => (
                      <div key={item.name} className="bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 text-crd-white font-mono text-sm">{item.name}</div>
                          <div className="w-20 text-crd-lightGray text-sm">{item.value}</div>
                          <div className="w-20 text-crd-lightGray text-sm">{item.rem}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`h-4 bg-crd-blue rounded`} style={{ width: item.value }}></div>
                          <code className="text-crd-orange text-sm">{item.class}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Layout Guidelines */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Layout Guidelines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Container Padding</h4>
                      <div className="space-y-2 text-sm text-crd-lightGray">
                        <div>Mobile: <span className="text-crd-blue">16px</span></div>
                        <div>Tablet+: <span className="text-crd-blue">24px</span></div>
                        <div>Desktop: <span className="text-crd-blue">32px</span></div>
                      </div>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Component Spacing</h4>
                      <div className="space-y-2 text-sm text-crd-lightGray">
                        <div>Card Internal: <span className="text-crd-blue">24px (1.5rem)</span></div>
                        <div>Button Padding: <span className="text-crd-blue">12px vertical, 24px horizontal</span></div>
                        <div>Input Padding: <span className="text-crd-blue">12px all sides</span></div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Border Radius Scale */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Border Radius Scale</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Small', value: '8px (0.5rem)', usage: 'Buttons, inputs', class: 'rounded-sm' },
                      { name: 'Medium', value: '12px (0.75rem)', usage: 'Small cards', class: 'rounded-md' },
                      { name: 'Large', value: '16px (1rem)', usage: 'Main cards', class: 'rounded-lg' },
                      { name: 'Extra Large', value: '24px (1.5rem)', usage: 'Hero sections', class: 'rounded-xl' },
                      { name: 'Pills', value: '90px', usage: 'Full rounded buttons', class: 'rounded-pill' },
                      { name: 'Circle', value: '50%', usage: 'Avatars, icon buttons', class: 'rounded-circle' },
                    ].map((item) => (
                      <div key={item.name} className="bg-crd-darkGray p-4 border border-crd-mediumGray/30 text-center" style={{ borderRadius: item.name === 'Circle' ? '50%' : item.value.split('(')[0].trim() }}>
                        <div className="text-sm font-medium text-crd-white mb-1">{item.name}</div>
                        <div className="text-xs text-crd-lightGray mb-1">{item.value}</div>
                        <div className="text-xs text-crd-blue">{item.usage}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'glass-effects' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Glass Morphism Effects</h2>
                
                {/* Glass Morphism Showcase */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Glass Effect Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-light rounded-xl p-6 text-center hover-lift">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Light Glass</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Subtle transparency with 4px blur</p>
                      <code className="text-crd-blue text-xs">glass-light</code>
                    </div>
                    <div className="glass-medium rounded-xl p-6 text-center hover-lift">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Medium Glass</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Balanced effect with 8px blur</p>
                      <code className="text-crd-blue text-xs">glass-medium</code>
                    </div>
                    <div className="glass-heavy rounded-xl p-6 text-center hover-lift">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Heavy Glass</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Strong effect with 12px blur</p>
                      <code className="text-crd-blue text-xs">glass-heavy</code>
                    </div>
                  </div>
                </section>

                {/* Shadow System */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Enhanced Shadow System</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-crd-darkGray rounded-xl p-6 shadow-card border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Card Shadow</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Standard elevation for cards</p>
                      <code className="text-crd-blue text-xs">shadow-card</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 shadow-elevated border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Elevated Shadow</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Higher elevation for modals</p>
                      <code className="text-crd-blue text-xs">shadow-elevated</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 shadow-heavy border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Heavy Shadow</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Maximum depth for overlays</p>
                      <code className="text-crd-blue text-xs">shadow-heavy</code>
                    </div>
                  </div>
                </section>

                {/* Glow Effects */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Color Glow Effects</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-crd-darkGray rounded-xl p-4 shadow-glow-blue border border-crd-blue/30 text-center">
                      <div className="text-crd-blue font-semibold mb-1">Blue Glow</div>
                      <code className="text-xs text-crd-lightGray">shadow-glow-blue</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-4 shadow-glow-orange border border-crd-orange/30 text-center">
                      <div className="text-crd-orange font-semibold mb-1">Orange Glow</div>
                      <code className="text-xs text-crd-lightGray">shadow-glow-orange</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-4 shadow-glow-green border border-crd-green/30 text-center">
                      <div className="text-crd-green font-semibold mb-1">Green Glow</div>
                      <code className="text-xs text-crd-lightGray">shadow-glow-green</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-4 shadow-glow-purple border border-crd-purple/30 text-center">
                      <div className="text-crd-purple font-semibold mb-1">Purple Glow</div>
                      <code className="text-xs text-crd-lightGray">shadow-glow-purple</code>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'animations' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Animations & Timing</h2>
                
                {/* Timing Functions */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">CRD Timing Functions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Fast', duration: '150ms', usage: 'Micro-interactions', class: 'ease-fast' },
                      { name: 'Standard', duration: '200ms', usage: 'Hover states', class: 'ease-standard' },
                      { name: 'Slow', duration: '300ms', usage: 'Page transitions', class: 'ease-slow' },
                      { name: 'Complex', duration: '500ms', usage: 'Card flips, modals', class: 'ease-complex' },
                    ].map((item) => (
                      <div key={item.name} className={`bg-crd-darkGray rounded-xl p-4 border border-crd-mediumGray/30 hover:border-crd-blue/50 hover:transform hover:scale-105 ${item.class} text-center cursor-pointer`}>
                        <div className="text-crd-white font-semibold mb-1">{item.name}</div>
                        <div className="text-crd-blue text-sm mb-1">{item.duration}</div>
                        <div className="text-crd-lightGray text-xs">{item.usage}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Interactive Animations */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Interactive Animations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 hover-scale cursor-pointer text-center">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Hover Scale</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Scale to 1.05 on hover</p>
                      <code className="text-crd-blue text-xs">hover-scale</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 hover-lift cursor-pointer text-center">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Hover Lift</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Translate up with shadow</p>
                      <code className="text-crd-blue text-xs">hover-lift</code>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30 button-press cursor-pointer text-center active:transform active:scale-95">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Button Press</h4>
                      <p className="text-crd-lightGray text-sm mb-4">Scale to 0.98 on active</p>
                      <code className="text-crd-blue text-xs">button-press</code>
                    </div>
                  </div>
                </section>

                {/* Easing Curves */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Easing Curves</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-full h-20 bg-crd-blue/20 rounded-lg mb-3 ease-smooth hover:bg-crd-blue/40 cursor-pointer"></div>
                        <div className="text-crd-white font-medium mb-1">Smooth</div>
                        <code className="text-crd-lightGray text-xs">cubic-bezier(0.4, 0, 0.2, 1)</code>
                      </div>
                      <div className="text-center">
                        <div className="w-full h-20 bg-crd-orange/20 rounded-lg mb-3 ease-bounce hover:bg-crd-orange/40 cursor-pointer"></div>
                        <div className="text-crd-white font-medium mb-1">Bounce</div>
                        <code className="text-crd-lightGray text-xs">cubic-bezier(0.68, -0.55, 0.265, 1.55)</code>
                      </div>
                      <div className="text-center">
                        <div className="w-full h-20 bg-crd-green/20 rounded-lg mb-3 ease-out hover:bg-crd-green/40 cursor-pointer"></div>
                        <div className="text-crd-white font-medium mb-1">Ease Out</div>
                        <code className="text-crd-lightGray text-xs">Default ease-out</code>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'mobile' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Mobile Components</h2>
                
                {/* Mobile Navigation */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Mobile Navigation</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <div className="mobile-nav-height bg-crd-dark rounded-lg flex items-center justify-around border border-crd-mediumGray/30 mb-4">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-5 h-5 bg-crd-blue rounded"></div>
                        <span className="text-xs text-crd-blue">Home</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-5 h-5 bg-crd-lightGray rounded"></div>
                        <span className="text-xs text-crd-lightGray">Browse</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-5 h-5 bg-crd-lightGray rounded"></div>
                        <span className="text-xs text-crd-lightGray">Create</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-5 h-5 bg-crd-lightGray rounded"></div>
                        <span className="text-xs text-crd-lightGray">Profile</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-crd-lightGray">Height: <span className="text-crd-blue">64px (4rem)</span></div>
                      <div className="text-crd-lightGray">Icon Size: <span className="text-crd-blue">20px (1.25rem)</span></div>
                      <div className="text-crd-lightGray">Active: <span className="text-crd-blue">#3772FF</span></div>
                      <div className="text-crd-lightGray">Inactive: <span className="text-crd-blue">#777E90</span></div>
                    </div>
                  </div>
                </section>

                {/* Mobile Avatars */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Mobile Avatar Sizes</h3>
                  <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="text-center">
                        <div className="mobile-avatar-sm bg-gradient-to-br from-crd-blue to-crd-purple rounded-full mb-2"></div>
                        <div className="text-xs text-crd-lightGray">Small (32px)</div>
                      </div>
                      <div className="text-center">
                        <div className="mobile-avatar-md bg-gradient-to-br from-crd-green to-crd-blue rounded-full mb-2"></div>
                        <div className="text-xs text-crd-lightGray">Medium (48px)</div>
                      </div>
                      <div className="text-center">
                        <div className="mobile-avatar-lg bg-gradient-to-br from-crd-orange to-crd-purple rounded-full mb-2"></div>
                        <div className="text-xs text-crd-lightGray">Large (80px)</div>
                      </div>
                    </div>
                    <code className="text-crd-blue text-sm">mobile-avatar-sm • mobile-avatar-md • mobile-avatar-lg</code>
                  </div>
                </section>

                {/* Mobile Form Elements */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Mobile Form Elements</h3>
                  <div className="space-y-6">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">Mobile Input</h4>
                      <input 
                        type="text" 
                        placeholder="Mobile-optimized input field"
                        className="mobile-input w-full text-crd-white placeholder:text-crd-lightGray"
                      />
                      <div className="mt-3 text-sm text-crd-lightGray">
                        Height: 48px • Background: #23262F • Border: 1px solid #353945 • Focus: 2px solid #3772FF
                      </div>
                    </div>
                    
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">Mobile Toggle</h4>
                      <div className="mobile-toggle bg-crd-blue relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-0.5 shadow-sm"></div>
                      </div>
                      <div className="mt-3 text-sm text-crd-lightGray">
                        Height: 24px • Border Radius: 12px • Smooth transitions
                      </div>
                    </div>
                  </div>
                </section>

                {/* Mobile Guidelines */}
                <section>
                  <h3 className="text-section text-crd-white mb-6">Mobile Design Guidelines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">Touch Targets</h4>
                      <div className="space-y-2 text-sm text-crd-lightGray">
                        <div>Minimum: <span className="text-crd-blue">44px × 44px</span></div>
                        <div>Optimal: <span className="text-crd-blue">48px × 48px</span></div>
                        <div>Spacing: <span className="text-crd-blue">8px minimum between targets</span></div>
                      </div>
                    </div>
                    <div className="bg-crd-darkGray rounded-xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-medium text-crd-white mb-4">Performance</h4>
                      <div className="space-y-2 text-sm text-crd-lightGray">
                        <div>Target: <span className="text-crd-blue">60fps minimum</span></div>
                        <div>Loading: <span className="text-crd-blue">&lt;2s for hero card</span></div>
                        <div>Memory: <span className="text-crd-blue">&lt;200MB typical session</span></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'buttons' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Buttons</h2>
                
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Button Variants</h3>
                  <div className="space-y-4 max-w-md">
                    <button className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                      Primary Button
                    </button>
                    <button className="w-full border border-crd-mediumGray text-crd-white font-semibold px-6 py-3 rounded-lg hover:bg-crd-mediumGray/20 transition-colors">
                      Secondary Button
                    </button>
                    <button className="w-full bg-crd-orange hover:bg-crd-orange/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                      Action Button
                    </button>
                    <button className="w-full bg-transparent text-crd-lightGray font-semibold px-6 py-3 rounded-lg hover:bg-crd-mediumGray/20 hover:text-white transition-colors">
                      Ghost Button
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'cards' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Cards</h2>
                
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Card Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-crd-dark rounded-2xl p-6 border border-crd-mediumGray/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Standard Card</h4>
                      <p className="text-crd-lightGray">Basic card with dark background and subtle border.</p>
                    </div>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Glass Card</h4>
                      <p className="text-crd-lightGray">Glass morphism effect with blur and transparency.</p>
                    </div>
                    <div className="bg-crd-dark rounded-2xl p-6 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all cursor-pointer">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Interactive Card</h4>
                      <p className="text-crd-lightGray">Hover effects and interactive states.</p>
                    </div>
                    <div className="bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-2xl p-6 border border-crd-blue/30">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Gradient Card</h4>
                      <p className="text-crd-lightGray">Subtle gradient backgrounds for emphasis.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'backgrounds' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Backgrounds</h2>
                
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Background Patterns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-32 bg-crd-darkest rounded-lg border border-crd-mediumGray flex items-center justify-center">
                      <span className="text-crd-lightGray">Solid Dark</span>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-crd-dark to-crd-darkGray rounded-lg flex items-center justify-center">
                      <span className="text-crd-lightGray">Gradient</span>
                    </div>
                    <div className="h-32 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-crd-lightGray">Glass Effect</span>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-crd-blue/10 to-crd-purple/10 rounded-lg border border-crd-blue/20 flex items-center justify-center">
                      <span className="text-crd-lightGray">Accent Gradient</span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignGuide;