import * as THREE from 'three';

// Функция для создания куба с закругленными углами
function createRoundedBoxGeometry(width, height, depth, radius, smoothness) {
  const shape = new THREE.Shape();
  const eps = 0.00001;
  const radius0 = radius - eps;

  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: Math.max(smoothness, 2),
    steps: 1,
    bevelSize: radius0,
    bevelThickness: radius,
    curveSegments: Math.max(smoothness, 2),
  });

  geometry.center();

  return geometry;
}

export function createBasic1Objects(environmentTexture) {
  const objects = [];

  // Создание геометрии с закругленными углами
  const glassGeometry = createRoundedBoxGeometry(100, 100, 100, 10 / 3, 2); // Радиус скругления = 10, плавность = 10

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 'black',
    metalness: 0,
    roughness: 0,
    transmission: 1.0, // прозрачность
    thickness: 5, // Толщина стекла
    envMap: environmentTexture, // Текстура окружения для отражений
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const glassMesh1 = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh1.castShadow = true;
  glassMesh1.receiveShadow = true;
  glassMesh1.position.x = -100;
  glassMesh1.name = 'стекло со скосом граней';

  // Обычный куб
  const geometry = new THREE.BoxGeometry(100, 100, 100);

  const material2 = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    opacity: 0.5,
    transmission: 0.8,
    ior: 1.5
  });
  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  cube2.position.x = 100;
  cube2.name = 'обычный куб';

  objects.push(glassMesh1, cube2);

  return objects;
}
