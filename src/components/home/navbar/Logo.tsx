
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
        className="h-10 w-10 object-contain shrink-0"
        alt="CRD Logo"
      />
    </Link>
  );
};
