
import React, { useState } from 'react';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

const MarketplacePage: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Marketplace</h1>
        <MarketplaceSearch 
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default MarketplacePage;
