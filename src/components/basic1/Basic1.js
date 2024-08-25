import * as THREE from 'three';

// const colors = [
//   0xff0000,
//   0x00ff00,
//   0x0000ff,
//   0xffff00,
//   0xff00ff,
// ];

// const materials = [

// ];
// // Функция для получения случайного индекса из массива
// function getRandom(array) {
//   const randomIndex = Math.floor(Math.random() * array.length);
//   return array[randomIndex];
// }


////////////////

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material1 = new THREE.MeshPhysicalMaterial({
//   color: 0xffffff,
//   transparent: true,
// opacity: 0.8,
// refraction: 1.52,
// roughness: 0.1,
// metalness: 0,
// clearcoat: 0.5,
// clearcoatRoughness: 0.1
  color: 0xffffff,
  transparent: true,
  opacity: 0.8, // 80% прозрачности
  roughness: 0.1, // Гладкая поверхность
  metalness: 0.0,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1
});
const cube1 = new THREE.Mesh(geometry, material1);
cube1.position.x = -1.5;
// cube1.castShadow = true;
// cube1.receiveShadow = true;

// MeshPhysicalMaterial: Для более реалистичных металлических
const material2 = new THREE.MeshBasicMaterial({
  color: 0x808080,
  // roughness: 0.5,
  // metalness: 0.7,
});
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 1.5;

const cubes = [cube1, cube2];

export default cubes;

