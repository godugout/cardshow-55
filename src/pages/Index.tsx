
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";
import { NavbarAwareContainer } from "@/components/layout/NavbarAwareContainer";

export default function Index() {
  console.log('Index page rendering - streamlined version');
  
  return (
    <NavbarAwareContainer className="bg-[#141416] min-h-screen flex flex-col overflow-hidden">
      <main className="w-full flex-1">
        <EnhancedHero />
        <SimplifiedDiscover />
        <SimplifiedCTA />
      </main>
      <Footer />
    </NavbarAwareContainer>
  );
}
