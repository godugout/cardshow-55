import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Code2, Palette, Layout, MousePointer, Grid3x3, Monitor, Eye, BookOpen, Share2, Download, Check, Copy, ChevronDown, Play, Pause, Star, RotateCcw, Tablet, Smartphone, AlertCircle, CheckCircle, XCircle, Calendar, Settings, ShoppingCart, Search, Plus, DollarSign, Upload, BarChart, Heart, Zap, Globe, Sparkles, Users, Layers, Target, Paintbrush, Type, Image, Navigation } from 'lucide-react';
import { cardshowLogoDatabase } from "@/lib/cardshowDNA";
import { getImagePath } from "@/lib/imagePathUtil";
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { CRDButton, CRDCard, CRDBadge, TeamThemeShowcase, PalettePreview, Typography } from '@/components/ui/design-system';
import { CRDLogo } from '@/components/crd/CRDLogoComponent';

const DesignGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPalette, availablePalettes, setTheme, setLogoTheme, currentLogoCode } = useTeamTheme();
  
  // Interactive component states
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonFavorited, setButtonFavorited] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardFavorited, setCardFavorited] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [selectedLogo, setSelectedLogo] = useState(null);

  // Handle logo selection with immediate visual feedback
  const handleLogoSelect = (logo: any) => {
    setSelectedLogo(logo);
    setLogoTheme(logo.dnaCode);
    
    // Update URL parameters for sharing
    const newParams = new URLSearchParams(searchParams);
    newParams.set('logo', logo.dnaCode);
    setSearchParams(newParams);
  };

  // Handle direct theme switching
  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setSelectedLogo(null); // Clear logo selection when using direct themes
  };

  // Load theme from URL parameters on mount
  useEffect(() => {
    const logoParam = searchParams.get('logo');
    if (logoParam && logoParam !== currentLogoCode) {
      const logo = cardshowLogoDatabase.find(l => l.dnaCode === logoParam);
      if (logo) {
        setSelectedLogo(logo);
        setLogoTheme(logoParam);
      }
    }
  }, [searchParams, setLogoTheme, currentLogoCode]);

  const sidebarSections = [
    { id: 'overview', label: 'Brand Overview', icon: Layout, description: 'Mission, vision, and design philosophy' },
    { id: 'theme-preview', label: 'Live Theme Preview', icon: Eye, description: 'Interactive theme switching with live preview' },
    { id: 'colors-themes', label: 'Color System', icon: Palette, description: 'Color psychology, palettes, and theming system' },
    { id: 'components', label: 'Components', icon: Grid3x3, description: 'UI components with interactive states' },
    { id: 'patterns', label: 'Design Patterns', icon: Layout, description: 'Layout patterns and design guidelines' },
    { id: 'responsive', label: 'Responsive Design', icon: Monitor, description: 'Mobile-first guidelines and breakpoints' },
    { id: 'accessibility', label: 'Accessibility', icon: Heart, description: 'WCAG compliance and inclusive design' },
    { id: 'tokens', label: 'Design Tokens', icon: Code2, description: 'CSS variables and design specifications' },
  ];

  // Interactive functions
  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    });
  }, []);

  // Progress animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue(prev => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Logo database
  const availableLogos = cardshowLogoDatabase.slice(0, 12); // Show first 12 for better UX

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
          {/* Current Theme Preview Header */}
          <div className="bg-themed-navbar border-b border-themed-light/20 p-4 sticky top-16 z-10 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
{selectedLogo ? (
                    <img src={selectedLogo.imageUrl} alt={selectedLogo.displayName} className="w-8 h-8 rounded object-contain" />
                  ) : (
                    <div className="w-8 h-8 bg-themed-primary rounded-full"></div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-themed-primary">Current Theme</div>
                    <div className="text-xs text-themed-secondary">
                      {selectedLogo ? selectedLogo.displayName : currentPalette?.name || 'Default Theme'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentPalette && <PalettePreview palette={currentPalette} size="sm" />}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CRDButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(window.location.href, 'Theme URL')}
                >
                  {copiedText === 'Theme URL' ? <Check size={14} /> : <Share2 size={14} />}
                </CRDButton>
              </div>
            </div>
          </div>

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
                    <CRDButton variant="ghost">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-themed-primary/20 to-themed-accent/20 rounded-2xl blur-xl"></div>
                    <CRDCard className="relative p-8 text-center space-y-6">
                      <div className="flex justify-center items-center space-x-4">
                        {selectedLogo ? (
                          <img src={selectedLogo.imageUrl} alt={selectedLogo.displayName} className="w-24 h-24 rounded-xl object-contain" />
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-themed-primary rounded-xl flex items-center justify-center">
                              <Sparkles className="w-12 h-12 text-themed-navbar" />
                            </div>
                            <div className="w-px h-12 bg-themed-light/30"></div>
                            <div className="w-24 h-24 bg-gradient-to-br from-themed-primary to-themed-accent rounded-xl flex items-center justify-center">
                              <Heart className="w-12 h-12 text-themed-navbar" />
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-themed-primary">Cardshow & CRD Platform</h3>
                      <p className="text-themed-secondary">Photorealistic rendering • Real-time physics • Emotional storytelling</p>
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

            {/* Live Theme Preview Section */}
            {activeSection === 'theme-preview' && (
              <div className="space-y-12">
                {/* Theme Control Panel */}
                <section className="space-y-8">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-themed-primary">Live Theme Preview</h1>
                    <p className="text-lg text-themed-secondary max-w-2xl mx-auto">
                      Select any logo or theme to see immediate changes across all components
                    </p>
                  </div>

                  {/* Logo Selection Grid */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-themed-primary">Choose a Logo Theme</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {availableLogos.map((logo) => (
                        <button
                          key={logo.dnaCode}
                          onClick={() => handleLogoSelect(logo)}
                          className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                            selectedLogo?.dnaCode === logo.dnaCode
                              ? 'border-themed-primary bg-themed-primary/10 shadow-lg shadow-themed-primary/20'
                              : 'border-themed-light/20 hover:border-themed-primary/50 bg-themed-navbar'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="w-full h-16 flex items-center justify-center">
                              <img src={logo.imageUrl} alt={logo.displayName} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="text-xs font-medium text-themed-primary truncate">
                              {logo.displayName}
                            </div>
                            <div className="text-xs text-themed-secondary">
                              {logo.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Theme Selection */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-themed-primary">Or Choose a Direct Theme</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availablePalettes.slice(0, 8).map((palette) => (
                        <button
                          key={palette.id}
                          onClick={() => handleThemeSelect(palette.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                            currentPalette?.id === palette.id && !selectedLogo
                              ? 'border-themed-primary bg-themed-primary/10 shadow-lg'
                              : 'border-themed-light/20 hover:border-themed-primary/50 bg-themed-navbar'
                          }`}
                        >
                          <div className="space-y-3">
                            <PalettePreview palette={palette} size="md" />
                            <div className="text-xs font-medium text-themed-primary">
                              {palette.name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Live Component Preview */}
                <TeamThemeShowcase />
              </div>
            )}

            {/* Colors & Themes Section */}
            {activeSection === 'colors-themes' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-themed-primary">Color System & Psychology</h1>
                  <p className="text-lg text-themed-secondary max-w-3xl mx-auto">
                    Extended color palettes with psychological descriptions, semantic usage guidelines, and accessibility standards.
                  </p>
                </div>

                {/* Current Theme Colors */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-themed-primary">Current Theme Colors</h2>
                    <div className="text-sm text-themed-secondary">
                      {selectedLogo ? `Using ${selectedLogo.displayName}` : 'Using direct theme'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { 
                        name: 'CRD Blue Family', 
                        colors: ['#3772FF', '#2D9CDB', '#1E88E5'], 
                        psychology: 'Trust, reliability, professionalism',
                        semantic: 'Primary actions, links, focus states',
                        contrast: 'AAA compliant on white and dark backgrounds'
                      },
                      { 
                        name: 'CRD Green Family', 
                        colors: ['#45B26B', '#27AE60', '#2ECC71'], 
                        psychology: 'Success, growth, positive reinforcement',
                        semantic: 'Success states, confirmations, financial gains',
                        contrast: 'AA+ compliant with proper text colors'
                      },
                      { 
                        name: 'CRD Orange Family', 
                        colors: ['#EA6E48', '#F97316', '#FF8C00'], 
                        psychology: 'Energy, creativity, urgency',
                        semantic: 'Warnings, highlights, creative tools',
                        contrast: 'Requires careful text color selection'
                      },
                      { 
                        name: 'CRD Purple Family', 
                        colors: ['#9757D7', '#8B5CF6', '#7C3AED'], 
                        psychology: 'Luxury, exclusivity, premium features',
                        semantic: 'Premium tiers, rare items, special events',
                        contrast: 'Excellent contrast on light backgrounds'
                      },
                      { 
                        name: 'Neutral Grays', 
                        colors: ['#141416', '#23262F', '#353945'], 
                        psychology: 'Sophistication, elegance, professional',
                        semantic: 'Backgrounds, containers, subtle elements',
                        contrast: 'Foundation for accessible color combinations'
                      },
                      { 
                        name: 'Status Colors', 
                        colors: ['#10B981', '#F59E0B', '#EF4444'], 
                        psychology: 'Clear communication, immediate recognition',
                        semantic: 'Success, warning, error states',
                        contrast: 'Optimized for accessibility and clarity'
                      }
                    ].map((family, index) => (
                      <CRDCard key={index} className="p-6 space-y-4">
                        <h3 className="font-bold text-crd-white">{family.name}</h3>
                        
                        <div className="flex space-x-2">
                          {family.colors.map((color, colorIdx) => (
                            <div 
                              key={colorIdx}
                              className="relative group cursor-pointer"
                              onClick={() => copyToClipboard(color, color)}
                            >
                              <div 
                                className="w-12 h-12 rounded-lg border-2 border-white/20 transition-all hover:scale-110"
                                style={{ backgroundColor: color }}
                              />
                              {copiedText === color && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-crd-green text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="text-crd-lightGray"><strong>Psychology:</strong> {family.psychology}</p>
                          <p className="text-crd-blue"><strong>Usage:</strong> {family.semantic}</p>
                          <p className="text-crd-green text-xs"><strong>Accessibility:</strong> {family.contrast}</p>
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Theme Showcase */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Interactive Theme Showcase</h2>
                  <TeamThemeShowcase />
                </section>
              </div>
            )}

            {/* UI Patterns Section */}
            {activeSection === 'patterns' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">UI Layout Patterns</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Card grids, dashboard layouts, and navigation systems optimized for trading card platforms.
                  </p>
                </div>

                {/* Card Grid Patterns */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Card Grid Patterns</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Collection Grid (Responsive)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, index) => (
                          <CRDCard key={index} className="aspect-[3/4] p-4 hover:shadow-lg hover:scale-105 transition-all">
                            <div className="w-full h-16 bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded mb-2"></div>
                            <div className="space-y-1">
                              <div className="text-xs font-semibold text-crd-white">Card #{index + 1}</div>
                              <div className="text-xs text-crd-lightGray">Rare • 2024</div>
                            </div>
                          </CRDCard>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Marketplace Layout</h3>
                      <div className="grid lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                          <CRDCard key={index} className="p-4 space-y-3 hover:shadow-lg transition-all">
                            <div className="aspect-[3/4] bg-gradient-to-br from-crd-green/20 to-crd-orange/20 rounded"></div>
                            <div className="space-y-2">
                              <div className="text-sm font-semibold text-crd-white">Featured Card</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-crd-lightGray">Current Bid</span>
                                <span className="text-sm font-bold text-crd-green">$42.50</span>
                              </div>
                              <CRDButton size="sm" className="w-full">Place Bid</CRDButton>
                            </div>
                          </CRDCard>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Navigation Patterns */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Navigation Systems</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Top Navigation</h3>
                      <CRDCard className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-8">
                            <div className="text-lg font-bold text-crd-white">Cardshow</div>
                            <nav className="flex space-x-6">
                              <span className="text-crd-blue font-medium">Collections</span>
                              <span className="text-crd-lightGray hover:text-crd-white transition-colors cursor-pointer">Marketplace</span>
                              <span className="text-crd-lightGray hover:text-crd-white transition-colors cursor-pointer">Create</span>
                            </nav>
                          </div>
                          <div className="flex items-center space-x-4">
                            <CRDButton size="sm" variant="outline">Sign In</CRDButton>
                            <CRDButton size="sm">Get Started</CRDButton>
                          </div>
                        </div>
                      </CRDCard>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Sidebar Navigation</h3>
                      <div className="grid lg:grid-cols-4 gap-6">
                        <CRDCard className="p-6 space-y-4">
                          <h4 className="font-semibold text-crd-white">Main Menu</h4>
                          <nav className="space-y-2">
                            {['Dashboard', 'My Collection', 'Marketplace', 'Create Card', 'Settings'].map((item, index) => (
                              <div key={index} className={`p-2 rounded cursor-pointer transition-all ${
                                index === 0 ? 'bg-crd-blue/20 text-crd-blue' : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/20'
                              }`}>
                                {item}
                              </div>
                            ))}
                          </nav>
                        </CRDCard>
                        
                        <div className="lg:col-span-3">
                          <CRDCard className="p-6 h-64 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <div className="text-lg font-semibold text-crd-white">Main Content Area</div>
                              <div className="text-sm text-crd-lightGray">Selected navigation content would appear here</div>
                            </div>
                          </CRDCard>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Dashboard Patterns */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Dashboard Layouts</h2>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-crd-white">Creator Dashboard</h3>
                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-4 gap-4">
                        {[
                          { label: 'Total Cards', value: '1,247', trend: '+12%' },
                          { label: 'This Month', value: '89', trend: '+23%' },
                          { label: 'Revenue', value: '$2,840', trend: '+8%' },
                          { label: 'Views', value: '12.4K', trend: '+15%' }
                        ].map((stat, index) => (
                          <CRDCard key={index} className="p-4 text-center space-y-2">
                            <div className="text-2xl font-bold text-crd-white">{stat.value}</div>
                            <div className="text-sm text-crd-lightGray">{stat.label}</div>
                            <div className="text-xs text-crd-green">{stat.trend}</div>
                          </CRDCard>
                        ))}
                      </div>
                      
                      <div className="grid lg:grid-cols-3 gap-6">
                        <CRDCard className="lg:col-span-2 p-6">
                          <h4 className="font-semibold text-crd-white mb-4">Recent Activity</h4>
                          <div className="space-y-3">
                            {[...Array(5)].map((_, index) => (
                              <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-crd-mediumGray/20">
                                <div className="w-8 h-8 bg-crd-blue/20 rounded"></div>
                                <div className="flex-1">
                                  <div className="text-sm text-crd-white">New card created</div>
                                  <div className="text-xs text-crd-lightGray">2 hours ago</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CRDCard>
                        
                        <CRDCard className="p-6">
                          <h4 className="font-semibold text-crd-white mb-4">Quick Actions</h4>
                          <div className="space-y-3">
                            <CRDButton className="w-full justify-start">Create New Card</CRDButton>
                            <CRDButton variant="outline" className="w-full justify-start">Upload Batch</CRDButton>
                            <CRDButton variant="ghost" className="w-full justify-start">View Analytics</CRDButton>
                          </div>
                        </CRDCard>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Interactions Section */}
            {activeSection === 'interactions' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Interactions & Feedback</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Loading states, animations, hover effects, and status feedback systems for premium user experiences.
                  </p>
                </div>

                {/* Interactive Components */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Interactive Component Library</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Interactive Button */}
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-xl font-semibold text-crd-white">Interactive Button</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => {
                              setButtonLoading(true);
                              setTimeout(() => setButtonLoading(false), 2000);
                            }}
                            disabled={buttonLoading}
                            className="cta-themed px-6 py-3 rounded-pill font-semibold flex items-center space-x-2 disabled:opacity-70"
                          >
                            {buttonLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                              </>
                            ) : (
                              <span>Click to Load</span>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => setButtonFavorited(!buttonFavorited)}
                            className={`p-3 rounded-full transition-all ${
                              buttonFavorited 
                                ? 'bg-crd-orange text-white' 
                                : 'bg-crd-mediumGray/20 text-crd-lightGray hover:text-crd-orange'
                            }`}
                          >
                            <Star size={16} className={buttonFavorited ? 'fill-current' : ''} />
                          </button>
                        </div>
                        
                        <div className="text-sm text-crd-lightGray">
                          Features loading states, disabled state handling, and favorite toggle with smooth transitions
                        </div>
                      </div>
                    </CRDCard>

                    {/* Dropdown Demo */}
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-xl font-semibold text-crd-white">Dropdown Menu</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="btn-themed-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <span>Filter Options</span>
                          <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {dropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg shadow-2xl z-50 overflow-hidden">
                            <div className="p-2 space-y-1">
                              {['All Cards', 'Rare Only', 'Legendary Only', 'Recent Additions', 'Most Popular'].map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => setDropdownOpen(false)}
                                  className="w-full text-left px-3 py-2 text-sm text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/20 rounded transition-all"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-crd-lightGray">
                        Proper background styling, high z-index, and smooth open/close animations
                      </div>
                    </CRDCard>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Progress Animation */}
                    <CRDCard className="p-8 space-y-6">
                      <h3 className="text-xl font-semibold text-crd-white">Progress Animation</h3>
                      <div className="space-y-4">
                        <div className="w-full bg-crd-mediumGray/30 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-crd-blue to-crd-green transition-all duration-500 ease-out"
                            style={{ width: `${progressValue}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-crd-lightGray">Processing cards...</span>
                          <span className="text-crd-blue font-mono">{progressValue}%</span>
                        </div>
                        <div className="text-sm text-crd-lightGray">
                          Cycles automatically to demonstrate smooth progress animations
                        </div>
                      </div>
                    </CRDCard>

                    {/* Interactive Card */}
                    <CRDCard className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-crd-white">Expandable Card</h3>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setCardFavorited(!cardFavorited)}
                            className={`p-2 rounded-full transition-all ${
                              cardFavorited ? 'text-crd-orange' : 'text-crd-lightGray hover:text-crd-orange'
                            }`}
                          >
                            <Heart size={16} className={cardFavorited ? 'fill-current' : ''} />
                          </button>
                          <button 
                            onClick={() => setCardExpanded(!cardExpanded)}
                            className="p-2 text-crd-lightGray hover:text-crd-white transition-colors"
                          >
                            <ChevronDown size={16} className={`transition-transform ${cardExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-crd-lightGray">Click to expand for more details</p>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${
                          cardExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="space-y-2 pt-2 border-t border-crd-mediumGray/30">
                            <p className="text-sm text-crd-lightGray">Additional card information appears here with smooth expand/collapse animation.</p>
                            <div className="flex space-x-2">
                              <CRDBadge variant="secondary">Expandable</CRDBadge>
                              <CRDBadge variant="outline">Interactive</CRDBadge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Status System */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Status & Feedback System</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { 
                        type: 'success', 
                        icon: CheckCircle, 
                        title: 'Success State', 
                        message: 'Card successfully uploaded to your collection',
                        color: 'text-crd-green bg-crd-green/10 border-crd-green/30'
                      },
                      { 
                        type: 'warning', 
                        icon: AlertCircle, 
                        title: 'Warning State', 
                        message: 'Image quality could be improved for better results',
                        color: 'text-crd-orange bg-crd-orange/10 border-crd-orange/30'
                      },
                      { 
                        type: 'error', 
                        icon: XCircle, 
                        title: 'Error State', 
                        message: 'Upload failed. Please check file format and try again',
                        color: 'text-red-400 bg-red-400/10 border-red-400/30'
                      }
                    ].map((status, index) => (
                      <div key={index} className={`p-6 rounded-xl border ${status.color}`}>
                        <div className="flex items-start space-x-3">
                          <status.icon size={20} className="flex-shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <h4 className="font-semibold">{status.title}</h4>
                            <p className="text-sm opacity-90">{status.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Loading Skeletons */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Loading Skeletons & Micro-interactions</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Card Loading Skeleton</h3>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-16 h-20 bg-crd-mediumGray/30 rounded animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-crd-mediumGray/30 rounded animate-pulse"></div>
                              <div className="h-3 bg-crd-mediumGray/20 rounded w-3/4 animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Hover Effects Demo</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, index) => (
                          <div 
                            key={index}
                            className="aspect-square bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-lg hover:scale-110 hover:shadow-lg hover:shadow-crd-blue/20 transition-all duration-300 cursor-pointer"
                          ></div>
                        ))}
                      </div>
                      <p className="text-sm text-crd-lightGray">Hover over squares to see scale and shadow effects</p>
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Responsive Design Section */}
            {activeSection === 'responsive' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Responsive Design</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Mobile-first design guidelines, breakpoint documentation, and responsive examples optimized for all devices.
                  </p>
                </div>

                {/* Breakpoint System */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Breakpoint System</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { 
                        name: 'Mobile', 
                        range: '320px - 768px', 
                        icon: Smartphone,
                        description: 'Primary focus with touch-optimized interactions',
                        guidelines: ['44px minimum touch targets', 'Single column layouts', 'Simplified navigation', 'Thumb-friendly controls']
                      },
                      { 
                        name: 'Tablet', 
                        range: '768px - 1024px', 
                        icon: Tablet,
                        description: 'Balanced experience between mobile and desktop',
                        guidelines: ['2-3 column card grids', 'Collapsible sidebars', 'Modal interfaces', 'Gesture support']
                      },
                      { 
                        name: 'Desktop', 
                        range: '1024px+', 
                        icon: Monitor,
                        description: 'Full-featured experience with advanced interactions',
                        guidelines: ['Complex grid layouts', 'Hover states', 'Keyboard shortcuts', 'Multi-panel interfaces']
                      }
                    ].map((breakpoint, index) => (
                      <CRDCard key={index} className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-crd-blue/20 rounded-lg">
                            <breakpoint.icon size={20} className="text-crd-blue" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-crd-white">{breakpoint.name}</h3>
                            <div className="text-sm text-crd-blue font-mono">{breakpoint.range}</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-crd-lightGray">{breakpoint.description}</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-crd-white">Guidelines:</h4>
                          <ul className="text-xs text-crd-lightGray space-y-1">
                            {breakpoint.guidelines.map((guideline, gIndex) => (
                              <li key={gIndex} className="flex items-start space-x-2">
                                <Check size={12} className="text-crd-green mt-0.5 flex-shrink-0" />
                                <span>{guideline}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>

                {/* Responsive Examples */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Responsive Layout Examples</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Card Collection (Responsive Grid)</h3>
                      <CRDCard className="p-6">
                        <div className="text-center text-sm text-crd-lightGray mb-4">
                          Resize browser to see responsive behavior
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          {[...Array(12)].map((_, index) => (
                            <div key={index} className="aspect-[3/4] bg-gradient-to-br from-crd-green/20 to-crd-blue/20 rounded-lg p-2">
                              <div className="text-xs text-center text-crd-white pt-8">Card {index + 1}</div>
                            </div>
                          ))}
                        </div>
                      </CRDCard>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-crd-white">Dashboard Layout (Responsive Columns)</h3>
                      <CRDCard className="p-6">
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                          <div className="md:col-span-3 lg:col-span-3 space-y-4">
                            <div className="h-32 bg-crd-mediumGray/20 rounded-lg flex items-center justify-center">
                              <span className="text-sm text-crd-lightGray">Main Content Area</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="h-24 bg-crd-blue/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-crd-blue">Stats Widget 1</span>
                              </div>
                              <div className="h-24 bg-crd-green/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-crd-green">Stats Widget 2</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="h-40 bg-crd-purple/10 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-crd-purple text-center">Sidebar<br/>Content</span>
                            </div>
                          </div>
                        </div>
                      </CRDCard>
                    </div>
                  </div>
                </section>

                {/* Mobile Optimization */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Mobile-First Optimization</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Touch Targets & Gestures</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">Minimum Touch Target</span>
                          <CRDBadge variant="secondary">44px × 44px</CRDBadge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">Comfortable Touch Target</span>
                          <CRDBadge variant="secondary">48px × 48px</CRDBadge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">Spacing Between Targets</span>
                          <CRDBadge variant="secondary">8px minimum</CRDBadge>
                        </div>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Performance Targets</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">First Contentful Paint</span>
                          <CRDBadge variant="success">&lt; 2.5s</CRDBadge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">Largest Contentful Paint</span>
                          <CRDBadge variant="success">&lt; 4s</CRDBadge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <span className="text-sm text-crd-white">Frame Rate</span>
                          <CRDBadge variant="success">60fps target</CRDBadge>
                        </div>
                      </div>
                    </CRDCard>
                  </div>
                </section>
              </div>
            )}

            {/* Accessibility Section */}
            {activeSection === 'accessibility' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Accessibility Standards</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    WCAG 2.1 AA compliance guidelines, focus management, screen reader optimization, and inclusive design patterns.
                  </p>
                </div>

                {/* WCAG Compliance */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">WCAG 2.1 AA Compliance</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Color Contrast Standards</h3>
                      <div className="space-y-3">
                        {[
                          { bg: '#3772FF', text: '#FFFFFF', ratio: '7.2:1', level: 'AAA', label: 'Primary Blue on White' },
                          { bg: '#45B26B', text: '#FFFFFF', ratio: '6.8:1', level: 'AAA', label: 'Success Green on White' },
                          { bg: '#EA6E48', text: '#FFFFFF', ratio: '5.1:1', level: 'AA+', label: 'Warning Orange on White' },
                          { bg: '#141416', text: '#FCFCFD', ratio: '18.7:1', level: 'AAA', label: 'Dark Background with Light Text' }
                        ].map((combo, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg" 
                               style={{ backgroundColor: combo.bg, color: combo.text }}>
                            <span className="text-sm font-medium">{combo.label}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs opacity-80">{combo.ratio}</span>
                              <CRDBadge 
                                variant={combo.level === 'AAA' ? 'success' : 'secondary'}
                                className="text-xs"
                              >
                                {combo.level}
                              </CRDBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Focus Management</h3>
                      <div className="space-y-3">
                        <button className="w-full p-3 text-left bg-crd-mediumGray/20 rounded-lg text-crd-white focus:outline-none focus:ring-2 focus:ring-crd-blue focus:ring-offset-2 focus:ring-offset-crd-darkGray transition-all">
                          Focusable Button Example
                        </button>
                        <input 
                          type="text" 
                          placeholder="Focus-managed input field"
                          className="w-full p-3 bg-crd-mediumGray/20 rounded-lg text-crd-white placeholder-crd-lightGray focus:outline-none focus:ring-2 focus:ring-crd-blue focus:ring-offset-2 focus:ring-offset-crd-darkGray transition-all"
                        />
                        <div className="text-sm text-crd-lightGray">
                          All interactive elements have visible focus indicators with 2px outline and proper color contrast
                        </div>
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Screen Reader Optimization */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Screen Reader Optimization</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Semantic Markup Examples</h3>
                      <div className="space-y-4">
                        <div className="bg-crd-darkGray rounded-lg p-4">
                          <pre className="text-sm text-crd-lightGray overflow-x-auto">
                            <code>{`<button 
  aria-label="Add to favorites"
  aria-pressed={isFavorited}
  onClick={toggleFavorite}
>
  <Star aria-hidden="true" />
  {isFavorited ? 'Remove from' : 'Add to'} favorites
</button>`}</code>
                          </pre>
                        </div>
                        <div className="text-sm text-crd-lightGray">
                          Proper ARIA labels, semantic HTML, and descriptive text for screen readers
                        </div>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Keyboard Navigation</h3>
                      <div className="space-y-3">
                        {[
                          'Tab - Navigate to next focusable element',
                          'Shift + Tab - Navigate to previous element',
                          'Enter/Space - Activate buttons and links',
                          'Arrow keys - Navigate within component groups',
                          'Escape - Close modals and dropdowns'
                        ].map((shortcut, index) => (
                          <div key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-crd-mediumGray/10">
                            <div className="text-xs bg-crd-mediumGray/30 px-2 py-1 rounded font-mono text-crd-blue">
                              {shortcut.split(' - ')[0]}
                            </div>
                            <span className="text-sm text-crd-lightGray">{shortcut.split(' - ')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Inclusive Design Patterns */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Inclusive Design Patterns</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Visual Indicators',
                        description: 'Color is never the only way to convey information',
                        examples: ['Icons + color for status', 'Patterns + color for categories', 'Text labels for all states']
                      },
                      {
                        title: 'Motor Accessibility',
                        description: 'Accommodates users with motor impairments',
                        examples: ['Large click targets (44px+)', 'Generous spacing', 'No time-based interactions']
                      },
                      {
                        title: 'Cognitive Accessibility',
                        description: 'Clear, consistent, and predictable interactions',
                        examples: ['Consistent navigation', 'Clear error messages', 'Progress indicators']
                      }
                    ].map((pattern, index) => (
                      <CRDCard key={index} className="p-6 space-y-4">
                        <h3 className="font-semibold text-crd-white">{pattern.title}</h3>
                        <p className="text-sm text-crd-lightGray">{pattern.description}</p>
                        <div className="space-y-2">
                          {pattern.examples.map((example, eIndex) => (
                            <div key={eIndex} className="flex items-start space-x-2">
                              <Check size={12} className="text-crd-green mt-1 flex-shrink-0" />
                              <span className="text-xs text-crd-lightGray">{example}</span>
                            </div>
                          ))}
                        </div>
                      </CRDCard>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Design Tokens Section */}
            {activeSection === 'design-tokens' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Design Tokens</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    CSS variables, spacing scales, typography tokens, and the complete token system powering our design consistency.
                  </p>
                </div>

                {/* Color Tokens */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Color Tokens</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Primary Colors</h3>
                      <div className="space-y-3">
                        {[
                          { token: '--crd-blue', value: '#3772FF', usage: 'Primary CTAs, links' },
                          { token: '--crd-green', value: '#45B26B', usage: 'Success states' },
                          { token: '--crd-orange', value: '#EA6E48', usage: 'Warnings, highlights' },
                          { token: '--crd-purple', value: '#9757D7', usage: 'Premium features' }
                        ].map((color, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded border-2 border-white/20 cursor-pointer"
                                style={{ backgroundColor: color.value }}
                                onClick={() => copyToClipboard(color.token, color.token)}
                              />
                              <div>
                                <div className="text-sm font-mono text-crd-white">{color.token}</div>
                                <div className="text-xs text-crd-lightGray">{color.usage}</div>
                              </div>
                            </div>
                            <div className="text-xs font-mono text-crd-blue">{color.value}</div>
                            {copiedText === color.token && (
                              <div className="text-xs text-crd-green">Copied!</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Background Tokens</h3>
                      <div className="space-y-3">
                        {[
                          { token: '--crd-bg-primary', value: '#141416', usage: 'Main app background' },
                          { token: '--crd-bg-secondary', value: '#1A1D24', usage: 'Card backgrounds' },
                          { token: '--crd-bg-tertiary', value: '#23262F', usage: 'Elevated surfaces' },
                          { token: '--crd-bg-border', value: '#353945', usage: 'Borders, dividers' }
                        ].map((color, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded border-2 border-white/20 cursor-pointer"
                                style={{ backgroundColor: color.value }}
                                onClick={() => copyToClipboard(color.token, color.token)}
                              />
                              <div>
                                <div className="text-sm font-mono text-crd-white">{color.token}</div>
                                <div className="text-xs text-crd-lightGray">{color.usage}</div>
                              </div>
                            </div>
                            <div className="text-xs font-mono text-crd-blue">{color.value}</div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Spacing Tokens */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Spacing Scale</h2>
                  
                  <CRDCard className="p-6 space-y-4">
                    <h3 className="font-semibold text-crd-white">Spacing Tokens</h3>
                    <div className="space-y-3">
                      {[
                        { token: 'space-xs', value: '0.25rem', px: '4px', usage: 'Tight spacing, borders' },
                        { token: 'space-sm', value: '0.5rem', px: '8px', usage: 'Small gaps, padding' },
                        { token: 'space-md', value: '1rem', px: '16px', usage: 'Standard spacing' },
                        { token: 'space-lg', value: '1.5rem', px: '24px', usage: 'Section spacing' },
                        { token: 'space-xl', value: '2rem', px: '32px', usage: 'Large gaps' },
                        { token: 'space-2xl', value: '3rem', px: '48px', usage: 'Page sections' },
                        { token: 'space-3xl', value: '4rem', px: '64px', usage: 'Major sections' }
                      ].map((space, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-crd-mediumGray/20 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="bg-crd-blue/30 h-4" 
                                style={{ width: space.value }}
                              />
                              <span className="text-sm font-mono text-crd-white">{space.token}</span>
                            </div>
                            <span className="text-xs text-crd-lightGray">{space.usage}</span>
                          </div>
                          <div className="text-xs font-mono text-crd-blue">{space.value} ({space.px})</div>
                        </div>
                      ))}
                    </div>
                  </CRDCard>
                </section>

                {/* Typography Tokens */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Typography Tokens</h2>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Font Size Scale</h3>
                      <div className="space-y-4">
                        {[
                          { token: 'text-xs', value: '0.75rem', sample: 'Extra small text' },
                          { token: 'text-sm', value: '0.875rem', sample: 'Small text' },
                          { token: 'text-base', value: '1rem', sample: 'Base text size' },
                          { token: 'text-lg', value: '1.125rem', sample: 'Large text' },
                          { token: 'text-xl', value: '1.25rem', sample: 'Extra large text' },
                          { token: 'text-2xl', value: '1.5rem', sample: 'Heading text' },
                          { token: 'text-3xl', value: '1.875rem', sample: 'Large heading' }
                        ].map((font, index) => (
                          <div key={index} className="flex items-baseline justify-between">
                            <div className="flex-1">
                              <div className={`${font.token} text-crd-white`}>{font.sample}</div>
                            </div>
                            <div className="text-xs font-mono text-crd-blue ml-4">{font.token} ({font.value})</div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-4">
                      <h3 className="font-semibold text-crd-white">Font Weight Scale</h3>
                      <div className="space-y-4">
                        {[
                          { token: 'font-normal', value: '400', sample: 'Normal weight text' },
                          { token: 'font-medium', value: '500', sample: 'Medium weight text' },
                          { token: 'font-semibold', value: '600', sample: 'Semibold weight text' },
                          { token: 'font-bold', value: '700', sample: 'Bold weight text' },
                          { token: 'font-extrabold', value: '800', sample: 'Extra bold weight text' }
                        ].map((weight, index) => (
                          <div key={index} className="flex items-baseline justify-between">
                            <div className="flex-1">
                              <div className={`${weight.token} text-crd-white`}>{weight.sample}</div>
                            </div>
                            <div className="text-xs font-mono text-crd-blue ml-4">{weight.token} ({weight.value})</div>
                          </div>
                        ))}
                      </div>
                    </CRDCard>
                  </div>
                </section>

                {/* Token Usage Examples */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Token Implementation</h2>
                  
                  <CRDCard className="p-6 space-y-4">
                    <h3 className="font-semibold text-crd-white">CSS Implementation Example</h3>
                    <div className="bg-crd-darkGray rounded-lg p-6 border border-crd-mediumGray/30">
                      <pre className="text-sm text-crd-lightGray overflow-x-auto leading-relaxed">
                        <code>{`/* Design Token Usage */
.card-component {
  background: var(--crd-bg-secondary);
  border: 1px solid var(--crd-bg-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  color: var(--crd-text-primary);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--crd-text-primary);
  margin-bottom: var(--space-sm);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--crd-text-secondary);
  line-height: 1.5;
}

.primary-button {
  background: var(--crd-blue);
  color: var(--crd-white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-pill);
  transition: all 0.3s ease;
}

.primary-button:hover {
  background: var(--crd-blue-hover);
  transform: translateY(-1px);
}`}</code>
                      </pre>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CRDButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(
                          "/* Design tokens provide consistent styling across all components */", 
                          "CSS Code"
                        )}
                      >
                        <Copy size={14} className="mr-2" />
                        Copy Code
                      </CRDButton>
                      {copiedText === "CSS Code" && (
                        <span className="text-sm text-crd-green">Code copied to clipboard!</span>
                      )}
                    </div>
                  </CRDCard>
                </section>
              </div>
            )}

            {/* Real Examples Section */}
            {activeSection === 'real-examples' && (
              <div className="space-y-16">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold text-crd-white">Real-World Examples</h1>
                  <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
                    Complete marketplace and dashboard interfaces showcasing the design system in production-ready applications.
                  </p>
                </div>

                {/* Marketplace Example */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Marketplace Interface</h2>
                  
                  <CRDCard className="p-8 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-crd-white">Card Marketplace</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Search cards..."
                            className="pl-10 pr-4 py-2 bg-crd-mediumGray/20 rounded-lg text-crd-white placeholder-crd-lightGray focus:outline-none focus:ring-2 focus:ring-crd-blue"
                          />
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray" />
                        </div>
                        <CRDButton variant="outline" size="sm">Filter</CRDButton>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'Rare Rookie Card', price: '$2,450', bid: '$2,400', time: '2h 15m', rarity: 'Legendary' },
                        { name: 'Championship Series', price: '$890', bid: '$850', time: '1d 8h', rarity: 'Rare' },
                        { name: 'Vintage Collection', price: '$1,250', bid: '$1,200', time: '4h 32m', rarity: 'Epic' },
                        { name: 'Season Highlights', price: '$675', bid: '$650', time: '12h 45m', rarity: 'Uncommon' }
                      ].map((card, index) => (
                        <CRDCard key={index} className="p-4 space-y-4 hover:shadow-lg hover:shadow-crd-blue/10 transition-all">
                          <div className="aspect-[3/4] bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-crd-lightGray">Card Preview</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-crd-white text-sm">{card.name}</h4>
                              <CRDBadge variant="outline" className="text-xs">{card.rarity}</CRDBadge>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-crd-lightGray">Buy Now:</span>
                              <span className="text-crd-green font-semibold">{card.price}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-crd-lightGray">Current Bid:</span>
                              <span className="text-crd-blue font-semibold">{card.bid}</span>
                            </div>
                            
                            <div className="text-xs text-crd-orange">
                              Ends in {card.time}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <CRDButton size="sm" className="flex-1">Place Bid</CRDButton>
                            <button className="p-2 bg-crd-mediumGray/20 rounded-lg text-crd-lightGray hover:text-crd-orange transition-colors">
                              <Heart size={14} />
                            </button>
                          </div>
                        </CRDCard>
                      ))}
                    </div>
                  </CRDCard>
                </section>

                {/* Dashboard Example */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Creator Dashboard</h2>
                  
                  <div className="space-y-6">
                    {/* Dashboard Header */}
                    <CRDCard className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-crd-white">Creator Dashboard</h3>
                          <p className="text-crd-lightGray">Manage your card collection and track performance</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <CRDButton variant="outline">
                            <Download size={16} className="mr-2" />
                            Export Data
                          </CRDButton>
                          <CRDButton>
                            <Plus size={16} className="mr-2" />
                            Create Card
                          </CRDButton>
                        </div>
                      </div>
                    </CRDCard>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Cards', value: '1,247', change: '+12%', trend: 'up', icon: Grid3x3 },
                        { label: 'Active Auctions', value: '23', change: '+5%', trend: 'up', icon: Calendar },
                        { label: 'Total Revenue', value: '$12,840', change: '+8%', trend: 'up', icon: DollarSign },
                        { label: 'Profile Views', value: '8.2K', change: '+15%', trend: 'up', icon: Eye }
                      ].map((stat, index) => (
                        <CRDCard key={index} className="p-6 text-center space-y-4">
                          <div className="flex items-center justify-center">
                            <div className="p-3 bg-crd-blue/20 rounded-xl">
                              <stat.icon size={24} className="text-crd-blue" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-crd-white">{stat.value}</div>
                            <div className="text-sm text-crd-lightGray">{stat.label}</div>
                            <div className="text-xs text-crd-green">{stat.change} this month</div>
                          </div>
                        </CRDCard>
                      ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Recent Activity */}
                      <CRDCard className="lg:col-span-2 p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-crd-white">Recent Activity</h4>
                          <CRDButton variant="ghost" size="sm">View All</CRDButton>
                        </div>
                        
                        <div className="space-y-4">
                          {[
                            { action: 'Card sold', item: 'Rookie Legend #247', amount: '$450', time: '2 hours ago', type: 'success' },
                            { action: 'New bid received', item: 'Championship Series #89', amount: '$280', time: '4 hours ago', type: 'info' },
                            { action: 'Card created', item: 'Season Highlights #156', amount: null, time: '1 day ago', type: 'default' },
                            { action: 'Auction ended', item: 'Vintage Collection #34', amount: '$920', time: '2 days ago', type: 'success' }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-crd-mediumGray/10 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  activity.type === 'success' ? 'bg-crd-green' : 
                                  activity.type === 'info' ? 'bg-crd-blue' : 'bg-crd-lightGray'
                                }`}></div>
                                <div>
                                  <div className="text-sm text-crd-white">{activity.action}</div>
                                  <div className="text-xs text-crd-lightGray">{activity.item}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                {activity.amount && (
                                  <div className="text-sm font-semibold text-crd-green">{activity.amount}</div>
                                )}
                                <div className="text-xs text-crd-lightGray">{activity.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CRDCard>

                      {/* Quick Actions */}
                      <CRDCard className="p-6 space-y-6">
                        <h4 className="text-lg font-semibold text-crd-white">Quick Actions</h4>
                        
                        <div className="space-y-3">
                          {[
                            { label: 'Upload New Card', icon: Upload, color: 'bg-crd-blue' },
                            { label: 'Batch Upload', icon: Layers, color: 'bg-crd-green' },
                            { label: 'View Analytics', icon: BarChart, color: 'bg-crd-purple' },
                            { label: 'Account Settings', icon: Settings, color: 'bg-crd-orange' }
                          ].map((action, index) => (
                            <button 
                              key={index}
                              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-crd-mediumGray/10 hover:bg-crd-mediumGray/20 transition-all text-left"
                            >
                              <div className={`p-2 ${action.color} rounded-lg`}>
                                <action.icon size={16} className="text-white" />
                              </div>
                              <span className="text-sm text-crd-white">{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </CRDCard>
                    </div>
                  </div>
                </section>

                {/* Code Example */}
                <section className="space-y-8">
                  <h2 className="text-2xl font-bold text-crd-white">Implementation Code</h2>
                  
                  <CRDCard className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-crd-white">React Component Example</h3>
                      <CRDButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard("// Complete React component code", "Component Code")}
                      >
                        <Copy size={14} className="mr-2" />
                        Copy Component
                      </CRDButton>
                    </div>
                    
                    <div className="bg-crd-darkest rounded-xl p-6 border border-crd-mediumGray/30">
                      <pre className="text-sm text-crd-lightGray overflow-x-auto leading-relaxed">
                        <code>{`// Marketplace Card Component
import { CRDCard, CRDButton, CRDBadge } from '@/components/ui/design-system';

export const MarketplaceCard = ({ card }) => {
  return (
    <CRDCard className="p-4 space-y-4 hover:shadow-lg transition-all">
      <div className="aspect-[3/4] bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-lg">
        <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-crd-white text-sm">{card.name}</h4>
          <CRDBadge variant="outline">{card.rarity}</CRDBadge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-crd-lightGray">Current Bid:</span>
          <span className="text-crd-green font-semibold">{card.currentBid}</span>
        </div>
      </div>
      
      <CRDButton className="w-full" onClick={() => placeBid(card.id)}>
        Place Bid
      </CRDButton>
    </CRDCard>
  );
};`}</code>
                      </pre>
                    </div>
                    
                    {copiedText === "Component Code" && (
                      <div className="text-sm text-crd-green">Component code copied to clipboard!</div>
                    )}
                  </CRDCard>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availableLogos.map((logo, index) => {
                      const isActive = currentLogoCode === logo.dnaCode;
                      return (
                        <div 
                          key={logo.dnaCode} 
                          onClick={() => handleLogoSelect(logo)}
                          className={`relative bg-gradient-to-br from-card to-card/50 rounded-xl border-2 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in cursor-pointer group ${
                            isActive ? 'ring-2 ring-crd-blue border-crd-blue/60 bg-crd-blue/5' : ''
                          }`}
                          style={{ 
                            animationDelay: `${index * 100}ms`,
                            borderColor: isActive ? logo.colorPalette[0] : logo.colorPalette[0] + '40'
                          }}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-crd-blue rounded-full border-2 border-white shadow-lg"></div>
                          )}
                        <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-crd-mediumGray/10 to-crd-darkGray/20 rounded-xl p-4">
                          <img 
                            src={logo.imageUrl} 
                            alt={logo.displayName}
                            className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                              e.currentTarget.alt = `${logo.displayName} (loading...)`;
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-crd-white group-hover:text-primary transition-colors">
                            {logo.displayName}
                          </h4>
                          <p className="text-xs text-crd-lightGray leading-relaxed">
                            {logo.description}
                          </p>
                          <div className="flex items-center space-x-1">
                            {logo.colorPalette.slice(0, 4).map((color, colorIndex) => (
                              <div 
                                key={colorIndex}
                                className="w-3 h-3 rounded-full border border-crd-mediumGray/30 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to apply theme
                          </div>
                         </div>
                       </div>
                     );
                    })}
                   </div>
                </section>

                {/* Current Theme Preview */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">Current Theme Preview</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      See how the selected theme affects different UI components across the application.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <CRDCard className="p-6 space-y-6">
                      <h3 className="text-lg font-bold text-foreground">Interactive Elements</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <CRDButton variant="primary">Primary Action</CRDButton>
                          <CRDButton variant="secondary">Secondary</CRDButton>
                          <CRDButton variant="outline">Outline</CRDButton>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <CRDBadge variant="default">Default</CRDBadge>
                          <CRDBadge variant="secondary">Secondary</CRDBadge>
                          <CRDBadge variant="outline">Outline</CRDBadge>
                        </div>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 space-y-6">
                      <h3 className="text-lg font-bold text-foreground">Typography & Colors</h3>
                      <div className="space-y-3">
                        <div className="text-primary font-semibold">Primary Text Color</div>
                        <div className="text-secondary">Secondary Text Color</div>
                        <div className="text-muted-foreground">Muted Text Color</div>
                        <div className="p-3 bg-accent rounded border">Accent Background</div>
                      </div>
                    </CRDCard>
                  </div>

                  {/* Show Current Palette */}
                  {currentPalette && (
                    <div className="text-center">
                      <PalettePreview 
                        palette={currentPalette} 
                        size="lg" 
                        showLabels={true}
                        className="mx-auto"
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        Current theme: {currentPalette.name}
                      </p>
                    </div>
                  )}
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
                      <CRDCard key={index} className="p-6 space-y-4 text-center">
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
                           <div className="text-center lg:text-left">
                             <div className={`${type.size} ${type.weight} text-crd-white mb-2`}>
                               {type.example}
                             </div>
                             <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-crd-lightGray">
                               <span className="font-mono">{type.label}</span>
                               <span>•</span>
                               <span>{type.usage}</span>
                             </div>
                           </div>
                           <div className="text-center lg:text-right text-sm text-crd-blue font-mono">
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
                    <CRDCard className="p-8 space-y-6 text-center">
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
                    <CRDCard className="p-8 space-y-6 text-center">
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

                {/* CRD:DNA System Overview */}
                <section className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-crd-white">CRD:DNA System Overview</h2>
                    <p className="text-crd-lightGray leading-relaxed">
                      Our revolutionary theming system features {cardshowLogoDatabase.length} curated logo themes with professional 4-color palettes, 
                      creating deeper emotional connections and brand loyalty while opening new revenue streams for teams and creators.
                    </p>
                  </div>

                  {/* Dynamic Statistics */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <CRDCard className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-crd-blue">{cardshowLogoDatabase.length}</div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-crd-white">Logo Themes</h3>
                        <p className="text-xs text-crd-lightGray">Professional curated collection</p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-crd-green">
                        {[...new Set(cardshowLogoDatabase.map(logo => logo.category))].length}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-crd-white">Categories</h3>
                        <p className="text-xs text-crd-lightGray">Modern, Script, Bold, Fantasy, Retro</p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-crd-orange">
                        {cardshowLogoDatabase.filter(logo => logo.rarity === 'legendary').length}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-crd-white">Legendary</h3>
                        <p className="text-xs text-crd-lightGray">Premium rare themes</p>
                      </div>
                    </CRDCard>

                    <CRDCard className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-crd-purple">4</div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-crd-white">Color System</h3>
                        <p className="text-xs text-crd-lightGray">Primary, Secondary, Accent, Neutral</p>
                      </div>
                    </CRDCard>
                  </div>

                  {/* 4-Color Palette System Visualization */}
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-crd-white">Professional 4-Color Palette System</h3>
                      <p className="text-sm text-crd-lightGray">Each theme features carefully crafted color harmony for optimal brand application</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      {[
                        { 
                          name: 'Primary', 
                          description: 'Main brand color for logos and dominant elements',
                          usage: 'Navbar backgrounds, primary buttons, logo colors',
                          example: currentPalette?.colors.primary || '#45B7D1'
                        },
                        { 
                          name: 'Secondary', 
                          description: 'Supporting brand color for complementary elements',
                          usage: 'Secondary buttons, borders, supporting text',
                          example: currentPalette?.colors.secondary || '#7FB069'
                        },
                        { 
                          name: 'Accent', 
                          description: 'Action color for CTAs and interactive elements',
                          usage: 'Call-to-action buttons, highlights, active states',
                          example: currentPalette?.colors.accent || '#FF6B35'
                        },
                        { 
                          name: 'Neutral', 
                          description: 'Background and text support for readability',
                          usage: 'Card backgrounds, readable text areas, overlays',
                          example: currentPalette?.colors.neutral || '#F8FAFC'
                        }
                      ].map((color, index) => (
                        <CRDCard key={index} className="p-6 space-y-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl border-2 border-white/20"
                              style={{ backgroundColor: color.example }}
                            />
                            <div>
                              <h4 className="font-semibold text-crd-white">{color.name}</h4>
                              <div className="text-xs text-crd-lightGray font-mono">{color.example}</div>
                            </div>
                          </div>
                          <p className="text-sm text-crd-lightGray leading-relaxed">{color.description}</p>
                          <div className="text-xs text-crd-blue font-medium">{color.usage}</div>
                        </CRDCard>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Logo Showcase */}
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-crd-white">Interactive Logo Collection</h3>
                      <p className="text-sm text-crd-lightGray">Click any logo to apply its 4-color theme across the entire interface</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {cardshowLogoDatabase.slice(0, 18).map((logo, index) => {
                        const isActive = currentLogoCode === logo.dnaCode;
                        const rarityColors = {
                          common: 'text-crd-lightGray border-crd-mediumGray/30',
                          uncommon: 'text-crd-green border-crd-green/30',
                          rare: 'text-crd-blue border-crd-blue/30',
                          legendary: 'text-crd-orange border-crd-orange/30'
                        };
                        
                        return (
                          <div 
                            key={logo.dnaCode} 
                            onClick={() => handleLogoSelect(logo)}
                            className={`group cursor-pointer transition-all duration-300 rounded-xl border-2 p-4 space-y-3 ${
                              isActive 
                                ? 'bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 border-crd-blue shadow-lg shadow-crd-blue/20' 
                                : `hover:shadow-lg hover:scale-105 ${rarityColors[logo.rarity]}`
                            }`}
                          >
                            <div className="aspect-square bg-crd-darkGray/50 rounded-lg p-2 overflow-hidden">
                              <img 
                                src={logo.imageUrl} 
                                alt={logo.displayName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-crd-white truncate">{logo.displayName}</div>
                              
                              {/* 4-Color Palette Preview */}
                              <div className="flex space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: logo.logoTheme.primary }}
                                  title={`Primary: ${logo.logoTheme.primary}`}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: logo.logoTheme.secondary }}
                                  title={`Secondary: ${logo.logoTheme.secondary}`}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: logo.logoTheme.accent }}
                                  title={`Accent: ${logo.logoTheme.accent}`}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: logo.logoTheme.neutral }}
                                  title={`Neutral: ${logo.logoTheme.neutral}`}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <CRDBadge 
                                  variant={logo.rarity === 'legendary' ? 'primary' : 'secondary'}
                                  className="text-xs px-2 py-0.5"
                                >
                                  {logo.rarity}
                                </CRDBadge>

                                {isActive && (
                                  <div className="text-xs text-crd-blue font-semibold">Active</div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {cardshowLogoDatabase.length > 18 && (
                      <div className="text-center">
                        <CRDButton variant="outline">
                          View All {cardshowLogoDatabase.length} Logo Themes
                        </CRDButton>
                      </div>
                    )}
                  </div>

                  {/* Rarity Distribution */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-crd-white text-center">Rarity Distribution</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { rarity: 'common', color: 'text-crd-lightGray', bg: 'bg-crd-lightGray/10' },
                        { rarity: 'uncommon', color: 'text-crd-green', bg: 'bg-crd-green/10' },
                        { rarity: 'rare', color: 'text-crd-blue', bg: 'bg-crd-blue/10' },
                        { rarity: 'legendary', color: 'text-crd-orange', bg: 'bg-crd-orange/10' }
                      ].map((tier) => {
                        const count = cardshowLogoDatabase.filter(logo => logo.rarity === tier.rarity).length;
                        const percentage = Math.round((count / cardshowLogoDatabase.length) * 100);
                        
                        return (
                          <div key={tier.rarity} className={`${tier.bg} p-4 rounded-lg text-center space-y-2`}>
                            <div className={`text-2xl font-bold ${tier.color}`}>{count}</div>
                            <div className="text-sm text-crd-white capitalize">{tier.rarity}</div>
                            <div className="text-xs text-crd-lightGray">{percentage}% of collection</div>
                          </div>
                        );
                      })}
                    </div>
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