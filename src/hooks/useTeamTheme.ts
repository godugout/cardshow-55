import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  allPalettes, 
  getPaletteById, 
  generatePaletteCSSVars, 
  createPaletteFromTeamColors,
  type TeamPalette 
} from '@/lib/teamPalettes';

interface ColorTheme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  primary_example_team: string;
}

export const useTeamTheme = () => {
  const [currentPalette, setCurrentPalette] = useState<TeamPalette | null>(null);
  const [availablePalettes, setAvailablePalettes] = useState<TeamPalette[]>(allPalettes);
  const [databaseThemes, setDatabaseThemes] = useState<ColorTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load database color themes
  const loadDatabaseThemes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('color_themes')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading color themes:', error);
        return;
      }

      if (data) {
        setDatabaseThemes(data);
        
        // Convert database themes to TeamPalette format
        const dbPalettes = data.map(theme => 
          createPaletteFromTeamColors(
            theme.name,
            theme.primary_color,
            theme.secondary_color,
            theme.accent_color
          )
        );
        
        // Combine with static palettes
        setAvailablePalettes([...allPalettes, ...dbPalettes]);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme CSS variables to document
  const applyTheme = useCallback((palette: TeamPalette) => {
    const cssVars = generatePaletteCSSVars(palette);
    const root = document.documentElement;
    
    // Apply all CSS variables
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', palette.id);
    
    setCurrentPalette(palette);
  }, []);

  // Set theme by ID
  const setTheme = useCallback((themeId: string) => {
    const palette = getPaletteById(themeId) || 
                   availablePalettes.find(p => p.id === themeId);
    
    if (palette) {
      applyTheme(palette);
      // Save to localStorage for persistence
      localStorage.setItem('crd-theme', themeId);
    } else {
      console.warn(`Theme not found: ${themeId}`);
    }
  }, [availablePalettes, applyTheme]);

  // Reset to default theme
  const resetToDefault = useCallback(() => {
    const defaultPalette = allPalettes[0]; // SF Orange
    applyTheme(defaultPalette);
    localStorage.removeItem('crd-theme');
  }, [applyTheme]);

  // Get theme preview (without applying)
  const getThemePreview = useCallback((themeId: string) => {
    return getPaletteById(themeId) || 
           availablePalettes.find(p => p.id === themeId);
  }, [availablePalettes]);

  // Generate CSS variables for a specific theme (for preview)
  const getThemeCSSVars = useCallback((themeId: string) => {
    const palette = getThemePreview(themeId);
    return palette ? generatePaletteCSSVars(palette) : {};
  }, [getThemePreview]);

  // Initialize theme on mount
  useEffect(() => {
    loadDatabaseThemes();
  }, [loadDatabaseThemes]);

  // Load saved theme after palettes are available
  useEffect(() => {
    if (availablePalettes.length > 0 && !isLoading) {
      const savedTheme = localStorage.getItem('crd-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Apply default theme
        const defaultPalette = allPalettes.find(p => p.id === 'cardshow-basic') || allPalettes[0];
        applyTheme(defaultPalette);
      }
    }
  }, [availablePalettes, isLoading, setTheme, applyTheme]);

  return {
    // Current state
    currentPalette,
    availablePalettes,
    databaseThemes,
    isLoading,
    
    // Actions
    setTheme,
    resetToDefault,
    applyTheme,
    
    // Utilities
    getThemePreview,
    getThemeCSSVars,
    loadDatabaseThemes,
    
    // Computed values
    currentThemeId: currentPalette?.id || null,
    isDefaultTheme: currentPalette?.id === 'cardshow-basic'
  };
};