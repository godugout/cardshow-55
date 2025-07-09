
import React, { useState, useEffect } from 'react';
import { SfOrangeLogo } from './SfOrangeLogo';
import { WashingtonLogo } from './WashingtonLogo';
import { OaklandLogo } from './OaklandLogo';
import { PittsburghLogo } from './PittsburghLogo';
import { TorontoLogo } from './TorontoLogo';
import { CardshowBasicLogo } from './CardshowBasicLogo';
import { CardshowGreenLogo } from './CardshowGreenLogo';
import { CardshowRedBlueLogo } from './CardshowRedBlueLogo';
import { CardshowBlueLogo } from './CardshowBlueLogo';
import { CardshowOrangeLogo } from './CardshowOrangeLogo';
import { CardshowGreenSparklesLogo } from './CardshowGreenSparklesLogo';
import { CardshowBlockLettersLogo } from './CardshowBlockLettersLogo';
import { CardshowRetroLogo } from './CardshowRetroLogo';
import { CardshowVintageLogo } from './CardshowVintageLogo';
import { CardshowModernLogo } from './CardshowModernLogo';
import { CRDGradientLogo } from './CRDGradientLogo';
import { ChevronDown } from 'lucide-react';

const logoGroups = [
  {
    label: 'Team Logos',
    logos: [
      { name: 'SF ORANGE', component: SfOrangeLogo, hoverColor: 'orange', themeId: 'sf-orange' },
      { name: 'WAS', component: WashingtonLogo, hoverColor: 'red', themeId: 'washington' },
      { name: 'OAK', component: OaklandLogo, hoverColor: 'green', themeId: 'oakland' },
      { name: 'PIT', component: PittsburghLogo, hoverColor: 'yellow', themeId: 'pittsburgh' },
      { name: 'TOR', component: TorontoLogo, hoverColor: 'blue', themeId: 'toronto' },
    ]
  },
  {
    label: 'Cardshow Logos',
    logos: [
      { name: 'Cardshow Basic', component: CardshowBasicLogo, hoverColor: 'gray', themeId: 'cardshow-basic' },
      { name: 'Cardshow Green', component: CardshowGreenLogo, hoverColor: 'green', themeId: 'cardshow-green' },
      { name: 'Cardshow Green Sparkles', component: CardshowGreenSparklesLogo, hoverColor: 'emerald', themeId: 'cardshow-green-sparkles' },
      { name: 'Cardshow Red/Blue', component: CardshowRedBlueLogo, hoverColor: 'purple', themeId: 'cardshow-red-blue' },
      { name: 'Cardshow Blue', component: CardshowBlueLogo, hoverColor: 'blue', themeId: 'cardshow-blue' },
      { name: 'Cardshow Orange', component: CardshowOrangeLogo, hoverColor: 'orange', themeId: 'cardshow-orange' },
      { name: 'Cardshow Block', component: CardshowBlockLettersLogo, hoverColor: 'slate', themeId: 'cardshow-block' },
      { name: 'Cardshow Vintage', component: CardshowVintageLogo, hoverColor: 'amber', themeId: 'cardshow-vintage' },
      { name: 'Cardshow Retro', component: CardshowRetroLogo, hoverColor: 'cyan', themeId: 'cardshow-retro' },
      { name: 'Cardshow Modern', component: CardshowModernLogo, hoverColor: 'indigo', themeId: 'cardshow-modern' },
      { name: 'CRDMKR', component: CRDGradientLogo, hoverColor: 'cyan', themeId: 'crdmkr' },
    ]
  }
];

const getHoverColorClasses = (color: string) => {
  const colorMap = {
    orange: 'hover:bg-orange-500/10 hover:border-orange-500/20',
    red: 'hover:bg-red-500/10 hover:border-red-500/20',
    green: 'hover:bg-green-500/10 hover:border-green-500/20',
    yellow: 'hover:bg-yellow-500/10 hover:border-yellow-500/20',
    blue: 'hover:bg-blue-500/10 hover:border-blue-500/20',
    gray: 'hover:bg-gray-500/10 hover:border-gray-500/20',
    emerald: 'hover:bg-emerald-500/10 hover:border-emerald-500/20',
    purple: 'hover:bg-purple-500/10 hover:border-purple-500/20',
    slate: 'hover:bg-slate-500/10 hover:border-slate-500/20',
    amber: 'hover:bg-amber-500/10 hover:border-amber-500/20',
    cyan: 'hover:bg-cyan-500/10 hover:border-cyan-500/20',
    indigo: 'hover:bg-indigo-500/10 hover:border-indigo-500/20',
  };
  return colorMap[color] || 'hover:bg-gray-500/10 hover:border-gray-500/20';
};

interface LogoSelectorProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelector = ({ onThemeChange }: LogoSelectorProps) => {
  const [selectedLogo, setSelectedLogo] = useState(logoGroups[0].logos[0]);
  const [isOpen, setIsOpen] = useState(false);

  const SelectedLogoComponent = selectedLogo.component;

  // Apply theme to document and notify parent
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedLogo.themeId);
    onThemeChange?.(selectedLogo.themeId);
  }, [selectedLogo.themeId, onThemeChange]);

  const handleLogoSelect = (logo: typeof selectedLogo) => {
    setSelectedLogo(logo);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[10000]">
      <button 
        className="group flex items-center gap-2 cursor-pointer outline-none focus:outline-none border-none bg-transparent p-2 rounded-lg transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <SelectedLogoComponent className="h-12 w-32 object-contain" />
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${isOpen ? 'rotate-180 opacity-100' : ''}`} />
      </button>

      {/* Enhanced Dropdown Menu */}
      <div className={`fixed top-[80px] left-0 right-0 bg-gradient-to-b from-[#23262F] to-[#1C1F28] border border-[#353945] shadow-2xl z-[10001] transition-all duration-500 transform origin-top ${
        isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {logoGroups.map((group, groupIndex) => (
            <div key={group.label}>
              <h3 className="text-gray-300 text-sm font-semibold mb-4 px-2 tracking-wide">
                {group.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {group.logos.map((logo) => {
                  const LogoComponent = logo.component;
                  const hoverClasses = getHoverColorClasses(logo.hoverColor);
                  return (
                    <button
                      key={logo.name}
                      onClick={() => handleLogoSelect(logo)}
                      className={`group bg-[#2A2D37] rounded-xl p-2 transition-all duration-300 hover:scale-105 border border-transparent ${hoverClasses} hover:shadow-lg flex items-center justify-center`}
                    >
                      <LogoComponent className="h-8 w-20 object-contain transition-all duration-300 group-hover:brightness-110" />
                    </button>
                  );
                })}
              </div>
              {groupIndex < logoGroups.length - 1 && (
                <div className="border-t border-[#353945] mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
