import * as THREE from 'three';

export function makeFrostedGlass(color) {
  const fostedGlass = new THREE.MeshPhysicalMaterial({
  color: color,
  opacity: 0.1,
  transmission: 0.9,
  ior: 1.5,
  roughness: 0.2, // шероховатость
  metalness: 0.0,
  clearcoat: 0.0, // Отсутствие прозрачного верхнего слоя
  clearcoatRoughness: 0.2 // Шероховатость
});
return fostedGlass;
}
