
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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

  const SelectedLogoComponent = selectedLogo.component;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crd-primary focus:ring-offset-[#141416] rounded-md group">
          <div className="relative overflow-hidden rounded-md">
            <SelectedLogoComponent className="h-12 w-32 object-contain transition-all duration-300 group-hover:brightness-110" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-holographic-flow"></div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#23262F] border-[#353945] w-64">
        {logoGroups.map((group, groupIndex) => (
          <div key={group.label}>
            <DropdownMenuLabel className="text-gray-300 text-xs font-semibold px-3 py-2">
              {group.label}
            </DropdownMenuLabel>
            {group.logos.map((logo) => {
              const LogoComponent = logo.component;
              return (
                <DropdownMenuItem
                  key={logo.name}
                  onSelect={() => setSelectedLogo(logo)}
                  className="group cursor-pointer hover:!bg-[#353945] focus:!bg-[#353945] flex items-center justify-center py-2 px-3"
                >
                  <div className="relative overflow-hidden rounded-md">
                    <LogoComponent className="h-8 w-20 object-contain group-hover:scale-105 transition-all duration-300 group-hover:brightness-110" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-holographic-flow"></div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            {groupIndex < logoGroups.length - 1 && <DropdownMenuSeparator className="bg-[#353945]" />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
