import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Download, Filter } from 'lucide-react';
import { useCRDFrame } from '@/hooks/useCRDFrame';
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
  const { frames, loading } = useCRDFrame();
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
      const matchesSearch = frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (frame.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesCategory = selectedCategory === 'all' || frame.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [frames, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-crd-mediumGray/20 rounded w-32 animate-pulse" />
          <div className="h-10 bg-crd-mediumGray/20 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-crd-mediumGray/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-crd-mediumGray/20 rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-crd-mediumGray/20 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-crd-mediumGray/20 rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-crd-mediumGray/20 rounded w-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-crd-white mb-2">Select CRD Frame</h3>
          <p className="text-sm text-crd-lightGray">Choose from {frames.length} professional frame templates</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-crd-lightGray" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white placeholder:text-crd-lightGray focus:border-crd-blue"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
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

      {/* Frames Grid - Now with larger thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
        {filteredFrames.map(frame => (
          <div
            key={frame.id}
            className={`bg-crd-darker border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-crd-blue/50 hover:bg-crd-darker/80 ${
              selectedFrameId === frame.id 
                ? 'border-crd-blue bg-crd-blue/10' 
                : 'border-crd-mediumGray/20'
            }`}
            onClick={() => onFrameSelect(frame)}
          >
            {/* Large Frame Preview */}
            <div className="aspect-[5/7] bg-crd-mediumGray/20 rounded mb-3 flex items-center justify-center border border-crd-mediumGray/30 overflow-hidden">
              {frame.preview_image_url ? (
                <img
                  src={frame.preview_image_url}
                  alt={frame.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="text-lg text-crd-lightGray font-mono mb-2">FRAME</div>
                  <div className="text-sm text-crd-blue font-semibold">{frame.category?.toUpperCase()}</div>
                  <div className="text-xs text-crd-lightGray mt-2">
                    {frame.frame_config.dimensions.width} × {frame.frame_config.dimensions.height}px
                  </div>
                </div>
              )}
            </div>

            {/* Frame Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-crd-white text-sm truncate">{frame.name}</h4>
                  <p className="text-xs text-crd-lightGray capitalize">{frame.category}</p>
                </div>
                
                {/* Premium Badge */}
                {frame.price_cents > 0 && (
                  <Badge className="ml-2 bg-crd-lightBlue/20 text-crd-lightBlue border-crd-lightBlue/30 text-xs">
                    Pro
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-crd-lightGray">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-crd-lightBlue text-crd-lightBlue" />
                  <span>{frame.rating_average.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{frame.download_count.toLocaleString()}</span>
                </div>
              </div>

              {/* Tags */}
              {frame.tags && frame.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {frame.tags.slice(0, 2).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs py-0 px-1.5 bg-crd-mediumGray/20 text-crd-lightGray border-none"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFrames.length === 0 && !loading && (
        <div className="text-center py-8">
          <Filter className="h-12 w-12 mx-auto mb-3 text-crd-mediumGray" />
          <h4 className="text-crd-white font-medium mb-2">No frames found</h4>
          <p className="text-crd-lightGray text-sm">Try adjusting your search or category filters</p>
        </div>
      )}
    </div>
  );
};