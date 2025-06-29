import type { DetectedRegion } from '@/types/crdmkr';

interface EdgePoint {
  x: number;
  y: number;
  strength: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export class HeuristicDetector {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async detectRegions(imageElement: HTMLImageElement): Promise<DetectedRegion[]> {
    console.log('🔍 Starting heuristic detection...');
    
    this.setupCanvas(imageElement);
    
    const regions: DetectedRegion[] = [];
    
    // Fast geometric detection
    const rectangles = this.detectRectangles();
    const textBlocks = this.detectTextBlocks();
    const imageAreas = this.detectImageAreas();
    
    // Convert to DetectedRegion format
    regions.push(...rectangles.map(rect => this.rectangleToRegion(rect, 'border')));
    regions.push(...textBlocks.map(block => this.rectangleToRegion(block, 'text')));
    regions.push(...imageAreas.map(area => this.rectangleToRegion(area, 'photo')));
    
    // Remove overlapping regions
    return this.removeOverlappingRegions(regions);
  }

  private setupCanvas(imageElement: HTMLImageElement) {
    this.canvas.width = imageElement.naturalWidth;
    this.canvas.height = imageElement.naturalHeight;
    this.ctx.drawImage(imageElement, 0, 0);
  }

  private detectRectangles(): Rectangle[] {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const edges = this.detectEdges(imageData);
    
    return this.findRectangularShapes(edges);
  }

  private detectEdges(imageData: ImageData): EdgePoint[] {
    const { data, width, height } = imageData;
    const edges: EdgePoint[] = [];
    const threshold = 30;
    
    // Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Convert to grayscale
        const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        
        // Calculate gradients
        const gx = this.getGradientX(data, x, y, width);
        const gy = this.getGradientY(data, x, y, width);
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        
        if (magnitude > threshold) {
          edges.push({
            x,
            y,
            strength: magnitude
          });
        }
      }
    }
    
