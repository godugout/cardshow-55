
import * as THREE from 'three';

export const createCardMaterials = (
  frontTexture: THREE.Texture,
  backTexture: THREE.Texture
): THREE.Material[] => {
  // Enhanced edge material with metallic properties
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
    side: THREE.DoubleSide,
    envMapIntensity: 1.0
  });

  // Front material with enhanced properties
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    side: THREE.DoubleSide,
    transparent: false,
    roughness: 0.3,
    metalness: 0.1
  });

  // Back material with dark background
  const backgroundCanvas = document.createElement('canvas');
  backgroundCanvas.width = 512;
  backgroundCanvas.height = 512;
  const ctx = backgroundCanvas.getContext('2d')!;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 512, 512);
  
  // Draw logo in center
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const logoSize = 200;
    const x = (512 - logoSize) / 2;
    const y = (512 - logoSize) / 2;
    ctx.drawImage(img, x, y, logoSize, logoSize);
  };
  img.src = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';

  const backMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.CanvasTexture(backgroundCanvas),
    side: THREE.DoubleSide,
    transparent: false,
    roughness: 0.4,
    metalness: 0.2
  });

  // Array of materials for BoxGeometry faces: [+X, -X, +Y, -Y, +Z, -Z]
  return [
    edgeMaterial, // Right edge (+X)
    edgeMaterial, // Left edge (-X)  
    edgeMaterial, // Top edge (+Y)
    edgeMaterial, // Bottom edge (-Y)
    frontMaterial, // Front face (+Z)
    backMaterial  // Back face (-Z)
  ];
};
