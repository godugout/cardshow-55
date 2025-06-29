import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavLinks: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link
        to="/create"
        className="text-white hover:text-crd-green transition-colors duration-200 font-medium"
      >
        Create
      </Link>
      <Link
        to="/crdmkr"
        className="text-white hover:text-crd-green transition-colors duration-200 font-medium"
      >
        CRDMKR
      </Link>
      <Link
        to="/cards"
        className="text-white hover:text-crd-green transition-colors duration-200 font-medium"
      >
        Cards
      </Link>
      <Link
        to="/gallery"
        className="text-white hover:text-crd-green transition-colors duration-200 font-medium"
      >
        Gallery
      </Link>
      <Link
        to="/studio"
        className="text-white hover:text-crd-green transition-colors duration-200 font-medium"
      >
        Studio
      </Link>
    </div>
  );
};
