import * as THREE from 'three';

// Basic 1
export const handleCubeClick = (cube) => {

  if (cube) {
    cube.scale.set(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    cube.material.color.setHex(Math.random() * 0xffffff);
  }
};

// Basic 2
export const createDecals = (intersection) => {
  if (!intersection.face || !intersection.face.normal) {
    console.log('Intersection does not have a valid face normal.');
    return null;  // Возвращаем null, чтобы предотвратить дальнейшую обработку
  }

  // Создание декали
  const decalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const decalGeometry = new THREE.PlaneGeometry(1, 1);
  const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);

  // Проекция декали на поверхность
  decalMesh.position.copy(intersection.point);
  decalMesh.lookAt(intersection.point.clone().add(intersection.face.normal));
  //поворачивает декаль так, чтобы она была перпендикулярна поверхности объекта, на которую она проецируется.

  // Создание линии
  const lineGeometry = new THREE.BufferGeometry();
  const points = new Float32Array([ //создается массив из шести чисел, представляющих две точки в трехмерном пространстве: начальная и конечная точка
    intersection.point.x, intersection.point.y, intersection.point.z,
    intersection.point.x + intersection.face.normal.x * 1,
    intersection.point.y + intersection.face.normal.y * 1,
    intersection.point.z + intersection.face.normal.z * 1
  ]);

  // задает атрибуты геометрии для линии, используя точки, которые были определены выше
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  return line;
};

// Basic 3
export function createLineToCentresOfGeometry(intersection) {

  const { object } = intersection;

  if (!intersection.face || !intersection.face.normal) {
    console.log('Intersection does not have a valid face normal.');
    return null;  // Возвращаем null, чтобы предотвратить дальнейшую обработку
  }

  // Создание декали
  const decalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const decalGeometry = new THREE.PlaneGeometry(1, 1);
  const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);

  // Проекция декали на поверхность
  decalMesh.position.copy(intersection.point);
  decalMesh.lookAt(intersection.point.clone().add(intersection.face.normal));
  //поворачивает декаль так, чтобы она была перпендикулярна поверхности объекта, на которую она проецируется.

  // Создание линии
  // Создаем материал для линии
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  // Функция для создания линии
  function createLine(startPoint, endPoint) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
      startPoint.x, startPoint.y, startPoint.z,
      endPoint.x, endPoint.y, endPoint.z
    ], 3));

    const line = new THREE.Line(geometry, lineMaterial);
    return line;
  }
  return createLine(intersection.point, object.position);
}

// Basic 4
export function changeSizeAsDistance(intersection, scene) {
  const clickedObject = intersection.object;

  if (!intersection.face || !intersection.face.normal) {
    console.log('Intersection does not have a valid face normal.');
    return null;
  }

  const cubeCenter = clickedObject.position;
  const distance = intersection.point.distanceTo(cubeCenter);

  const secondCube = scene.children.find(obj => obj !== clickedObject && obj.isMesh);

  if (!secondCube) {
    console.log('Second cube not found or same as clicked object.');
    return null;
  }

  console.log(distance, 'расстояние от клика до центра куба');

  // Узнаем старые размеры объекта
  const box = new THREE.Box3().setFromObject(secondCube);
  const size = new THREE.Vector3().subVectors(box.max, box.min);
  console.log(size, 'старый размер');

  if (secondCube.geometry.isBufferGeometry) {
    const positionAttribute = secondCube.geometry.attributes.position;

    // Находим коэффициенты масштабирования для каждого измерения
    const scaleX = size.x === 0 ? 0 : distance / size.x; //проверка деления на ноль
    const scaleY = size.y === 0 ? 0 : distance / size.y;
    const scaleZ = size.z === 0 ? 0 : distance / size.z;

    // Масштабирование вершин
    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setXYZ(
        i,
        positionAttribute.getX(i) * scaleX,
        positionAttribute.getY(i) * scaleY,
        positionAttribute.getZ(i) * scaleZ
      );
    }

    positionAttribute.needsUpdate = true;
    secondCube.geometry.computeBoundingBox();

    // Получение нового размера
    const newBox = new THREE.Box3().setFromObject(secondCube);
    const newSize = new THREE.Vector3().subVectors(newBox.max, newBox.min);
    console.log(newSize, 'Новый размер');
  }
}

