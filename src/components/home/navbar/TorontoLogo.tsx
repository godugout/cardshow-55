
import React from "react";

export const TorontoLogo = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className={className}>
      <text x="10" y="35" fontSize="22" fontWeight="bold" fill="#2563eb">TORONTO</text>
      <text x="10" y="55" fontSize="16" fill="#2563eb">BLUE JAYS</text>
      <path d="M160 20 L180 35 L160 50 Z" fill="#2563eb"/>
    </svg>
  );
};
