
import React from "react";
import { Navbar } from "@/components/home/Navbar";
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Navbar />
      <EnhancedHero />
      <SimplifiedCTA />
    </div>
  );
};

export default Index;
