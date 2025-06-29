
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks: React.FC = () => {
  const location = useLocation();
  
  const getLinkClassName = (path: string) => {
    const isActive = location.pathname === path;
    return `text-white hover:text-crd-green transition-colors duration-200 font-medium ${
      isActive ? 'text-crd-green' : ''
    }`;
  };

  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link
        to="/create"
        className={getLinkClassName('/create')}
      >
        Create
      </Link>
      <Link
        to="/crdmkr"
        className={getLinkClassName('/crdmkr')}
      >
        CRDMKR
      </Link>
      <Link
        to="/cards"
        className={getLinkClassName('/cards')}
      >
        Cards
      </Link>
      <Link
        to="/gallery"
        className={getLinkClassName('/gallery')}
      >
        Gallery
      </Link>
      <Link
        to="/studio"
        className={getLinkClassName('/studio')}
      >
        Studio
      </Link>
    </div>
  );
};
