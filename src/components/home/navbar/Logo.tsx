
import React from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="self-stretch flex items-center my-auto">
      <img
        src="/lovable-uploads/818118d9-c823-4f86-b240-854bb79af713.png"
        className="h-16 w-16 object-contain shrink-0"
        alt="CRD Logo"
      />
    </Link>
  );
};
