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

// Объекты для первых трех пунктов меню
export function createBasic123Objects(environmentTexture) {
  const objects = [];

  // Создание геометрии с закругленными углами
  const glassGeometry = createRoundedBoxGeometry(100, 100, 100, 10 / 3, 2); // Радиус скругления = 10, плавность = 10

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

  const glassMesh1 = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh1.castShadow = true;
  glassMesh1.receiveShadow = true;
  glassMesh1.position.x = -100;
  glassMesh1.name = 'куб со скруглением граней';

  // Обычный куб
  const geometry = new THREE.BoxGeometry(100, 100, 100);

  const material2 = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    opacity: 0.1, // Уменьшаем непрозрачность
    transmission: 0.9, // Увеличиваем прозрачность
    ior: 1.5,
    roughness: 0.2, // шероховатость для матового эффекта
    metalness: 0.0, // Отсутствие металлического блеска
    clearcoat: 0.0, // Отсутствие прозрачного верхнего слоя
    clearcoatRoughness: 0.2 // Шероховатость прозрачного слоя
  });
  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  cube2.position.x = 100;
  cube2.name = 'куб';

  objects.push(glassMesh1, cube2);

  return objects;
}

class Cube {
  constructor(x, y, z, color, name) {
    this.geometry = new THREE.BoxGeometry(100, 100, 100);
    // this.geometry2 = this.geometry.clone();
    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      opacity: 0.1,
      transmission: 0.9,
      ior: 1.5,
      roughness: 0.2,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.2
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.mesh.name = name;
  }
}

export function createBasic4Objects() {
  const cubes = [];
  // cubes.push(new Cube(-300, 0x00ffff));
  cubes.push(new Cube(-150, 0, 0, 0x00ffff, 'box_1').mesh);
  cubes.push(new Cube(150, 0, 0, 0xffff00, 'box_2').mesh);
  return cubes;
}

export function createBasic5Objects() {
  const cubes = [];
  cubes.push(new Cube(0, 0, 0, 0x00ffff, 'box_1').mesh);//blue
  cubes.push(new Cube(100, 0, 100, 0x66cdaa, 'box_2').mesh);//green
  cubes.push(new Cube(100, 0, 100, 0xe3256b, 'box_3').mesh);
  return cubes;
}

///////////////////////////////////

// Объекты для 4 пункта меню
// export function createBasic4Objects() {
//   const geometry = new THREE.BoxGeometry(100, 100, 100);
//   //создается копия геометрии чтобы кубы имели разные geometry.attributes.position
//   const geometry2 = geometry.clone();

//   const material1 = new THREE.MeshPhysicalMaterial({
//     color: 0x00ffff,
//     opacity: 0.1,
//     transmission: 0.9,
//     ior: 1.5,
//     roughness: 0.2,
//     metalness: 0.0,
//     clearcoat: 0.0,
//     clearcoatRoughness: 0.2
//   });
//   const cube1 = new THREE.Mesh(geometry, material1);
//   cube1.name = 'cube1blue';
//   cube1.position.x = -150;

//   const material2 = new THREE.MeshPhysicalMaterial({ color: 0x0000ff });
//   const cube2 = new THREE.Mesh(geometry2, material2);
//   cube2.name = 'cube2green';
//   cube2.position.x = 150;

//   const cubes = [cube1, cube2];

//   return cubes;
// }


