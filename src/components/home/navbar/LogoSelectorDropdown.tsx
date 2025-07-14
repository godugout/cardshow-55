
import React, { useState } from 'react';
import { ChevronDown, Home, Shirt, Users } from 'lucide-react';
import { useTeams } from '@/hooks/use-teams';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { cn } from '@/lib/utils';
import type { NavbarMode } from '@/hooks/useNavbarTheme';

interface LogoSelectorDropdownProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDropdown = ({ onThemeChange }: LogoSelectorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { teams } = useTeams();
  const { 
    currentTheme, 
    setTheme, 
    navbarMode, 
    setNavbarMode,
    currentPalette 
  } = useTeamTheme();

  const handleTeamSelect = (teamId: string) => {
    setTheme(teamId);
    onThemeChange?.(teamId);
    setIsOpen(false);
  };

  const handleNavbarModeChange = (mode: NavbarMode) => {
    setNavbarMode(mode);
    setIsOpen(false);
  };

  const getCurrentTeam = () => {
    return teams.find(team => team.id === currentTheme);
  };

  const currentTeam = getCurrentTeam();

  // Set CSS custom property for pinstripe color
  React.useEffect(() => {
    if (currentPalette?.colors?.primary) {
      document.documentElement.style.setProperty('--pinstripe-color', currentPalette.colors.primary);
    }
  }, [currentPalette]);

  const navbarModeOptions = [
    {
      id: 'normal' as NavbarMode,
      label: 'Normal',
      description: 'Dynamic team colors',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'home' as NavbarMode,
      label: 'Home',
      description: 'Light background',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'away' as NavbarMode,
      label: 'Away',
      description: 'MLB away gray',
      icon: <Shirt className="w-4 h-4" />
    },
    {
      id: 'pinstripes' as NavbarMode,
      label: 'Pinstripes',
      description: 'Classic pinstripe style',
      icon: <Shirt className="w-4 h-4" />
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
          "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20",
          isOpen && "bg-white/10"
        )}
      >
        {currentTeam?.logoUrl ? (
          <img 
            src={currentTeam.logoUrl} 
            alt={currentTeam.name}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-gradient-to-br from-crd-blue to-crd-purple flex items-center justify-center">
            <span className="text-white font-bold text-sm">CRD</span>
          </div>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 text-white/70 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50">
            {/* Navbar Mode Section */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white/90 mb-3">Navbar Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {navbarModeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleNavbarModeChange(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 text-center",
                      navbarMode === option.id
                        ? "bg-crd-blue/20 text-white border border-crd-blue/30"
                        : "hover:bg-white/5 text-white/70 hover:text-white/90"
                    )}
                  >
                    {option.icon}
                    <span className="text-xs font-medium">{option.label}</span>
                    <span className="text-xs opacity-60">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Selection Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-white/90 mb-3">Team Theme</h3>
              <div className="max-h-60 overflow-y-auto">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left",
                      currentTheme === team.id
                        ? "bg-crd-blue/20 text-white"
                        : "hover:bg-white/5 text-white/80 hover:text-white"
                    )}
                  >
                    {team.logoUrl ? (
                      <img 
                        src={team.logoUrl} 
                        alt={team.name}
                        className="w-6 h-6 object-contain flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{team.name}</div>
                      <div className="text-xs opacity-60 truncate">{team.abbreviation}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
