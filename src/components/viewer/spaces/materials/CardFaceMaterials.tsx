import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { useDynamicCardBackMaterials } from '../../hooks/useDynamicCardBackMaterials';

// For TS: minimal legacy interface for card
interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface EdgeGlowProps {
  emissiveColor: THREE.Color;
  emissiveIntensity: number;
}

// Utility function to create edge glow properties
export const createEdgeGlowProps = (
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): EdgeGlowProps => {
  // Get the dominant effect to determine glow color
  const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
    effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
  );
  
  if (activeEffects.length === 0) {
    return {
      emissiveColor: new THREE.Color(0x4a90e2), // Default blue
      emissiveIntensity: 0.5
    };
  }
  
  // Find the effect with highest intensity
  const dominantEffect = activeEffects.reduce((max, current) => 
    (current[1].intensity as number) > (max[1].intensity as number) ? current : max
  );
  
  const [effectId, effect] = dominantEffect;
  const intensity = (effect.intensity as number) / 100;
  
  // Color mapping for different effects
  const colorMap: Record<string, number> = {
    holographic: 0x00ffff,
    gold: 0xffd700,
    chrome: 0xc0c0c0,
    crystal: 0xffffff,
    prizm: 0xff69b4,
    vintage: 0xd2b48c,
    ice: 0x87ceeb,
    aurora: 0x9370db,
    interference: 0x98fb98,
    foilspray: 0xffa500,
    brushedmetal: 0xa9a9a9,
    waves: 0x4169e1,
    lunar: 0xc0c0c0
  };
  
  const baseColor = colorMap[effectId] || 0x4a90e2;
  let finalIntensity = intensity * 1.2; // Base intensity increased
  
  // Boost intensity for hovering and interactive lighting
  if (isHovering && interactiveLighting) {
    finalIntensity *= 2.0;
  } else if (isHovering) {
    finalIntensity *= 1.5;
  }
  
  return {
    emissiveColor: new THREE.Color(baseColor),
    emissiveIntensity: Math.min(finalIntensity, 2.0) // Increased max intensity
  };
};

