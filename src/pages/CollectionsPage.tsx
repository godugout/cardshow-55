
import React from 'react';
import { CollectionCard } from '@/components/collections/CollectionCard';

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CollectionCard />
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
