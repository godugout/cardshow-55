"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StarsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  starCount?: number;
}

export function StarsBackground({
  children,
  className,
  starCount = 50
}: StarsBackgroundProps) {
  // Generate static star positions once
  const stars = React.useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 2
    }));
  }, [starCount]);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-gradient-to-b from-indigo-900/20 via-purple-900/30 to-black",
        className
      )}
    >
      {/* Static Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.animationDelay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {children}
    </div>
  );
}