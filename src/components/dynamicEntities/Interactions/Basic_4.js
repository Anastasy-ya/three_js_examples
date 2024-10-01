import * as THREE from 'three';

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
