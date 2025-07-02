
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/8b862ea9-8c97-4583-b217-1760341dbc2c.png"
        className="h-16 w-16 object-contain shrink-0"
        alt="CRD Logo"
      />
    </Link>
  );
};
