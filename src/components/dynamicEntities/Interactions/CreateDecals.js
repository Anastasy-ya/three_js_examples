import * as THREE from 'three';

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