// Basic 5
export function makeChildren(cubes) {
  let parent = cubes[0];

  for (let i = 1; i < cubes.length; i++) {
    const child = cubes[i];
    parent.add(child);
    parent = child; // Следующий объект становится новым родителем
  }

  return cubes[0];
}

// Функция для генерации случайного числа в заданном диапазоне
function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

// функция для обновления позиции
function updateCubePosition(cube, cameraPosition) {
  cube.position.set(
    getRandomPosition(-10, 10),
    getRandomPosition(-10, 10),
    getRandomPosition(-10, 10)
  );
  const distanceToCamera = cube.position.distanceTo(cameraPosition);
  console.log(`Куб ${cube.name}: расстояние до камеры = ${distanceToCamera.toFixed(2)}`);
}


export function randomPosition(scene, camera) {

  const cameraPosition = camera.position.clone();
  console.log(cameraPosition, 'cameraPosition')

  scene.traverse((object) => {
    if (object.isMesh && object.geometry.type === 'BoxGeometry') {
      updateCubePosition(object, cameraPosition);
    }
  });
}

// Advanced 1
function calculateIntersectionArea(circle, plane) {
  const planeWidth = plane.geometry.parameters.width;
  const halfPlaneWidth = planeWidth / 2;
  const radius = circle.geometry.parameters.radius;
  let intersectionArea = 0;
  const Smax = Math.PI * radius * radius;

  //центр шара
  const x0 = circle.position.x;
  const y0 = circle.position.y;
  const z0 = circle.position.z;

  //определение выхода сферы за границы плоскости
  let intersectX = 0;
  if (x0 >= 0) {
    intersectX = x0 + radius
  } else {
    intersectX = Math.abs(x0 - radius)
  }

  // всегда будет удовлетворять условиям, но пусть будет на случай,
  // если понадобится двигать сферу во всех плоскостях
  let intersectY = 0;
  if (y0 >= 0) {
    intersectY = y0 + radius
  } else {
    intersectY = Math.abs(y0 - radius)
  }

  let intersectZ = 0;
  if (z0 >= 0) {
    intersectZ = z0 + radius
  } else {
    intersectZ = Math.abs(z0 - radius)
  }

  //вариант нахождения сферы отдельно от плоскости не рассчитывается поскольку сфера перемещается относительно плоскости
  //если сфера выходит за границы плоскости частично, нужно понять происходит ли сечение окружности хордой или сегментом
  if (intersectX >= halfPlaneWidth || intersectZ >= halfPlaneWidth || intersectY >= halfPlaneWidth) {
    console.log('сфера вышла за границы плоскости');
    //определим считать площадь для круга, ограниченного прямой или двумя прямыми
    //сдвиг только по x или только по z
    if ((intersectX >= halfPlaneWidth && z0 === 0) || (intersectZ >= halfPlaneWidth && x0 === 0)) {
      //формула вычисления площади для круга, отсеченного одной прямой
      //не понятно как считать углы S = (1/2) * R^2 * (α - sin(α))
      intersectionArea = 'считать по формуле вычисления площади части круга, отрезанного хордой'
    }
    //формула вычисления площади для круга, отсеченного двумя прямыми
    //как рассчитать уменьшенный диаметр круга для сегмента в случае, если он занимает меньше 25%? А если он еще и сдвинут?
    intersectionArea = 'вычислять площадь сегмента с уменьшением диаметра и вычитать получившееся значение из общей плоскости'
  } else intersectionArea = Smax; // если шар внутри плоскости, получим максимально возможную площадь пересечения
  return intersectionArea;
}

function findSpheres(scene) {
  let spheres = [];

  scene.traverse((object) => {
    if (object.isMesh && object.geometry instanceof THREE.SphereGeometry) {
      spheres.push(object);
    }
  });

  return { spheres };
}

function findPlanes(scene) {
  let planes = [];

  scene.traverse((object) => {
    if (object.isMesh && object.geometry instanceof THREE.PlaneGeometry) {
      planes.push(object);
    }
  });

  return { planes };
}

