
import React from "react";

export const OaklandLogo = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className={className}>
      <circle cx="40" cy="40" r="30" fill="#16a34a" stroke="#15803d" strokeWidth="2"/>
      <text x="80" y="35" fontSize="20" fontWeight="bold" fill="#16a34a">OAKLAND</text>
      <text x="80" y="55" fontSize="14" fill="#16a34a">ATHLETICS</text>
    </svg>
  );
};
