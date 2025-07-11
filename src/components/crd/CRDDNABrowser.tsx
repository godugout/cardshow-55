import React, { useState, useMemo } from 'react';
import { CRD_DNA_ENTRIES, CRDEntry, RarityLevel } from '@/lib/cardshowDNA';
import { Search, Filter, Palette, Tag, Star, Zap, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CRDDNABrowserProps {
  onEntrySelect?: (entry: CRDEntry) => void;
}

export const CRDDNABrowser = ({ onEntrySelect }: CRDDNABrowserProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return CRD_DNA_ENTRIES.filter(entry => {
      const matchesSearch = 
        entry.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = selectedGroup === 'all' || entry.group === selectedGroup;
      const matchesStyle = selectedStyle === 'all' || entry.styleTag === selectedStyle;
      const matchesRarity = selectedRarity === 'all' || entry.rarity === selectedRarity;
      
      return matchesSearch && matchesGroup && matchesStyle && matchesRarity;
    });
  }, [searchTerm, selectedGroup, selectedStyle, selectedRarity]);

  const groups = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.group)))];
  const styles = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.styleTag).filter(Boolean)))];
  const rarities = ['all', ...Array.from(new Set(CRD_DNA_ENTRIES.map(e => e.rarity)))];

  const getStyleBadgeColor = (entry: CRDEntry) => {
    switch (entry.styleTag) {
      case 'Classic': return 'bg-amber-500/20 text-amber-700';
      case 'Vintage': return 'bg-orange-500/20 text-orange-700';
      case 'Sketch': return 'bg-purple-500/20 text-purple-700';
      case '3D': return 'bg-blue-500/20 text-blue-700';
      case 'Jersey': return 'bg-green-500/20 text-green-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRarityColor = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500/20 text-gray-700';
      case 'Uncommon': return 'bg-green-500/20 text-green-700';
      case 'Rare': return 'bg-blue-500/20 text-blue-700';
      case 'Epic': return 'bg-purple-500/20 text-purple-700';
      case 'Legendary': return 'bg-orange-500/20 text-orange-700';
      case 'Mythic': return 'bg-red-500/20 text-red-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRarityIcon = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'Common': return null;
      case 'Uncommon': return <Star className="h-3 w-3" />;
      case 'Rare': return <Star className="h-3 w-3" />;
      case 'Epic': return <Zap className="h-3 w-3" />;
      case 'Legendary': return <Trophy className="h-3 w-3" />;
      case 'Mythic': return <Trophy className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">CRD:DNA Browser</h1>
          <Badge variant="outline" className="text-xs">
            {filteredEntries.length} entries
          </Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, cities, or codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Group: {selectedGroup}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {groups.map(group => (
                  <DropdownMenuItem key={group} onClick={() => setSelectedGroup(group)}>
                    {group.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Tag className="h-4 w-4 mr-2" />
                  Style: {selectedStyle}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {styles.map(style => (
                  <DropdownMenuItem key={style} onClick={() => setSelectedStyle(style)}>
                    {style || 'Unknown'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Rarity: {selectedRarity}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {rarities.map(rarity => (
                  <DropdownMenuItem key={rarity} onClick={() => setSelectedRarity(rarity)}>
                    {rarity}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEntries.map((entry) => (
          <div
            key={entry.fileName}
            className="group relative bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onEntrySelect?.(entry)}
          >
            {/* Logo */}
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img 
                src={entry.imagePath}
                alt={entry.fileName}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<div class="text-muted-foreground text-sm">${entry.fileName}</div>`;
                }}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              {/* Team Info */}
              <div>
                <h3 className="font-semibold text-foreground">
                  {entry.teamName || entry.styleCode}
                </h3>
                {entry.teamCity && (
                  <p className="text-sm text-muted-foreground">{entry.teamCity}</p>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {entry.group}
                </Badge>
                <Badge className={`text-xs flex items-center gap-1 ${getRarityColor(entry.rarity)}`}>
                  {getRarityIcon(entry.rarity)}
                  {entry.rarity}
                </Badge>
                {entry.styleTag && (
                  <Badge className={`text-xs ${getStyleBadgeColor(entry)}`}>
                    {entry.styleTag}
                  </Badge>
                )}
                {entry.decade && (
                  <Badge className="text-xs bg-pink-500/20 text-pink-700">
                    {entry.decade}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {entry.fontStyle}
                </Badge>
              </div>
              
              {/* Gaming Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Power</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${entry.powerLevel}%` }}
                      />
                    </div>
                    <span className="font-mono text-foreground">{entry.powerLevel}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Supply</span>
                  <span className="font-mono text-foreground">
                    {entry.totalSupply ? `${entry.currentSupply}/${entry.totalSupply}` : entry.currentSupply}
                  </span>
                </div>
                
                <div className="flex gap-1 text-xs">
                  {entry.isBlendable && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                      Blendable
                    </Badge>
                  )}
                  {entry.isRemixable && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                      Remixable
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Colors */}
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: entry.primaryColor }}
                  title={`Primary: ${entry.primaryColor}`}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: entry.secondaryColor }}
                  title={`Secondary: ${entry.secondaryColor}`}
                />
                {entry.tertiaryColor && (
                  <div 
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: entry.tertiaryColor }}
                    title={`Tertiary: ${entry.tertiaryColor}`}
                  />
                )}
              </div>
              
              {/* Mascot */}
              {entry.mascot && (
                <p className="text-xs text-muted-foreground">🎭 {entry.mascot}</p>
              )}
              
              {/* Notes */}
              {entry.notes && (
                <p className="text-xs text-muted-foreground italic">{entry.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No entries found matching your criteria</p>
        </div>
      )}
    </div>
  );
};