// Helper to dynamically create a canvas texture for the card back, incorporating
// the background gradient, CRD logo (centered), and style.
function useCardBackCanvasTexture(
  effectValues: EffectValues,
  cardWidth: number = 400,
  cardHeight: number = 560
) {
  // Get dynamic back style
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // Static image URL for the CRD logo
  const crdLogoUrl = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';

  // Memoize canvas+texture for performance
  return useMemo(() => {
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    const ctx = canvas.getContext('2d')!;
    
    // Paint background gradient
    if (selectedMaterial.background.startsWith('linear-gradient')) {
      // Parse linear-gradient stops (very basic, not production-grade, but supports our usage)
      // Example: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, ...)
      const gradMatch = selectedMaterial.background.match(/linear-gradient\(([^,]+),(.+)\)/);
      let gradient: CanvasGradient | null = null;
      if (gradMatch) {
        // We'll only parse left-right for demo, but since our gradients are diagonal, do TL->BR
        gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
        const stops = gradMatch[2].split(',').map(s => s.trim());
        stops.forEach(stop => {
          // Find color and percent
          const parts = stop.match(/(#[0-9a-fA-F]+|rgba?\([^)]+\)|[a-zA-Z0-9]+)\s*([0-9.]+%?)/);
          let percent: number = 0;
          if (parts) {
            const color = parts[1];
            if (parts[2] !== undefined) {
              const parsed = parseFloat(parts[2]);
              percent = (!isNaN(parsed) ? parsed : 0) / 100;
            }
            gradient!.addColorStop(percent, parts[1]);
          } else if (stop.startsWith('#') || stop.startsWith('rgb')) {
            // Support for stops without explicit percent (fallback)
            gradient!.addColorStop(0, stop);
          }
        });
      }
      if (gradient) {
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = '#1a1a1a';
      }
      ctx.fillRect(0, 0, cardWidth, cardHeight);
    } else {
      ctx.fillStyle = selectedMaterial.background || '#1a1a1a';
      ctx.fillRect(0, 0, cardWidth, cardHeight);
    }

    // Optionally add texture effect (blur/noise overlay for some styles)
    if (selectedMaterial.texture === "noise") {
      // Simple noise (grain) overlay for vintage, for demo
      for (let i = 0; i < 2000; i++) {
        // Ensure cardWidth and cardHeight are numbers for arithmetic
        const safeCardWidth = Number(cardWidth);
        const safeCardHeight = Number(cardHeight);
        const x = Math.random() * safeCardWidth;
        const y = Math.random() * safeCardHeight;
        const alpha = Math.floor(30 + Math.random() * 40); // 30-70
        ctx.fillStyle = `rgba(80,70,60,${alpha / 255})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    if (selectedMaterial.blur) {
      // Not directly supported on canvas, but layer a blur rect as a cheap effect
      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.filter = `blur(${selectedMaterial.blur * 2}px)`;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      ctx.restore();
      // reset filter
      ctx.filter = "none";
    }

    // Optionally add border overlay (simulate borderColor)
    if (selectedMaterial.borderColor) {
      ctx.save();
      ctx.lineWidth = 10;
      ctx.strokeStyle = selectedMaterial.borderColor;
      ctx.globalAlpha = 0.3;
      ctx.strokeRect(5, 5, cardWidth - 10, cardHeight - 10);
      ctx.restore();
    }

    // Now render the logo (centered, styled according to selectedMaterial.logoTreatment)
    const logoImg = document.createElement('img');
    let finished = false;
    // We'll synchronously return a DataTexture, but in edge case where logo isn't yet loaded,
    // fallback to white box, and user will see the real logo on next frame.
    // [This is acceptable for 3D texture, which auto-refreshes!]
    logoImg.onload = () => {
      // clear center region (optional)
      // draw logo in the center
      const scale = (selectedMaterial.logoTreatment?.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1.0) * 1;
      const logoW = 180 * scale; // appearance tweak
      const logoH = 180 * scale;
      const x = cardWidth / 2 - logoW / 2;
      const y = cardHeight / 2 - logoH / 2;
      ctx.save();
      ctx.globalAlpha = selectedMaterial.logoTreatment?.opacity ?? 0.87;
      // apply slight drop shadow
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 16;
      ctx.filter = selectedMaterial.logoTreatment?.filter || "none";
      ctx.drawImage(logoImg, x, y, logoW, logoH);
      ctx.restore();
      finished = true;
    };
    // If logo is not loaded synchronously, use fallback icon first, which is ok (logo will appear on next frame)
    logoImg.src = crdLogoUrl;

    // If the image has not loaded, fallback to a white circle for first frame
    if (!finished) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(cardWidth / 2, cardHeight / 2, 85, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    }
    // Edge glow (soft white overlay) if wanted
    // (optional: could add more signature effects here)

    // Convert canvas to texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 4;
    return texture;
    // eslint-disable-next-line
  }, [JSON.stringify(selectedMaterial), cardWidth, cardHeight, crdLogoUrl]);
}

// Hook to create materials for card faces
export const useCardFaceMaterials = (
  card: Simple3DCard,
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material[] => {
  // Card front texture (normal card image)
  const frontTexture = useTexture(card.image_url || '/placeholder-card.jpg');

  // Card back texture (dynamic, CRD logo etc.)
  const backTexture = useCardBackCanvasTexture(effectValues);

  // Get edge glow properties (for edge faces)
  const edgeGlowProps = createEdgeGlowProps(effectValues, isHovering, interactiveLighting);

  // Create materials array for box geometry faces
  // Order: [+X, -X, +Y, -Y, +Z (front), -Z (back)]
  const materials: THREE.Material[] = [
    // Right side (+X)
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.92
    }),
    // Left side (-X)
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.92
    }),
    // Top side (+Y)
    new THREE.MeshStandardMaterial({
      color: 0x181818,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.75,
      transparent: true,
      opacity: 0.90
    }),
    // Bottom side (-Y)
    new THREE.MeshStandardMaterial({
      color: 0x181818,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.75,
      transparent: true,
      opacity: 0.90
    }),
    // Front face (+Z) - Card image
    new THREE.MeshStandardMaterial({
      map: frontTexture,
      transparent: false,
      roughness: 0.33,
      metalness: 0.1,
      side: THREE.FrontSide
    }),
    // Back face (-Z) - CRD logo with styling, effect-driven
    new THREE.MeshStandardMaterial({
      map: backTexture,
      transparent: false,
      roughness: 0.22,
      metalness: 0.22,
      side: THREE.FrontSide
    }),
  ];

  return materials;
};
