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
        <div className="w-12 h-full bg-crd-darker/90 backdrop-blur-xl border border-crd-blue/30 shadow-2xl flex flex-col relative overflow-hidden">
          {/* Animated glow border */}
          <div className="absolute inset-0 bg-gradient-to-b from-crd-blue/20 via-transparent to-crd-purple/20 opacity-50 animate-pulse" />
          <div className="absolute inset-0 border border-crd-blue/50 shadow-[0_0_20px_rgba(55,114,255,0.3)]" />
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="relative w-full h-12 flex items-center justify-center text-crd-lightGray hover:text-crd-white hover:bg-crd-blue/20 transition-all duration-300 border-b border-crd-mediumGray/30 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-crd-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">{collapseIcon}</div>
          </button>
          
          {/* Collapsed Content Icons */}
          <div className="flex-1 p-2 relative z-10">
            {collapsedContent}
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {!isCollapsed && (
        <div className="w-full h-full bg-crd-darker/80 backdrop-blur-xl border border-crd-blue/40 shadow-2xl flex flex-col relative overflow-hidden">
          {/* Multi-layered shadows and glow effects */}
          <div className="absolute inset-0 shadow-[0_0_50px_rgba(55,114,255,0.2)]" />
          <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(55,114,255,0.3)]" />
          
          {/* Animated gradient border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-crd-blue/30 via-crd-purple/30 to-crd-blue/30 opacity-60 animate-pulse" 
               style={{ mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)', 
                        maskComposite: 'xor',
                        WebkitMask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                        WebkitMaskComposite: 'xor',
                        padding: '1px' }} />
          
          {/* Subtle holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-crd-blue/5 via-transparent to-crd-purple/5 opacity-70" />
          
          {/* Toggle Button Header */}
          <div className="relative flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-crd-blue/40 bg-gradient-to-r from-crd-darker/50 to-crd-darker/80 backdrop-blur-sm">
            {/* Header gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-crd-blue/10 via-transparent to-crd-purple/10" />
            
            <div className="relative text-crd-white text-sm font-medium tracking-wide">
              {side === 'left' ? 'Tools' : 'Properties'}
            </div>
            <button
              onClick={onToggle}
              className="relative p-1.5 text-crd-lightGray hover:text-crd-white hover:bg-crd-blue/20 rounded-md transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-crd-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              <div className="relative z-10">{collapseIcon}</div>
            </button>
          </div>
          
          {/* Main Content */}
          <div className="relative flex-1 overflow-hidden">
            {/* Content backdrop with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-crd-darker/60 to-crd-darker/80" />
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                   backgroundImage: `radial-gradient(circle at 1px 1px, rgba(55,114,255,0.1) 1px, transparent 0)`,
                   backgroundSize: '20px 20px'
                 }} />
            
            {/* Animated edge glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crd-blue/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crd-purple/60 to-transparent" />
            
            <div className="relative z-10 h-full">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};