export function moveSphere(intersection, scene) {
  const point = intersection.point;

  if (!intersection.face || !intersection.face.normal) {
    console.log('Intersection does not have a valid face normal.');
    return null;
  }

  const { planes } = findPlanes(scene);
  const { spheres } = findSpheres(scene);

  if (spheres.length === 0) {
    console.log('No spheres found in the scene.');
    return;
  }

  if (planes.length === 0) {
    console.log('No planes found in the scene.');
    return;
  }

  spheres[0].position.set(point.x, 0, point.z);

  const intersectionArea = calculateIntersectionArea(spheres[0], planes[0]);
  console.log('Площадь пересечения:', intersectionArea);
}

// Advanced 3

// Функция для генерации UV-координат
// export function generateUVs(geometry, radius) {
//   const uvs = [];
//   const position = geometry.attributes.position;

//   for (let i = 0; i < position.count; i++) {
//     const x = position.getX(i);
//     const y = position.getY(i);

//     // Переводим координаты вершины в UV в диапазоне [0, 1]
//     const u = (x / (2 * radius)) + 0.5;
//     const v = (y / (Math.sqrt(3) * radius)) + 0.5;

//     uvs.push(u, v);
//   }
//   geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
// }

export function generateUVs(geometry) {
  const uvs = geometry.attributes.uv.array;

  // Размер нового массива (добавляем 2 элемента для первой вершины)
const newSize = uvs.length + 2;

// Создаем новый Float32Array
const newUVs = new Float32Array(newSize);

// Копируем старые UV-координаты в новый массив
newUVs.set(uvs);

// Добавляем первую вершину в конец нового массива
newUVs[newSize - 2] = uvs[0]; // U-координата первой вершины
newUVs[newSize - 1] = uvs[1]; // V-координата первой вершины

  console.log(geometry.attributes.uv, 'uvs')
  let minU = Infinity, maxU = -Infinity;
  let minV = Infinity, maxV = -Infinity;

  for (let i = 0; i < uvs.length; i += 2) {
    const u = uvs[i];
    const v = uvs[i + 1];
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }

  const rangeU = maxU - minU;
  const rangeV = maxV - minV;

  for (let i = 0; i < uvs.length; i += 2) {
    uvs[i] = (uvs[i] - minU) / rangeU;
    uvs[i + 1] = (uvs[i + 1] - minV) / rangeV;
  }

  geometry.attributes.uv.needsUpdate = true;
}





// export function makeTexture(intersection, baseColorImg, ambientOcclusImg, heightImg, normalMapImg, opacity, roughnessImg) {
//   // Загрузка текстуры
// const loadedTexture = new THREE.TextureLoader();

// const baseColorTexture = loadedTexture.load(baseColorImg);
// const ambientOcclusTexture = loadedTexture.load(ambientOcclusImg);
// const heightTexture = loadedTexture.load(heightImg);
// const normalTexture = loadedTexture.load(normalMapImg);
// const opacityTexture = loadedTexture.load(opacity);
// const roughnessTexture = loadedTexture.load(roughnessImg);




// // Настройка повторения текстуры
// loadedTexture.wrapS = THREE.RepeatWrapping;
// loadedTexture.wrapT = THREE.RepeatWrapping;

// // Настройка масштабирования текстуры
// loadedTexture.repeat.set(1, 1);

// // Создание материала с текстурой
// const material = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   map: loadedTexture,
//   side: THREE.DoubleSide
// });
// // console.log(material, 'material')
// return material;
// }

// export function makeTexture(
//   baseColorImg,
//   ambientOcclusImg,
//   heightImg,
//   normalMapImg,
//   opacityImg,
//   roughnessImg,
//   displacementScale = 1
// ) { //metalnessImg
//     // Создание загрузчика текстур
//     const textureLoader = new THREE.TextureLoader();

//     console.log(baseColorImg, ambientOcclusImg, heightImg, normalMapImg, opacityImg, roughnessImg, roughnessImg)

