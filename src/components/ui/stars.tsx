"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  motion,
  type SpringOptions,
  type Transition,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

type NebulaLayerProps = HTMLMotionProps<"div"> & {
  colors: string[];
  opacity: number;
  size: number;
  blur: number;
};

type StarLayerProps = HTMLMotionProps<"div"> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string | string[];
};

function generateStars(count: number, starColors: string[]) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    shadows.push(`${x}px ${y}px ${color}`);
  }
  return shadows.join(", ");
}

function NebulaLayer({ colors, opacity, size, blur, className, ...props }: NebulaLayerProps) {
  const [nebulaStyle, setNebulaStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    const gradients = colors.map((color, index) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const radius = 20 + Math.random() * 30;
      return `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${radius}%)`;
    });

    setNebulaStyle({
      background: gradients.join(", "),
      opacity,
      filter: `blur(${blur}px)`,
    });
  }, [colors, opacity, blur]);

  return (
    <motion.div
      data-slot="nebula-layer"
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 120 + Math.random() * 60, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={nebulaStyle}
      {...props}
    />
  );
}

function StarLayer({
  count = 200,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: "linear" },
  starColor = "#fff",
  className,
  ...props
}: StarLayerProps) {
  const [boxShadow, setBoxShadow] = React.useState<string>("");

  React.useEffect(() => {
    const starColors = Array.isArray(starColor) ? starColor : [starColor];
    setBoxShadow(generateStars(count, starColors));
  }, [count, starColor]);

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn("absolute top-0 left-0 w-full h-[2000px]", className)}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full top-[2000px]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
    </motion.div>
  );
}

type StarsBackgroundProps = React.ComponentProps<"div"> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string | string[];
};

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = ["#fff", "#e6f3ff", "#ffe6e6", "#f0e6ff", "#e6ffe6"],
  ...props
}: StarsBackgroundProps) {
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);

  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newOffsetX = -(e.clientX - centerX) * factor;
      const newOffsetY = -(e.clientY - centerY) * factor;
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [offsetX, offsetY, factor],
  );

  return (
    <div
      data-slot="stars-background"
      className={cn(
        "relative size-full overflow-hidden bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black",
        className,
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Distant nebular clouds */}
      <NebulaLayer
        colors={["rgba(138, 43, 226, 0.1)", "rgba(75, 0, 130, 0.08)"]}
        opacity={0.3}
        size={100}
        blur={8}
      />
      <NebulaLayer
        colors={["rgba(25, 25, 112, 0.12)", "rgba(0, 0, 139, 0.1)"]}
        opacity={0.25}
        size={80}
        blur={12}
      />
      <NebulaLayer
        colors={["rgba(138, 43, 226, 0.08)", "rgba(220, 20, 60, 0.06)"]}
        opacity={0.2}
        size={120}
        blur={15}
      />

      {/* Star layers with reduced counts */}
      <motion.div style={{ x: springX, y: springY }}>
        <StarLayer
          count={150}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
          starColor={starColor}
        />
        <StarLayer
          count={80}
          size={2}
          transition={{
            repeat: Infinity,
            duration: speed * 2,
            ease: "linear",
          }}
          starColor={starColor}
        />
        <StarLayer
          count={40}
          size={3}
          transition={{
            repeat: Infinity,
            duration: speed * 3,
            ease: "linear",
          }}
          starColor={starColor}
        />
      </motion.div>
      {children}
    </div>
  );
}