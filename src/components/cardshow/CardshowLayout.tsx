
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CardshowBottomNav } from './CardshowBottomNav';

export const CardshowLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <main className="pb-20">
        <Outlet />
      </main>
      <CardshowBottomNav />
    </div>
  );
};
