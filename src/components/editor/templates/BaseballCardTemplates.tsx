
import React from 'react';
import type { DesignTemplate } from '@/types/card';

// SVG Baseball Card Template Components
export const ClassicBaseballTemplate = ({ 
  imageUrl, 
  playerName = "PLAYER NAME", 
  teamName = "TEAM", 
  position = "POS",
  colors = { primary: '#1f2937', secondary: '#3b82f6', accent: '#ef4444' }
}: {
  imageUrl?: string;
  playerName?: string;
  teamName?: string;
  position?: string;
  colors?: { primary: string; secondary: string; accent: string };
}) => (
  <svg viewBox="0 0 250 350" className="w-full h-full">
    {/* Card Background */}
    <rect width="250" height="350" fill="white" stroke={colors.primary} strokeWidth="2" rx="8"/>
    
    {/* Header Banner */}
    <rect width="250" height="40" fill={colors.secondary} />
    <text x="125" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
      {teamName.toUpperCase()}
    </text>
    
    {/* Photo Area */}
    <rect x="15" y="50" width="220" height="180" fill="#f3f4f6" stroke={colors.primary} strokeWidth="1" rx="4"/>
    {imageUrl && (
      <image 
        x="15" 
        y="50" 
        width="220" 
        height="180" 
        href={imageUrl} 
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#photoClip)"
      />
    )}
    <defs>
      <clipPath id="photoClip">
        <rect x="15" y="50" width="220" height="180" rx="4"/>
      </clipPath>
    </defs>
    
    {/* Player Name Banner */}
    <rect x="15" y="240" width="220" height="35" fill={colors.accent} rx="4"/>
    <text x="125" y="262" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
      {playerName.toUpperCase()}
    </text>
    
    {/* Position Badge */}
    <circle cx="40" cy="295" r="15" fill={colors.secondary}/>
    <text x="40" y="300" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
      {position}
    </text>
    
    {/* Stats Area */}
    <rect x="15" y="285" width="220" height="50" fill="none" stroke={colors.primary} strokeWidth="1" rx="4"/>
    <text x="125" y="305" textAnchor="middle" fill={colors.primary} fontSize="10">
      STATS
    </text>
  </svg>
);

export const ModernBaseballTemplate = ({ 
  imageUrl, 
  playerName = "PLAYER NAME", 
  teamName = "TEAM",
  colors = { primary: '#0f172a', secondary: '#06b6d4', accent: '#f59e0b' }
}: {
  imageUrl?: string;
  playerName?: string;
  teamName?: string;
  colors?: { primary: string; secondary: string; accent: string };
}) => (
  <svg viewBox="0 0 250 350" className="w-full h-full">
    {/* Card Background */}
    <rect width="250" height="350" fill="white" rx="12"/>
    
    {/* Geometric Header */}
    <polygon points="0,0 250,0 250,50 200,60 0,50" fill={colors.secondary}/>
    <text x="20" y="30" fill="white" fontSize="12" fontWeight="bold">
      {teamName.toUpperCase()}
    </text>
    
    {/* Photo Area with Angular Cut */}
    <polygon points="20,70 230,70 240,240 10,240" fill="#f3f4f6" stroke={colors.primary} strokeWidth="1"/>
    {imageUrl && (
      <image 
        x="10" 
        y="70" 
        width="230" 
        height="170" 
        href={imageUrl} 
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#modernPhotoClip)"
      />
    )}
    <defs>
      <clipPath id="modernPhotoClip">
        <polygon points="20,70 230,70 240,240 10,240"/>
      </clipPath>
    </defs>
    
    {/* Name Section */}
    <rect x="10" y="260" width="230" height="40" fill={colors.accent} transform="skewX(-5)" rx="4"/>
    <text x="125" y="285" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
      {playerName.toUpperCase()}
    </text>
    
    {/* Modern Stats Grid */}
    <rect x="20" y="310" width="60" height="25" fill={colors.primary} rx="2"/>
    <rect x="95" y="310" width="60" height="25" fill={colors.primary} rx="2"/>
    <rect x="170" y="310" width="60" height="25" fill={colors.primary} rx="2"/>
  </svg>
);

