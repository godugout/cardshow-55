// CRD:DNA System - Cardshow Brand & Logo Management
export type RarityLevel = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type UnlockMethod = 'starter' | 'achievement' | 'premium' | 'seasonal' | 'special' | 'legacy';

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
  
  // Computed properties for components
  id?: string;
  displayName?: string;
  style?: string;
  
  // Phase 1: Core Gaming Attributes
  rarity: RarityLevel;
  powerLevel: number; // 1-100
  unlockMethod: UnlockMethod;
  collectibility: number; // 1-100, affects trading value
  isBlendable: boolean;
  isRemixable: boolean;
  
  // Scarcity System
  totalSupply?: number; // null = unlimited
  currentSupply: number;
  dropRate: number; // 0-1 probability
  mintingRules?: {
    requiresAchievement?: string;
    seasonalOnly?: boolean;
    requiresPurchase?: boolean;
    packExclusive?: boolean;
  };
}

// Core CRD:DNA Database
export const CRD_DNA_ENTRIES: CRDEntry[] = [
  // MLB Teams
  {
    fileName: "CS_MLB_BAL_OBS.png",
    group: "MLB",
    teamCode: "BAL",
    teamName: "Orioles",
    id: "bal_obs",
    displayName: "Orioles Classic",
    style: "Classic",
    teamCity: "Baltimore",
    styleCode: "OBS",
    fontStyle: "Script",
    primaryColor: "#DF4601",
    secondaryColor: "#000000",
    tertiaryColor: "#FFFFFF",
    styleTag: "Standard",
    mascot: "The Oriole Bird",
    imagePath: "/lovable-uploads/cs-mlb-bal-obs.png",
    rarity: "Common",
    powerLevel: 65,
    unlockMethod: "starter",
    collectibility: 70,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1000,
    dropRate: 0.15
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
    imagePath: "/lovable-uploads/cs-mlb-cl-bos-rbb.png",
    rarity: "Rare",
    powerLevel: 85,
    unlockMethod: "achievement",
    collectibility: 90,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 5000,
    currentSupply: 3200,
    dropRate: 0.05,
    mintingRules: {
      requiresAchievement: "MLB Classic Collector"
    }
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
    imagePath: "/lovable-uploads/cs-mlb-cl-mil-byb.png",
    rarity: "Uncommon",
    powerLevel: 75,
    unlockMethod: "achievement",
    collectibility: 80,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 8000,
    currentSupply: 6500,
    dropRate: 0.08
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
    imagePath: "/lovable-uploads/cs-mlb-cl-oak-00s.png",
    rarity: "Epic",
    powerLevel: 90,
    unlockMethod: "seasonal",
    collectibility: 95,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 2000,
    currentSupply: 1200,
    dropRate: 0.02,
    mintingRules: {
      seasonalOnly: true,
      requiresAchievement: "00s Decade Master"
    }
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
    imagePath: "/lovable-uploads/cs-mlb-cl-sdp-70s.png",
    rarity: "Legendary",
    powerLevel: 95,
    unlockMethod: "special",
    collectibility: 98,
    isBlendable: false,
    isRemixable: true,
    totalSupply: 1000,
    currentSupply: 342,
    dropRate: 0.01,
    mintingRules: {
      seasonalOnly: true,
      requiresAchievement: "70s Vintage Collector",
      packExclusive: true
    }
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
    imagePath: "/lovable-uploads/cs-mlb-cl-sea-80s.png",
    rarity: "Epic",
    powerLevel: 88,
    unlockMethod: "achievement",
    collectibility: 92,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 3000,
    currentSupply: 2100,
    dropRate: 0.03,
    mintingRules: {
      requiresAchievement: "80s Era Champion"
    }
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
    imagePath: "/lovable-uploads/cs-mlb-cle-rbs.png",
    rarity: "Common",
    powerLevel: 68,
    unlockMethod: "starter",
    collectibility: 72,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1200,
    dropRate: 0.12
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
    imagePath: "/lovable-uploads/cs-mlb-lad-bs.png",
    rarity: "Rare",
    powerLevel: 82,
    unlockMethod: "premium",
    collectibility: 88,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 6000,
    currentSupply: 4200,
    dropRate: 0.06,
    mintingRules: {
      requiresPurchase: true
    }
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
    imagePath: "/lovable-uploads/cs-mlb-mia.png",
    rarity: "Uncommon",
    powerLevel: 70,
    unlockMethod: "achievement",
    collectibility: 75,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 800,
    dropRate: 0.09
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
    imagePath: "/lovable-uploads/cs-mlb-oak.png",
    rarity: "Common",
    powerLevel: 62,
    unlockMethod: "starter",
    collectibility: 68,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1500,
    dropRate: 0.14
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
    imagePath: "/lovable-uploads/cs-mlb-pit-bby.png",
    rarity: "Uncommon",
    powerLevel: 73,
    unlockMethod: "achievement",
    collectibility: 78,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 900,
    dropRate: 0.10
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
    imagePath: "/lovable-uploads/cs-3d-wgb.png",
    rarity: "Epic",
    powerLevel: 92,
    unlockMethod: "special",
    collectibility: 96,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 1500,
    currentSupply: 890,
    dropRate: 0.015,
    mintingRules: {
      requiresAchievement: "3D Master",
      packExclusive: true
    }
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
    imagePath: "/lovable-uploads/crd-gradient.png",
    rarity: "Mythic",
    powerLevel: 100,
    unlockMethod: "legacy",
    collectibility: 100,
    isBlendable: false,
    isRemixable: false,
    totalSupply: 100,
    currentSupply: 23,
    dropRate: 0.001,
    mintingRules: {
      requiresAchievement: "CRD Founder",
      seasonalOnly: false,
      requiresPurchase: true,
      packExclusive: true
    }
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
    imagePath: "/lovable-uploads/cs-uni-ybb.png",
    rarity: "Common",
    powerLevel: 55,
    unlockMethod: "starter",
    collectibility: 60,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 2000,
    dropRate: 0.20
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
    imagePath: "/lovable-uploads/cs-uni-wrb.png",
    rarity: "Uncommon",
    powerLevel: 58,
    unlockMethod: "starter",
    collectibility: 65,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 1800,
    dropRate: 0.18
  },
  {
    fileName: "CS_UNI_BB.png",
    group: "UNI",
    styleCode: "BB",
    fontStyle: "Block",
    primaryColor: "#0000FF",
    secondaryColor: "#000000",
    styleTag: "Jersey",
    imagePath: "/lovable-uploads/cs-uni-bb.png",
    rarity: "Common",
    powerLevel: 52,
    unlockMethod: "starter",
    collectibility: 58,
    isBlendable: true,
    isRemixable: true,
    currentSupply: 2200,
    dropRate: 0.22
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
    imagePath: "/lovable-uploads/cs-ncaa-big10.png",
    rarity: "Rare",
    powerLevel: 80,
    unlockMethod: "achievement",
    collectibility: 85,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 5000,
    currentSupply: 3800,
    dropRate: 0.07,
    mintingRules: {
      requiresAchievement: "NCAA Conference Champion"
    }
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
    imagePath: "/lovable-uploads/cs-old-rs.png",
    rarity: "Legendary",
    powerLevel: 94,
    unlockMethod: "legacy",
    collectibility: 97,
    isBlendable: false,
    isRemixable: true,
    totalSupply: 800,
    currentSupply: 456,
    dropRate: 0.005,
    mintingRules: {
      requiresAchievement: "Vintage Collector",
      seasonalOnly: true
    }
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
    imagePath: "/lovable-uploads/cs-orig-ws.png",
    rarity: "Epic",
    powerLevel: 89,
    unlockMethod: "special",
    collectibility: 93,
    isBlendable: true,
    isRemixable: false,
    totalSupply: 1200,
    currentSupply: 734,
    dropRate: 0.02,
    mintingRules: {
      requiresAchievement: "Original Teams Historian"
    }
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
    imagePath: "/lovable-uploads/cs-sk-rb.png",
    rarity: "Rare",
    powerLevel: 78,
    unlockMethod: "achievement",
    collectibility: 82,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 4000,
    currentSupply: 2890,
    dropRate: 0.06,
    mintingRules: {
      requiresAchievement: "Artist Apprentice"
    }
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
    imagePath: "/lovable-uploads/cs-sk-rs.png",
    rarity: "Rare",
    powerLevel: 76,
    unlockMethod: "achievement",
    collectibility: 80,
    isBlendable: true,
    isRemixable: true,
    totalSupply: 4500,
    currentSupply: 3200,
    dropRate: 0.055,
    mintingRules: {
      requiresAchievement: "Sketch Master"
    }
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

// Phase 1: Gaming Utility Functions
export const getCRDEntriesByRarity = (rarity: RarityLevel): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.rarity === rarity);
};

