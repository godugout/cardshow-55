import React, { useState, useEffect } from "react";
import { ChevronDown, Home, Plane, Shirt } from "lucide-react";
import { useTeamTheme } from "@/hooks/useTeamTheme";
import { teamPalettes, TeamPalette } from "@/lib/teamPalettes";
import { cn } from "@/lib/utils";

interface LogoSelectorDropdownProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDropdown = ({ onThemeChange }: LogoSelectorDropdownProps) => {
  const { 
    currentTheme, 
    setTheme, 
    navbarMode, 
    toggleNavbarMode,
    isHomeTeamMode,
    isAwayTeamMode 
  } = useTeamTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPalette = teamPalettes[currentTheme];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="logo-selector"]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    onThemeChange?.(themeId);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredPalettes = Object.entries(teamPalettes).filter(([id, palette]: [string, TeamPalette]) => {
    return palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getNavbarModeIcon = () => {
    switch (navbarMode) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'away':
        return <Plane className="w-4 h-4" />;
      default:
        return <Shirt className="w-4 h-4" />;
    }
  };

  const getNavbarModeLabel = () => {
    switch (navbarMode) {
      case 'home':
        return 'Home Team';
      case 'away':
        return 'Away Game';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="flex items-center gap-3" data-dropdown="logo-selector">
      {/* Logo Display */}
      <div 
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-white/10 hover:backdrop-blur-sm",
          isOpen && "bg-white/10 backdrop-blur-sm"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Team Logo */}
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ 
            background: `linear-gradient(135deg, ${currentPalette?.colors?.primary || '#333'}, ${currentPalette?.colors?.secondary || '#666'})` 
          }}
        >
          {currentPalette?.name?.slice(0, 2).toUpperCase() || 'CRD'}
        </div>

        {/* Team Name */}
        <div className="flex flex-col">
          <span className={cn(
            "font-semibold text-sm",
            isHomeTeamMode ? "text-slate-800" : isAwayTeamMode ? "text-gray-800" : "text-white"
          )}>
            {currentPalette?.name || 'Select Team'}
          </span>
        </div>

        <ChevronDown 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isHomeTeamMode ? "text-slate-600" : isAwayTeamMode ? "text-gray-600" : "text-gray-300",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {/* Navbar Mode Toggle Button */}
      <button
        onClick={toggleNavbarMode}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
          "border border-white/20 hover:border-white/40 hover:bg-white/10",
          isHomeTeamMode && "bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-slate-300",
          isAwayTeamMode && "bg-gray-300/90 text-gray-800 border-gray-400 hover:bg-gray-400/90 hover:border-gray-500"
        )}
        title={`Current: ${getNavbarModeLabel()} - Click to cycle`}
      >
        {getNavbarModeIcon()}
        <span className="text-xs font-medium hidden sm:inline">
          {getNavbarModeLabel()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 dropdown-themed z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              autoFocus
            />
          </div>

          {/* Team List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredPalettes.length > 0 ? (
              <div className="p-2">
                {filteredPalettes.map(([themeId, palette]: [string, TeamPalette]) => {
                  return (
                    <button
                      key={themeId}
                      onClick={() => handleThemeSelect(themeId)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                        "text-left hover:bg-white/10",
                        currentTheme === themeId && "bg-white/20 border border-white/30"
                      )}
                    >
                      {/* Team Color Preview */}
                      <div 
                        className="w-6 h-6 rounded-md flex-shrink-0"
                        style={{ 
                          background: `linear-gradient(135deg, ${palette.colors.primary}, ${palette.colors.secondary})` 
                        }}
                      />
                      
                      {/* Team Info */}
                      <div className="flex-1">
                        <div className="font-medium text-white">{palette.name}</div>
                        <div className="text-xs text-gray-400">{themeId}</div>
                      </div>

                      {/* Current Selection Indicator */}
                      {currentTheme === themeId && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>No teams found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
