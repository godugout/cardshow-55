
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SfOrangeLogo } from './SfOrangeLogo';
import { WashingtonLogo } from './WashingtonLogo';
import { OaklandLogo } from './OaklandLogo';
import { PittsburghLogo } from './PittsburghLogo';
import { TorontoLogo } from './TorontoLogo';
import { ChevronDown } from 'lucide-react';

const logos = [
  { name: 'SF ORANGE', component: SfOrangeLogo },
  { name: 'WAS', component: WashingtonLogo },
  { name: 'OAK', component: OaklandLogo },
  { name: 'PIT', component: PittsburghLogo },
  { name: 'TOR', component: TorontoLogo },
];

export const LogoSelector = () => {
  const [selectedLogo, setSelectedLogo] = useState(logos[0]);

  const SelectedLogoComponent = selectedLogo.component;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crd-primary focus:ring-offset-[#141416] rounded-md">
          <div className="logo-container" style={{ color: 'initial' }}>
            <SelectedLogoComponent className="h-8 w-24 object-contain" />
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#23262F] border-[#353945] text-white z-50">
        {logos.map((logo) => {
          const LogoComponent = logo.component;
          return (
            <DropdownMenuItem
              key={logo.name}
              onSelect={() => setSelectedLogo(logo)}
              className="group cursor-pointer hover:!bg-[#353945] focus:!bg-[#353945] flex items-center justify-center py-1 px-2"
            >
              <div className="logo-container transition-all duration-300" style={{ color: 'initial' }}>
                <LogoComponent className="h-6 w-20 object-contain" />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
