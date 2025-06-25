
import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-crd-darker border border-crd-mediumGray/20 rounded-lg p-4 animate-pulse">
    <div className="w-full aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded-lg mb-3"></div>
    <div className="h-4 bg-crd-mediumGray/20 rounded mb-2"></div>
    <div className="h-3 bg-crd-mediumGray/20 rounded w-3/4"></div>
  </div>
);

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const HeaderSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-crd-mediumGray/20 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-crd-mediumGray/20 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-crd-mediumGray/20 rounded w-1/2"></div>
  </div>
);

export const NavigationSkeleton: React.FC = () => (
  <div className="flex space-x-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-10 bg-crd-mediumGray/20 rounded w-20"></div>
    ))}
  </div>
);
