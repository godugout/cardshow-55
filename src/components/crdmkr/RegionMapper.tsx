
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { DetectedRegion } from '@/types/crdmkr';

interface RegionMapperProps {
  imageUrl: string;
  detectedRegions: DetectedRegion[];
  onRegionsUpdate: (regions: DetectedRegion[]) => void;
}

export const RegionMapper: React.FC<RegionMapperProps> = ({
  imageUrl,
  detectedRegions,
  onRegionsUpdate
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showRegions, setShowRegions] = useState(true);

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId);
  };

  const handleRegionTypeChange = (regionId: string, newType: DetectedRegion['type']) => {
    const updatedRegions = detectedRegions.map(region =>
      region.id === regionId ? { ...region, type: newType } : region
    );
    onRegionsUpdate(updatedRegions);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Image with Regions */}
      <div className="flex-1 relative">
        <div className="relative inline-block max-w-full">
          <img 
            src={imageUrl} 
            alt="Card analysis"
            className="w-full h-auto max-h-[500px] object-contain border border-crd-mediumGray/30 rounded-lg"
          />
          
          {showRegions && detectedRegions.map((region) => (
            <div
              key={region.id}
              className={`absolute border-2 cursor-pointer transition-all ${
                selectedRegion === region.id 
                  ? 'border-crd-green bg-crd-green/20' 
                  : 'border-blue-400 hover:border-blue-300'
              }`}
              style={{
                left: `${region.bounds.x}px`,
                top: `${region.bounds.y}px`,
                width: `${region.bounds.width}px`,
                height: `${region.bounds.height}px`,
              }}
              onClick={() => handleRegionClick(region.id)}
            >
              <div className="absolute -top-6 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {region.type} ({Math.round(region.confidence * 100)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-80 bg-crd-darker rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-crd-white">Detected Regions</h3>
          <CRDButton
            size="sm"
            variant="outline"
            onClick={() => setShowRegions(!showRegions)}
          >
            {showRegions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </CRDButton>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {detectedRegions.map((region) => (
            <div
              key={region.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedRegion === region.id 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
              }`}
              onClick={() => handleRegionClick(region.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-crd-white font-medium capitalize">{region.type}</span>
                <span className="text-crd-lightGray text-sm">
                  {Math.round(region.confidence * 100)}%
                </span>
              </div>
              
              <select
                value={region.type}
                onChange={(e) => handleRegionTypeChange(region.id, e.target.value as DetectedRegion['type'])}
                className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-2 py-1 text-sm text-crd-white"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="photo">Photo</option>
                <option value="text">Text</option>
                <option value="logo">Logo</option>
                <option value="border">Border</option>
                <option value="background">Background</option>
                <option value="decoration">Decoration</option>
              </select>
            </div>
          ))}
        </div>

        {detectedRegions.length === 0 && (
          <div className="text-center text-crd-lightGray py-8">
            No regions detected. Try running the analysis again.
          </div>
        )}
      </div>
    </div>
  );
};
