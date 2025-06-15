
import React from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";

export const Navbar: React.FC = () => {
  return (
    <div className="bg-[#141416] w-full overflow-hidden">
      <div className="flex w-full items-center justify-between flex-wrap px-40 py-5 max-md:max-w-full max-md:px-5">
        <div className="self-stretch flex items-center gap-8 my-auto max-md:max-w-full">
          <LogoSelector />
          <NavLinks />
        </div>
        <NavActions />
      </div>
      <div className="bg-[#353945] flex min-h-px w-full" />
    </div>
  );
};
