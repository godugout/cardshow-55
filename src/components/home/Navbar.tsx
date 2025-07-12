
import React, { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";

const getNavbarColorClasses = (color: string) => {
  // Enhanced navbar styling - uses secondary color for background per new strategy
  return 'navbar-themed-bg border-b border-[hsl(var(--theme-navbar-border)/0.2)]';
};

const getDividerColorClasses = (color: string) => {
  const colorMap = {
    orange: 'bg-orange-500/15 border-t-orange-500/20',
    red: 'bg-red-500/15 border-t-red-500/20',
    green: 'bg-green-500/15 border-t-green-500/20',
    yellow: 'bg-yellow-500/15 border-t-yellow-500/20',
    blue: 'bg-blue-500/15 border-t-blue-500/20',
    gray: 'bg-gray-500/15 border-t-gray-500/20',
    emerald: 'bg-emerald-500/15 border-t-emerald-500/20',
    purple: 'bg-purple-500/15 border-t-purple-500/20',
    slate: 'bg-slate-500/15 border-t-slate-500/20',
    amber: 'bg-amber-500/15 border-t-amber-500/20',
    cyan: 'bg-cyan-500/15 border-t-cyan-500/20',
    indigo: 'bg-indigo-500/15 border-t-indigo-500/20',
  };
  return colorMap[color] || 'bg-gray-500/15 border-t-gray-500/20';
};

export const Navbar: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('sf-orange');

  return (
    <div className={`navbar-themed w-full overflow-hidden ${getNavbarColorClasses(currentTheme)}`}>
      <div className="flex w-full items-center justify-between flex-wrap px-6 py-5 max-md:max-w-full max-md:px-5">
        <div className="flex items-center gap-8 my-auto">
          <LogoSelector onThemeChange={setCurrentTheme} />
          <NavLinks />
        </div>
        <NavActions />
      </div>
      <div className="flex min-h-px w-full" style={{ background: `linear-gradient(90deg, hsl(var(--theme-accent) / 0.2), hsl(var(--theme-accent) / 0.1))` }} />
    </div>
  );
};
