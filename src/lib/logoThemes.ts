// Logo-specific theming system for Cardshow
// Each logo gets a carefully crafted 4-color theme based on official team/brand colors

import { cardshowLogoDatabase, LogoTheme } from './cardshowDNA';
import { TeamPalette } from './teamPalettes';

// Convert hex to HSL for CSS variables
export const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
};

// Convert logo theme to TeamPalette format
export const logoThemeToTeamPalette = (logo: typeof cardshowLogoDatabase[0]): TeamPalette => {
  const { logoTheme, dnaCode, displayName, themeUsage } = logo;
  
  return {
    id: `logo-${dnaCode.toLowerCase()}`,
    name: `${displayName} Theme`,
    description: logo.description,
    colors: logoTheme,
    hsl: {
      primary: hexToHsl(logoTheme.primary),
      secondary: hexToHsl(logoTheme.secondary),
      accent: hexToHsl(logoTheme.accent),
      neutral: hexToHsl(logoTheme.neutral)
    },
    usage: themeUsage
  };
};

// Generate all logo-based themes
export const generateLogoThemes = (): TeamPalette[] => {
  return cardshowLogoDatabase.map(logoThemeToTeamPalette);
};

// Get theme by logo DNA code
export const getThemeByDNA = (dnaCode: string): TeamPalette | undefined => {
  const logo = cardshowLogoDatabase.find(l => l.dnaCode === dnaCode);
  return logo ? logoThemeToTeamPalette(logo) : undefined;
};

// Generate CSS variables for logo theme
export const generateLogoThemeCSSVars = (logoTheme: LogoTheme): Record<string, string> => {
  return {
    '--theme-primary': hexToHsl(logoTheme.primary),
    '--theme-secondary': hexToHsl(logoTheme.secondary),
    '--theme-accent': hexToHsl(logoTheme.accent),
    '--theme-neutral': hexToHsl(logoTheme.neutral),
    
    // Navbar theming
    '--theme-navbar-bg': hexToHsl(logoTheme.primary),
    '--theme-navbar-border': hexToHsl(logoTheme.accent),
    '--theme-text-primary': hexToHsl(logoTheme.neutral),
    '--theme-text-secondary': hexToHsl(logoTheme.secondary),
    '--theme-text-active': hexToHsl(logoTheme.accent),
    
    // Interactive elements
    '--theme-cta-bg': hexToHsl(logoTheme.accent),
    '--theme-cta-text': hexToHsl(logoTheme.primary),
    '--theme-accent-hover': adjustBrightness(hexToHsl(logoTheme.accent), 10),
    
    // Card theming
    '--theme-card-bg': hexToHsl(logoTheme.neutral),
    '--theme-card-border': hexToHsl(logoTheme.secondary),
    '--theme-card-hover': hexToHsl(logoTheme.accent),
    
    // Component theming
    '--theme-badge-primary': hexToHsl(logoTheme.accent),
    '--theme-badge-secondary': hexToHsl(logoTheme.secondary),
    '--theme-highlight': hexToHsl(logoTheme.accent),
    '--theme-success-text': hexToHsl(logoTheme.secondary)
  };
};

// Adjust HSL brightness for hover effects
const adjustBrightness = (hsl: string, adjustment: number): string => {
  const [h, s, l] = hsl.split(' ').map(Number);
  const newL = Math.max(0, Math.min(100, l + adjustment));
  return `${h} ${s} ${newL}`;
};

// Logo-specific theme recommendations
export const getLogoThemeRecommendations = (dnaCode: string) => {
  const logo = cardshowLogoDatabase.find(l => l.dnaCode === dnaCode);
  if (!logo) return null;

  const recommendations = {
    bestFor: [] as string[],
    contrastRatio: 'AAA',
    designStyle: logo.category.toLowerCase(),
    colorHarmony: 'Complementary'
  };

  // Category-specific recommendations
  switch (logo.category) {
    case 'Modern':
      recommendations.bestFor = ['Tech brands', 'Startups', 'Digital products'];
      break;
    case 'Script':
      recommendations.bestFor = ['Traditional brands', 'Sports teams', 'Heritage companies'];
      break;
    case 'Bold':
      recommendations.bestFor = ['Sports', 'Gaming', 'Entertainment'];
      break;
    case 'Fantasy':
      recommendations.bestFor = ['Gaming', 'Entertainment', 'Creative brands'];
      break;
    case 'Retro':
      recommendations.bestFor = ['Vintage brands', 'Nostalgic products', '70s-80s themes'];
      break;
  }

  return recommendations;
};