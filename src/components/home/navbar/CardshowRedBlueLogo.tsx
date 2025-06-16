
import React from "react";

export const CardshowRedBlueLogo = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 400 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Light gray header background */}
      <rect x="0" y="0" width="400" height="40" fill="#f8f9fa" />
      
      {/* Cardshow text with adjusted colors */}
      <text x="200" y="28" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#dc3545">CARD</text>
      <text x="200" y="28" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0d6efd" dx="60">SHOW</text>
      
      {/* Subtitle or accent elements */}
      <rect x="50" y="50" width="300" height="60" fill="#ffffff" stroke="#e9ecef" strokeWidth="2" rx="8" />
      <text x="200" y="85" textAnchor="middle" fontSize="16" fill="#6c757d">Trading Cards</text>
    </svg>
  );
};
