
import React from 'react';
import { SmartCardGrid } from '@/components/catalog/SmartCardGrid';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Gallery</h1>
        <SmartCardGrid />
      </div>
    </div>
  );
};

export default GalleryPage;
