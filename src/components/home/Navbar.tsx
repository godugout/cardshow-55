
import React, { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";

const getNavbarColorClasses = (color: string) => {
  const colorMap = {
    orange: 'bg-gradient-to-r from-orange-500/5 to-orange-400/5 border-b-orange-500/10',
    red: 'bg-gradient-to-r from-red-500/5 to-red-400/5 border-b-red-500/10',
    green: 'bg-gradient-to-r from-green-500/5 to-green-400/5 border-b-green-500/10',
    yellow: 'bg-gradient-to-r from-yellow-500/5 to-yellow-400/5 border-b-yellow-500/10',
    blue: 'bg-gradient-to-r from-blue-500/5 to-blue-400/5 border-b-blue-500/10',
    gray: 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10',
    emerald: 'bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 border-b-emerald-500/10',
    purple: 'bg-gradient-to-r from-purple-500/5 to-purple-400/5 border-b-purple-500/10',
    slate: 'bg-gradient-to-r from-slate-500/5 to-slate-400/5 border-b-slate-500/10',
    amber: 'bg-gradient-to-r from-amber-500/5 to-amber-400/5 border-b-amber-500/10',
    cyan: 'bg-gradient-to-r from-cyan-500/5 to-cyan-400/5 border-b-cyan-500/10',
    indigo: 'bg-gradient-to-r from-indigo-500/5 to-indigo-400/5 border-b-indigo-500/10',
  };
  return colorMap[color] || 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10';
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
  const [selectedLogoColor, setSelectedLogoColor] = useState('orange');
  
  const navbarColorClasses = getNavbarColorClasses(selectedLogoColor);
  const dividerColorClasses = getDividerColorClasses(selectedLogoColor);

  return (
    <div className={`bg-[#141416] w-full overflow-hidden transition-all duration-500 ${navbarColorClasses}`}>
      <div className="flex w-full items-center justify-between flex-wrap px-6 py-5 max-md:max-w-full max-md:px-5">
        <div className="flex items-center gap-8 my-auto">
          <LogoSelector onColorChange={setSelectedLogoColor} />
          <NavLinks />
        </div>
        <NavActions />
      </div>
      <div className={`flex min-h-px w-full transition-all duration-500 ${dividerColorClasses}`} />
    </div>
  );
};
