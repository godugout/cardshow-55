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
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="aspect-[3/4] bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-1" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredFrames.map(frame => (
          <Card
            key={frame.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedFrameId === frame.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onFrameSelect(frame)}
          >
            <CardContent className="p-3">
              {/* Frame Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-crd-surface to-crd-darker rounded mb-2 relative overflow-hidden">
                {frame.preview_image_url ? (
                  <img
                    src={frame.preview_image_url}
                    alt={frame.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-xs opacity-60">Preview</div>
                      <div className="text-xs font-medium">{frame.name}</div>
                    </div>
                  </div>
                )}
                
                {/* Premium Badge */}
                {frame.price_cents > 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Frame Info */}
              <div className="space-y-1">
                <h4 className="font-medium text-sm truncate">{frame.name}</h4>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{frame.rating_average.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{frame.download_count}</span>
                  </div>
                </div>

                {frame.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {frame.description}
                  </p>
                )}

                {/* Tags */}
                {frame.tags && frame.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {frame.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs py-0 px-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFrames.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No frames found matching your search.</p>
        </div>
      )}
    </div>
  );
};