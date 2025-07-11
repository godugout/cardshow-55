import React, { useState } from 'react';
import { Code2, Palette, Type, MousePointer, Layout, Paintbrush, Sparkles, Image } from 'lucide-react';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { CRDButton, CRDCard, CRDBadge, TeamThemeShowcase, PalettePreview } from '@/components/ui/design-system';
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
    { id: 'team-themes', label: 'Team Themes', icon: Sparkles },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'buttons', label: 'Buttons', icon: MousePointer },
    { id: 'cards', label: 'Cards', icon: Layout },
    { id: 'backgrounds', label: 'Backgrounds', icon: Paintbrush },
  ];

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-white/10 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Design System</h2>
            <nav className="space-y-2">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-lg shadow-primary/10'
                        : 'text-crd-lightGray hover:bg-white/5 hover:text-white hover:shadow-md'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="text-xs font-semibold text-crd-lightGray uppercase tracking-wide mb-2">
                DESIGN SYSTEM
              </div>
              <h1 className="text-4xl font-bold text-crd-white mb-4">
                CRD Design Guide
              </h1>
              <p className="text-crd-lightGray max-w-2xl mx-auto">
                Comprehensive documentation of Cardshow's design system, components, and patterns. Built
                for consistency, accessibility, and exceptional user experiences.
              </p>
            </div>

            {activeSection === 'overview' && (
              <div className="space-y-12">
                {/* Design System Overview */}
                <section>
                  <h2 className="text-2xl font-bold text-crd-white mb-6">Design System Overview</h2>
                  <p className="text-crd-lightGray mb-8">
                    The CRD Design System is built on modern web technologies with a focus on dark aesthetics, glass morphism,
                    and premium user experiences. Every component follows consistent patterns for spacing, typography, and
                    interaction design.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Color System */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                          <Palette size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Color System</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Comprehensive color palette with semantic tokens, gradients, and accessibility considerations.
                      </p>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-primary rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-secondary rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-accent rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-highlight rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shadow-lg">
                          <Type size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Typography</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Consistent type scale, font weights, and text hierarchy for optimal readability.
                      </p>
                      <div className="space-y-1">
                        <div className="w-12 h-3 bg-white/20 rounded"></div>
                        <div className="w-16 h-2 bg-white/15 rounded"></div>
                        <div className="w-20 h-2 bg-white/10 rounded"></div>
                      </div>
                    </div>

                    {/* Interactive Elements */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-highlight rounded-lg flex items-center justify-center shadow-lg">
                          <MousePointer size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Interactive Elements</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Buttons, links, and form controls with consistent states and animations.
                      </p>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-primary rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-secondary rounded shadow-sm"></div>
                        <div className="w-6 h-6 bg-accent rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Card Components */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-highlight to-primary rounded-lg flex items-center justify-center shadow-lg">
                          <Layout size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Card Components</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Glass morphism cards, creator boxes, and collection displays with depth and elegance.
                      </p>
                      <div className="space-y-2">
                        <div className="h-3 bg-white/15 rounded shadow-sm"></div>
                        <div className="h-2 bg-white/10 rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Background Patterns */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                          <Paintbrush size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Background Patterns</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Floating elements, gradients, and animated patterns that create visual depth.
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="w-full h-3 bg-gradient-to-r from-primary to-secondary rounded shadow-sm"></div>
                        <div className="w-full h-3 bg-gradient-to-r from-secondary to-accent rounded shadow-sm"></div>
                        <div className="w-full h-3 bg-gradient-to-r from-accent to-primary rounded shadow-sm"></div>
                      </div>
                    </div>

                    {/* Code Examples */}
                    <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-highlight rounded-lg flex items-center justify-center shadow-lg">
                          <Code2 size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Code Examples</h3>
                      </div>
                      <p className="text-crd-lightGray text-sm mb-4 leading-relaxed">
                        Ready-to-use code snippets with TypeScript support and best practices.
                      </p>
                      <div className="space-y-1">
                        <div className="flex space-x-1">
                          <div className="w-6 h-2 bg-primary rounded shadow-sm"></div>
                          <div className="w-6 h-2 bg-secondary rounded shadow-sm"></div>
                          <div className="w-6 h-2 bg-accent rounded shadow-sm"></div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-white/30 rounded shadow-sm"></div>
                          <div className="w-8 h-2 bg-white/30 rounded shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Principles */}
                <section>
                  <h2 className="text-2xl font-bold text-crd-white mb-8">Key Principles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center glass-panel rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-primary mb-3">Consistency</h3>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        Uniform patterns across all components and interactions.
                      </p>
                    </div>
                    <div className="text-center glass-panel rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-secondary mb-3">Accessibility</h3>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        WCAG compliant with proper contrast and keyboard navigation.
                      </p>
                    </div>
                    <div className="text-center glass-panel rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-accent mb-3">Performance</h3>
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
                  <h3 className="text-xl font-semibold text-white mb-6">CRD Brand Identity</h3>
                  <div className="glass-panel rounded-2xl p-8 border border-white/10">
                    <div className="text-center mb-6">
                      <CRDGradientLogo className="mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">Primary CRD Logo</h4>
                      <p className="text-crd-lightGray text-sm leading-relaxed">
                        The CRD gradient logo with "MKR" suffix. This is our primary brand mark for the CRD platform.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
                        <div className="text-crd-lightGray mb-1 font-medium">File Path</div>
                        <div className="font-mono text-primary text-xs">/lovable-uploads/7697ffa5...</div>
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
                        <div className="text-crd-lightGray mb-1 font-medium">Component</div>
                        <div className="font-mono text-accent text-xs">CRDGradientLogo</div>
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
                        <div className="text-crd-lightGray mb-1 font-medium">Usage</div>
                        <div className="text-secondary text-xs">Primary branding</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cardshow Logo Collection */}
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-6">Cardshow Logo Collection</h3>
                  
                  {/* Basic/Classic Collection */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-white mb-4">Basic & Classic Logos</h4>
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
                    <h4 className="text-lg font-medium text-white mb-4">Modern Collection</h4>
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
                    <h4 className="text-lg font-medium text-white mb-4">Vintage Collection</h4>
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
                  <h3 className="text-xl font-semibold text-white mb-6">Usage Guidelines</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-medium text-white mb-4">When to Use CRD Logo</h4>
                      <ul className="text-crd-lightGray text-sm space-y-2 leading-relaxed">
                        <li>• Platform-wide branding</li>
                        <li>• Technical documentation</li>
                        <li>• Developer tools</li>
                        <li>• API integrations</li>
                        <li>• System architecture</li>
                      </ul>
                    </div>
                    <div className="glass-panel rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-medium text-white mb-4">When to Use Cardshow Logos</h4>
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
                  <h3 className="text-xl font-semibold text-white mb-6">Technical Specifications</h3>
                  <div className="glass-panel rounded-xl p-6 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-3">Logo Sizing</h4>
                        <div className="text-sm text-crd-lightGray space-y-1 leading-relaxed">
                          <div>Minimum: 24px height</div>
                          <div>Standard: 48-64px height</div>
                          <div>Large: 96px+ height</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-3">File Formats</h4>
                        <div className="text-sm text-crd-lightGray space-y-1 leading-relaxed">
                          <div>PNG (web optimized)</div>
                          <div>React components</div>
                          <div>Responsive scaling</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-3">Accessibility</h4>
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
                  <h3 className="text-xl font-semibold text-white mb-6">Implementation Example</h3>
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
                            <div className="text-sm font-medium text-themed-primary">Primary</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.primary}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.secondary }}
                            ></div>
                            <div className="text-sm font-medium text-themed-primary">Secondary</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.secondary}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.accent }}
                            ></div>
                            <div className="text-sm font-medium text-themed-primary">Accent</div>
                            <div className="text-xs text-crd-lightGray">{currentPalette.colors.accent}</div>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-20 rounded-lg mb-2" 
                              style={{ backgroundColor: currentPalette.colors.neutral }}
                            ></div>
                            <div className="text-sm font-medium text-themed-primary">Neutral</div>
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
                        <h5 className="text-lg font-semibold text-themed-primary mb-2">Themed Card</h5>
                        <p className="text-themed-secondary">This card uses the current team theme colors automatically.</p>
                      </CRDCard>
                      <CRDCard variant="interactive" className="p-6">
                        <h5 className="text-lg font-semibold text-themed-primary mb-2">Interactive Themed Card</h5>
                        <p className="text-themed-secondary">Hover effects with team colors.</p>
                      </CRDCard>
                    </div>
                  </div>

                  {/* Text Styles */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-crd-white mb-4">Text Styles</h4>
                    <div className="space-y-3">
                      <div className="text-themed-primary text-xl font-semibold">Primary themed text</div>
                      <div className="text-themed-secondary">Secondary themed text</div>
                      <div className="accent-themed font-medium">Accent themed text</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'typography' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-crd-white">Typography</h2>
                
                <section>
                  <h3 className="text-xl font-semibold text-crd-white mb-4">Type Scale</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-black text-crd-white mb-2">Hero Heading</div>
                      <div className="text-sm text-crd-lightGray">4xl / 900 weight</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-crd-white mb-2">Main Heading</div>
                      <div className="text-sm text-crd-lightGray">3xl / 700 weight</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-crd-white mb-2">Section Heading</div>
                      <div className="text-sm text-crd-lightGray">2xl / 600 weight</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium text-crd-white mb-2">Component Heading</div>
                      <div className="text-sm text-crd-lightGray">xl / 500 weight</div>
                    </div>
                    <div>
                      <div className="text-base font-normal text-crd-white mb-2">Body Text</div>
                      <div className="text-sm text-crd-lightGray">base / 400 weight</div>
                    </div>
                    <div>
                      <div className="text-sm font-normal text-crd-lightGray mb-2">Small Text</div>
                      <div className="text-sm text-crd-lightGray">sm / 400 weight</div>
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