export const getCRDEntriesByUnlockMethod = (method: UnlockMethod): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.unlockMethod === method);
};

export const getBlendableEntries = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.isBlendable);
};

export const getRemixableEntries = (): CRDEntry[] => {
  return CRD_DNA_ENTRIES.filter(entry => entry.isRemixable);
};

export const getRarityDistribution = () => {
  const distribution: Record<RarityLevel, number> = {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    Mythic: 0
  };
  
  CRD_DNA_ENTRIES.forEach(entry => {
    distribution[entry.rarity]++;
  });
  
  return distribution;
};

// Advanced Gaming Analytics
export const getSupplyMetrics = () => {
  const totalSupply = CRD_DNA_ENTRIES.reduce((acc, entry) => acc + entry.currentSupply, 0);
  const limitedSupplyItems = CRD_DNA_ENTRIES.filter(entry => entry.totalSupply);
  const unlimitedSupplyItems = CRD_DNA_ENTRIES.filter(entry => !entry.totalSupply);
  
  return {
    totalSupply,
    limitedSupplyItems: limitedSupplyItems.length,
    unlimitedSupplyItems: unlimitedSupplyItems.length,
    averageDropRate: CRD_DNA_ENTRIES.reduce((acc, entry) => acc + entry.dropRate, 0) / CRD_DNA_ENTRIES.length
  };
};

