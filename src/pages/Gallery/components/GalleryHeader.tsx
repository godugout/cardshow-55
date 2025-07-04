
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';

interface GalleryHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-themed-primary mb-8">
        Discover <span className="highlight-themed font-extrabold">Cards & Collectibles</span>
      </h1>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex justify-between items-center w-full">
            <div className="tabs-themed">
              <button 
                onClick={() => onTabChange('featured')}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === 'featured' ? 'tab-themed-active' : 'tab-themed-inactive'
                }`}
              >
                Featured
              </button>
              <button 
                onClick={() => onTabChange('trending')}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === 'trending' ? 'tab-themed-active' : 'tab-themed-inactive'
                }`}
              >
                Trending
              </button>
              <button 
                onClick={() => onTabChange('new')}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === 'new' ? 'tab-themed-active' : 'tab-themed-inactive'
                }`}
              >
                New
              </button>
            </div>
            
            <button className="btn-themed-primary flex items-center gap-2 px-6 py-3 rounded-md">
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
            </button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
