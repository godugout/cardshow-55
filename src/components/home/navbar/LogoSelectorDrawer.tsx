import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { PalettePreview } from '@/components/ui/design-system';
import { MLBBalOBSLogo } from './MLBBalOBSLogo';
import { MLBBosRBBLogo } from './MLBBosRBBLogo';
import { MLBPadres70sLogo } from './MLBPadres70sLogo';
import { MLBMariners80sLogo } from './MLBMariners80sLogo';
import { MLBAthletics00sLogo } from './MLBAthletics00sLogo';
import { CS3DWGBLogo } from './CS3DWGBLogo';
import { NCAABig10Logo } from './NCAABig10Logo';
import { CSSketchRBLogo } from './CSSketchRBLogo';
import { CSSketchRSLogo } from './CSSketchRSLogo';
import { CSOrigWSLogo } from './CSOrigWSLogo';
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
    label: 'MLB Teams',
    logos: [
      { name: 'CS_MLB_BAL_OBS', component: MLBBalOBSLogo, hoverColor: 'orange', themeId: 'cs_mlb_bal_obs' },
      { name: 'CS_MLB_CLE_RBS', component: CardshowRedBlueLogo, hoverColor: 'red', themeId: 'cs_mlb_cle_rbs' },
      { name: 'CS_MLB_LAD_BS', component: CardshowBlueLogo, hoverColor: 'blue', themeId: 'cs_mlb_lad_bs' },
      { name: 'CS_MLB_PIT_BBY', component: CardshowOrangeLogo, hoverColor: 'yellow', themeId: 'cs_mlb_pit_bby' },
      { name: 'CS_MLB_OAK', component: CardshowGreenLogo, hoverColor: 'green', themeId: 'cs_mlb_oak' },
      { name: 'CS_MLB_MIA', component: CardshowBlueLogo, hoverColor: 'cyan', themeId: 'cs_mlb_mia' },
    ]
  },
  {
    label: 'MLB Classic Era',
    logos: [
      { name: 'CS_MLB_CL_BOS_RBB', component: MLBBosRBBLogo, hoverColor: 'red', themeId: 'cs_mlb_cl_bos_rbb' },
      { name: 'CS_MLB_CL_SDP_70s', component: MLBPadres70sLogo, hoverColor: 'amber', themeId: 'cs_mlb_cl_sdp_70s' },
      { name: 'CS_MLB_CL_SEA_80s', component: MLBMariners80sLogo, hoverColor: 'cyan', themeId: 'cs_mlb_cl_sea_80s' },
      { name: 'CS_MLB_CL_OAK_00s', component: MLBAthletics00sLogo, hoverColor: 'green', themeId: 'cs_mlb_cl_oak_00s' },
    ]
  },
  {
    label: 'NCAA & Uniforms',
    logos: [
      { name: 'CS_NCAA_BIG10', component: NCAABig10Logo, hoverColor: 'indigo', themeId: 'cs_ncaa_big10' },
      { name: 'CS_UNI_YBB', component: CardshowOrangeLogo, hoverColor: 'yellow', themeId: 'cs_uni_ybb' },
      { name: 'CS_UNI_WRB', component: CardshowRedBlueLogo, hoverColor: 'purple', themeId: 'cs_uni_wrb' },
      { name: 'CS_UNI_BB', component: CardshowBlueLogo, hoverColor: 'blue', themeId: 'cs_uni_bb' },
    ]
  },
  {
    label: 'Cardshow Originals',
    logos: [
      { name: 'CRD_GRADIENT', component: CRDGradientLogo, hoverColor: 'cyan', themeId: 'crd_gradient' },
      { name: 'CS_3D_WGB', component: CS3DWGBLogo, hoverColor: 'emerald', themeId: 'cs_3d_wgb' },
      { name: 'CS_OLD_RS', component: CardshowVintageLogo, hoverColor: 'red', themeId: 'cs_old_rs' },
      { name: 'CS_ORIG_WS', component: CSOrigWSLogo, hoverColor: 'gray', themeId: 'cs_orig_ws' },
      { name: 'CS_SK_RB', component: CSSketchRBLogo, hoverColor: 'purple', themeId: 'cs_sk_rb' },
      { name: 'CS_SK_RS', component: CSSketchRSLogo, hoverColor: 'emerald', themeId: 'cs_sk_rs' },
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

// Enhanced logo component with CRD:DNA integration and robust error handling
const LogoWithFallback = ({ LogoComponent, logoName, className }: { 
  LogoComponent: React.ComponentType<{ className?: string }>, 
  logoName: string, 
  className?: string 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quick initialization check
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  // Error state with CRD:DNA styling
  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md text-xs text-muted-foreground transition-all duration-200 hover:bg-muted/70`}>
        <span className="font-mono text-center px-1">{logoName}</span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/30 rounded-md animate-pulse`}>
        <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  // Attempt to render the logo component with error boundary
  try {
    return (
      <div className="relative group">
        <LogoComponent className={className} />
        {/* CRD:DNA code tooltip on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border rounded-md px-2 py-1 text-xs text-popover-foreground shadow-lg whitespace-nowrap z-50">
            {logoName}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.warn(`Failed to render CRD:DNA logo: ${logoName}`, error);
    setHasError(true);
    return (
      <div className={`${className} flex items-center justify-center bg-destructive/10 border border-dashed border-destructive/30 rounded-md text-xs text-destructive transition-all duration-200`}>
        <span className="font-mono">⚠ {logoName}</span>
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
    return logoGroups[0].logos[0]; // Fallback to first MLB team
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