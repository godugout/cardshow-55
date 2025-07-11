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
        <div className="w-12 h-full bg-crd-darker/80 backdrop-blur-md border border-crd-mediumGray/30 shadow-lg flex flex-col transition-all duration-300">
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="w-full h-12 flex items-center justify-center text-crd-lightGray hover:text-[hsl(var(--theme-accent))] hover:bg-[hsl(var(--theme-accent)/0.1)] transition-all duration-200 border-b border-[hsl(var(--theme-accent)/0.1)]"
          >
            {collapseIcon}
          </button>
          
          {/* Collapsed Content Icons */}
          <div className="flex-1 p-2">
            {collapsedContent}
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {!isCollapsed && (
        <div className={`w-full h-full bg-crd-darker/60 backdrop-blur-md border border-crd-mediumGray/30 shadow-2xl flex flex-col transition-all duration-300 ${
          side === 'left' ? 'border-r-2 border-r-[hsl(var(--theme-accent)/0.3)]' : 'border-l-2 border-l-[hsl(var(--theme-accent)/0.3)]'
        }`}>
          {/* Toggle Button Header */}
          <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-[hsl(var(--theme-accent)/0.1)]">
            <div className="text-crd-white text-sm font-medium">
              {side === 'left' ? 'Tools' : 'Properties'}
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-crd-lightGray hover:text-[hsl(var(--theme-accent))] hover:bg-[hsl(var(--theme-accent)/0.1)] rounded transition-all duration-200"
            >
              {collapseIcon}
            </button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};