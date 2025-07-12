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

            {/* Other sections can be added here as needed */}
            {activeSection !== 'overview' && activeSection !== 'typography' && activeSection !== 'spacing' && (
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
