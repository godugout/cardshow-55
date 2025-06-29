
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
};

global.IntersectionObserver = global.IntersectionObserver || class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
};

// Mock URL.createObjectURL for file handling tests
if (typeof URL.createObjectURL === 'undefined') {
  global.URL.createObjectURL = () => 'mock-url';
  global.URL.revokeObjectURL = () => {};
}

// Mock canvas context for tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype.getContext || function(contextId: string) {
    if (contextId === '2d') {
      return {
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
      };
    }
    return null;
  };
}

export {};