export const getPowerLevelStats = () => {
  const powerLevels = CRD_DNA_ENTRIES.map(entry => entry.powerLevel);
  const minPower = Math.min(...powerLevels);
  const maxPower = Math.max(...powerLevels);
  const avgPower = powerLevels.reduce((a, b) => a + b, 0) / powerLevels.length;
  
  return { minPower, maxPower, avgPower: Math.round(avgPower) };
};

export const getUnlockMethodDistribution = () => {
  const distribution: Record<UnlockMethod, number> = {
    starter: 0,
    achievement: 0,
    premium: 0,
    seasonal: 0,
    special: 0,
    legacy: 0
  };
  
  CRD_DNA_ENTRIES.forEach(entry => {
    distribution[entry.unlockMethod]++;
  });
  
  return distribution;
};

// Gaming utility functions for card creation
export const getCardRarityFromDNA = (dnaSegments: CRDEntry[]): string => {
  const rarityWeights = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythic: 6 };
  const avgWeight = dnaSegments.reduce((sum, dna) => sum + rarityWeights[dna.rarity], 0) / dnaSegments.length;
  
  if (avgWeight >= 5.5) return 'Mythic';
  if (avgWeight >= 4.5) return 'Legendary';
  if (avgWeight >= 3.5) return 'Epic';
  if (avgWeight >= 2.5) return 'Rare';
  if (avgWeight >= 1.5) return 'Uncommon';
  return 'Common';
};

export const checkBlendCompatibility = (dna1: CRDEntry, dna2: CRDEntry): boolean => {
  if (!dna1.isBlendable || !dna2.isBlendable) return false;
  if (dna1.group === dna2.group) return true;
  return Math.random() > 0.3; // 70% compatibility for demo
};

export const generateBlendResult = (dnaSegments: CRDEntry[]) => {
  const primaryDNA = dnaSegments[0];
  const blendName = `${primaryDNA.group} Fusion`;
  const rarity = getCardRarityFromDNA(dnaSegments);
  return { name: blendName, rarity };
};

export const generateCardMetadata = (dnaSegments: CRDEntry[]) => {
  const totalPower = dnaSegments.reduce((sum, dna) => sum + dna.powerLevel, 0);
  const avgCollectibility = dnaSegments.reduce((sum, dna) => sum + dna.collectibility, 0) / dnaSegments.length;
  const rarity = getCardRarityFromDNA(dnaSegments);
  
  return {
    powerLevel: Math.floor(totalPower / dnaSegments.length),
    collectibility: Math.floor(avgCollectibility),
    rarity,
    appliedDNA: dnaSegments.map(dna => dna.fileName),
    blendable: dnaSegments.every(dna => dna.isBlendable),
    remixable: dnaSegments.every(dna => dna.isRemixable)
  };
};