export const VintageBaseballTemplate = ({ 
  imageUrl, 
  playerName = "PLAYER NAME", 
  teamName = "TEAM",
  colors = { primary: '#7c2d12', secondary: '#dc2626', accent: '#fbbf24' }
}: {
  imageUrl?: string;
  playerName?: string;
  teamName?: string;
  colors?: { primary: string; secondary: string; accent: string };
}) => (
  <svg viewBox="0 0 250 350" className="w-full h-full">
    {/* Card Background */}
    <rect width="250" height="350" fill="#fef7ed" stroke={colors.primary} strokeWidth="3" rx="6"/>
    
    {/* Decorative Border */}
    <rect x="8" y="8" width="234" height="334" fill="none" stroke={colors.accent} strokeWidth="1" rx="4"/>
    <rect x="12" y="12" width="226" height="326" fill="none" stroke={colors.primary} strokeWidth="0.5" rx="2"/>
    
    {/* Vintage Header */}
    <ellipse cx="125" cy="35" rx="100" ry="20" fill={colors.secondary}/>
    <text x="125" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="serif">
      {teamName.toUpperCase()}
    </text>
    
    {/* Oval Photo Frame */}
    <ellipse cx="125" cy="155" rx="90" ry="75" fill="#f3f4f6" stroke={colors.primary} strokeWidth="2"/>
    {imageUrl && (
      <image 
        x="35" 
        y="80" 
        width="180" 
        height="150" 
        href={imageUrl} 
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#vintagePhotoClip)"
      />
    )}
    <defs>
      <clipPath id="vintagePhotoClip">
        <ellipse cx="125" cy="155" rx="88" ry="73"/>
      </clipPath>
    </defs>
    
    {/* Vintage Name Banner */}
    <rect x="25" y="250" width="200" height="30" fill={colors.accent} stroke={colors.primary} strokeWidth="1" rx="15"/>
    <text x="125" y="270" textAnchor="middle" fill={colors.primary} fontSize="16" fontWeight="bold" fontFamily="serif">
      {playerName.toUpperCase()}
    </text>
    
    {/* Decorative Elements */}
    <circle cx="50" cy="300" r="8" fill={colors.secondary}/>
    <circle cx="200" cy="300" r="8" fill={colors.secondary}/>
    <text x="125" y="320" textAnchor="middle" fill={colors.primary} fontSize="10" fontFamily="serif">
      VINTAGE COLLECTION
    </text>
  </svg>
);

// Template Definitions
export const BASEBALL_CARD_TEMPLATES: DesignTemplate[] = [
  {
    id: 'classic-baseball',
    name: 'Classic Baseball',
    category: 'Baseball',
    description: 'Traditional baseball card with clean layout and team colors',
    template_data: {
      type: 'svg',
      component: 'ClassicBaseballTemplate',
      photoRegion: { x: 15, y: 50, width: 220, height: 180 },
      textRegions: {
        playerName: { x: 125, y: 262, maxLength: 20 },
        teamName: { x: 125, y: 25, maxLength: 15 },
        position: { x: 40, y: 300, maxLength: 3 }
      },
      colors: {
        primary: '#1f2937',
        secondary: '#3b82f6',
        accent: '#ef4444'
      },
      customizable: ['colors', 'playerName', 'teamName', 'position']
    },
    is_premium: false,
    usage_count: 0,
    tags: ['classic', 'traditional', 'baseball', 'team']
  },
  {
    id: 'modern-baseball',
    name: 'Modern Baseball',
    category: 'Baseball',
    description: 'Contemporary design with geometric elements and bold styling',
    template_data: {
      type: 'svg',
      component: 'ModernBaseballTemplate',
      photoRegion: { x: 10, y: 70, width: 230, height: 170 },
      textRegions: {
        playerName: { x: 125, y: 285, maxLength: 18 },
        teamName: { x: 20, y: 30, maxLength: 15 }
      },
      colors: {
        primary: '#0f172a',
        secondary: '#06b6d4',
        accent: '#f59e0b'
      },
      customizable: ['colors', 'playerName', 'teamName']
    },
    is_premium: false,
    usage_count: 0,
    tags: ['modern', 'geometric', 'baseball', 'contemporary']
  },
  {
    id: 'vintage-baseball',
    name: 'Vintage Baseball',
    category: 'Baseball',
    description: 'Retro styling with decorative borders and classic typography',
    template_data: {
      type: 'svg',
      component: 'VintageBaseballTemplate',
      photoRegion: { x: 35, y: 80, width: 180, height: 150, shape: 'ellipse' },
      textRegions: {
        playerName: { x: 125, y: 270, maxLength: 16 },
        teamName: { x: 125, y: 40, maxLength: 12 }
      },
      colors: {
        primary: '#7c2d12',
        secondary: '#dc2626',
        accent: '#fbbf24'
      },
      customizable: ['colors', 'playerName', 'teamName']
    },
    is_premium: true,
    usage_count: 0,
    tags: ['vintage', 'retro', 'baseball', 'classic', 'decorative']
  }
];
