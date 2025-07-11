import React from 'react';
import { getCRDEntryByFileName, CRDEntry } from '@/lib/cardshowDNA';

interface CRDLogoProps {
  fileName: string;
  className?: string;
  fallbackText?: string;
}

export const CRDLogo: React.FC<CRDLogoProps> = ({ 
  fileName, 
  className = "", 
  fallbackText 
}) => {
  const entry = getCRDEntryByFileName(fileName);
  
  if (!entry) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded ${className}`}>
        <span className="text-muted-foreground text-sm">
          {fallbackText || fileName}
        </span>
      </div>
    );
  }

  return (
    <img
      src={entry.imagePath}
      alt={`${entry.teamName || entry.styleCode} logo - ${entry.styleTag || 'Standard'} style`}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.parentElement) {
          target.parentElement.innerHTML = `
            <div class="flex items-center justify-center bg-muted rounded text-muted-foreground text-sm ${className}">
              ${fallbackText || entry.fileName}
            </div>
          `;
        }
      }}
    />
  );
};

// Specific MLB logo components
export const MLBLogo = ({ teamCode, style, className }: { 
  teamCode: string; 
  style?: string; 
  className?: string; 
}) => {
  // Find matching entry by team code and style
  const fileName = style 
    ? `CS_MLB_${teamCode}_${style}.png`
    : `CS_MLB_${teamCode}.png`;
  
  return <CRDLogo fileName={fileName} className={className} />;
};

// Classic decade logos
export const ClassicMLBLogo = ({ teamCode, decade, className }: {
  teamCode: string;
  decade: '70s' | '80s' | '00s';
  className?: string;
}) => {
  const fileName = `CS_MLB_CL_${teamCode}_${decade}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Uniform style logos
export const UniformLogo = ({ styleCode, className }: {
  styleCode: string;
  className?: string;
}) => {
  const fileName = `CS_UNI_${styleCode}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Sketch style logos  
export const SketchLogo = ({ styleCode, className }: {
  styleCode: string;
  className?: string;
}) => {
  const fileName = `CS_SK_${styleCode}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Component to display CRD entry details
export const CRDEntryCard = ({ entry, className }: {
  entry: CRDEntry;
  className?: string;
}) => {
  return (
    <div className={`p-4 border border-border rounded-lg bg-card ${className}`}>
      <div className="flex items-center gap-4">
        <CRDLogo fileName={entry.fileName} className="w-16 h-16" />
        <div className="flex-1">
          <h3 className="font-semibold">
            {entry.teamName || entry.styleCode}
          </h3>
          {entry.teamCity && (
            <p className="text-sm text-muted-foreground">{entry.teamCity}</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {entry.group}
            </span>
            {entry.styleTag && (
              <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                {entry.styleTag}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};