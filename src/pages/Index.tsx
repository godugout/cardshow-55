
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  return (
    <div className="bg-[#141416] min-h-screen flex flex-col overflow-hidden">
      <main className="w-full flex-1">
        <EnhancedHero />
        <SimplifiedDiscover />
        <SimplifiedCTA />
      </main>
      <Footer />
    </div>
  );
}
