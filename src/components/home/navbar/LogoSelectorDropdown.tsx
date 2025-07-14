
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CRDLogo } from '@/components/crd/CRDLogoComponent';
import { teamPalettes, TeamPalette } from '@/lib/teamPalettes';

interface LogoSelectorDropdownProps {
  onThemeChange?: (themeId: string) => void;
}

// Teams that should have larger logos
const LARGE_LOGO_TEAMS = [
  'emerald-spark',
  'liberty-block', 
  'vintage-vibe',
  'coastal-storm',
  'cardinal-script',
  'neon-rush',
  'elite-emerald',
  'crimson-bold',
  'steel-force',
  'vintage-burgundy',
  'shadow-force'
];

export const LogoSelectorDropdown = ({ onThemeChange }: LogoSelectorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamPalette | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTeamSelect = (team: TeamPalette) => {
    setSelectedTeam(team);
    setIsOpen(false);
    if (onThemeChange && team.name) {
      onThemeChange(team.name);
    }
  };

  // Get logo size based on team
  const getLogoSize = (teamId: string) => {
    return LARGE_LOGO_TEAMS.includes(teamId) ? 'w-8 h-8' : 'w-6 h-6';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-crd-white hover:text-crd-orange transition-colors bg-crd-darkGray/50 hover:bg-crd-darkGray/70 rounded-md border border-crd-darkGray"
      >
        {selectedTeam ? (
          <>
            <CRDLogo 
              fileName={`CS_MLB_${selectedTeam.teamCode}.png`} 
              className="w-5 h-5" 
            />
            <span className="hidden sm:inline">{selectedTeam.name}</span>
          </>
        ) : (
          <>
            <CRDLogo 
              fileName="CS_MLB_LAD.png" 
              className="w-5 h-5" 
            />
            <span className="hidden sm:inline">CRD</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-crd-darker border border-crd-darkGray rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-crd-white mb-3">Select Team Theme</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(teamPalettes).map((team) => (
                <button
                  key={team.name}
                  onClick={() => handleTeamSelect(team)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-crd-darkGray/50 transition-colors text-left w-full"
                >
                  <CRDLogo 
                    fileName={`CS_MLB_${team.teamCode}.png`} 
                    className={getLogoSize(team.id || team.name?.toLowerCase().replace(/\s+/g, '-') || '')}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-crd-white truncate">
                      {team.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-crd-darkGray/30" 
                        style={{ backgroundColor: team.colors?.primary || '#1a1a1a' }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-crd-darkGray/30" 
                        style={{ backgroundColor: team.colors?.secondary || '#333333' }}
                      />
                    </div>
                  </div>
                  {selectedTeam?.name === team.name && (
                    <div className="w-2 h-2 bg-crd-orange rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
