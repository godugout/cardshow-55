
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/ffcc3926-a637-4938-a3d6-6b0b366e95d4.png"
        className="h-16 w-16 object-contain shrink-0"
        alt="Green and Yellow CRD Logo"
      />
    </Link>
  );
};
