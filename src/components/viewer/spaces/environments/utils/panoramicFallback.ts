
import * as THREE from 'three';

export const createPanoramicFallback = (): THREE.Texture => {
  console.warn('⚠️ Using enhanced gradient fallback due to error');
  
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Create sophisticated gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.3, '#16213e');
  gradient.addColorStop(0.7, '#0f3460');
  gradient.addColorStop(1, '#533483');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);
  
  // Add some stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const size = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const fallbackTexture = new THREE.CanvasTexture(canvas);
  fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
  
  return fallbackTexture;
};
