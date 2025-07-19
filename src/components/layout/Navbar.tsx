
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Navigation } from '@/components/navigation/Navigation';
import { MobileNav } from '@/components/home/navbar/MobileNav';
import { NavActions } from '@/components/home/navbar/NavActions';
import { useEnhancedNavbar } from '@/hooks/useEnhancedNavbar';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMessageOverlayPresent, setIsMessageOverlayPresent] = useState(false);
  const [isHoveringNavbar, setIsHoveringNavbar] = useState(false);

  const {
    isVisible,
    isScrolled,
    scrollMetrics,
    isSpecialRoute,
    isHomePage,
    prefersReducedMotion
  } = useEnhancedNavbar();

  // Check for top-level message overlays
  useEffect(() => {
    const checkForOverlays = () => {
      // Look for viewing conditions indicator or other top-level messages
      const topMessages = document.querySelectorAll('[class*="top-"], [class*="fixed"][class*="top-"]');
      const hasTopOverlay = Array.from(topMessages).some(el => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        const zIndex = parseInt(computedStyle.zIndex) || 0;
        
        // Check if element is positioned in navbar area and has high z-index
        return rect.top < 80 && zIndex > 40 && rect.height > 0;
      });
      
      setIsMessageOverlayPresent(hasTopOverlay);
    };

    // Check immediately and set up observer
    checkForOverlays();
    
    const observer = new MutationObserver(checkForOverlays);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
  }, []);

  const isHomePage_ = location.pathname === '/';
  const isCreatePage = location.pathname === '/create';
  const isStudioPage = location.pathname === '/studio';
  const isCRDEditorPage = location.pathname === '/create/crd';

  // Determine navbar visibility
  const shouldHideForMessages = isMessageOverlayPresent && !isHoveringNavbar;
  const shouldShowNavbar = !shouldHideForMessages && (
    isHomePage_ || 
    isCreatePage || 
    (!isStudioPage && !isCRDEditorPage && isVisible)
  );

  // Enhanced navbar classes
  const navbarClasses = cn(
    // Base styles
    "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
    
    // Background and styling
    isScrolled || !isHomePage_ 
      ? "bg-[hsl(var(--theme-navbar-bg))] backdrop-blur-md border-b border-[hsl(var(--theme-navbar-border)/0.2)]" 
      : "bg-transparent",
    
    // Height and spacing
    "h-[var(--navbar-height)]",
    
    // Visibility transitions
    shouldShowNavbar
      ? "translate-y-0 opacity-100"
      : shouldHideForMessages 
        ? "-translate-y-full opacity-75" 
        : "-translate-y-full opacity-0",
    
    // Reduced motion support
    prefersReducedMotion && "transition-none",
    
    // Additional classes
    className
  );

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleNavbarMouseEnter = () => {
    setIsHoveringNavbar(true);
  };

  const handleNavbarMouseLeave = () => {
    setIsHoveringNavbar(false);
  };

  return (
    <>
      <nav 
        className={navbarClasses}
        onMouseEnter={handleNavbarMouseEnter}
        onMouseLeave={handleNavbarMouseLeave}
        style={{
          '--navbar-height': '4rem'
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-crd-orange to-crd-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CRD</span>
                </div>
                <span className="font-bold text-lg tracking-tight hidden sm:block">
                  Cardshow
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <Navigation className="flex-1 justify-center" />

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <NavActions />
              
              {/* Mobile menu button */}
              <button
                onClick={handleMobileNavToggle}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hover detection area when navbar is hidden */}
      {shouldHideForMessages && (
        <div 
          className="fixed top-0 left-0 right-0 h-12 z-30"
          onMouseEnter={handleNavbarMouseEnter}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
};
