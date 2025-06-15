
import React from "react";

export const WashingtonLogo = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className={className}>
      <text x="10" y="40" fontSize="24" fontWeight="bold" fill="#dc2626">WASHINGTON</text>
      <text x="10" y="65" fontSize="16" fill="#dc2626">NATIONALS</text>
    </svg>
  );
};
