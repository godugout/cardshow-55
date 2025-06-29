
interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface TeamColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface ColorMappingOptions {
  preserveBrandColors?: boolean;
  ensureReadability?: boolean;
  generateComplementary?: boolean;
  adjustForDarkMode?: boolean;
}

export class ColorMapper {
  // Convert hex to RGB
  private hexToRgb(hex: string): ColorRGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // Convert RGB to hex
  private rgbToHex(rgb: ColorRGB): string {
    const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  // Convert RGB to HSL
  private rgbToHsl(rgb: ColorRGB): ColorHSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  // Convert HSL to RGB
  private hslToRgb(hsl: ColorHSL): ColorRGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // Calculate contrast ratio between two colors
  private getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string) => {
      const rgb = this.hexToRgb(hex);
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Adjust color for better readability
  private adjustForReadability(textColor: string, backgroundColor: string, minRatio = 4.5): string {
    let currentRatio = this.getContrastRatio(textColor, backgroundColor);
    
    if (currentRatio >= minRatio) {
      return textColor;
    }

    const textHsl = this.rgbToHsl(this.hexToRgb(textColor));
    const backgroundHsl = this.rgbToHsl(this.hexToRgb(backgroundColor));

    // Determine if we need to make text lighter or darker
    const shouldLighten = backgroundHsl.l < 50;
    
    let adjustedHsl = { ...textHsl };
    const step = shouldLighten ? 5 : -5;
    
    while (currentRatio < minRatio && 
           adjustedHsl.l > 0 && adjustedHsl.l < 100) {
      adjustedHsl.l += step;
      adjustedHsl.l = Math.max(0, Math.min(100, adjustedHsl.l));
      
      const adjustedColor = this.rgbToHex(this.hslToRgb(adjustedHsl));
      currentRatio = this.getContrastRatio(adjustedColor, backgroundColor);
      
      if (currentRatio >= minRatio) {
        return adjustedColor;
      }
    }

    // Fallback to black or white
    return shouldLighten ? '#FFFFFF' : '#000000';
  }

  // Generate complementary colors
  generateComplementaryColors(baseColor: string): {
    complementary: string;
    triadic: string[];
    analogous: string[];
  } {
    const hsl = this.rgbToHsl(this.hexToRgb(baseColor));
    
    const complementary = this.rgbToHex(this.hslToRgb({
      h: (hsl.h + 180) % 360,
      s: hsl.s,
      l: hsl.l
    }));

    const triadic = [
      this.rgbToHex(this.hslToRgb({
        h: (hsl.h + 120) % 360,
        s: hsl.s,
        l: hsl.l
      })),
      this.rgbToHex(this.hslToRgb({
        h: (hsl.h + 240) % 360,
        s: hsl.s,
        l: hsl.l
      }))
    ];

    const analogous = [
      this.rgbToHex(this.hslToRgb({
        h: (hsl.h + 30) % 360,
        s: hsl.s,
        l: hsl.l
      })),
      this.rgbToHex(this.hslToRgb({
        h: (hsl.h - 30 + 360) % 360,
        s: hsl.s,
        l: hsl.l
      }))
    ];

    return { complementary, triadic, analogous };
  }

  // Create color variations (lighter/darker shades)
  createColorVariations(baseColor: string, steps = 5): {
    lighter: string[];
    darker: string[];
  } {
    const hsl = this.rgbToHsl(this.hexToRgb(baseColor));
    const lighter: string[] = [];
    const darker: string[] = [];

    for (let i = 1; i <= steps; i++) {
      const lightStep = Math.min(100, hsl.l + (i * 10));
      const darkStep = Math.max(0, hsl.l - (i * 10));

      lighter.push(this.rgbToHex(this.hslToRgb({
        h: hsl.h,
        s: hsl.s,
        l: lightStep
      })));

      darker.push(this.rgbToHex(this.hslToRgb({
        h: hsl.h,
        s: hsl.s,
        l: darkStep
      })));
    }

    return { lighter, darker };
  }

  // Map team colors to template zones
  mapTeamColorsToTemplate(
    teamColors: TeamColors,
    templateZones: Record<string, string>,
    options: ColorMappingOptions = {}
  ): Record<string, string> {
    const {
      preserveBrandColors = true,
      ensureReadability = true,
      generateComplementary = true,
      adjustForDarkMode = false
    } = options;

    const mappedColors: Record<string, string> = {};
    
    // Generate complementary colors if needed
    const complementaryColors = generateComplementary ? 
      this.generateComplementaryColors(teamColors.primary) : null;

    Object.entries(templateZones).forEach(([zoneId, currentColor]) => {
      let newColor = currentColor;

      // Apply team colors based on zone type
      if (zoneId.includes('primary') || zoneId.includes('main')) {
        newColor = teamColors.primary;
      } else if (zoneId.includes('secondary')) {
        newColor = teamColors.secondary;
      } else if (zoneId.includes('accent') || zoneId.includes('highlight')) {
        newColor = teamColors.accent;
      } else if (zoneId.includes('text')) {
        newColor = teamColors.text;
      } else if (zoneId.includes('background')) {
        newColor = teamColors.background;
      } else if (complementaryColors && zoneId.includes('complement')) {
        newColor = complementaryColors.complementary;
      }

      // Adjust for readability if needed
      if (ensureReadability && zoneId.includes('text')) {
        const backgroundZone = Object.keys(templateZones).find(zone => 
          zone.includes('background') || zone.includes('bg')
        );
        
        if (backgroundZone) {
          newColor = this.adjustForReadability(
            newColor, 
            templateZones[backgroundZone]
          );
        }
      }

      // Adjust for dark mode
      if (adjustForDarkMode) {
        const hsl = this.rgbToHsl(this.hexToRgb(newColor));
        if (zoneId.includes('background')) {
          // Make backgrounds darker
          newColor = this.rgbToHex(this.hslToRgb({
            ...hsl,
            l: Math.max(0, hsl.l - 30)
          }));
        } else if (zoneId.includes('text')) {
          // Make text lighter
          newColor = this.rgbToHex(this.hslToRgb({
            ...hsl,
            l: Math.min(100, hsl.l + 30)
          }));
        }
      }

      mappedColors[zoneId] = newColor;
    });

    return mappedColors;
  }

  // Extract dominant colors from an image (for logo analysis)
  async extractDominantColors(imageUrl: string, numColors = 5): Promise<string[]> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return resolve([]);

        // Simple color quantization using k-means
        const colors = this.kMeansColors(imageData, numColors);
        resolve(colors.map(color => this.rgbToHex(color)));
      };

