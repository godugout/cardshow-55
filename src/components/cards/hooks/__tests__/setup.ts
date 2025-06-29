
// Browser-compatible test setup without jsdom
// Using native browser APIs available in the test environment

// Setup for vitest browser environment
import { beforeAll, afterEach } from 'vitest';

beforeAll(() => {
  // Setup any global test configuration here
  console.log('Test environment setup complete');
});

afterEach(() => {
  // Cleanup after each test
  document.body.innerHTML = '';
});

// Mock implementations for testing
global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
} as any;

global.IntersectionObserver = global.IntersectionObserver || class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [0];
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
} as any;

// Mock URL.createObjectURL for file handling tests
if (typeof URL.createObjectURL === 'undefined') {
  global.URL.createObjectURL = () => 'mock-url';
  global.URL.revokeObjectURL = () => {};
}

// Mock canvas context for tests
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextId: string, options?: any) {
    if (contextId === '2d') {
      return {
        canvas: this,
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        putImageData: () => {},
        createImageData: () => ({ data: new Uint8ClampedArray(4) }),
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
        getContextAttributes: () => ({}),
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
      } as any;
    }
    return originalGetContext?.call(this, contextId as any, options) || null;
  };
}

// Test utility functions
export const createMockFile = (name: string = 'test.jpg', type: string = 'image/jpeg'): File => {
  return new File(['test content'], name, { type });
};

export const createMockUploadedImage = (id: string = '1'): any => ({
  id,
  file: createMockFile(`test${id}.jpg`),
  preview: `blob:test${id}`,
});

export const createMockDetectedCard = (id: string = 'card-1'): any => ({
  id,
  confidence: 0.9,
  originalImageId: '1',
  originalImageUrl: `blob:original${id}`,
  croppedImageUrl: `blob:cropped${id}`,
  bounds: { x: 0, y: 0, width: 100, height: 140 },
  metadata: { 
    detectedAt: new Date('2024-01-01T00:00:00.000Z'),
    processingTime: 500,
    cardType: 'Pokemon' 
  },
});

export {};
