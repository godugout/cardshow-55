import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Star, Download, Filter, Eye } from 'lucide-react';
import { useCRDFrame } from '@/hooks/useCRDFrame';
import { CRDFrameEngine } from './CRDFrameEngine';
import type { CRDFrame } from '@/types/crd-frame';
interface CRDFrameSelectorProps {
  selectedFrameId?: string;
  onFrameSelect: (frame: CRDFrame) => void;
  className?: string;
}
export const CRDFrameSelector: React.FC<CRDFrameSelectorProps> = ({
  selectedFrameId,
  onFrameSelect,
  className = ''
}) => {
  const {
    frames,
    loading
  } = useCRDFrame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(frames.map(f => f.category).filter(Boolean))];
    return cats;
  }, [frames]);

  // Filter frames
  const filteredFrames = useMemo(() => {
    return frames.filter(frame => {
      const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) || (frame.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [frames, searchQuery, selectedCategory]);
  if (loading) {
    return <div className={`space-y-6 ${className}`}>
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-crd-mediumGray/20 rounded w-32 animate-pulse" />
          <div className="h-10 bg-crd-mediumGray/20 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-20 bg-crd-mediumGray/20 rounded animate-pulse" />)}
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-2">
              <div className="aspect-[2/3] bg-crd-mediumGray/20 rounded-lg animate-pulse mb-2" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-8 bg-crd-mediumGray/20 rounded animate-pulse" />
                    <div className="h-3 w-6 bg-crd-mediumGray/20 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-crd-mediumGray/20 rounded w-16 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>;
   }
  return <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          
          <p className="text-sm text-crd-lightGray">Choose from {frames.length} professional frame templates</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-crd-lightGray" />
          <Input placeholder="Search frames..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white placeholder:text-crd-lightGray focus:border-crd-blue" />
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedCategory(category)} 
              className={`capitalize ${
                selectedCategory === category 
                  ? 'bg-crd-blue hover:bg-crd-blue/80 text-white border-crd-blue' 
                  : 'bg-transparent border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-crd-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Frames Grid - Mobile-first 2-column sidebar layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {filteredFrames.map(frame => {
          // Get appropriate frame preview image based on category
          const getFramePreviewImage = (category: string, frameName: string) => {
            const baseUrl = 'https://images.unsplash.com';
            switch (category?.toLowerCase()) {
              case 'sports':
                if (frameName.toLowerCase().includes('baseball')) {
                  return `${baseUrl}/photo-1566577739112-5180d4bf9390?w=400&h=600&fit=crop&crop=center`; // Baseball stadium
                }
                if (frameName.toLowerCase().includes('soccer')) {
                  return `${baseUrl}/photo-1431324155629-1a6deb1dec8d?w=400&h=600&fit=crop&crop=center`; // Soccer action
                }
                return `${baseUrl}/photo-1461896836934-ffe607ba8211?w=400&h=600&fit=crop&crop=center`; // Generic sports
              case 'vintage':
                return `${baseUrl}/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center`; // Vintage aesthetic
              case 'modern':
                return `${baseUrl}/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop&crop=center`; // Modern minimal
              case 'fantasy':
                return `${baseUrl}/photo-1518709268805-4e9042af2ac5?w=400&h=600&fit=crop&crop=center`; // Fantasy/mystical
              default:
                return `${baseUrl}/photo-1541339907198-e08756dedf3f?w=400&h=600&fit=crop&crop=center`; // Abstract geometric
            }
          };

          const previewImage = getFramePreviewImage(frame.category || '', frame.name);

          return (
            <div 
              key={frame.id} 
              className={`bg-crd-darker border rounded-lg p-2 cursor-pointer transition-all duration-200 hover:border-crd-blue/50 hover:bg-crd-darker/80 relative ${
                selectedFrameId === frame.id ? 'border-crd-blue bg-crd-blue/10' : 'border-crd-mediumGray/20'
              }`} 
              onClick={() => onFrameSelect(frame)}
            >
              {/* Preview Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-1.5 right-1.5 z-10 h-7 w-7 p-0 bg-black/80 border-crd-mediumGray/30 hover:bg-black/60" 
                    onClick={e => e.stopPropagation()}
                  >
                    <Eye className="h-3 w-3 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-crd-darker border-crd-mediumGray/30">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-crd-white">{frame.name}</h4>
                    <div className="flex justify-center">
                      <CRDFrameEngine 
                        frame={frame} 
                        content={{}} 
                        selectedVisualStyle="classic_matte" 
                        onContentChange={() => {}} 
                        onCropComplete={() => {}} 
                        className="max-w-[200px]" 
                      />
                    </div>
                    <p className="text-sm text-crd-lightGray">{frame.description || 'Professional frame template'}</p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Frame Thumbnail with Real Preview */}
              <div className="aspect-[2/3] bg-crd-darkest rounded-lg overflow-hidden mb-2 relative">
                <img 
                  src={previewImage}
                  alt={`${frame.name} preview`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Subtle overlay to show it's a frame preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs text-white font-medium truncate">{frame.name}</div>
                  <div className="text-xs text-white/70 capitalize">{frame.category}</div>
                </div>
              </div>

              {/* Compact Frame Info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-crd-lightBlue text-crd-lightBlue" />
                      <span className="text-xs text-crd-lightGray">{frame.rating_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-crd-lightGray" />
                      <span className="text-xs text-crd-lightGray">{frame.download_count > 999 ? `${(frame.download_count/1000).toFixed(1)}k` : frame.download_count}</span>
                    </div>
                  </div>
                  
                  {/* Premium Badge */}
                  {frame.price_cents > 0 && (
                    <Badge className="bg-crd-lightBlue/20 text-crd-lightBlue border-crd-lightBlue/30 text-xs px-1.5 py-0">
                      Pro
                    </Badge>
                  )}
                </div>

                {/* Tags - Show only one tag for space */}
                {frame.tags && frame.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs py-0 px-1.5 bg-crd-mediumGray/20 text-crd-lightGray border-none"
                    >
                      {frame.tags[0]}
                    </Badge>
                    {frame.tags.length > 1 && (
                      <span className="text-xs text-crd-mediumGray">+{frame.tags.length - 1}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFrames.length === 0 && !loading && <div className="text-center py-8">
          <Filter className="h-12 w-12 mx-auto mb-3 text-crd-mediumGray" />
          <h4 className="text-crd-white font-medium mb-2">No frames found</h4>
          <p className="text-crd-lightGray text-sm">Try adjusting your search or category filters</p>
        </div>}
    </div>;
};