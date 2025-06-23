
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";
import { LoadingState } from "@/components/common/LoadingState";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function Index() {
  const { isMobile } = useResponsiveLayout();
  
  console.log('Index page rendering - mobile-first version, isMobile:', isMobile);
  
  // Add error boundary around the entire page
  try {
    return (
      <div className="bg-[#141416] min-h-screen flex flex-col overflow-hidden items-center">
        {/* Mobile-first spacing and padding */}
        <main className={`w-full ${isMobile ? 'space-y-8' : ''}`}>
          <React.Suspense fallback={<LoadingState message="Loading hero section..." />}>
            <EnhancedHero />
          </React.Suspense>
          
          <React.Suspense fallback={<LoadingState message="Loading discover section..." />}>
            <SimplifiedDiscover />
          </React.Suspense>
          
          <React.Suspense fallback={<LoadingState message="Loading CTA section..." />}>
            <SimplifiedCTA />
          </React.Suspense>
        </main>
        
        {/* Footer with mobile-friendly spacing */}
        <div className={isMobile ? 'mt-8' : ''}>
          <React.Suspense fallback={<LoadingState message="Loading footer..." />}>
            <Footer />
          </React.Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Index page:', error);
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-4">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-crd-green hover:bg-crd-green/90 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
