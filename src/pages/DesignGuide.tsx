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

            {/* Typography Section with Fixed Template Literal */}
            {activeSection === 'typography' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Typography System</h2>
                
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

            {/* Spacing Section */}
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
              </div>
            )}

            {/* Default Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-crd-white mb-6 transition-colors duration-300">Design System Overview</h2>
                  <p className="text-crd-lightGray mb-8 transition-colors duration-300">
                    The CRD Design System is built on modern web technologies with a focus on dark aesthetics, glass morphism,
                    and premium user experiences. Every component follows consistent patterns for spacing, typography, and
                    interaction design.
                  </p>
                </section>
              </div>
            )}

            {/* Brand Assets Section */}
            {activeSection === 'brand-assets' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Brand & Visual Assets</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Logo Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'Gradient Logo', component: <CRDGradientLogo className="h-12" /> },
                      { name: 'Basic Logo', component: <CardshowBasicLogo className="h-12" /> },
                      { name: 'Blue Logo', component: <CardshowBlueLogo className="h-12" /> },
                      { name: 'Orange Logo', component: <CardshowOrangeLogo className="h-12" /> },
                      { name: 'Modern Logo', component: <CardshowModernLogo className="h-12" /> },
                      { name: 'Retro Logo', component: <CardshowRetroLogo className="h-12" /> },
                      { name: 'Vintage Logo', component: <CardshowVintageLogo className="h-12" /> },
                      { name: 'Red Blue Logo', component: <CardshowRedBlueLogo className="h-12" /> },
                      { name: 'Block Letters', component: <CardshowBlockLettersLogo className="h-12" /> },
                      { name: 'Green Logo', component: <CardshowGreenLogo className="h-12" /> },
                      { name: 'Green Sparkles', component: <CardshowGreenSparklesLogo className="h-12" /> },
                    ].map((logo) => (
                      <CRDCard key={logo.name} className="p-6 text-center">
                        <div className="flex justify-center mb-4">{logo.component}</div>
                        <p className="text-sm text-themed-secondary">{logo.name}</p>
                      </CRDCard>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Color Palette Section */}
            {activeSection === 'color-palette' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Color Palette</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Team Themes</h3>
                  <TeamThemeShowcase />
                </section>

                <section>
                  <h3 className="text-section text-crd-white mb-6">Available Palettes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availablePalettes.map((palette) => (
                      <CRDCard key={palette.id} className="p-6">
                        <div className="mb-4">
                          <PalettePreview palette={palette} size="lg" showLabels />
                        </div>
                        <CRDButton 
                          variant={currentPalette?.id === palette.id ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => setTheme(palette.id)}
                          className="w-full"
                        >
                          {currentPalette?.id === palette.id ? 'Active' : 'Apply Theme'}
                        </CRDButton>
                      </CRDCard>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Glass Effects Section */}
            {activeSection === 'glass-effects' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Glass Morphism</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Glass Effect Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Light Glass', class: 'glass-light' },
                      { name: 'Medium Glass', class: 'glass-medium' },
                      { name: 'Heavy Glass', class: 'glass-heavy' },
                    ].map((effect) => (
                      <div key={effect.name} className={`${effect.class} p-8 rounded-xl text-center`}>
                        <h4 className="text-lg font-semibold text-crd-white mb-2">{effect.name}</h4>
                        <p className="text-sm text-crd-lightGray">Hover to see effect</p>
                        <div className="mt-4 text-xs text-crd-lightGray font-mono bg-crd-darkGray/50 p-2 rounded">
                          .{effect.class}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Animations Section */}
            {activeSection === 'animations' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Animations & Timing</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Animation Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'Fade In', class: 'animate-fade-in' },
                      { name: 'Scale In', class: 'animate-scale-in' },
                      { name: 'Hover Scale', class: 'hover-scale' },
                      { name: 'Hover Lift', class: 'hover-lift' },
                      { name: 'Pulse', class: 'pulse' },
                      { name: 'Button Press', class: 'button-press' },
                    ].map((animation) => (
                      <CRDCard key={animation.name} className={`p-6 text-center cursor-pointer ${animation.class}`}>
                        <h4 className="text-lg font-semibold text-crd-white mb-2">{animation.name}</h4>
                        <div className="text-xs text-crd-lightGray font-mono bg-crd-darkGray/50 p-2 rounded">
                          .{animation.class}
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Mobile Components Section */}
            {activeSection === 'mobile' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Mobile Components</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Mobile Utilities</h3>
                  <div className="space-y-6">
                    <CRDCard className="p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Touch Targets</h4>
                      <div className="space-y-3">
                        <div className="mobile-avatar-sm bg-crd-blue rounded-full"></div>
                        <div className="mobile-avatar-md bg-crd-green rounded-full"></div>
                        <div className="mobile-avatar-lg bg-crd-orange rounded-full"></div>
                      </div>
                    </CRDCard>
                    
                    <CRDCard className="p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Mobile Input</h4>
                      <input className="mobile-input w-full" placeholder="Mobile-optimized input" />
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Team Themes Section */}
            {activeSection === 'team-themes' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Team Themes</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Current Theme Showcase</h3>
                  <TeamThemeShowcase />
                </section>
              </div>
            )}

            {/* Buttons Section */}
            {activeSection === 'buttons' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Buttons</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Button Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CRDCard className="p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Sizes</h4>
                      <div className="space-y-3">
                        <CRDButton size="sm">Small Button</CRDButton>
                        <CRDButton size="default">Medium Button</CRDButton>
                        <CRDButton size="lg">Large Button</CRDButton>
                      </div>
                    </CRDCard>
                    
                    <CRDCard className="p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-4">Variants</h4>
                      <div className="space-y-3">
                        <CRDButton variant="primary">Primary</CRDButton>
                        <CRDButton variant="secondary">Secondary</CRDButton>
                        <CRDButton variant="outline">Outline</CRDButton>
                        <CRDButton variant="ghost">Ghost</CRDButton>
                      </div>
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Cards Section */}
            {activeSection === 'cards' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Cards</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Card Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CRDCard className="p-6">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Basic Card</h4>
                      <p className="text-themed-secondary">Standard card with themed background and borders.</p>
                    </CRDCard>
                    
                    <CRDCard className="p-6 team-spirit-glow">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Glowing Card</h4>
                      <p className="text-themed-secondary">Card with team spirit glow effect.</p>
                    </CRDCard>
                    
                    <CRDCard className="p-6 glass-medium">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Glass Card</h4>
                      <p className="text-themed-secondary">Card with glass morphism effect.</p>
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Backgrounds Section */}
            {activeSection === 'backgrounds' && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">Backgrounds</h2>
                
                <section>
                  <h3 className="text-section text-crd-white mb-6">Background Examples</h3>
                  <div className="space-y-6">
                    <div className="p-8 rounded-xl bg-gradient-to-r from-crd-darkest to-crd-darkGray">
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Dark Gradient</h4>
                      <p className="text-crd-lightGray">Subtle gradient background</p>
                    </div>
                    
                    <div className="p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))' }}>
                      <h4 className="text-lg font-semibold text-crd-white mb-2">Themed Gradient</h4>
                      <p className="text-crd-lightGray">Background using current theme colors</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Fallback for any missing sections */}
            {!['overview', 'typography', 'spacing', 'brand-assets', 'color-palette', 'glass-effects', 'animations', 'mobile', 'team-themes', 'buttons', 'cards', 'backgrounds'].includes(activeSection) && (
              <div className="space-y-12">
                <h2 className="text-display text-crd-white">{sidebarSections.find(s => s.id === activeSection)?.label}</h2>
                <p className="text-crd-lightGray">This section is under development.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignGuide;
