
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  console.log('Index page rendering - streamlined version');
  
  try {
    return (
      <div className="bg-[#141416] min-h-screen flex flex-col overflow-hidden items-center">
        <main className="w-full">
          <EnhancedHero />
          <SimplifiedDiscover />
          <SimplifiedCTA />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Index page error:', error);
    return (
      <div className="min-h-screen bg-[#141416] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Page Error</h1>
          <p className="mb-4">The home page encountered an error.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
