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

  console.log(distance, 'distance');

  // Узнаем старые размеры объекта
  const box = new THREE.Box3().setFromObject(secondCube);
  const size = new THREE.Vector3().subVectors(box.max, box.min);
  console.log(size, 'старый размер');

  if (secondCube.geometry.isBufferGeometry) {
    const positionAttribute = secondCube.geometry.attributes.position;

    // Находим коэффициенты масштабирования для каждого измерения
    const scaleX = size.x === 0 ? '' : distance / size.x; //проверка деления на ноль
    const scaleY = size.y === 0 ? '' : distance / size.y;
    const scaleZ = size.z === 0 ? '' : distance / size.z;

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

    setIsUpdated(true);
  }
}