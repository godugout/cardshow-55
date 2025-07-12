import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { label: 'HOME', href: '/', active: true },
  { label: 'EXPLORE', href: '/explore' },
  { label: 'CREATE', href: '/create' },
  { label: 'MARKETPLACE', href: '/marketplace' },
  { label: 'COLLECTIONS', href: '/collections' },
];

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  return (
    <nav className={cn("hidden md:flex items-center gap-8", className)}>
      {navigationItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={cn(
            "text-sm font-semibold uppercase tracking-normal px-4 py-2 transition-colors duration-200",
            item.active 
              ? "text-crd-orange" 
              : "text-zinc-400 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};