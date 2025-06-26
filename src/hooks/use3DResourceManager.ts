
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface ResourceTracker {
  geometries: Set<THREE.BufferGeometry>;
  materials: Set<THREE.Material>;
  textures: Set<THREE.Texture>;
  objects: Set<THREE.Object3D>;
}

export const use3DResourceManager = () => {
  const resourcesRef = useRef<ResourceTracker>({
    geometries: new Set(),
    materials: new Set(),
    textures: new Set(),
    objects: new Set()
  });

  const trackGeometry = useCallback((geometry: THREE.BufferGeometry) => {
    resourcesRef.current.geometries.add(geometry);
    return geometry;
  }, []);

  const trackMaterial = useCallback((material: THREE.Material) => {
    resourcesRef.current.materials.add(material);
    return material;
  }, []);

  const trackTexture = useCallback((texture: THREE.Texture) => {
    resourcesRef.current.textures.add(texture);
    return texture;
  }, []);

  const trackObject = useCallback((object: THREE.Object3D) => {
    resourcesRef.current.objects.add(object);
    return object;
  }, []);

  const disposeGeometry = useCallback((geometry: THREE.BufferGeometry) => {
    geometry.dispose();
    resourcesRef.current.geometries.delete(geometry);
  }, []);

  const disposeMaterial = useCallback((material: THREE.Material) => {
    if (Array.isArray(material)) {
      material.forEach(m => m.dispose());
    } else {
      material.dispose();
    }
    resourcesRef.current.materials.delete(material);
  }, []);

  const disposeTexture = useCallback((texture: THREE.Texture) => {
    texture.dispose();
    resourcesRef.current.textures.delete(texture);
  }, []);

  const disposeObject = useCallback((object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) disposeGeometry(child.geometry);
        if (child.material) disposeMaterial(child.material);
      }
    });
    resourcesRef.current.objects.delete(object);
  }, [disposeGeometry, disposeMaterial]);

  const disposeAll = useCallback(() => {
    // Dispose all tracked resources
    resourcesRef.current.geometries.forEach(geometry => geometry.dispose());
    resourcesRef.current.materials.forEach(material => {
      if (Array.isArray(material)) {
        material.forEach(m => m.dispose());
      } else {
        material.dispose();
      }
    });
    resourcesRef.current.textures.forEach(texture => texture.dispose());
    resourcesRef.current.objects.forEach(object => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    });

    // Clear all sets
    resourcesRef.current.geometries.clear();
    resourcesRef.current.materials.clear();
    resourcesRef.current.textures.clear();
    resourcesRef.current.objects.clear();
  }, []);

  const getResourceCount = useCallback(() => {
    return {
      geometries: resourcesRef.current.geometries.size,
      materials: resourcesRef.current.materials.size,
      textures: resourcesRef.current.textures.size,
      objects: resourcesRef.current.objects.size
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disposeAll();
    };
  }, [disposeAll]);

  return {
    trackGeometry,
    trackMaterial,
    trackTexture,
    trackObject,
    disposeGeometry,
    disposeMaterial,
    disposeTexture,
    disposeObject,
    disposeAll,
    getResourceCount
  };
};