//     // Загрузка текстур
//     const baseColorTexture = textureLoader.load(baseColorImg);
//     const ambientOcclusTexture = textureLoader.load(ambientOcclusImg);
//     const heightTexture = textureLoader.load(heightImg);
//     const normalTexture = textureLoader.load(normalMapImg);
//     const opacityTexture = textureLoader.load(opacityImg);
//     const roughnessTexture = textureLoader.load(roughnessImg);
//     // const metalnessTexture = textureLoader.load(metalnessImg);

//     // Настройка повторения текстур
//     const textures = [baseColorTexture, ambientOcclusTexture, heightTexture, normalTexture, opacityTexture, roughnessTexture]; //, metalnessTexture
//     textures.forEach(texture => {
//         if (texture) {
//             texture.wrapS = THREE.RepeatWrapping;
//             texture.wrapT = THREE.RepeatWrapping;
//             texture.repeat.set(1, 1);
//         }
//     });

//     // console.log(!!opacityTexture, '!!opacityTexture')

//     // Создание материала с текстурами
//     const material = new THREE.MeshStandardMaterial({
//         map: baseColorTexture, // Основная текстура цвета
//         aoMap: ambientOcclusTexture, // Ambient Occlusion
//         displacementMap: heightTexture, // Карта высот
//         displacementScale: displacementScale, // Масштаб высот
//         normalMap: normalTexture, // Карта нормалей
//         roughnessMap: roughnessTexture, // Карта шероховатости
//         roughness: roughnessTexture ? 1 : undefined, // Если нет карты шероховатости, использовать значение по умолчанию
//         // metalnessMap: metalnessTexture, // Карта металлического эффекта
//         // metalness: metalnessTexture ? 1 : undefined, // Если нет карты металлическости, использовать значение по умолчанию
//         transparent: !!opacityTexture, //Приведение к булеву значению, если есть прозрачность, включить прозрачность (true)
//         alphaMap: opacityTexture, // Карта прозрачности
//         side: THREE.DoubleSide // Двойная сторона для рендеринга обеих сторон
//     });

//     return material;
// }

// baseColorImg, ambientOcclusImg, heightImg, normalMapImg, opacityImg, roughnessImg

//при использовании обязателен блок catch










export function makeTexture(
  baseColorImg,
  ambientOcclusImg = null,
  heightImg = null,
  normalMapImg = null,
  opacityImg = null,
  roughnessImg = null,
  metalnessImg = null,
  displacementScale = 0.2
) {
  const textureLoader = new THREE.TextureLoader();

  // console.log(baseColorImg, ambientOcclusImg, heightImg, normalMapImg, opacityImg, roughnessImg, roughnessImg, 'переменные текстур поступили  в makeTexture')

  // Загрузка текстур
  const baseColorTexture = textureLoader.load(baseColorImg);
  const ambientOcclusTexture = textureLoader.load(ambientOcclusImg);
  const heightTexture = textureLoader.load(heightImg);
  const normalTexture = textureLoader.load(normalMapImg);
  const opacityTexture = textureLoader.load(opacityImg);
  const roughnessTexture = textureLoader.load(roughnessImg);
  const metalnessTexture = textureLoader.load(metalnessImg);

  // Настройка повторения текстур
  const textures = [baseColorTexture, ambientOcclusTexture, heightTexture, normalTexture]; //, metalnessTexture, opacityTexture, roughnessTexture
  textures.forEach(texture => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    }
  });

  // Создание материала с текстурами
  // В случае изменения текстуры не нуждается в правке
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTexture,
    aoMap: ambientOcclusTexture,
    displacementMap: heightTexture, // требуют добавления сегментов чтобы изменить высоту
    displacementScale: displacementScale,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    roughness: roughnessTexture ? .5 : undefined,
    metalnessMap: metalnessTexture,
    metalness: metalnessTexture ? 1 : undefined, // Если нет карты opacityTexture, использовать значение по умолчанию
    // transparent: !!opacityTexture, //Приведение к булеву значению, если есть прозрачность, включить прозрачность (true)
    // alphaMap: opacityTexture,
    side: THREE.DoubleSide
  });

  return material;

}
