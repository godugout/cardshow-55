
import * as THREE from 'three';

export const createProceduralFallback = (): THREE.Texture => {
  console.warn('⚠️ Creating procedural fallback environment');
  
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Create sophisticated gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#2a2a3a');
  gradient.addColorStop(0.3, '#1a1a2e');
  gradient.addColorStop(0.7, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);
  
  // Add subtle stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const size = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const fallbackTexture = new THREE.CanvasTexture(canvas);
  fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
  
  return fallbackTexture;
};
