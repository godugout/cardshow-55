
import React from 'react';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';

const MarketplacePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Marketplace</h1>
        <MarketplaceSearch />
      </div>
    </div>
  );
};

export default MarketplacePage;
