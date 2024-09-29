import * as THREE from 'three';

export function makeGlassMaterial(environmentTexture) {
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 0,
    roughness: 0,
    transmission: 1.0, // прозрачность
    thickness: 5, // Толщина стекла
    envMap: environmentTexture, // Текстура окружения для отражений
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  return glassMaterial;
}


