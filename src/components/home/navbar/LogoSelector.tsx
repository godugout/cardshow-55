
import React, { useState } from 'react';
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
import { ChevronDown } from 'lucide-react';

const logoGroups = [
  {
    label: 'Team Logos',
    logos: [
      { name: 'SF ORANGE', component: SfOrangeLogo },
      { name: 'WAS', component: WashingtonLogo },
      { name: 'OAK', component: OaklandLogo },
      { name: 'PIT', component: PittsburghLogo },
      { name: 'TOR', component: TorontoLogo },
    ]
  },
  {
    label: 'Script Style',
    logos: [
      { name: 'Cardshow Basic', component: CardshowBasicLogo },
      { name: 'Cardshow Green', component: CardshowGreenLogo },
      { name: 'Cardshow Green Sparkles', component: CardshowGreenSparklesLogo },
      { name: 'Cardshow Red/Blue', component: CardshowRedBlueLogo },
      { name: 'Cardshow Blue', component: CardshowBlueLogo },
      { name: 'Cardshow Orange', component: CardshowOrangeLogo },
    ]
  },
  {
    label: 'Bold & Block',
    logos: [
      { name: 'Cardshow Block', component: CardshowBlockLettersLogo },
      { name: 'Cardshow Vintage', component: CardshowVintageLogo },
    ]
  },
  {
    label: 'Modern & Retro',
    logos: [
      { name: 'Cardshow Retro', component: CardshowRetroLogo },
      { name: 'Cardshow Modern', component: CardshowModernLogo },
    ]
  }
];

export const LogoSelector = () => {
  const [selectedLogo, setSelectedLogo] = useState(logoGroups[0].logos[0]);
  const [isOpen, setIsOpen] = useState(false);

  const SelectedLogoComponent = selectedLogo.component;

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crd-primary focus:ring-offset-[#141416] rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <SelectedLogoComponent className="h-12 w-32 object-contain" />
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Horizontal Dropdown Menu */}
      <div className={`absolute top-full left-0 mt-2 bg-[#23262F] border border-[#353945] rounded-lg shadow-xl z-[9999] transition-all duration-300 transform origin-top ${
        isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
      }`}>
        <div className="p-4 space-y-4 min-w-[800px]">
          {logoGroups.map((group, groupIndex) => (
            <div key={group.label}>
              <h3 className="text-gray-300 text-xs font-semibold mb-3 px-2">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.logos.map((logo) => {
                  const LogoComponent = logo.component;
                  return (
                    <button
                      key={logo.name}
                      onClick={() => {
                        setSelectedLogo(logo);
                        setIsOpen(false);
                      }}
                      className="group bg-[#2A2D37] hover:bg-[#353945] rounded-lg p-3 transition-all duration-300 hover:scale-105 border border-transparent hover:border-[#404040]"
                    >
                      <LogoComponent className="h-8 w-20 object-contain transition-all duration-300" />
                    </button>
                  );
                })}
              </div>
              {groupIndex < logoGroups.length - 1 && (
                <div className="border-t border-[#353945] mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
