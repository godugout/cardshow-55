
import React from "react";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { Footer } from "@/components/home/Footer";
import { usePerformanceOptimizer } from "@/hooks/usePerformanceOptimizer";

export default function Index() {
  console.log('Index page rendering - streamlined version');
  
  // Performance monitoring and automatic optimization
  const { settings, metrics } = usePerformanceOptimizer();
  
  return (
    <div className={`bg-[#141416] min-h-screen flex flex-col overflow-hidden ${
      settings.animationsEnabled ? '' : 'power-save-mode'
    }`}>
      <main className="w-full flex-1">
        <EnhancedHero />
        {/* Add spacing before Discover section */}
        <div className="mt-16 mb-8">
          <SimplifiedDiscover />
        </div>
        <SimplifiedCTA />
      </main>
      <Footer />
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`performance-overlay ${
          metrics.fps > 55 ? 'fps-good' : 
          metrics.fps > 45 ? 'fps-warning' : 'fps-critical'
        }`}>
          FPS: {Math.round(metrics.fps)} | Mem: {Math.round(metrics.memoryUsage)}MB
          {metrics.fps < 45 && <div style={{fontSize: '10px', color: '#ef4444'}}>Performance mode active</div>}
        </div>
      )}
    </div>
  );
}
