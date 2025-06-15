
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
          <SelectedLogoComponent className="h-10 object-contain" />
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#23262F] border-[#353945] text-white">
        {logos.map((logo) => (
          <DropdownMenuItem
            key={logo.name}
            onSelect={() => setSelectedLogo(logo)}
            className="cursor-pointer hover:!bg-[#353945] focus:!bg-[#353945] flex items-center gap-4 py-2 px-3"
          >
            <logo.component className="h-8 w-24 object-contain" />
            <span className="font-semibold">{logo.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
