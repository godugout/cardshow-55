import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { PalettePreview } from '@/components/ui/design-system';
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

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
      { name: 'Cardshow Classic', component: CardshowGreenSparklesLogo, hoverColor: 'emerald', themeId: 'cardshow-green-sparkles' },
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

// Error Boundary component for logo loading
const LogoWithFallback = ({ LogoComponent, logoName, className }: { 
  LogoComponent: React.ComponentType<{ className?: string }>, 
  logoName: string, 
  className?: string 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 text-xs rounded border border-gray-500/30`}>
        {logoName}
      </div>
    );
  }

  try {
    return <LogoComponent className={className} />;
  } catch (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-700 text-gray-300 text-xs rounded`}>
        {logoName}
      </div>
    );
  }
};

interface LogoSelectorDrawerProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDrawer = ({ onThemeChange }: LogoSelectorDrawerProps) => {
  const { settings, saveSettings } = useAppSettings();
  const { setTheme, currentPalette, availablePalettes } = useTeamTheme();
  const [open, setOpen] = useState(false);

  // Find logo by theme ID with fallback
  const findLogoByThemeId = (themeId: string) => {
    for (const group of logoGroups) {
      const found = group.logos.find(logo => logo.themeId === themeId);
      if (found) return found;
    }
    return logoGroups[0].logos[0]; // Fallback to SF ORANGE
  };

  // Initialize selected logo from settings or default
  const [selectedLogo, setSelectedLogo] = useState(() => {
    const savedTheme = settings?.theme;
    return savedTheme ? findLogoByThemeId(savedTheme) : logoGroups[0].logos[0];
  });

  const SelectedLogoComponent = selectedLogo.component;

  // Load saved theme on settings change
  useEffect(() => {
    if (settings?.theme && settings.theme !== selectedLogo.themeId) {
      const savedLogo = findLogoByThemeId(settings.theme);
      setSelectedLogo(savedLogo);
    }
  }, [settings?.theme]);

  // Apply theme to document and notify parent
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedLogo.themeId);
    onThemeChange?.(selectedLogo.themeId);
  }, [selectedLogo.themeId, onThemeChange]);

  const handleLogoSelect = (logo: typeof selectedLogo) => {
    setSelectedLogo(logo);
    // Apply team theme with 4-color palette
    setTheme(logo.themeId);
    // Save theme to persistent storage
    saveSettings({ theme: logo.themeId });
    onThemeChange?.(logo.themeId);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="group flex items-center gap-2 cursor-pointer outline-none focus:outline-none border-none bg-transparent p-2 rounded-lg transition-all duration-300">
          <LogoWithFallback 
            LogoComponent={SelectedLogoComponent} 
            logoName={selectedLogo.name}
            className="h-12 w-32 object-contain" 
          />
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${open ? 'rotate-180 opacity-100' : ''}`} />
        </button>
      </DrawerTrigger>
      
      <DrawerContent className="bg-gradient-to-b from-[#23262F] to-[#1C1F28] border-[#353945] max-h-[80vh]">
        <div className="w-full overflow-hidden">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-gray-100 text-lg font-semibold text-center">
              Choose Your Logo
            </DrawerTitle>
            <DrawerDescription className="text-gray-400 text-center">
              Select a logo to customize your theme
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="w-full px-6 pb-6 space-y-8 overflow-y-auto max-h-[60vh]">
            {logoGroups.map((group, groupIndex) => (
              <div key={group.label} className="w-full">
                    <h3 className="text-themed-secondary text-sm font-semibold mb-6 px-2 tracking-wide">
                      {group.label}
                    </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {group.logos.map((logo) => {
                    const LogoComponent = logo.component;
                    const hoverClasses = getHoverColorClasses(logo.hoverColor);
                    const isSelected = selectedLogo.themeId === logo.themeId;
                    
                    return (
                      <button
                        key={logo.name}
                        onClick={() => handleLogoSelect(logo)}
                        className={`group bg-themed-card rounded-xl p-3 transition-all duration-300 hover:scale-105 border-2 ${
                          isSelected 
                            ? 'border-themed-strong bg-themed-light' 
                            : `border-transparent hover:border-themed-light hover:bg-themed-subtle`
                        } hover:shadow-lg flex items-center justify-center min-h-[100px]`}
                        title={logo.name}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <LogoWithFallback 
                            LogoComponent={LogoComponent} 
                            logoName={logo.name}
                            className="h-8 w-20 object-contain transition-all duration-300 group-hover:brightness-110" 
                          />
                          {/* Show palette preview for themed logos */}
                          {availablePalettes.find(p => p.id === logo.themeId) && (
                            <PalettePreview 
                              palette={availablePalettes.find(p => p.id === logo.themeId)!}
                              size="sm"
                              className="opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {groupIndex < logoGroups.length - 1 && (
                  <div className="border-t border-[#353945] mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};