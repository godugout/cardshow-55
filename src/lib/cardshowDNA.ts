// CRD:DNA System - Cardshow Brand & Logo Management
export interface CRDEntry {
  fileName: string;
  group: 'MLB' | 'NCAA' | 'UNI' | 'SK' | 'OLD' | 'ORIG' | '3D' | 'CRD';
  teamCode?: string;
  teamName?: string;
  teamCity?: string;
  styleCode: string;
  fontStyle: 'Script' | 'Block' | 'Unknown';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  quaternaryColor?: string;
  decade?: '70s' | '80s' | '00s';
  styleTag?: 'Classic' | 'Standard' | 'Vintage' | 'Throwback' | 'Sketch' | '3D' | 'Gradient' | 'Jersey';
  mascot?: string;
  notes?: string;
  imagePath: string;
}

// Core CRD:DNA Database
export const CRD_DNA_ENTRIES: CRDEntry[] = [
  // MLB Teams
  {
    fileName: "CS_MLB_BAL_OBS.png",
    group: "MLB",
    teamCode: "BAL",
    teamName: "Orioles", 
    teamCity: "Baltimore",
    styleCode: "OBS",
    fontStyle: "Script",
    primaryColor: "#DF4601",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "The Oriole Bird",
    imagePath: "/lovable-uploads/cs-mlb-bal-obs.png"
  },
  {
    fileName: "CS_MLB_CL_BOS_RBB.png",
    group: "MLB",
    teamCode: "BOS",
    teamName: "Red Sox",
    teamCity: "Boston", 
    styleCode: "RBB",
    fontStyle: "Block",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    tertiaryColor: "#FFFFFF",
    styleTag: "Classic",
    mascot: "Wally the Green Monster",
    imagePath: "/lovable-uploads/cs-mlb-cl-bos-rbb.png"
  },
  {
    fileName: "CS_MLB_CL_MIL_BYB.png",
    group: "MLB",
    teamCode: "MIL", 
    teamName: "Brewers",
    teamCity: "Milwaukee",
    styleCode: "BYB",
    fontStyle: "Block",
    primaryColor: "#12284B",
    secondaryColor: "#FFC52F",
    tertiaryColor: "#FFFFFF",
    styleTag: "Classic",
    mascot: "Bernie Brewer",
    imagePath: "/lovable-uploads/cs-mlb-cl-mil-byb.png"
  },
  {
    fileName: "CS_MLB_CL_OAK_00s.png",
    group: "MLB",
    teamCode: "OAK",
    teamName: "Athletics",
    teamCity: "Oakland",
    styleCode: "00s",
    fontStyle: "Unknown",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E", 
    tertiaryColor: "#FFFFFF",
    decade: "00s",
    styleTag: "Classic",
    mascot: "Stomper",
    imagePath: "/lovable-uploads/cs-mlb-cl-oak-00s.png"
  },
  {
    fileName: "CS_MLB_CL_SDP_70s.png",
    group: "MLB",
    teamCode: "SDP",
    teamName: "Padres",
    teamCity: "San Diego",
    styleCode: "70s", 
    fontStyle: "Block",
    primaryColor: "#2F241D",
    secondaryColor: "#FFC425",
    tertiaryColor: "#FFFFFF",
    decade: "70s",
    styleTag: "Classic",
    mascot: "Swinging Friar",
    imagePath: "/lovable-uploads/cs-mlb-cl-sdp-70s.png"
  },
  {
    fileName: "CS_MLB_CL_SEA_80s.png",
    group: "MLB",
    teamCode: "SEA",
    teamName: "Mariners", 
    teamCity: "Seattle",
    styleCode: "80s",
    fontStyle: "Script",
    primaryColor: "#0C2C56",
    secondaryColor: "#005C5C",
    tertiaryColor: "#C4CED4",
    decade: "80s",
    styleTag: "Classic",
    mascot: "Mariner Moose",
    imagePath: "/lovable-uploads/cs-mlb-cl-sea-80s.png"
  },
  {
    fileName: "CS_MLB_CLE_RBS.png",
    group: "MLB",
    teamCode: "CLE",
    teamName: "Guardians",
    teamCity: "Cleveland",
    styleCode: "RBS",
    fontStyle: "Script",
    primaryColor: "#0F223E",
    secondaryColor: "#E31937",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "Slider",
    imagePath: "/lovable-uploads/cs-mlb-cle-rbs.png"
  },
  {
    fileName: "CS_MLB_LAD_BS.png",
    group: "MLB",
    teamCode: "LAD",
    teamName: "Dodgers",
    teamCity: "Los Angeles",
    styleCode: "BS",
    fontStyle: "Script",
    primaryColor: "#005A9C",
    secondaryColor: "#FFFFFF",
    tertiaryColor: "#EF3E42",
    styleTag: "Standard",
    imagePath: "/lovable-uploads/cs-mlb-lad-bs.png"
  },
  {
    fileName: "CS_MLB_MIA.png",
    group: "MLB",
    teamCode: "MIA",
    teamName: "Marlins",
    teamCity: "Miami",
    styleCode: "MIA",
    fontStyle: "Unknown",
    primaryColor: "#00A3E0",
    secondaryColor: "#EF3340",
    tertiaryColor: "#000000",
    styleTag: "Standard",
    mascot: "Billy the Marlin",
    imagePath: "/lovable-uploads/cs-mlb-mia.png"
  },
  {
    fileName: "CS_MLB_OAK.png",
    group: "MLB",
    teamCode: "OAK",
    teamName: "Athletics",
    teamCity: "Oakland",
    styleCode: "OAK",
    fontStyle: "Unknown",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "Stomper",
    imagePath: "/lovable-uploads/cs-mlb-oak.png"
  },
  {
    fileName: "CS_MLB_PIT_BBY.png",
    group: "MLB",
    teamCode: "PIT",
    teamName: "Pirates",
    teamCity: "Pittsburgh", 
    styleCode: "BBY",
    fontStyle: "Block",
    primaryColor: "#FDB827",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "Pirate Parrot",
    imagePath: "/lovable-uploads/cs-mlb-pit-bby.png"
  },

  // Other Styles
  {
    fileName: "CS_3D_WGB.png",
    group: "3D",
    styleCode: "WGB",
    fontStyle: "Block",
    primaryColor: "#FFFFFF",
    secondaryColor: "#45B26B",
    tertiaryColor: "#000000",
    styleTag: "3D",
    notes: "Abstract team card layout",
    imagePath: "/lovable-uploads/cs-3d-wgb.png"
  },
  {
    fileName: "CRD_GRADIENT.png",
    group: "CRD",
    styleCode: "GRADIENT",
    fontStyle: "Unknown",
    primaryColor: "#45B26B",
    secondaryColor: "#3772FF",
    styleTag: "Gradient",
    notes: "For backgrounds or CRD Tokens",
    imagePath: "/lovable-uploads/crd-gradient.png"
  },
  {
    fileName: "CS_UNI_YBB.png",
    group: "UNI",
    styleCode: "YBB",
    fontStyle: "Block",
    primaryColor: "#FFB100",
    secondaryColor: "#1F1F1F",
    tertiaryColor: "#0000FF",
    styleTag: "Jersey",
    notes: "For school/college lettering",
    imagePath: "/lovable-uploads/cs-uni-ybb.png"
  },
  {
    fileName: "CS_UNI_WRB.png",
    group: "UNI",
    styleCode: "WRB",
    fontStyle: "Block",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF0000",
    tertiaryColor: "#0000FF",
    styleTag: "Jersey",
    notes: "3-color option",
    imagePath: "/lovable-uploads/cs-uni-wrb.png"
  },
  {
    fileName: "CS_UNI_BB.png",
    group: "UNI",
    styleCode: "BB",
    fontStyle: "Block",
    primaryColor: "#0000FF",
    secondaryColor: "#000000",
    styleTag: "Jersey",
    imagePath: "/lovable-uploads/cs-uni-bb.png"
  },
  {
    fileName: "CS_NCAA_BIG10.png",
    group: "NCAA",
    teamCode: "BIG10",
    teamName: "Big Ten",
    styleCode: "BIG10",
    fontStyle: "Unknown",
    primaryColor: "#000080",
    secondaryColor: "#FFFFFF",
    styleTag: "Standard",
    notes: "Big Ten NCAA branding",
    imagePath: "/lovable-uploads/cs-ncaa-big10.png"
  },
  {
    fileName: "CS_OLD_RS.png",
    group: "OLD",
    teamCode: "BOS",
    teamName: "Red Sox",
    styleCode: "RS",
    fontStyle: "Script",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    styleTag: "Vintage",
    mascot: "Wally",
    notes: "Retro serif script",
    imagePath: "/lovable-uploads/cs-old-rs.png"
  },
  {
    fileName: "CS_ORIG_WS.png",
    group: "ORIG",
    teamCode: "WSH",
    teamName: "Senators",
    teamCity: "Washington",
    styleCode: "WS",
    fontStyle: "Script",
    primaryColor: "#FFFFFF",
    secondaryColor: "#FF0000",
    styleTag: "Throwback",
    notes: "Original style for Washington",
    imagePath: "/lovable-uploads/cs-orig-ws.png"
  },
  {
    fileName: "CS_SK_RB.png",
    group: "SK",
    styleCode: "RB",
    fontStyle: "Block",
    primaryColor: "#FF0000",
    secondaryColor: "#0000FF",
    styleTag: "Sketch",
    notes: "Artistic/alternate",
    imagePath: "/lovable-uploads/cs-sk-rb.png"
  },
  {
    fileName: "CS_SK_RS.png",
    group: "SK",
    styleCode: "RS",
    fontStyle: "Script",
    primaryColor: "#FF0000",
    secondaryColor: "#C0C0C0",
    styleTag: "Sketch",
    notes: "Artistic/alternate",
    imagePath: "/lovable-uploads/cs-sk-rs.png"
  }
];

// Utility functions
export const getCRDEntryByFileName = (fileName: string): CRDEntry | undefined => {
  return CRD_DNA_ENTRIES.find(entry => entry.fileName === fileName);
};

export const getCRDEntriesByGroup = (group: CRDEntry['group']): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.group === group);
};

export const getCRDEntriesByTeam = (teamCode: string): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.teamCode === teamCode);
};

export const getCRDEntriesByStyle = (styleTag: string): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.styleTag === styleTag);
};

export const getMLBTeams = (): CRDEntry[] => {
  return getCRDEntriesByGroup('MLB');
};

export const getClassicDecades = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.decade);
};
