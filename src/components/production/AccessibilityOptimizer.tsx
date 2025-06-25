
import React, { useEffect } from 'react';

export const AccessibilityOptimizer: React.FC = () => {
  useEffect(() => {
    // Initialize accessibility optimizations
    initializeA11y();
    
    // Set up keyboard navigation
    setupKeyboardNavigation();
    
    // Configure screen reader optimizations
    setupScreenReaderOptimizations();
    
    // Add focus management
    setupFocusManagement();
  }, []);

  const initializeA11y = () => {
    // Add skip link if not present
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-crd-green text-black px-4 py-2 rounded z-50';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure main content has proper ID
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }

    // Add lang attribute if missing
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
  };

  const setupKeyboardNavigation = () => {
    // Improve focus visibility
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 2px solid #00C851 !important;
        outline-offset: 2px !important;
      }
      
      .skip-link {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      
      .skip-link:focus {
        position: absolute !important;
        left: 6px !important;
        top: 6px !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
        z-index: 999999 !important;
      }
    `;
    document.head.appendChild(style);

    // Add keyboard navigation helpers
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals/overlays
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        }
      }

      // Tab trap in modals
      if (e.key === 'Tab') {
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (activeModal) {
          const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    });
  };

  const setupScreenReaderOptimizations = () => {
    // Add aria-live regions for dynamic content
    if (!document.querySelector('[aria-live="polite"]')) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'announcer';
      document.body.appendChild(announcer);
    }

    // Function to announce messages to screen readers
    window.announceToScreenReader = (message: string) => {
      const announcer = document.getElementById('announcer');
      if (announcer) {
        announcer.textContent = message;
        // Clear after announcement
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      }
    };
  };

  const setupFocusManagement = () => {
    // Store focus before navigation
    let lastFocusedElement: HTMLElement | null = null;

    // Focus management for route changes
    const observer = new MutationObserver(() => {
      // Auto-focus headings on page changes
      const mainHeading = document.querySelector('h1, [role="heading"][aria-level="1"]') as HTMLElement;
      if (mainHeading && mainHeading !== lastFocusedElement) {
        mainHeading.focus();
        lastFocusedElement = mainHeading;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Focus management for interactive elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, [role="button"], a, [role="link"]')) {
        lastFocusedElement = target;
      }
    });
  };

  return null;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    announceToScreenReader: (message: string) => void;
  }
}
