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
    intersection.point.x + intersection.face.normal.x * 10,
    intersection.point.y + intersection.face.normal.y * 10,
    intersection.point.z + intersection.face.normal.z * 10
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
export function changeSizeAsDistance(intersection, scene, setIsUpdated) {
  const clickedObject = intersection.object; // Получаем объект, по которому кликнули

  if (!intersection.face || !intersection.face.normal) {
    console.log('Intersection does not have a valid face normal.');
    return null;
  }

  // Получаем центр кликнутого объекта
  const cubeCenter = clickedObject.position;

  // Вычисляем расстояние от точки клика до центра объекта
  const distance = intersection.point.distanceTo(cubeCenter);

  // Определяем второй куб (предполагается, что он один из объектов сцены)
  const secondCube = scene.children.find(obj => obj !== clickedObject && obj.isMesh);

  if (secondCube) {
    console.log('запущена функция изменения размера');
    // Устанавливаем размеры второго куба равными расстоянию
    secondCube.scale.set(distance, distance, distance);
    // Пересчитываем boundingBox для правильного отображения (если это требуется)
    secondCube.updateMatrixWorld();
    setIsUpdated(true)
    // Возвращаем второй куб и, возможно, декаль
    // return [clickedObject, secondCube];//
  } else {
    console.log('Second cube not found.');
    return null;
  }
}