import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  allPalettes, 
  getPaletteById, 
  generatePaletteCSSVars, 
  createPaletteFromTeamColors,
  type TeamPalette 
} from '@/lib/teamPalettes';
import { generateLogoThemes, getThemeByDNA } from '@/lib/logoThemes';

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

  // Load database color themes and logo themes
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

      // Generate logo-based themes
      const logoThemes = generateLogoThemes();

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
        
        // Combine with static palettes and logo themes
        setAvailablePalettes([...allPalettes, ...dbPalettes, ...logoThemes]);
      } else {
        // Just use static and logo themes if no database themes
        setAvailablePalettes([...allPalettes, ...logoThemes]);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      // Fallback to static and logo themes
      const logoThemes = generateLogoThemes();
      setAvailablePalettes([...allPalettes, ...logoThemes]);
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

  // Set theme by ID with enhanced fallback
  const setTheme = useCallback((themeId: string) => {
    const palette = getPaletteById(themeId) || 
                   availablePalettes.find(p => p.id === themeId);
    
    if (palette) {
      applyTheme(palette);
      // Save to localStorage for persistence
      localStorage.setItem('crd-theme', themeId);
      console.log(`Applied theme: ${themeId}`);
    } else {
      console.warn(`Theme not found: ${themeId}. Available themes:`, availablePalettes.map(p => p.id));
      // Fallback to default theme
      const fallbackPalette = allPalettes.find(p => p.id === 'cardshow-basic') || allPalettes[0];
      if (fallbackPalette) {
        console.log(`Using fallback theme: ${fallbackPalette.id}`);
        applyTheme(fallbackPalette);
        localStorage.setItem('crd-theme', fallbackPalette.id);
      }
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

  // Logo-specific theme functions
  const setLogoTheme = useCallback((dnaCode: string) => {
    const logoTheme = getThemeByDNA(dnaCode);
    if (logoTheme) {
      applyTheme(logoTheme);
      localStorage.setItem('crd-theme', logoTheme.id);
      console.log(`Applied logo theme: ${dnaCode} -> ${logoTheme.id}`);
    } else {
      console.warn(`Logo theme not found for DNA code: ${dnaCode}`);
    }
  }, [applyTheme]);

  return {
    // Current state
    currentPalette,
    availablePalettes,
    databaseThemes,
    isLoading,
    
    // Actions
    setTheme,
    setLogoTheme,
    resetToDefault,
    applyTheme,
    
    // Utilities
    getThemePreview,
    getThemeCSSVars,
    loadDatabaseThemes,
    
    // Logo-specific utilities
    getThemeByDNA,
    
    // Computed values
    currentThemeId: currentPalette?.id || null,
    isDefaultTheme: currentPalette?.id === 'cardshow-basic'
  };
};