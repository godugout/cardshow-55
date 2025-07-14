
// Core team palette types
export interface TeamPalette {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    neutral?: string;
  };
  hsl?: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  description?: string;
  usage?: {
    navbar: string;
    cards: string;
    buttons: string;
    text: string;
  };
}

// Helper function to create team palettes
export const createTeamPalette = (
  id: string,
  name: string,
  description: string,
  primary: string,
  secondary: string,
  accent: string,
  text: string
): TeamPalette => ({
  name,
  colors: {
    primary,
    secondary,
    accent,
    text,
    neutral: text
  },
  hsl: {
    primary,
    secondary,
    accent,
    neutral: text
  },
  description,
  usage: {
    navbar: 'Primary branding and navigation',
    cards: 'Card backgrounds and accents',
    buttons: 'Interactive elements',
    text: 'Text and typography'
  }
});

// Main team palettes data
export const teamPalettes: Record<string, TeamPalette> = {
  lakers: createTeamPalette('lakers', 'Lakers', 'Purple & Gold', '#552583', '#FDB927', '#000000', '#FFFFFF'),
  warriors: createTeamPalette('warriors', 'Warriors', 'Blue & Gold', '#1D428A', '#FFC72C', '#26282F', '#FFFFFF'),
  celtics: createTeamPalette('celtics', 'Celtics', 'Green & Gold', '#007A33', '#BA9653', '#FFFFFF', '#000000'),
  bulls: createTeamPalette('bulls', 'Bulls', 'Red & Black', '#CE1141', '#000000', '#FFFFFF', '#000000'),
  heat: createTeamPalette('heat', 'Heat', 'Red & Black', '#98002E', '#F9A01B', '#000000', '#FFFFFF'),
  spurs: createTeamPalette('spurs', 'Spurs', 'Black & Silver', '#C4CED4', '#000000', '#FFFFFF', '#000000'),
  nets: createTeamPalette('nets', 'Nets', 'Black & White', '#000000', '#FFFFFF', '#777D84', '#FFFFFF'),
  knicks: createTeamPalette('knicks', 'Knicks', 'Blue & Orange', '#006BB6', '#F58426', '#FFFFFF', '#000000'),
  sixers: createTeamPalette('sixers', '76ers', 'Blue & Red', '#006BB6', '#ED174C', '#FFFFFF', '#000000'),
  rockets: createTeamPalette('rockets', 'Rockets', 'Red & Silver', '#CE1141', '#C4CED4', '#000000', '#FFFFFF'),
};

// Helper function to get palette by filename (for CRD DNA)
export const getPaletteByFileName = (fileName: string): string | null => {
  // Simple mapping logic - you can enhance this based on your filename patterns
  const lowerFileName = fileName.toLowerCase();
  
  for (const [paletteId, palette] of Object.entries(teamPalettes)) {
    if (lowerFileName.includes(paletteId) || lowerFileName.includes(palette.name.toLowerCase())) {
      return paletteId;
    }
  }
  
  return null;
};