      img.onerror = () => resolve([]);
      img.src = imageUrl;
    });
  }

  // K-means clustering for color extraction
  private kMeansColors(imageData: ImageData, k: number): ColorRGB[] {
    const pixels: ColorRGB[] = [];
    
    // Sample pixels (every 10th pixel for performance)
    for (let i = 0; i < imageData.data.length; i += 40) {
      pixels.push({
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2]
      });
    }

    // Initialize centroids randomly
    const centroids: ColorRGB[] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push({ ...randomPixel });
    }

    // K-means iterations
    for (let iter = 0; iter < 10; iter++) {
      const clusters: ColorRGB[][] = Array(k).fill(null).map(() => []);

      // Assign pixels to nearest centroid
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let closestCentroid = 0;

        centroids.forEach((centroid, index) => {
          const distance = Math.sqrt(
            Math.pow(pixel.r - centroid.r, 2) +
            Math.pow(pixel.g - centroid.g, 2) +
            Math.pow(pixel.b - centroid.b, 2)
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = index;
          }
        });

        clusters[closestCentroid].push(pixel);
      });

      // Update centroids
      clusters.forEach((cluster, index) => {
        if (cluster.length > 0) {
          centroids[index] = {
            r: cluster.reduce((sum, p) => sum + p.r, 0) / cluster.length,
            g: cluster.reduce((sum, p) => sum + p.g, 0) / cluster.length,
            b: cluster.reduce((sum, p) => sum + p.b, 0) / cluster.length
          };
        }
      });
    }

    return centroids;
  }

  // Generate accessible color palette
  generateAccessiblePalette(brandColor: string): TeamColors {
    const baseHsl = this.rgbToHsl(this.hexToRgb(brandColor));
    
    return {
      primary: brandColor,
      secondary: this.rgbToHex(this.hslToRgb({
        h: baseHsl.h,
        s: Math.max(10, baseHsl.s - 20),
        l: Math.min(80, baseHsl.l + 20)
      })),
      accent: this.rgbToHex(this.hslToRgb({
        h: (baseHsl.h + 30) % 360,
        s: baseHsl.s,
        l: baseHsl.l
      })),
      text: this.adjustForReadability('#000000', brandColor),
      background: this.rgbToHex(this.hslToRgb({
        h: baseHsl.h,
        s: Math.max(5, baseHsl.s - 40),
        l: Math.min(95, baseHsl.l + 40)
      }))
    };
  }
}

export const colorMapper = new ColorMapper();
