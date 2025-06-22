
import React from 'react';
import { CardshowBottomNav } from './CardshowBottomNav';

interface CardshowLayoutProps {
  children: React.ReactNode;
}

export const CardshowLayout: React.FC<CardshowLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <main className="pb-20">
        {children}
      </main>
      <CardshowBottomNav />
    </div>
  );
};
