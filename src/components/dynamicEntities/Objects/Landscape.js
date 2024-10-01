import * as THREE from 'three';

const width = 2048;
const height = 2048;
const maxHeight = 20;
const segments = 100;

export function createLandscape() {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

  const positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const heightValue = Math.random() * maxHeight; // Генерация высоты от 0 до 20
    positionAttribute.setZ(i, heightValue);
  }
  positionAttribute.needsUpdate = true;

  // Вычисление нормалей для более плавного отображения
  geometry.computeVertexNormals();

  // Применение материала Lambert
  const material = new THREE.MeshLambertMaterial({ color: 0x88cc88, side: THREE.DoubleSide });

  const landscape = new THREE.Mesh(geometry, material);
  landscape.rotation.x = -Math.PI / 2;

  // Добавление источника света для LambertMaterial
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 50, 50);
  landscape.add(light);

  return landscape;
}


