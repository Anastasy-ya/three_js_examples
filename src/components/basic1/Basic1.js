import * as THREE from 'three';

export function createGlassObjects(environmentTexture) {
  const objects = [];

  // Создание стеклянного объекта
  const glassGeometry = new THREE.SphereGeometry(100, 64, 64);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 0,
    roughness: 0,
    transmission: 1.0, // Это свойство делает материал прозрачным
    thickness: 5, // Толщина стекла
    envMap: environmentTexture, // Текстура окружения для отражений
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh.castShadow = true;
  glassMesh.receiveShadow = true;

  objects.push(glassMesh);

  return objects;
}
