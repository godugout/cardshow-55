import React, { useState, useMemo } from 'react';
import { Search, Filter, Palette, Code2, Tag, Star, Eye, Download, Upload } from 'lucide-react';
import { CRDCard, CRDButton, CRDBadge } from '@/components/ui/design-system';
import { cn } from '@/lib/utils';

// DNA Metadata Interface
interface DNAMetadata {
  fileName: string;
  group: string;
  teamCode: string;
  teamName: string;
  mascot?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  fontStyle: 'Script' | 'Block';
  styleCode: string;
  era?: string;
  notes?: string;
  imageUrl: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

// Sample DNA data - this would come from your CSV/uploaded files
const sampleDNAData: DNAMetadata[] = [
  {
    fileName: "CS_MLB_LAD_BS.png",
    group: "MLB",
    teamCode: "LAD",
    teamName: "Los Angeles Dodgers",
    mascot: "None",
    primaryColor: "#005A9C",
    secondaryColor: "#FFFFFF",
    tertiaryColor: "#EF3E42",
    fontStyle: "Block",
    styleCode: "BS",
    era: "Modern",
    notes: "Classic Dodger blue with red accent",
    imageUrl: "/placeholder-logos/dodgers-logo.png",
    rarity: "Common"
  },
  {
    fileName: "CS_MLB_BOS_RS.png",
    group: "MLB",
    teamCode: "BOS",
    teamName: "Boston Red Sox",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    fontStyle: "Script",
    styleCode: "RS",
    era: "Classic",
    notes: "Traditional Red Sox script style",
    imageUrl: "/placeholder-logos/redsox-logo.png",
    rarity: "Uncommon"
  },
  {
    fileName: "CS_NBA_LAL_PGS.png",
    group: "NBA",
    teamCode: "LAL",
    teamName: "Los Angeles Lakers",
    primaryColor: "#552583",
    secondaryColor: "#FDB927",
    fontStyle: "Script",
    styleCode: "PGS",
    era: "Showtime",
    notes: "Purple and gold script variant",
    imageUrl: "/placeholder-logos/lakers-logo.png",
    rarity: "Rare"
  },
  {
    fileName: "CS_UNI_UCLA_BBS.png",
    group: "UNI",
    teamCode: "UCLA",
    teamName: "UCLA Bruins",
    primaryColor: "#2774AE",
    secondaryColor: "#FFD100",
    fontStyle: "Script",
    styleCode: "BBS",
    era: "University",
    notes: "UCLA blue and gold university style",
    imageUrl: "/placeholder-logos/ucla-logo.png",
    rarity: "Epic"
  }
];

// Filename parser
const parseDNAFilename = (filename: string) => {
  const [, group, team, stylecode] = filename.replace(".png", "").split("_");
  const font = stylecode?.endsWith("S") ? "Script" : "Block";
  const colorCode = stylecode?.slice(0, -1) || "";
  return { group, team, stylecode, font, colorCode };
};

// Group definitions
const groupDefinitions = {
  MLB: { name: "Major League Baseball", icon: "⚾", color: "#005A9C" },
  NBA: { name: "National Basketball Association", icon: "🏀", color: "#C8102E" },
  NHL: { name: "National Hockey League", icon: "🏒", color: "#000000" },
  NFL: { name: "National Football League", icon: "🏈", color: "#013369" },
  UNI: { name: "University & College", icon: "🎓", color: "#8B4513" },
  SK: { name: "Sketch Style", icon: "✏️", color: "#6B7280" },
  CL: { name: "Classic Era", icon: "📸", color: "#92400E" },
  ORIG: { name: "Original Design", icon: "💎", color: "#7C3AED" },
  "3D": { name: "3D Style", icon: "🔮", color: "#EC4899" },
  GRADIENT: { name: "Gradient Style", icon: "🌈", color: "#10B981" }
};

export const CRDDNASystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDNA, setSelectedDNA] = useState<DNAMetadata | null>(null);

  // Filter and search logic
  const filteredDNAData = useMemo(() => {
    return sampleDNAData.filter(dna => {
      const matchesSearch = dna.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dna.teamCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dna.group.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'All' || dna.group === selectedGroup;
      const matchesRarity = selectedRarity === 'All' || dna.rarity === selectedRarity;
      
      return matchesSearch && matchesGroup && matchesRarity;
    });
  }, [searchTerm, selectedGroup, selectedRarity]);

  // Get unique groups and rarities for filters
  const availableGroups = ['All', ...Array.from(new Set(sampleDNAData.map(dna => dna.group)))];
  const availableRarities = ['All', ...Array.from(new Set(sampleDNAData.map(dna => dna.rarity).filter(Boolean)))];

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-crd-blue/10 to-crd-purple/10 px-4 py-2 rounded-full border border-crd-blue/20">
            <Code2 size={16} className="text-crd-blue" />
            <span className="text-sm font-semibold text-crd-blue uppercase tracking-wide">CRD:DNA System</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-crd-white via-crd-blue to-crd-purple bg-clip-text text-transparent">
            Cardshow Brand DNA Manager
          </h1>
          
          <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
            Organize, analyze, and apply team-based visual identities using the CRD:DNA system. 
            Each logo contains genetic information for building consistent brand experiences.
          </p>
        </div>

        {/* Controls */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray" size={16} />
            <input
              type="text"
              placeholder="Search teams, codes, leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white placeholder-crd-lightGray focus:border-crd-blue focus:outline-none"
            />
          </div>

          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-3 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white focus:border-crd-blue focus:outline-none"
          >
            {availableGroups.map(group => (
              <option key={group} value={group}>
                {group === 'All' ? 'All Leagues' : `${group} - ${groupDefinitions[group as keyof typeof groupDefinitions]?.name || group}`}
              </option>
            ))}
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-4 py-3 bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg text-crd-white focus:border-crd-blue focus:outline-none"
          >
            {availableRarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {rarity === 'All' ? 'All Rarities' : rarity}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex space-x-2">
            <CRDButton
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="flex-1"
            >
              Grid View
            </CRDButton>
            <CRDButton
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
              className="flex-1"
            >
              List View
            </CRDButton>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-blue">{filteredDNAData.length}</div>
            <div className="text-sm text-crd-lightGray">DNA Entries</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-green">{new Set(filteredDNAData.map(d => d.group)).size}</div>
            <div className="text-sm text-crd-lightGray">Leagues</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-orange">{new Set(filteredDNAData.map(d => d.teamCode)).size}</div>
            <div className="text-sm text-crd-lightGray">Teams</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-purple">{new Set(filteredDNAData.map(d => d.styleCode)).size}</div>
            <div className="text-sm text-crd-lightGray">Style Codes</div>
          </CRDCard>
        </div>

        {/* DNA Grid/List */}
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
        )}>
          {filteredDNAData.map((dna, index) => (
            <CRDCard 
              key={`${dna.fileName}-${index}`}
              className={cn(
                "group hover:shadow-lg hover:shadow-crd-blue/10 transition-all duration-300 cursor-pointer",
                viewMode === 'grid' ? "p-6" : "p-4 flex items-center space-x-4"
              )}
              onClick={() => setSelectedDNA(dna)}
            >
              {viewMode === 'grid' ? (
                <div className="space-y-4 text-center">
                  {/* Logo Placeholder */}
                  <div className="h-24 w-24 mx-auto bg-gradient-to-br from-crd-darkGray/50 to-crd-mediumGray/30 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{groupDefinitions[dna.group as keyof typeof groupDefinitions]?.icon || '🏆'}</span>
                  </div>
                  
                  {/* Team Info */}
                  <div>
                    <h3 className="font-bold text-crd-white group-hover:text-crd-blue transition-colors">
                      {dna.teamName}
                    </h3>
                    <p className="text-sm text-crd-lightGray">{dna.teamCode} • {dna.group}</p>
                  </div>
                  
                  {/* Style Code & Rarity */}
                  <div className="flex justify-center space-x-2">
                    <CRDBadge variant="outline" className="text-xs">
                      {dna.styleCode}
                    </CRDBadge>
                    <CRDBadge variant="secondary" className={cn("text-xs", getRarityColor(dna.rarity))}>
                      {dna.rarity}
                    </CRDBadge>
                  </div>
                  
                  {/* Color Swatches */}
                  <div className="flex justify-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-crd-mediumGray/50" 
                      style={{ backgroundColor: dna.primaryColor }}
                      title={`Primary: ${dna.primaryColor}`}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-crd-mediumGray/50" 
                      style={{ backgroundColor: dna.secondaryColor }}
                      title={`Secondary: ${dna.secondaryColor}`}
                    />
                    {dna.tertiaryColor && (
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-crd-mediumGray/50" 
                        style={{ backgroundColor: dna.tertiaryColor }}
                        title={`Tertiary: ${dna.tertiaryColor}`}
                      />
                    )}
                  </div>
                  
                  {/* Font Style */}
                  <div className="text-xs text-crd-blue font-medium">
                    {dna.fontStyle} Style
                  </div>
                </div>
              ) : (
                <>
                  {/* List View Layout */}
                  <div className="w-16 h-16 bg-gradient-to-br from-crd-darkGray/50 to-crd-mediumGray/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{groupDefinitions[dna.group as keyof typeof groupDefinitions]?.icon || '🏆'}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-crd-white truncate">{dna.teamName}</h3>
                      <CRDBadge variant="outline" className="text-xs flex-shrink-0">
                        {dna.styleCode}
                      </CRDBadge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-crd-lightGray">
                      <span>{dna.teamCode}</span>
                      <span>•</span>
                      <span>{dna.group}</span>
                      <span>•</span>
                      <span>{dna.fontStyle}</span>
                      <span>•</span>
                      <span className={getRarityColor(dna.rarity)}>{dna.rarity}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 flex-shrink-0">
                    <div 
                      className="w-4 h-4 rounded border border-crd-mediumGray/50" 
                      style={{ backgroundColor: dna.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded border border-crd-mediumGray/50" 
                      style={{ backgroundColor: dna.secondaryColor }}
                    />
                    {dna.tertiaryColor && (
                      <div 
                        className="w-4 h-4 rounded border border-crd-mediumGray/50" 
                        style={{ backgroundColor: dna.tertiaryColor }}
                      />
                    )}
                  </div>
                </>
              )}
            </CRDCard>
          ))}
        </div>

        {/* Upload Section */}
        <CRDCard className="p-8 text-center border-2 border-dashed border-crd-mediumGray/50">
          <Upload className="mx-auto mb-4 text-crd-blue" size={48} />
          <h3 className="text-xl font-semibold text-crd-white mb-2">Upload New DNA Entries</h3>
          <p className="text-crd-lightGray mb-4">
            Drop logo files following the CS_[GROUP]_[TEAM]_[STYLE].png naming convention
          </p>
          <CRDButton variant="primary">
            <Upload size={16} className="mr-2" />
            Upload Logos
          </CRDButton>
        </CRDCard>

        {/* DNA Detail Modal (when selectedDNA is set) */}
        {selectedDNA && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <CRDCard className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-crd-white">{selectedDNA.teamName}</h2>
                  <button 
                    onClick={() => setSelectedDNA(null)}
                    className="text-crd-lightGray hover:text-crd-white"
                  >
                    ✕
                  </button>
                </div>
                
                {/* DNA Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">File Name</label>
                      <p className="text-crd-white font-mono text-sm bg-crd-darkGray p-2 rounded mt-1">
                        {selectedDNA.fileName}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">League/Group</label>
                      <p className="text-crd-white mt-1">
                        {selectedDNA.group} - {groupDefinitions[selectedDNA.group as keyof typeof groupDefinitions]?.name}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Team Code</label>
                      <p className="text-crd-white mt-1">{selectedDNA.teamCode}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Style Code</label>
                      <p className="text-crd-white mt-1">{selectedDNA.styleCode} ({selectedDNA.fontStyle})</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Color Palette</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded border-2 border-crd-mediumGray/50" 
                            style={{ backgroundColor: selectedDNA.primaryColor }}
                          />
                          <span className="text-crd-white font-mono text-sm">{selectedDNA.primaryColor}</span>
                          <span className="text-crd-lightGray text-xs">Primary</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded border-2 border-crd-mediumGray/50" 
                            style={{ backgroundColor: selectedDNA.secondaryColor }}
                          />
                          <span className="text-crd-white font-mono text-sm">{selectedDNA.secondaryColor}</span>
                          <span className="text-crd-lightGray text-xs">Secondary</span>
                        </div>
                        {selectedDNA.tertiaryColor && (
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded border-2 border-crd-mediumGray/50" 
                              style={{ backgroundColor: selectedDNA.tertiaryColor }}
                            />
                            <span className="text-crd-white font-mono text-sm">{selectedDNA.tertiaryColor}</span>
                            <span className="text-crd-lightGray text-xs">Tertiary</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedDNA.era && (
                      <div>
                        <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Era/Style</label>
                        <p className="text-crd-white mt-1">{selectedDNA.era}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Rarity</label>
                      <p className={cn("mt-1 font-semibold", getRarityColor(selectedDNA.rarity))}>
                        {selectedDNA.rarity}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedDNA.notes && (
                  <div>
                    <label className="text-sm font-semibold text-crd-blue uppercase tracking-wide">Notes</label>
                    <p className="text-crd-lightGray mt-1">{selectedDNA.notes}</p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-crd-mediumGray/30">
                  <CRDButton variant="primary" className="flex-1">
                    <Palette size={16} className="mr-2" />
                    Apply to CRD
                  </CRDButton>
                  <CRDButton variant="outline">
                    <Download size={16} className="mr-2" />
                    Export DNA
                  </CRDButton>
                </div>
              </div>
            </CRDCard>
          </div>
        )}
      </div>
    </div>
  );
};