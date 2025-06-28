
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TeamColorGrid } from './TeamColorGrid';
import type { ColorTheme } from '@/hooks/useColorThemes';
import type { TeamColorScheme } from './TeamColors';

interface TeamColorTabsProps {
  themesBySport: Record<string, ColorTheme[]>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedColorScheme?: TeamColorScheme;
  hoveredTheme: string | null;
  onThemeHover: (themeId: string | null) => void;
  onThemeSelect: (theme: ColorTheme) => void;
}

export const TeamColorTabs = ({
  themesBySport,
  activeTab,
  onTabChange,
  selectedColorScheme,
  hoveredTheme,
  onThemeHover,
  onThemeSelect
}: TeamColorTabsProps) => {
  const sportTabs = Object.keys(themesBySport).sort();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-crd-mediumGray/20 mb-4">
        {sportTabs.slice(0, 4).map((sport) => (
          <TabsTrigger 
            key={sport} 
            value={sport}
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-crd-lightGray capitalize text-xs"
          >
            {sport}
            <span className="ml-1 text-xs opacity-70">
              ({themesBySport[sport]?.length || 0})
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {sportTabs.map((sport) => (
        <TabsContent key={sport} value={sport} className="mt-0">
          <TeamColorGrid
            themes={themesBySport[sport] || []}
            selectedColorScheme={selectedColorScheme}
            hoveredTheme={hoveredTheme}
            onThemeHover={onThemeHover}
            onThemeSelect={onThemeSelect}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
