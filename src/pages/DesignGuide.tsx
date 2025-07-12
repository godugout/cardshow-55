import React, { useState } from 'react';
import { Code2, Palette, Type, MousePointer, Layout, Paintbrush, Sparkles, Image, Eye, Heart, Zap, Globe, Users, Layers, Target, BookOpen, Share2, Download, Check } from 'lucide-react';
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
import { CardshowGreenSparklesOfficialLogo } from '@/components/home/navbar/CardshowGreenSparklesOfficialLogo';
import { CardshowGreenScriptLogo } from '@/components/home/navbar/CardshowGreenScriptLogo';
import { CardshowBrownOrangeLogo } from '@/components/home/navbar/CardshowBrownOrangeLogo';
import { CardshowBlueOutlineLogo } from '@/components/home/navbar/CardshowBlueOutlineLogo';
import { CardshowTealSparklesLogo } from '@/components/home/navbar/CardshowTealSparklesLogo';
import { CardshowRedScriptLogo } from '@/components/home/navbar/CardshowRedScriptLogo';
import { CardshowBlackBoldLogo } from '@/components/home/navbar/CardshowBlackBoldLogo';
import { CardshowPurpleOutlineLogo } from '@/components/home/navbar/CardshowPurpleOutlineLogo';
import { CardshowOrangeBlackBoldLogo } from '@/components/home/navbar/CardshowOrangeBlackBoldLogo';

const DesignGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentPalette, availablePalettes, setTheme } = useTeamTheme();

  const sidebarSections = [
    { id: 'overview', label: 'Brand Overview', icon: Layout, description: 'Mission, vision, and design philosophy' },
    { id: 'brand-identity', label: 'Brand Identity & Visual Language', icon: Heart, description: 'Logos, colors, typography, and brand story' },
    { id: 'user-experience', label: 'User Experience & Interface Design', icon: Users, description: 'Components, interactions, and UX patterns' },
    { id: 'technical-system', label: 'Technical Architecture & System', icon: Layers, description: 'Design tokens, CSS architecture, and performance' },
    { id: 'team-customization', label: 'Team Themes & Customization', icon: Sparkles, description: 'CRD:DNA system and theme applications' },
  ];

  const logoVariants = [
    { name: 'Cardshow Official', component: <CardshowGreenSparklesOfficialLogo className="h-16" />, usage: 'Primary brand mark with sparkles - Official Cardshow logo', context: 'Main brand applications, hero sections, official materials', theme: { primary: '#45B26B', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'CRD Gradient', component: <CRDGradientLogo className="h-16" />, usage: 'Technical brand mark for development tools', context: 'CRD maker, developer tools, technical documentation', theme: { primary: '#3772FF', secondary: '#9757D7', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Green Script', component: <CardshowGreenScriptLogo className="h-16" />, usage: 'Elegant script version for premium contexts', context: 'Luxury collections, premium features, elegant presentations', theme: { primary: '#45B26B', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Brown Orange', component: <CardshowBrownOrangeLogo className="h-16" />, usage: 'Warm, vintage appeal for retro themes', context: 'Vintage collections, heritage features, classic designs', theme: { primary: '#8B4513', secondary: '#FF8C00', accent: '#FFE4B5', text: '#FFFFFF' } },
    { name: 'Blue Outline', component: <CardshowBlueOutlineLogo className="h-16" />, usage: 'Clean outline version for professional use', context: 'Corporate communications, business materials, clean layouts', theme: { primary: '#3772FF', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Teal Sparkles', component: <CardshowTealSparklesLogo className="h-16" />, usage: 'Modern premium with magical elements', context: 'Special events, premium features, modern aesthetics', theme: { primary: '#008B8B', secondary: '#FFD700', accent: '#000000', text: '#FFFFFF' } },
    { name: 'Red Script', component: <CardshowRedScriptLogo className="h-16" />, usage: 'Bold script for high-energy contexts', context: 'Action features, dynamic content, high-energy themes', theme: { primary: '#DC143C', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Black Bold', component: <CardshowBlackBoldLogo className="h-16" />, usage: 'Strong, minimalist version', context: 'Modern minimalist designs, high contrast needs', theme: { primary: '#000000', secondary: '#FFFFFF', accent: '#808080', text: '#FFFFFF' } },
    { name: 'Purple Outline', component: <CardshowPurpleOutlineLogo className="h-16" />, usage: 'Premium outline version', context: 'Luxury branding, premium tier features, elegant designs', theme: { primary: '#9757D7', secondary: '#FFFFFF', accent: '#FFD700', text: '#FFFFFF' } },
    { name: 'Orange Black Bold', component: <CardshowOrangeBlackBoldLogo className="h-16" />, usage: 'High-contrast bold version', context: 'Sports themes, high-energy content, bold statements', theme: { primary: '#FF8C00', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Cardshow Basic', component: <CardshowBasicLogo className="h-16" />, usage: 'Clean, minimal version for professional contexts', context: 'Documentation, business materials, partnerships', theme: { primary: '#3772FF', secondary: '#FFFFFF', accent: '#000000', text: '#FFFFFF' } },
    { name: 'Cardshow Blue', component: <CardshowBlueLogo className="h-16" />, usage: 'Trust and reliability messaging', context: 'Corporate communications, enterprise features', theme: { primary: '#3772FF', secondary: '#FFFFFF', accent: '#000000', text: '#FFFFFF' } },
    { name: 'Cardshow Orange', component: <CardshowOrangeLogo className="h-16" />, usage: 'Energy and creativity themes', context: 'Creator tools, community features, calls-to-action', theme: { primary: '#EA6E48', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Cardshow Modern', component: <CardshowModernLogo className="h-16" />, usage: 'Contemporary, tech-forward messaging', context: 'Innovation showcases, product launches', theme: { primary: '#3772FF', secondary: '#9757D7', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Cardshow Retro', component: <CardshowRetroLogo className="h-16" />, usage: 'Nostalgic, vintage card collecting appeal', context: 'Heritage features, collector community', theme: { primary: '#8B4513', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Cardshow Vintage', component: <CardshowVintageLogo className="h-16" />, usage: 'Classic elegance and timeless quality', context: 'Premium offerings, luxury collections', theme: { primary: '#8B4513', secondary: '#FFE4B5', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Cardshow Red Blue', component: <CardshowRedBlueLogo className="h-16" />, usage: 'Patriotic themes and American sports', context: 'Sports partnerships, team collaborations', theme: { primary: '#DC143C', secondary: '#0000FF', accent: '#FFFFFF', text: '#FFFFFF' } },
    { name: 'Block Letters', component: <CardshowBlockLettersLogo className="h-16" />, usage: 'Bold, impactful messaging', context: 'Headlines, promotional materials, merchandise', theme: { primary: '#000000', secondary: '#FFFFFF', accent: '#808080', text: '#FFFFFF' } },
    { name: 'Cardshow Green', component: <CardshowGreenLogo className="h-16" />, usage: 'Growth, success, and environmental themes', context: 'Sustainability messaging, creator economy', theme: { primary: '#45B26B', secondary: '#FFFFFF', accent: '#000000', text: '#FFFFFF' } },
    { name: 'Green Sparkles', component: <CardshowGreenSparklesLogo className="h-16" />, usage: 'Magical, premium experiences', context: 'Special events, premium features, celebrations', theme: { primary: '#45B26B', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' } },
  ];

  const designPrinciples = [
    { 
      icon: Eye, 
      title: 'Visual Fidelity First',
      description: 'Every digital card should be indistinguishable from its physical counterpart. We achieve photorealism through advanced materials, accurate lighting, and authentic surface properties.',
      impact: 'Users experience genuine emotional connections with digital cards'
    },
    { 
      icon: Zap, 
      title: 'Performance Without Compromise',
      description: 'Premium visual quality delivered at 60fps minimum on all devices. Our optimization strategies ensure cinematic experiences without sacrificing accessibility.',
      impact: 'Consistent premium experience across all user devices and contexts'
    },
    { 
      icon: Heart, 
      title: 'Emotional Resonance',
      description: 'Every interaction creates moments of wonder. From pack opening ceremonies to card discoveries, we design for the emotional peaks that make collecting magical.',
      impact: 'High engagement, social sharing, and lasting user retention'
    },
    { 
      icon: Globe, 
      title: 'Universal Accessibility',
      description: 'Beautiful design that works for everyone. Our system scales from mobile screens to large displays while maintaining WCAG AAA standards.',
      impact: 'Inclusive platform that serves diverse global communities'
    }
  ];

  const brandMetrics = [
    { label: 'Components Available', value: '47', trend: 'Active', context: 'Design system components' },
    { label: 'Team Themes', value: '570+', trend: 'Growing', context: 'Professional sports coverage' },
    { label: 'Accessibility Standard', value: 'AAA', trend: 'Target', context: 'WCAG compliance goal' },
    { label: 'Mobile Performance', value: '60fps', trend: 'Target', context: 'Minimum frame rate goal' }
  ];

  return (
    <div className="min-h-screen bg-crd-darkest pt-16 transition-all duration-500">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gradient-to-b from-crd-darkGray to-crd-darkGray/80 border-r border-crd-mediumGray/30 overflow-y-auto transition-all duration-500 backdrop-blur-sm">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-crd-white mb-2">Professional Brand Guide</h2>
              <p className="text-sm text-crd-lightGray">Complete design system documentation for Cardshow & CRD brands</p>
            </div>
            
            <nav className="space-y-3">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex flex-col items-start space-y-2 p-4 rounded-xl text-left transition-all duration-300 group ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-crd-blue/20 to-crd-purple/20 border border-crd-blue/50 shadow-lg shadow-crd-blue/10'
                        : 'hover:bg-crd-mediumGray/50 hover:shadow-md border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Icon size={20} className={`${activeSection === section.id ? 'text-crd-blue' : 'text-crd-lightGray group-hover:text-crd-white'} transition-colors`} />
                      <span className={`text-sm font-semibold ${activeSection === section.id ? 'text-crd-white' : 'text-crd-lightGray group-hover:text-crd-white'} transition-colors`}>
                        {section.label}
                      </span>
                    </div>
                    <p className={`text-xs ${activeSection === section.id ? 'text-crd-lightGray' : 'text-crd-lightGray/70'} leading-relaxed`}>
                      {section.description}
                    </p>
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-crd-darkGray/50 to-crd-mediumGray/30 rounded-xl border border-crd-mediumGray/20">
              <h3 className="text-sm font-semibold text-crd-white mb-3">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-crd-lightGray">Components</span>
                  <span className="text-crd-green font-mono">47</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-crd-lightGray">Team Themes</span>
                  <span className="text-crd-blue font-mono">570+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-crd-lightGray">Accessibility</span>
                  <span className="text-crd-purple font-mono">AAA</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 ml-80 transition-all duration-500">
          <div className="max-w-6xl mx-auto p-8">
            
            {/* Brand Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-16">
                {/* Hero Header */}
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-crd-blue/10 to-crd-purple/10 px-4 py-2 rounded-full border border-crd-blue/20">
                    <BookOpen size={16} className="text-crd-blue" />
                    <span className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Professional Brand Guide</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-crd-white via-crd-blue to-crd-purple bg-clip-text text-transparent leading-tight">
                    Cardshow & CRD Design System
                  </h1>
                  
                  <p className="text-xl text-crd-lightGray max-w-3xl mx-auto leading-relaxed">
                    The complete brand guide for creating the world's most advanced digital trading card platform. 
                    Built for photorealism, performance, and emotional resonance.
                  </p>

                  <div className="flex items-center justify-center space-x-4">
                    <CRDButton variant="primary" className="group">
                      <Download size={16} className="mr-2 group-hover:animate-bounce" />
                      Download Assets
                    </CRDButton>
                    <CRDButton variant="outline">
                      <Share2 size={16} className="mr-2" />
                      Share Guide
                    </CRDButton>
                  </div>
                </div>

                {/* Brand Mission */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-crd-white">Our Mission</h2>
                    <div className="space-y-4 text-lg text-crd-lightGray leading-relaxed">
                      <p>
                        <strong className="text-crd-white">Cardshow transforms trading cards into living, breathing digital experiences.</strong> 
                        We're not just digitizing cards—we're creating a new medium where physical authenticity meets digital possibility.
                      </p>
                      <p>
                        Every pixel serves the story. Every animation honors the emotion. Every interaction celebrates the collector's journey.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-crd-blue to-crd-purple border-2 border-crd-darkGray"></div>
                        ))}
                      </div>
                      <span className="text-sm text-crd-lightGray">Building the future of digital collecting</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 to-crd-blue/20 rounded-2xl blur-xl"></div>
                    <CRDCard className="relative p-8 text-center space-y-6">
                      <div className="flex justify-center items-center space-x-4">
                        <CardshowGreenSparklesOfficialLogo className="w-16" />
                        <div className="w-px h-12 bg-crd-mediumGray/50"></div>
                        <CRDGradientLogo className="w-16" />
                      </div>
                      <h3 className="text-xl font-bold text-crd-white">Cardshow & CRD Platform</h3>
                      <p className="text-crd-lightGray">Photorealistic rendering • Real-time physics • Emotional storytelling</p>
                    </CRDCard>
                  </div>
                </section>

                {/* Design Principles */}
                <section className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-crd-white">Design Principles</h2>
                    <p className="text-lg text-crd-lightGray max-w-2xl mx-auto">
                      Four foundational principles guide every design decision across the Cardshow ecosystem
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {designPrinciples.map((principle, index) => (
                      <CRDCard key={index} className="p-8 group hover:shadow-2xl hover:shadow-crd-blue/10 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-xl">
                            <principle.icon size={24} className="text-crd-blue" />
                          </div>
                          <div className="space-y-3 flex-1">
                            <h3 className="text-xl font-bold text-crd-white group-hover:text-crd-blue transition-colors">
                              {principle.title}
                            </h3>
                            <p className="text-crd-lightGray leading-relaxed">
                              {principle.description}
                            </p>
                            <div className="pt-2 border-t border-crd-mediumGray/30">
                              <p className="text-sm text-crd-blue font-medium">
                                Impact: {principle.impact}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Brand Metrics */}
                <section className="space-y-8">
                   <div className="text-center space-y-4">
                     <h2 className="text-3xl font-bold text-crd-white">System Overview</h2>
                     <p className="text-lg text-crd-lightGray">
                       Current system capabilities and development targets
                     </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    {brandMetrics.map((metric, index) => (
                      <CRDCard key={index} className="p-6 text-center space-y-4 group hover:shadow-lg hover:shadow-crd-green/10 transition-all">
                         <div className="text-3xl font-bold text-crd-green">{metric.value}</div>
                         <div className="space-y-1">
                           <div className="text-sm font-semibold text-crd-white">{metric.label}</div>
                           <div className="text-xs text-crd-lightGray">{metric.context}</div>
                         </div>
                         <div className="flex items-center justify-center space-x-1">
                           <span className="text-xs text-crd-blue font-medium">{metric.trend}</span>
                         </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Brand Identity & Visual Language Section */}
            {activeSection === 'brand-identity' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Brand Identity & Visual Language</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Complete visual identity system including logos, color psychology, typography hierarchy, 
                    and brand applications across all touchpoints.
                  </p>
                </div>

                {/* Logo System */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Logo System & Brand Marks</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      Our comprehensive logo collection serves different contexts and emotional messaging. 
                      Each variant maintains brand recognition while adapting to specific use cases and audiences.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {logoVariants.map((logo, index) => (
                      <CRDCard key={index} className="p-6 group hover:shadow-lg hover:shadow-crd-blue/10 transition-all duration-300">
                        <div className="flex justify-center mb-6 p-4 bg-gradient-to-br from-crd-darkGray/50 to-crd-mediumGray/30 rounded-xl">
                          {logo.component}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-crd-white group-hover:text-crd-blue transition-colors">
                            {logo.name}
                          </h3>
                          <p className="text-sm text-crd-lightGray leading-relaxed">
                            {logo.usage}
                          </p>
                          <div className="pt-2 border-t border-crd-mediumGray/30">
                            <p className="text-xs text-crd-blue font-medium">
                              Best for: {logo.context}
                            </p>
                          </div>
                          {logo.theme && (
                            <div className="flex justify-center space-x-1 mt-2">
                              <div className="w-4 h-4 rounded-full border border-crd-mediumGray/30" style={{ backgroundColor: logo.theme.primary }}></div>
                              <div className="w-4 h-4 rounded-full border border-crd-mediumGray/30" style={{ backgroundColor: logo.theme.secondary }}></div>
                              <div className="w-4 h-4 rounded-full border border-crd-mediumGray/30" style={{ backgroundColor: logo.theme.accent }}></div>
                            </div>
                          )}
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Logo Usage Guidelines */}
                <section className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-crd-white">Usage Guidelines</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-crd-white font-medium">Maintain clear space</p>
                          <p className="text-sm text-crd-lightGray">Minimum 2x logo height on all sides</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-crd-white font-medium">Preserve aspect ratio</p>
                          <p className="text-sm text-crd-lightGray">Never stretch or distort logo proportions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-crd-white font-medium">Use appropriate contrast</p>
                          <p className="text-sm text-crd-lightGray">Ensure 4.5:1 contrast ratio minimum</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-crd-white">Download Assets</h3>
                    
                    <div className="space-y-3">
                      {['SVG Vector Files', 'PNG (Multiple Sizes)', 'PDF Brand Guide', 'Figma Components'].map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-crd-darkGray rounded-lg">
                          <span className="text-crd-white text-sm">{asset}</span>
                          <CRDButton size="sm" variant="outline">
                            <Download size={14} className="mr-1" />
                            Download
                          </CRDButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Color Psychology */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Color Psychology & Brand Palette</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      Our color system is rooted in psychology and designed to evoke specific emotions that enhance 
                      the collecting experience. Each color serves a strategic purpose in user engagement and brand perception.
                    </p>
                  </div>

                  <TeamThemeShowcase />

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { color: 'CRD Blue', hex: '#3772FF', psychology: 'Trust, reliability, premium quality', usage: 'Primary CTAs, links, focus states' },
                      { color: 'CRD Green', hex: '#45B26B', psychology: 'Success, growth, positive outcomes', usage: 'Confirmations, achievements, financial gains' },
                      { color: 'CRD Orange', hex: '#EA6E48', psychology: 'Energy, creativity, excitement', usage: 'Highlights, warnings, creator tools' },
                      { color: 'CRD Purple', hex: '#9757D7', psychology: 'Luxury, exclusivity, premium features', usage: 'Premium tiers, rare items, special events' }
                    ].map((color, index) => (
                      <CRDCard key={index} className="p-6 space-y-4">
                        <div className="h-16 rounded-lg" style={{ backgroundColor: color.hex }}></div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-crd-white">{color.color}</h3>
                          <p className="text-xs text-crd-lightGray font-mono">{color.hex}</p>
                          <p className="text-sm text-crd-lightGray leading-relaxed">{color.psychology}</p>
                          <p className="text-xs text-crd-blue font-medium">{color.usage}</p>
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Typography Hierarchy */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Typography Hierarchy</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      Our typography system balances readability with personality, using carefully chosen weights and sizes 
                      to create clear information hierarchy while maintaining the premium feel of our brand.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {[
                      { label: 'Display', size: 'text-display', weight: 'font-extrabold', example: 'Welcome to Cardshow', usage: 'Hero headlines, major announcements' },
                      { label: 'Section', size: 'text-section', weight: 'font-bold', example: 'Featured Collections', usage: 'Page sections, major groupings' },
                      { label: 'Page Title', size: 'text-page-title', weight: 'font-bold', example: 'My Collection Dashboard', usage: 'Page titles, modal headers' },
                      { label: 'Component', size: 'text-component', weight: 'font-semibold', example: 'Filter by Rarity', usage: 'Component labels, card titles' },
                      { label: 'Body', size: 'text-body', weight: 'font-normal', example: 'Discover rare cards from your favorite teams and players', usage: 'Main content, descriptions' },
                      { label: 'Caption', size: 'text-caption', weight: 'font-normal', example: 'Last updated 2 minutes ago', usage: 'Metadata, timestamps, helper text' }
                    ].map((type, index) => (
                      <div key={index} className="p-6 bg-crd-darkGray rounded-xl border border-crd-mediumGray/30">
                        <div className="grid lg:grid-cols-2 gap-6 items-center">
                          <div>
                            <div className={`${type.size} ${type.weight} text-crd-white mb-2`}>
                              {type.example}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-crd-lightGray">
                              <span className="font-mono">{type.label}</span>
                              <span>•</span>
                              <span>{type.usage}</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-crd-blue font-mono">
                            {type.size} {type.weight}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* User Experience & Interface Design Section */}
            {activeSection === 'user-experience' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">User Experience & Interface Design</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Comprehensive component library, interaction patterns, and UX guidelines designed for 
                    premium experiences across all devices and accessibility standards.
                  </p>
                </div>

                {/* Component Showcase */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Interactive Component Library</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Buttons */}
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-xl font-semibold text-crd-white">Button System</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm text-crd-lightGray">Primary Actions</p>
                          <div className="flex flex-wrap gap-3">
                            <CRDButton variant="primary" size="sm">Small</CRDButton>
                            <CRDButton variant="primary" size="default">Default</CRDButton>
                            <CRDButton variant="primary" size="lg">Large</CRDButton>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-crd-lightGray">Secondary Actions</p>
                          <div className="flex flex-wrap gap-3">
                            <CRDButton variant="secondary">Secondary</CRDButton>
                            <CRDButton variant="outline">Outline</CRDButton>
                            <CRDButton variant="ghost">Ghost</CRDButton>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-crd-mediumGray/30">
                        <p className="text-xs text-crd-blue">
                          All buttons include hover states, focus rings, and loading animations
                        </p>
                      </div>
                    </CRDCard>

                    {/* Cards */}
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-xl font-semibold text-crd-white">Card Components</h3>
                      <div className="space-y-4">
                        <CRDCard className="p-4">
                          <h4 className="font-semibold text-crd-white mb-2">Basic Card</h4>
                          <p className="text-sm text-crd-lightGray">Standard content container with themed styling</p>
                        </CRDCard>
                        
                        <CRDCard className="p-4 team-spirit-glow">
                          <h4 className="font-semibold text-crd-white mb-2">Glowing Card</h4>
                          <p className="text-sm text-crd-lightGray">Enhanced card with team spirit effects</p>
                        </CRDCard>
                        
                        <CRDCard className="p-4 glass-medium">
                          <h4 className="font-semibold text-crd-white mb-2">Glass Morphism</h4>
                          <p className="text-sm text-crd-lightGray">Translucent glass effect variant</p>
                        </CRDCard>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Animation System */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Animation & Timing System</h2>
                    <p className="text-crd-lightGray">
                      Carefully crafted animations that enhance usability while maintaining premium feel and performance.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: 'Fade In', class: 'animate-fade-in', timing: '300ms ease-out', purpose: 'Content reveals, page transitions' },
                      { name: 'Scale In', class: 'animate-scale-in', timing: '200ms ease-out', purpose: 'Modal openings, card appearances' },
                      { name: 'Hover Scale', class: 'hover-scale', timing: '200ms ease-out', purpose: 'Interactive feedback, card hovers' },
                      { name: 'Glass Blur', class: 'fade-blur', timing: '300ms ease-out', purpose: 'Modal backdrops, overlays' },
                      { name: 'Button Press', class: 'button-press', timing: '150ms ease-out', purpose: 'Tactile button feedback' },
                      { name: 'Pulse', class: 'pulse', timing: '2s infinite', purpose: 'Loading states, attention-grabbing' }
                    ].map((animation, index) => (
                      <CRDCard key={index} className={`p-6 text-center cursor-pointer ${animation.class} group`}>
                        <h4 className="text-lg font-semibold text-crd-white mb-2">{animation.name}</h4>
                        <div className="space-y-2">
                          <div className="text-xs text-crd-lightGray font-mono bg-crd-darkGray/50 p-2 rounded">
                            .{animation.class}
                          </div>
                          <p className="text-xs text-crd-blue">{animation.timing}</p>
                          <p className="text-xs text-crd-lightGray leading-relaxed">{animation.purpose}</p>
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Accessibility Guidelines */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Accessibility & Inclusion</h2>
                    <p className="text-crd-lightGray">
                      WCAG AAA compliant design system ensuring our platform is accessible to all users, 
                      regardless of ability or assistive technology.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">Color Contrast Standards</h3>
                      <div className="space-y-4">
                        {[
                          { bg: 'bg-crd-blue', text: 'text-crd-white', ratio: '7.2:1', level: 'AAA' },
                          { bg: 'bg-crd-green', text: 'text-crd-white', ratio: '6.8:1', level: 'AAA' },
                          { bg: 'bg-crd-orange', text: 'text-crd-white', ratio: '5.1:1', level: 'AA+' },
                          { bg: 'bg-crd-darkGray', text: 'text-crd-white', ratio: '8.9:1', level: 'AAA' }
                        ].map((combo, index) => (
                          <div key={index} className={`p-4 rounded-lg ${combo.bg} ${combo.text} flex justify-between items-center`}>
                            <span className="font-medium">Sample Text</span>
                            <div className="text-sm">
                              <span className="opacity-80">{combo.ratio}</span>
                              <span className="ml-2 px-2 py-1 bg-black/20 rounded text-xs">{combo.level}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">Keyboard Navigation</h3>
                      <div className="space-y-3">
                        {[
                          'All interactive elements are keyboard accessible',
                          'Visible focus indicators with 2px outline',
                          'Logical tab order throughout the interface',
                          'Skip links for efficient navigation',
                          'Screen reader optimized markup'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                            <span className="text-sm text-crd-lightGray">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Mobile Optimization */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Mobile-First Design</h2>
                    <p className="text-crd-lightGray">
                      Optimized for touch interactions with appropriate target sizes, gestures, and responsive layouts 
                      that maintain premium quality across all screen sizes.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Touch Targets</h3>
                      <div className="space-y-3">
                        <div className="mobile-avatar-sm bg-crd-blue rounded-full" title="Small: 32px minimum"></div>
                        <div className="mobile-avatar-md bg-crd-green rounded-full" title="Medium: 44px recommended"></div>
                        <div className="mobile-avatar-lg bg-crd-orange rounded-full" title="Large: 56px for primary actions"></div>
                      </div>
                      <p className="text-xs text-crd-lightGray">
                        All touch targets meet 44px minimum accessibility requirement
                      </p>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Mobile Input</h3>
                      <input className="mobile-input w-full" placeholder="Mobile-optimized input field" />
                      <p className="text-xs text-crd-lightGray">
                        Larger text, appropriate keyboard types, validation feedback
                      </p>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Responsive Grid</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-crd-blue/20 rounded"></div>
                        <div className="h-8 bg-crd-green/20 rounded"></div>
                        <div className="h-8 bg-crd-orange/20 rounded col-span-2"></div>
                      </div>
                      <p className="text-xs text-crd-lightGray">
                        Flexible layouts that adapt to any screen size
                      </p>
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Technical Architecture & System Section */}
            {activeSection === 'technical-system' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Technical Architecture & System</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Design token system, CSS architecture, performance optimization, and developer handoff specifications 
                    for consistent implementation across all platforms.
                  </p>
                </div>

                {/* Design Tokens */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Design Token System</h2>
                    <p className="text-crd-lightGray">
                      Semantic tokens that ensure consistency across all platforms and enable dynamic theming capabilities.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-8">
                      <h3 className="text-lg font-semibold text-crd-white mb-6">Spacing Scale</h3>
                      <div className="space-y-4">
                        {[
                          { token: 'xs', value: '8px', usage: 'Tight spacing, icon gaps' },
                          { token: 'sm', value: '12px', usage: 'Small component padding' },
                          { token: 'md', value: '16px', usage: 'Standard spacing unit' },
                          { token: 'lg', value: '24px', usage: 'Section spacing' },
                          { token: 'xl', value: '32px', usage: 'Large component margins' },
                          { token: '2xl', value: '48px', usage: 'Page section gaps' },
                          { token: '3xl', value: '64px', usage: 'Hero section spacing' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-4 bg-crd-blue rounded" style={{ width: item.value }}></div>
                              <span className="text-sm text-crd-white font-mono">{item.token}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-crd-blue font-mono">{item.value}</div>
                              <div className="text-xs text-crd-lightGray">{item.usage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8">
                      <h3 className="text-lg font-semibold text-crd-white mb-6">Border Radius System</h3>
                      <div className="space-y-4">
                        {[
                          { token: 'sm', value: '8px', usage: 'Buttons, inputs' },
                          { token: 'md', value: '12px', usage: 'Small cards' },
                          { token: 'lg', value: '16px', usage: 'Main cards' },
                          { token: 'xl', value: '24px', usage: 'Hero sections' },
                          { token: 'pill', value: '90px', usage: 'Pill buttons' },
                          { token: 'circle', value: '50%', usage: 'Avatars, icons' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-crd-green/20 border border-crd-green/40" style={{ borderRadius: item.value }}></div>
                              <span className="text-sm text-crd-white font-mono">{item.token}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-crd-blue font-mono">{item.value}</div>
                              <div className="text-xs text-crd-lightGray">{item.usage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* CSS Architecture */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">CSS Architecture</h2>
                    <p className="text-crd-lightGray">
                      Modular CSS structure using Tailwind CSS with custom utilities and component patterns for maintainable, scalable styling.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <CRDCard className="p-6">
                      <h3 className="font-semibold text-crd-white mb-4">Base Layer</h3>
                      <div className="space-y-2 text-sm">
                        <div className="text-crd-lightGray">CSS Reset & Normalize</div>
                        <div className="text-crd-lightGray">Typography Base Styles</div>
                        <div className="text-crd-lightGray">Theme Variables</div>
                        <div className="text-crd-lightGray">Global Layout Rules</div>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6">
                      <h3 className="font-semibold text-crd-white mb-4">Component Layer</h3>
                      <div className="space-y-2 text-sm">
                        <div className="text-crd-lightGray">Button Components</div>
                        <div className="text-crd-lightGray">Card Variations</div>
                        <div className="text-crd-lightGray">Form Elements</div>
                        <div className="text-crd-lightGray">Navigation Components</div>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6">
                      <h3 className="font-semibold text-crd-white mb-4">Utility Layer</h3>
                      <div className="space-y-2 text-sm">
                        <div className="text-crd-lightGray">Animation Classes</div>
                        <div className="text-crd-lightGray">Glass Morphism Effects</div>
                        <div className="text-crd-lightGray">Theme Utilities</div>
                        <div className="text-crd-lightGray">Mobile Optimizations</div>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Glass Morphism System */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Glass Morphism Effects</h2>
                    <p className="text-crd-lightGray">
                      Sophisticated glass effects that add depth and premium feel while maintaining readability and performance.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { 
                        name: 'Light Glass', 
                        class: 'glass-light',
                        backdrop: '10px',
                        opacity: '5%',
                        usage: 'Subtle overlays, secondary content'
                      },
                      { 
                        name: 'Medium Glass', 
                        class: 'glass-medium',
                        backdrop: '20px',
                        opacity: '10%',
                        usage: 'Modal backgrounds, navigation bars'
                      },
                      { 
                        name: 'Heavy Glass', 
                        class: 'glass-heavy',
                        backdrop: '40px',
                        opacity: '20%',
                        usage: 'Feature highlights, hero sections'
                      }
                    ].map((effect, index) => (
                      <div key={index} className={`${effect.class} p-8 rounded-xl text-center space-y-4`}>
                        <h4 className="text-lg font-semibold text-crd-white">{effect.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-crd-lightGray">Backdrop Blur: {effect.backdrop}</div>
                          <div className="text-crd-lightGray">Background Opacity: {effect.opacity}</div>
                          <div className="text-crd-blue font-medium">{effect.usage}</div>
                        </div>
                        <div className="text-xs text-crd-lightGray font-mono bg-crd-darkGray/50 p-2 rounded">
                          .{effect.class}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Performance Guidelines */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Performance Optimization</h2>
                    <p className="text-crd-lightGray">
                      Best practices and guidelines for maintaining 60fps performance while delivering premium visual experiences.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">CSS Performance</h3>
                      <div className="space-y-4">
                        {[
                          'Use transform for animations instead of layout properties',
                          'Minimize backdrop-filter usage on low-end devices',
                          'Leverage CSS containment for complex components',
                          'Optimize critical CSS for above-the-fold content',
                          'Use will-change sparingly and remove after animation'
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                            <span className="text-sm text-crd-lightGray leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">Asset Optimization</h3>
                      <div className="space-y-4">
                        {[
                          'Use WebP images with JPEG fallbacks',
                          'Implement lazy loading for below-fold content',
                          'Compress and optimize SVG assets',
                          'Use CSS sprites for small repeated icons',
                          'Implement proper caching strategies'
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                            <span className="text-sm text-crd-lightGray leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>

                  <CRDCard className="p-8">
                    <h3 className="text-lg font-semibold text-crd-white mb-6">Design System Standards</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                       {[
                         { metric: 'Frame Rate Target', target: '60fps', current: '60fps' },
                         { metric: 'Mobile Touch Target', target: '44px min', current: '44px+' },
                         { metric: 'Color Contrast', target: 'AA/AAA', current: 'WCAG AA' },
                         { metric: 'Components', target: 'Scalable', current: '47 Active' }
                       ].map((item, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="text-2xl font-bold text-crd-green">{item.current}</div>
                          <div className="text-sm text-crd-white">{item.metric}</div>
                          <div className="text-xs text-crd-lightGray">Target: {item.target}</div>
                        </div>
                       ))}
                     </div>
                  </CRDCard>
                </section>
              </div>
            )}

            {/* Team Themes & Customization Section */}
            {activeSection === 'team-customization' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Team Themes & Customization</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    The CRD:DNA system with 570+ team entries, advanced customization options, and 
                    partnership opportunities that connect brands with passionate fan communities.
                  </p>
                </div>

                {/* CRD:DNA Overview */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">CRD:DNA System Overview</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      Our revolutionary theming system allows fans to experience Cardshow in their team's colors, 
                      creating deeper emotional connections and brand loyalty while opening new revenue streams for teams and creators.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <CRDCard className="p-8 text-center space-y-6">
                      <div className="text-4xl font-bold text-crd-blue">570+</div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-crd-white">Team Entries</h3>
                        <p className="text-sm text-crd-lightGray">Professional sports teams, colleges, and esports organizations</p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8 text-center space-y-6">
                      <div className="text-4xl font-bold text-crd-green">12</div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-crd-white">Rarity Tiers</h3>
                        <p className="text-sm text-crd-lightGray">From common themes to ultra-rare championship editions</p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8 text-center space-y-6">
                      <div className="text-4xl font-bold text-crd-purple">∞</div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-crd-white">Customization</h3>
                        <p className="text-sm text-crd-lightGray">Unlimited possibilities with custom team creation tools</p>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Current Theme Showcase */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Live Theme Demonstration</h2>
                  <TeamThemeShowcase />
                </section>

                {/* Theme Application Examples */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Theme Implementation Examples</h2>
                    <p className="text-crd-lightGray">
                      See how team themes transform the entire user experience with consistent branding across all interface elements.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">Navigation & Headers</h3>
                      <div className="space-y-4">
                        <div className="navbar-themed p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="text-themed-primary font-bold">Cardshow</div>
                            <div className="flex space-x-4">
                              <span className="text-themed-secondary">Collections</span>
                              <span className="text-themed-active">My Cards</span>
                              <span className="text-themed-secondary">Marketplace</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-crd-lightGray">
                          Navigation automatically adapts to team colors while maintaining accessibility standards
                        </p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">Buttons & Actions</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <button className="cta-themed px-4 py-2 rounded-pill font-semibold">Primary Action</button>
                          <button className="btn-themed-secondary px-4 py-2 rounded-pill font-semibold">Secondary</button>
                          <button className="btn-themed-ghost px-4 py-2 rounded-pill font-semibold">Ghost Button</button>
                        </div>
                        <p className="text-sm text-crd-lightGray">
                          All interactive elements inherit team colors while maintaining proper contrast ratios
                        </p>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Available Palettes Grid */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Available Team Palettes</h2>
                    <p className="text-crd-lightGray">
                      Interactive palette browser with instant theme switching. Click any palette to see the design system adapt in real-time.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availablePalettes.slice(0, 12).map((palette) => (
                      <CRDCard key={palette.id} className="p-6 group hover:shadow-lg hover:shadow-themed-accent/20 transition-all duration-300 cursor-pointer"
                               onClick={() => setTheme(palette.id)}>
                        <div className="space-y-4">
                          <PalettePreview palette={palette} size="lg" showLabels />
                          <div className="space-y-2">
                            <h3 className="font-semibold text-crd-white group-hover:text-themed-accent transition-colors">
                              {palette.name}
                            </h3>
                            <p className="text-xs text-crd-lightGray leading-relaxed">
                              {palette.description}
                            </p>
                          </div>
                          <CRDButton 
                            variant={currentPalette?.id === palette.id ? 'secondary' : 'outline'}
                            size="sm"
                            className="w-full"
                          >
                            {currentPalette?.id === palette.id ? '✓ Active' : 'Apply Theme'}
                          </CRDButton>
                        </div>
                      </CRDCard>
                    ))}
                  </div>

                  {availablePalettes.length > 12 && (
                    <div className="text-center">
                      <CRDButton variant="outline">
                        View All {availablePalettes.length} Themes
                      </CRDButton>
                    </div>
                  )}
                </section>

                {/* Partnership Opportunities */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Partnership & Revenue Opportunities</h2>
                    <p className="text-crd-lightGray">
                      The CRD:DNA system creates new revenue streams for teams, brands, and creators while deepening fan engagement.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">For Teams & Organizations</h3>
                      <div className="space-y-4">
                        {[
                          'Brand your digital presence with official team themes',
                          'Monetize fan engagement through premium theme unlocks',
                          'Exclusive partnership themes for sponsors and partners',
                          'Limited edition themes for special events and championships',
                          'Analytics dashboard showing theme adoption and engagement'
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                            <span className="text-sm text-crd-lightGray leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-lg font-semibold text-crd-white">For Creators & Brands</h3>
                      <div className="space-y-4">
                        {[
                          'Custom brand themes for sponsored content and collaborations',
                          'White-label theming solutions for enterprise clients',
                          'Co-branded themes combining multiple brand identities',
                          'Seasonal and event-based theme campaigns',
                          'Revenue sharing from theme purchases and upgrades'
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Check size={16} className="text-crd-green mt-1 flex-shrink-0" />
                            <span className="text-sm text-crd-lightGray leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Technical Implementation */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Technical Implementation</h2>
                    <p className="text-crd-lightGray">
                      Advanced CSS variable system enables real-time theme switching with zero performance impact.
                    </p>
                  </div>

                  <CRDCard className="p-8">
                    <h3 className="text-lg font-semibold text-crd-white mb-6">Code Implementation Example</h3>
                    <div className="bg-crd-darkest rounded-xl p-6 border border-crd-mediumGray/30">
                      <pre className="text-sm text-crd-lightGray overflow-x-auto leading-relaxed">
                        <code>{`// Theme switching with CSS variables
const applyTeamTheme = (teamId: string) => {
  const theme = getTeamTheme(teamId);
  
  document.documentElement.style.setProperty('--theme-primary', theme.primary);
  document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
  document.documentElement.style.setProperty('--theme-accent', theme.accent);
  
  // All components automatically update via CSS variables
};

// Usage in components
.team-themed-button {
  background: hsl(var(--theme-primary));
  color: hsl(var(--theme-secondary));
  transition: all 0.3s ease;
}

.team-themed-button:hover {
  background: hsl(var(--theme-accent));
  transform: translateY(-1px);
}`}</code>
                      </pre>
                    </div>
                  </CRDCard>
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