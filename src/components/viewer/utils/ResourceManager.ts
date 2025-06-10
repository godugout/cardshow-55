
import * as THREE from 'three';

export class ResourceManager {
  private static instance: ResourceManager;
  private geometries = new Set<THREE.BufferGeometry>();
  private materials = new Set<THREE.Material>();
  private textures = new Set<THREE.Texture>();
  private meshes = new Set<THREE.Mesh>();

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  register(resource: THREE.BufferGeometry | THREE.Material | THREE.Texture | THREE.Mesh) {
    if (resource instanceof THREE.BufferGeometry) {
      this.geometries.add(resource);
    } else if (resource instanceof THREE.Material) {
      this.materials.add(resource);
    } else if (resource instanceof THREE.Texture) {
      this.textures.add(resource);
    } else if (resource instanceof THREE.Mesh) {
      this.meshes.add(resource);
    }
  }

  dispose(resource?: THREE.BufferGeometry | THREE.Material | THREE.Texture | THREE.Mesh) {
    if (resource) {
      this.disposeResource(resource);
      return;
    }

    // Dispose all resources
    this.geometries.forEach(geo => this.disposeResource(geo));
    this.materials.forEach(mat => this.disposeResource(mat));
    this.textures.forEach(tex => this.disposeResource(tex));
    this.meshes.forEach(mesh => this.disposeResource(mesh));

    this.geometries.clear();
    this.materials.clear();
    this.textures.clear();
    this.meshes.clear();
  }

  private disposeResource(resource: any) {
    try {
      if (resource.dispose) {
        resource.dispose();
      }
      if (resource.geometry?.dispose) {
        resource.geometry.dispose();
      }
      if (resource.material?.dispose) {
        resource.material.dispose();
      }
    } catch (error) {
      console.warn('Error disposing resource:', error);
    }
  }

  getMemoryUsage() {
    return {
      geometries: this.geometries.size,
      materials: this.materials.size,
      textures: this.textures.size,
      meshes: this.meshes.size
    };
  }
}
