// Comprehensive 4-color palettes for team theming
// Each palette contains: primary, secondary, accent, and neutral colors

export interface TeamPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;    // Main brand color
    secondary: string;  // Complementary color
    accent: string;     // Highlight/action color
    neutral: string;    // Background/text support
  };
  hsl: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  usage: {
    navbar: string;
    cards: string;
    buttons: string;
    text: string;
  };
}

// Logo-based 4-color palettes (matching existing logos)
export const logoPalettes: TeamPalette[] = [
  {
    id: 'sf-orange',
    name: 'SF Orange',
    description: 'Bold orange with classic black and cream accents',
    colors: {
      primary: '#FD5A1E',   // SF Orange
      secondary: '#000000',  // Black
      accent: '#AE8F6F',     // Cream/Tan
      neutral: '#FFFFFF'     // White
    },
    hsl: {
      primary: '17 98 55',   // Orange
      secondary: '0 0 0',    // Black
      accent: '33 22 56',    // Cream
      neutral: '0 0 100'     // White
    },
    usage: {
      navbar: 'Dark orange background with orange accents',
      cards: 'Orange borders with cream highlights',
      buttons: 'Orange primary, black secondary',
      text: 'White on dark, orange for accents'
    }
  },
  {
    id: 'washington',
    name: 'Washington',
    description: 'Patriotic red, navy, and white with silver accents',
    colors: {
      primary: '#C8102E',   // Washington Red
      secondary: '#041E42',  // Navy Blue
      accent: '#87CEEB',     // Light Blue
      neutral: '#A5ACAF'     // Silver
    },
    hsl: {
      primary: '350 87 43',  // Red
      secondary: '222 84 13', // Navy
      accent: '197 71 73',   // Light Blue
      neutral: '200 8 68'    // Silver
    },
    usage: {
      navbar: 'White background with red accents',
      cards: 'Red borders with navy highlights',
      buttons: 'Red primary, navy secondary',
      text: 'Navy on white, red for highlights'
    }
  },
  {
    id: 'oakland',
    name: 'Oakland',
    description: 'Forest green and gold with natural earth tones',
    colors: {
      primary: '#003831',   // Forest Green
      secondary: '#EFB21E',  // Gold
      accent: '#45B26B',     // Bright Green
      neutral: '#2C5530'     // Dark Green
    },
    hsl: {
      primary: '163 100 11', // Forest Green
      secondary: '44 88 53', // Gold
      accent: '142 42 55',   // Bright Green
      neutral: '126 30 25'   // Dark Green
    },
    usage: {
      navbar: 'Forest green background with gold accents',
      cards: 'Green borders with gold highlights',
      buttons: 'Gold primary, green secondary',
      text: 'White on green, gold for accents'
    }
  },
  {
    id: 'pittsburgh',
    name: 'Pittsburgh',
    description: 'Classic black and gold with gray support tones',
    colors: {
      primary: '#000000',   // Black
      secondary: '#FFB612',  // Gold
      accent: '#FFC72C',     // Bright Gold
      neutral: '#869397'     // Gray
    },
    hsl: {
      primary: '0 0 0',      // Black
      secondary: '44 100 53', // Gold
      accent: '47 100 58',   // Bright Gold
      neutral: '200 8 57'    // Gray
    },
    usage: {
      navbar: 'Black background with gold accents',
      cards: 'Gold borders with gray highlights',
      buttons: 'Gold primary, black secondary',
      text: 'Gold on black, white for readability'
    }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    description: 'Royal blue with white and light blue accents',
    colors: {
      primary: '#003E7E',   // Royal Blue
      secondary: '#FFFFFF',  // White
      accent: '#41B6E6',     // Light Blue
      neutral: '#C4CED4'     // Light Gray
    },
    hsl: {
      primary: '217 100 25', // Royal Blue
      secondary: '0 0 100',  // White
      accent: '198 72 58',   // Light Blue
      neutral: '210 17 81'   // Light Gray
    },
    usage: {
      navbar: 'Royal blue background with light blue accents',
      cards: 'Blue borders with white highlights',
      buttons: 'Blue primary, light blue secondary',
      text: 'White on blue, light blue for accents'
    }
  }
];