    return edges;
  }

  private getGradientX(data: Uint8ClampedArray, x: number, y: number, width: number): number {
    const getGray = (px: number, py: number) => {
      const idx = (py * width + px) * 4;
      return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    };
    
    return (
      -1 * getGray(x - 1, y - 1) +
      -2 * getGray(x - 1, y) +
      -1 * getGray(x - 1, y + 1) +
      1 * getGray(x + 1, y - 1) +
      2 * getGray(x + 1, y) +
      1 * getGray(x + 1, y + 1)
    );
  }

  private getGradientY(data: Uint8ClampedArray, x: number, y: number, width: number): number {
    const getGray = (px: number, py: number) => {
      const idx = (py * width + px) * 4;
      return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    };
    
    return (
      -1 * getGray(x - 1, y - 1) +
      -2 * getGray(x, y - 1) +
      -1 * getGray(x + 1, y - 1) +
      1 * getGray(x - 1, y + 1) +
      2 * getGray(x, y + 1) +
      1 * getGray(x + 1, y + 1)
    );
  }

  private findRectangularShapes(edges: EdgePoint[]): Rectangle[] {
    const rectangles: Rectangle[] = [];
    const minArea = 1000; // Minimum area threshold
    
    // Group edges into potential rectangles using clustering
    const clusters = this.clusterEdges(edges);
    
    for (const cluster of clusters) {
      const bounds = this.getBounds(cluster);
      
      if (bounds.width * bounds.height > minArea) {
        rectangles.push({
          ...bounds,
          confidence: this.calculateRectangleConfidence(cluster, bounds)
        });
      }
    }
    
    return rectangles;
  }

  private clusterEdges(edges: EdgePoint[]): EdgePoint[][] {
    const clusters: EdgePoint[][] = [];
    const visited = new Set<number>();
    const clusterRadius = 20;
    
    for (let i = 0; i < edges.length; i++) {
      if (visited.has(i)) continue;
      
      const cluster: EdgePoint[] = [];
      const queue = [i];
      
      while (queue.length > 0) {
        const currentIdx = queue.shift()!;
        if (visited.has(currentIdx)) continue;
        
        visited.add(currentIdx);
        cluster.push(edges[currentIdx]);
        
        // Find nearby edges
        for (let j = 0; j < edges.length; j++) {
          if (visited.has(j)) continue;
          
          const distance = Math.sqrt(
            Math.pow(edges[currentIdx].x - edges[j].x, 2) +
            Math.pow(edges[currentIdx].y - edges[j].y, 2)
          );
          
          if (distance < clusterRadius) {
            queue.push(j);
          }
        }
      }
      
      if (cluster.length > 10) {
        clusters.push(cluster);
      }
    }
    
    return clusters;
  }

  private getBounds(points: EdgePoint[]): { x: number; y: number; width: number; height: number } {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private calculateRectangleConfidence(cluster: EdgePoint[], bounds: Rectangle): number {
    const perimeter = 2 * (bounds.width + bounds.height);
    const edgeStrength = cluster.reduce((sum, point) => sum + point.strength, 0) / cluster.length;
    
    // Higher confidence for stronger edges and more complete rectangles
    return Math.min((cluster.length / perimeter) * (edgeStrength / 100), 1.0);
  }

  private detectTextBlocks(): Rectangle[] {
    // Detect text regions using connected component analysis
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const textRegions = this.findTextRegions(imageData);
    
    return textRegions;
  }

  private findTextRegions(imageData: ImageData): Rectangle[] {
    const { data, width, height } = imageData;
    const textRegions: Rectangle[] = [];
    
    // Convert to binary image (text is typically high contrast)
    const binary = new Uint8Array(width * height);
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const pixelIdx = i / 4;
      
      // Threshold for text detection
      binary[pixelIdx] = gray < 128 ? 1 : 0;
    }
    
    // Find connected components
    const components = this.findConnectedComponents(binary, width, height);
    
    for (const component of components) {
      const bounds = this.getBounds(component.map(idx => ({
        x: idx % width,
        y: Math.floor(idx / width),
        strength: 1
      })));
      
      // Filter by aspect ratio typical for text
      const aspectRatio = bounds.width / bounds.height;
      if (aspectRatio > 1.5 && aspectRatio < 10 && bounds.width > 20 && bounds.height > 8) {
        textRegions.push({
          ...bounds,
          confidence: 0.7
        });
      }
    }
    
    return textRegions;
  }

  private findConnectedComponents(binary: Uint8Array, width: number, height: number): number[][] {
    const visited = new Set<number>();
    const components: number[][] = [];
    
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === 1 && !visited.has(i)) {
        const component = this.floodFill(binary, i, width, height, visited);
        if (component.length > 50) { // Minimum size for text
          components.push(component);
        }
      }
    }
    
    return components;
  }

  private floodFill(binary: Uint8Array, start: number, width: number, height: number, visited: Set<number>): number[] {
    const component: number[] = [];
    const queue = [start];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      
      visited.add(current);
      component.push(current);
      
      const x = current % width;
      const y = Math.floor(current / width);
      
      // Check 8-connected neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          const neighborIdx = ny * width + nx;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
              binary[neighborIdx] === 1 && !visited.has(neighborIdx)) {
            queue.push(neighborIdx);
          }
        }
      }
    }
    
    return component;
  }

  private detectImageAreas(): Rectangle[] {
    // Detect smooth regions that likely contain photos
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const smoothRegions = this.findSmoothRegions(imageData);
    
    return smoothRegions;
  }

  private findSmoothRegions(imageData: ImageData): Rectangle[] {
    const { data, width, height } = imageData;
    const smoothRegions: Rectangle[] = [];
    const blockSize = 16;
    
    // Analyze image in blocks
    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        const variance = this.calculateBlockVariance(data, x, y, blockSize, width);
        
        // Low variance indicates smooth regions (photos)
        if (variance < 500) {
          smoothRegions.push({
            x,
            y,
            width: blockSize,
            height: blockSize,
            confidence: 1 - (variance / 1000)
          });
        }
      }
    }
    
    // Merge adjacent smooth regions
    return this.mergeAdjacentRegions(smoothRegions);
  }

  private calculateBlockVariance(data: Uint8ClampedArray, startX: number, startY: number, blockSize: number, width: number): number {
    let sum = 0;
    let count = 0;
    
    // Calculate mean
    for (let y = startY; y < startY + blockSize; y++) {
      for (let x = startX; x < startX + blockSize; x++) {
        const idx = (y * width + x) * 4;
        const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        sum += gray;
        count++;
      }
    }
    
    const mean = sum / count;
    
    // Calculate variance
    let variance = 0;
    for (let y = startY; y < startY + blockSize; y++) {
      for (let x = startX; x < startX + blockSize; x++) {
        const idx = (y * width + x) * 4;
        const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        variance += Math.pow(gray - mean, 2);
      }
    }
    
    return variance / count;
  }

  private mergeAdjacentRegions(regions: Rectangle[]): Rectangle[] {
    const merged: Rectangle[] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < regions.length; i++) {
      if (used.has(i)) continue;
      
      let mergedRegion = { ...regions[i] };
      used.add(i);
      
      // Find adjacent regions
      for (let j = i + 1; j < regions.length; j++) {
        if (used.has(j)) continue;
        
        if (this.areAdjacent(mergedRegion, regions[j])) {
          mergedRegion = this.mergeRectangles(mergedRegion, regions[j]);
          used.add(j);
        }
      }
      
      // Only keep regions above minimum size
      if (mergedRegion.width * mergedRegion.height > 2000) {
        merged.push(mergedRegion);
      }
    }
    
    return merged;
  }

  private areAdjacent(rect1: Rectangle, rect2: Rectangle): boolean {
    const threshold = 5;
    
    return (
      Math.abs(rect1.x + rect1.width - rect2.x) < threshold ||
      Math.abs(rect2.x + rect2.width - rect1.x) < threshold ||
      Math.abs(rect1.y + rect1.height - rect2.y) < threshold ||
      Math.abs(rect2.y + rect2.height - rect1.y) < threshold
    );
  }

  private mergeRectangles(rect1: Rectangle, rect2: Rectangle): Rectangle {
    const minX = Math.min(rect1.x, rect2.x);
    const minY = Math.min(rect1.y, rect2.y);
    const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      confidence: Math.max(rect1.confidence, rect2.confidence)
    };
  }

  private rectangleToRegion(rect: Rectangle, type: DetectedRegion['type']): DetectedRegion {
    return {
      id: `heuristic-${Date.now()}-${Math.random()}`,
      type,
      bounds: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      confidence: rect.confidence,
      layerIds: []
    };
  }

  private removeOverlappingRegions(regions: DetectedRegion[]): DetectedRegion[] {
    const filtered: DetectedRegion[] = [];
    
    for (const region of regions) {
      let shouldAdd = true;
      
      for (const existing of filtered) {
        const overlap = this.calculateOverlap(region.bounds, existing.bounds);
        
        // If significant overlap, keep the one with higher confidence
        if (overlap > 0.5) {
          if (region.confidence <= existing.confidence) {
            shouldAdd = false;
            break;
          } else {
            // Remove the existing one
            const index = filtered.indexOf(existing);
            filtered.splice(index, 1);
          }
        }
      }
      
      if (shouldAdd) {
        filtered.push(region);
      }
    }
    
    return filtered;
  }

  private calculateOverlap(bounds1: DetectedRegion['bounds'], bounds2: DetectedRegion['bounds']): number {
    const x1 = Math.max(bounds1.x, bounds2.x);
    const y1 = Math.max(bounds1.y, bounds2.y);
    const x2 = Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width);
    const y2 = Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const overlapArea = (x2 - x1) * (y2 - y1);
    const area1 = bounds1.width * bounds1.height;
    const area2 = bounds2.width * bounds2.height;
    
    return overlapArea / Math.min(area1, area2);
  }

  dispose() {
    // Cleanup resources
  }
}

// Singleton instance
export const heuristicDetector = new HeuristicDetector();
