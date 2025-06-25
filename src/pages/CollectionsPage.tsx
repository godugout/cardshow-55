
import React, { useState } from 'react';
import { CollectionCard } from '@/components/collections/CollectionCard';

const CollectionsPage: React.FC = () => {
  const [collections] = useState([
    {
      id: '1',
      title: 'My First Collection',
      description: 'A collection of my favorite cards',
      cardCount: 12,
      coverImageUrl: '/crd-logo-gradient.png',
      visibility: 'public' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleEdit = (collection: any) => {
    console.log('Edit collection:', collection.id);
  };

  const handleDelete = (collectionId: string) => {
    console.log('Delete collection:', collectionId);
  };

  const handleView = (collection: any) => {
    console.log('View collection:', collection.id);
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <CollectionCard 
              key={collection.id}
              collection={collection}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
