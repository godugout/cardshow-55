/**
 * Utility functions to get CSS custom property values for Three.js materials
 * This ensures our 3D scene uses the same colors as our design system
 */

/**
 * Gets a CSS custom property value and converts it to a hex color string for Three.js
 * @param property - CSS custom property name (without --)
 * @returns Hex color string (e.g., '#ffee44')
 */
export function getCSSColor(property: string): string {
  if (typeof window === 'undefined') {
    // Return fallback colors for SSR
    const fallbacks: Record<string, string> = {
      'sun-core': '#ffee44',
      'sun-core-emissive': '#ff9900',
      'sun-chromosphere': '#ff6600',
      'sun-chromosphere-emissive': '#ff7700',
      'sun-corona': '#ffbb00',
      'sun-corona-emissive': '#ffcc33',
      'sun-outer-corona': '#fff8e1',
      'sun-outer-emissive': '#fff2c7',
      'monolith-base': '#000000',
      'monolith-emissive': '#0a0a0a',
      'glass-case': '#e6f3ff',
      'glass-emissive': '#ffffff',
    };
    return fallbacks[property] || '#ffffff';
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${property}`)
    .trim();

  if (!value) {
    console.warn(`CSS property --${property} not found, using fallback`);
    return getCSSColor(property); // Use fallback
  }

  // Convert HSL to hex
  return hslToHex(value);
}

/**
 * Converts HSL string to hex color
 * @param hsl - HSL string like "53 100% 65%"
 * @returns Hex color string
 */
function hslToHex(hsl: string): string {
  const parts = hsl.split(' ').map(part => part.replace('%', ''));
  const h = parseInt(parts[0]) / 360;
  const s = parseInt(parts[1]) / 100;
  const l = parseInt(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Pre-defined color getters for common 3D scene elements
 */
export const SceneColors = {
  // Sun colors
  sunCore: () => getCSSColor('sun-core'),
  sunCoreEmissive: () => getCSSColor('sun-core-emissive'),
  sunChromosphere: () => getCSSColor('sun-chromosphere'),
  sunChromosphereEmissive: () => getCSSColor('sun-chromosphere-emissive'),
  sunCorona: () => getCSSColor('sun-corona'),
  sunCoronaEmissive: () => getCSSColor('sun-corona-emissive'),
  sunOuterCorona: () => getCSSColor('sun-outer-corona'),
  sunOuterEmissive: () => getCSSColor('sun-outer-emissive'),
  
  // Monolith colors
  monolithBase: () => getCSSColor('monolith-base'),
  monolithEmissive: () => getCSSColor('monolith-emissive'),
  glassCase: () => getCSSColor('glass-case'),
  glassEmissive: () => getCSSColor('glass-emissive'),
} as const;