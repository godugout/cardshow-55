import React from 'react';

interface CreationPanelsProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  bottomSection?: React.ReactNode;
}

export const CreationPanels = ({ 
  leftPanel, 
  centerPanel, 
  rightPanel, 
  bottomSection 
}: CreationPanelsProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0">
        {/* Left Panel - 3 columns */}
        <div className="col-span-3 flex flex-col space-y-6">
          {leftPanel}
        </div>

        {/* Center Panel - 6 columns */}
        <div className="col-span-6 flex flex-col">
          {centerPanel}
        </div>

        {/* Right Panel - 3 columns */}
        <div className="col-span-3 flex flex-col space-y-6">
          {rightPanel}
        </div>
      </div>

      {/* Bottom Section */}
      {bottomSection && (
        <div className="flex-shrink-0 border-t border-crd-mediumGray/20 bg-crd-darker/50 backdrop-blur-sm">
          {bottomSection}
        </div>
      )}
    </div>
  );
};