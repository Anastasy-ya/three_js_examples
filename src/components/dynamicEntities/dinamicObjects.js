import * as THREE from 'three';

//TODO вынести функции создания объектов во внешние файлы

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

// Объекты для первых трех пунктов меню basic1-3
export function createBasic123Objects(environmentTexture) {
  const objects = [];

  // Создание геометрии с закругленными углами
  const glassGeometry = createRoundedBoxGeometry(10, 10, 10, 2 / 3, 2); // Радиус скругления = 10, плавность = 10

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
  glassMesh1.position.x = -10;
  glassMesh1.name = 'куб со скруглением граней';

  // Обычный куб
  const geometry = new THREE.BoxGeometry(10, 10, 10);

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
  cube2.position.x = 10;
  cube2.name = 'куб';

  objects.push(glassMesh1, cube2);

  return objects;
}

class Cube {
  constructor(x, y, z, color, name) {
    this.geometry = new THREE.BoxGeometry(10, 10, 10);
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

//basic4
export function createBasic4Objects() {
  const cubes = [];
  cubes.push(new Cube(-15, 0, 0, 0x00ffff, 'box_1').mesh);
  cubes.push(new Cube(15, 0, 0, 0xffff00, 'box_2').mesh);
  return cubes;
}

//basic5
export function createBasic5Objects() {
  const cubes = [];
  cubes.push(new Cube(0, 0, 0, 0x00ffff, 'box_1').mesh);//blue
  cubes.push(new Cube(10, 0, 10, 0x66cdaa, 'box_2').mesh);//green
  cubes.push(new Cube(10, 0, 10, 0xe3256b, 'box_3').mesh);
  return cubes;
}

class Plane {
  constructor(color, name, side) {
    this.geometry = new THREE.PlaneGeometry(side, side);
    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      opacity: 0.1,
      transmission: 0.9,
      ior: 1.5,
      roughness: 0.2,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = name;
    this.mesh.rotation.x = Math.PI / 2;
  }
}
class Sphere {
  constructor(color, name, radius = 4, widthSegments = 32, heightSegments = 32) {
    this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      opacity: 0.1,
      transmission: 0.9,
      ior: 1.5,
      roughness: 0.2,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.2,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = name;
  }
}

//advanced1
export function createAdvance1Objects() {
  const objects = [];
  objects.push(new Plane(0x67595e, 'plane_1', 8).mesh);
  objects.push(new Sphere(0xa49393, 'sphere_1').mesh);
  return objects;
}

//advanced3

// Функция для создания хэлпера
// const createHelper = (shape) => {
//   const points = shape.getPoints();
//   const hexHelperGeometry = new THREE.BufferGeometry().setFromPoints(points);
//   // const material = new THREE.LineBasicMaterial({ color: 0xffffff });
//   // Создание линии-хэлпера
//   // const hexHelper = new THREE.Line(hexGeometry, material);
//   return hexHelperGeometry;
// };

// Функция для создания шестиугольника
function createHexagon(radius, helper) {
  const objects = [];
  //чтобы построить шестиугольник представим его как окружность,
  //все вершины шестиугольника располагаются на окружности
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    //Вычисляется угол для текущей вершины в радианах.
    const angle = (i / 6) * Math.PI * 2;
    //1я вершина 0 радиан, вторая 2П/6(60град) и далее с шагом 60 градусов
    const x = radius * Math.cos(angle);//по формуле вычисления координат точек на окружности
    const y = radius * Math.sin(angle);
    if (i === 0) {
      shape.moveTo(x, y);//в начало линии
    } else {
      shape.lineTo(x, y);//в след точку
    }
  }
  shape.closePath();

  const geometry = new THREE.ShapeGeometry(shape);
  objects.push(geometry);

  return objects;
}

// Генерация шестиугольников
function generateHexGrid(planeSize, hexRadius, helper) {
  //формула для вычисления высоты правильного шестиугольника корень из 3*радиус
  const hexHeight = Math.sqrt(3) * hexRadius; // Высота шестиугольника
  const hexWidth = 2 * hexRadius; // Ширина шестиугольника
  const offsetX = hexWidth * 0.75; // Смещение по X  * 0.75?
  const offsetY = hexHeight; // Смещение по Y

  //создаю переменные вне цикла for TODO создавать в зависимости от helper, если хэлпер не включен, переменные не нужны, но и в цикле несколько раз создавать нет смысла
  const [hexGeometry] = createHexagon(hexRadius, helper);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
  const materialHelper = new THREE.LineBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

  const hexGroup = new THREE.Group(); // Группа для всех шестиугольников
  //начина с отрицательных значений для крайней точки плоскости по осям
  // до положительного значения крайней точки с шагом смещения
  let string = 1;//counter
  for (let x = (-planeSize / 2); x < planeSize / 2 + hexRadius; x += offsetX) {
    string += 1;
    // Смещение по X для четных строк чтобы замостить всю плоскость
    // перенесено из второго цикла чтобы уменьшить кол-во итераций
    const shiftY = string % 2 === 0 ? offsetY / 2 : 0;

    for (let y = (-planeSize / 2) + hexRadius / 2; y < planeSize / 2 + hexRadius; y += offsetY) {
      const mesh = new THREE.Mesh(hexGeometry, material);


      mesh.position.set(x, y - shiftY, -5);
      // второй параметр сдвигает каждый четный ряд,
      // последний параметр поднимает шестиугольники над плоскостью чтобы они не совпадали с ней
      hexGroup.add(mesh);

      if (helper) {//TODO вынести в отдельную
        const edgesGeometry = new THREE.EdgesGeometry(hexGeometry);
        const line = new THREE.LineSegments(edgesGeometry, materialHelper);
        line.position.set(x, y - shiftY, -5);
        hexGroup.add(line);
      }
    }
  }
  hexGroup.rotation.x = Math.PI / 2; // Поворот всей группы по оси X

  return hexGroup;
}


export function createAdvance3Objects(planeSize, hexRadius, helper) {//helper=true/false
  const objects = [];
  objects.push(new Plane(0x67595e, 'plane_1', 2048).mesh);
  // сетка шестиугольников
  const hexGroup = generateHexGrid(planeSize, hexRadius, helper);//размер плоскости, радиус шестиугольника, наличие хэлпера
  objects.push(hexGroup);
  // console.log(objects, 'objects')
  return objects;
}



