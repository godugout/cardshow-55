
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
    <div className="bg-crd-darker border-b border-crd-mediumGray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-8">
            Discover <span className="text-crd-green">Cards & Collectibles</span>
          </h1>
          
          <div className="flex justify-between items-center">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <div className="flex justify-between items-center w-full">
                <TabsList className="bg-crd-darkest p-1 rounded-md">
                  <TabsTrigger 
                    value="cards" 
                    className={`px-4 py-2 ${activeTab === 'cards' ? 'bg-crd-green text-black' : 'text-crd-lightGray'}`}
                  >
                    Cards
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collections" 
                    className={`px-4 py-2 ${activeTab === 'collections' ? 'bg-crd-green text-black' : 'text-crd-lightGray'}`}
                  >
                    Collections
                  </TabsTrigger>
                  <TabsTrigger 
                    value="creators" 
                    className={`px-4 py-2 ${activeTab === 'creators' ? 'bg-crd-green text-black' : 'text-crd-lightGray'}`}
                  >
                    Creators
                  </TabsTrigger>
                </TabsList>
                
                <Button className="bg-crd-green text-black rounded-md flex items-center gap-2 hover:bg-crd-green/90">
                  <Filter size={16} />
                  Filter
                  <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
