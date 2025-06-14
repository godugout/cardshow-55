
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
          <div className="logo-container">
            <SelectedLogoComponent className="h-12 w-32 object-contain" />
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#23262F] border-[#353945] text-white z-50">
        {logos.map((logo) => (
          <DropdownMenuItem
            key={logo.name}
            onSelect={() => setSelectedLogo(logo)}
            className="group cursor-pointer hover:!bg-[#353945] focus:!bg-[#353945] flex items-center gap-4 py-2 px-3"
          >
            <div className="logo-container grayscale group-hover:grayscale-0 transition-all duration-300">
              <logo.component className="h-12 w-32 object-contain" />
            </div>
            <span className="font-semibold">{logo.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
