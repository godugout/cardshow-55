
import React from "react";

export const PittsburghLogo = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className={className}>
      <text x="10" y="35" fontSize="22" fontWeight="bold" fill="#eab308">PITTSBURGH</text>
      <text x="10" y="55" fontSize="16" fill="#eab308">PIRATES</text>
      <rect x="10" y="60" width="150" height="3" fill="#eab308"/>
    </svg>
  );
};
