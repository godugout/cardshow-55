
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/03d7ff9d-b3c8-409a-97bc-138aac963994.png"
        className="h-16 w-16 object-contain shrink-0"
        alt="Green and Yellow CRD Logo"
      />
    </Link>
  );
};