// Cardshow branded palettes
export const cardshowPalettes: TeamPalette[] = [
  {
    id: 'cardshow-basic',
    name: 'Cardshow Basic',
    description: 'Clean minimal grayscale with subtle accents',
    colors: {
      primary: '#1A1A1A',   // Dark Gray
      secondary: '#FFFFFF',  // White
      accent: '#45B26B',     // CRD Green
      neutral: '#F5F5F5'     // Light Gray
    },
    hsl: {
      primary: '0 0 10',     // Dark Gray
      secondary: '0 0 100',  // White
      accent: '142 42 55',   // CRD Green
      neutral: '0 0 96'      // Light Gray
    },
    usage: {
      navbar: 'Light gray background with green accents',
      cards: 'White background with green borders',
      buttons: 'Green primary, gray secondary',
      text: 'Dark gray with green highlights'
    }
  },
  {
    id: 'cardshow-green',
    name: 'Cardshow Green',
    description: 'CRD signature green with professional tones',
    colors: {
      primary: '#45B26B',   // CRD Green
      secondary: '#1A1A1A',  // Dark Gray
      accent: '#66CC88',     // Light Green
      neutral: '#2A2A2A'     // Medium Gray
    },
    hsl: {
      primary: '142 42 55',  // CRD Green
      secondary: '0 0 10',   // Dark Gray
      accent: '142 52 65',   // Light Green
      neutral: '0 0 17'      // Medium Gray
    },
    usage: {
      navbar: 'Dark green background with light green accents',
      cards: 'Green borders with gray backgrounds',
      buttons: 'Green primary, dark secondary',
      text: 'White on dark, green for accents'
    }
  },
  {
    id: 'cardshow-blue',
    name: 'Cardshow Blue', 
    description: 'Professional blue with modern accents',
    colors: {
      primary: '#3772FF',   // CRD Blue
      secondary: '#FFFFFF',  // White
      accent: '#5B8FFF',     // Light Blue
      neutral: '#E6EFFF'     // Very Light Blue
    },
    hsl: {
      primary: '225 100 61', // CRD Blue
      secondary: '0 0 100',  // White
      accent: '225 100 69',  // Light Blue
      neutral: '225 100 93'  // Very Light Blue
    },
    usage: {
      navbar: 'Blue background with light blue accents',
      cards: 'Blue borders with white backgrounds',
      buttons: 'Blue primary, light blue secondary', 
      text: 'White on blue, blue for highlights'
    }
  },
  {
    id: 'cardshow-orange',
    name: 'Cardshow Orange',
    description: 'Vibrant orange with warm earth tones',
    colors: {
      primary: '#EA6E48',   // CRD Orange
      secondary: '#2A1A0F',  // Dark Brown
      accent: '#FFB87A',     // Light Orange
      neutral: '#FFF4E6'     // Cream
    },
    hsl: {
      primary: '17 79 58',   // CRD Orange
      secondary: '33 42 12', // Dark Brown
      accent: '33 100 73',   // Light Orange
      neutral: '33 100 95'   // Cream
    },
    usage: {
      navbar: 'Orange background with cream accents',
      cards: 'Orange borders with cream backgrounds',
      buttons: 'Orange primary, brown secondary',
      text: 'Dark brown with orange highlights'
    }
  }
];

// Utility function to convert team colors from database to 4-color palette
export const createPaletteFromTeamColors = (
  name: string,
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
): TeamPalette => {
  // Convert hex to HSL for consistency
  const hexToHsl = (hex: string): string => {
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

  // Smart neutral color generation based on primary
  const generateNeutral = (primaryHex: string): string => {
    const r = parseInt(primaryHex.slice(1, 3), 16);
    const g = parseInt(primaryHex.slice(3, 5), 16);
    const b = parseInt(primaryHex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return light or dark neutral based on primary brightness
    return brightness > 128 ? '#2A2A2A' : '#F5F5F5';
  };

  const neutral = generateNeutral(primaryColor);

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    description: `${name} team colors with smart neutral tones`,
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      neutral: neutral
    },
    hsl: {
      primary: hexToHsl(primaryColor),
      secondary: hexToHsl(secondaryColor),
      accent: hexToHsl(accentColor),
      neutral: hexToHsl(neutral)
    },
    usage: {
      navbar: `${name} themed navigation with team colors`,
      cards: `${name} card styling with accent highlights`,
      buttons: `${name} branded buttons and interactions`,
      text: `${name} optimized text contrast and readability`
    }
  };
};

// All available palettes
export const allPalettes = [...logoPalettes, ...cardshowPalettes];

// Get palette by ID
export const getPaletteById = (id: string): TeamPalette | undefined => {
  return allPalettes.find(palette => palette.id === id);
};

// Generate CSS variables for a palette
export const generatePaletteCSSVars = (palette: TeamPalette): Record<string, string> => {
  return {
    '--theme-primary': palette.hsl.primary,
    '--theme-secondary': palette.hsl.secondary,
    '--theme-accent': palette.hsl.accent,
    '--theme-neutral': palette.hsl.neutral,
    
    // Derived variables for specific use cases
    '--theme-navbar-bg': palette.hsl.primary,
    '--theme-navbar-border': palette.hsl.accent,
    '--theme-text-primary': palette.hsl.secondary,
    '--theme-text-secondary': palette.hsl.neutral,
    '--theme-text-active': palette.hsl.accent,
    '--theme-cta-bg': palette.hsl.accent,
    '--theme-cta-text': palette.hsl.primary,
    '--theme-accent-hover': palette.hsl.accent,
    
    // Card theming
    '--theme-card-bg': palette.hsl.neutral,
    '--theme-card-border': palette.hsl.accent,
    '--theme-card-hover': palette.hsl.accent,
    
    // Extended theming
    '--theme-badge-primary': palette.hsl.accent,
    '--theme-badge-secondary': palette.hsl.secondary,
    '--theme-highlight': palette.hsl.accent,
    '--theme-success-text': palette.hsl.accent
  };
};