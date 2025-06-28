
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useColorThemes, type ColorTheme } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from './TeamColors';
import { TeamColorSelectorHeader } from './TeamColorSelectorHeader';
import { TeamColorTabs } from './TeamColorTabs';
import { SelectedColorInfo } from './SelectedColorInfo';

interface TeamColorSelectorProps {
  selectedColorScheme?: TeamColorScheme;
  onColorSchemeSelect: (colorScheme: TeamColorScheme) => void;
  className?: string;
}

export const TeamColorSelector = ({ 
  selectedColorScheme, 
  onColorSchemeSelect, 
  className = "" 
}: TeamColorSelectorProps) => {
  const { colorThemes, loading, error } = useColorThemes();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('baseball');

  // Group themes by sport with improved logic - filter out cricket
  const themesBySport = useMemo(() => {
    const grouped = colorThemes.reduce((acc, theme) => {
      const teams = theme.teams || [];
      
      if (teams.length === 0) {
        // Default to baseball for themes without teams
        if (!acc.baseball) acc.baseball = [];
        acc.baseball.push(theme);
      } else {
        teams.forEach(team => {
          const sport = team.sport.toLowerCase();
          // Skip cricket teams
          if (sport === 'cricket') return;
          
          if (!acc[sport]) acc[sport] = [];
          // Only add theme once per sport to avoid duplicates within the same sport
          if (!acc[sport].find(t => t.id === theme.id)) {
            acc[sport].push(theme);
          }
        });
      }
      
      return acc;
    }, {} as Record<string, ColorTheme[]>);
    
    // Ensure we have the expected sports (excluding cricket)
    const expectedSports = ['baseball', 'basketball', 'football', 'hockey', 'soccer'];
    expectedSports.forEach(sport => {
      if (!grouped[sport]) grouped[sport] = [];
    });
    
    return grouped;
  }, [colorThemes]);

  // Set default active tab to first sport with themes
  React.useEffect(() => {
    const sportsWithThemes = Object.keys(themesBySport).filter(sport => 
      themesBySport[sport].length > 0
    );
    if (sportsWithThemes.length > 0 && !sportsWithThemes.includes(activeTab)) {
      setActiveTab(sportsWithThemes[0]);
    }
  }, [themesBySport, activeTab]);

  const handleThemeSelect = (theme: ColorTheme) => {
    const scheme = convertColorThemeToScheme(theme);
    onColorSchemeSelect(scheme);
  };

  if (loading) {
    return (
      <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
        <CardHeader>
          <TeamColorSelectorHeader />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
        <CardHeader>
          <TeamColorSelectorHeader />
        </CardHeader>
        <CardContent>
          <div className="text-crd-lightGray text-sm">
            Failed to load color themes. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
      <CardHeader>
        <TeamColorSelectorHeader selectedColorScheme={selectedColorScheme} />
        <p className="text-crd-lightGray text-xs">
          Choose from professional sports team color schemes
        </p>
      </CardHeader>
      <CardContent>
        <TeamColorTabs
          themesBySport={themesBySport}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedColorScheme={selectedColorScheme}
          hoveredTheme={hoveredTheme}
          onThemeHover={setHoveredTheme}
          onThemeSelect={handleThemeSelect}
        />
        
        {selectedColorScheme && (
          <SelectedColorInfo selectedColorScheme={selectedColorScheme} />
        )}
      </CardContent>
    </Card>
  );
};
