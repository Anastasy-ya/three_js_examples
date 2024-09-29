import * as THREE from 'three';

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
