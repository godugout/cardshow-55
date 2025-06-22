
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function Index() {
  const { isMobile } = useResponsiveLayout();
  
  console.log('Index page rendering - mobile-first version, isMobile:', isMobile);
  
  return (
    <div className="bg-[#141416] min-h-screen flex flex-col overflow-hidden items-center">
      {/* Mobile-first spacing and padding */}
      <main className={`w-full ${isMobile ? 'space-y-8' : ''}`}>
        <EnhancedHero />
        <SimplifiedDiscover />
        <SimplifiedCTA />
      </main>
      
      {/* Footer with mobile-friendly spacing */}
      <div className={isMobile ? 'mt-8' : ''}>
        <Footer />
      </div>
    </div>
  );
}
