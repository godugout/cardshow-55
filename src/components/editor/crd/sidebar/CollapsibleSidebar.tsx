import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  side: 'left' | 'right';
  collapsedContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  children,
  isCollapsed,
  onToggle,
  side,
  collapsedContent,
  className = '',
  style = {}
}) => {
  const sideStyles = side === 'left' 
    ? { left: 0 } 
    : { right: 0 };

  const collapseIcon = side === 'left' 
    ? (isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
    : (isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />);

  return (
    <div 
      className={`absolute top-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${className}`}
      style={{
        ...sideStyles,
        width: isCollapsed ? '48px' : 'var(--sidebar-width, 380px)',
        transform: isCollapsed ? 'translateX(0)' : 'translateX(0)',
        ...style
      }}
    >
      {/* Collapsed Icon Strip */}
      {isCollapsed && (
        <div className="w-12 h-full bg-gradient-to-b from-crd-darker/90 to-crd-darker/70 backdrop-blur-xl border border-crd-mediumGray/40 shadow-2xl flex flex-col relative">
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(55,114,255,0.15)] pointer-events-none"></div>
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="relative w-full h-12 flex items-center justify-center text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/30 transition-all duration-300 border-b border-crd-mediumGray/30 hover:shadow-[inset_0_0_15px_rgba(55,114,255,0.2)]"
          >
            {collapseIcon}
          </button>
          
          {/* Collapsed Content Icons */}
          <div className="relative flex-1 p-2">
            {collapsedContent}
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {!isCollapsed && (
        <div className={`w-full h-full bg-gradient-to-b from-crd-darker/80 to-crd-darker/60 backdrop-blur-xl border border-crd-mediumGray/40 shadow-2xl flex flex-col relative ${
          side === 'left' ? 'border-r-2 border-r-crd-blue/40' : 'border-l-2 border-l-crd-blue/40'
        }`}>
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_25px_rgba(55,114,255,0.12)] pointer-events-none"></div>
          
          {/* Toggle Button Header */}
          <div className="relative flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-crd-mediumGray/40 bg-gradient-to-r from-transparent via-crd-mediumGray/5 to-transparent">
            <div className="text-crd-white text-sm font-medium">
              {side === 'left' ? 'Tools' : 'Properties'}
            </div>
            <button
              onClick={onToggle}
              className="relative p-1 text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/30 rounded transition-all duration-300 hover:shadow-[inset_0_0_10px_rgba(55,114,255,0.2)]"
            >
              {collapseIcon}
            </button>
          </div>
          
          {/* Main Content */}
          <div className="relative flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};