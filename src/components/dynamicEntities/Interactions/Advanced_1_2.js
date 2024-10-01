import * as THREE from 'three';
import { getIntersectedObject } from '../DinamicFunctions';
import { makeCircleVisualisation } from '../Objects/CircleVisualisation';
import { makeBoxVisualisation } from '../Objects/BoxVisualisation';

// Функция, вызываемая при движении указателя мыши
export function moveRollOverMesh(rollOverMesh, scene, camera, event = null, lifting) {

  const intersect = getIntersectedObject(event, scene, camera);

  if (!intersect || intersect.length === 0) {
    return;
  }
  // Логика перемещения rollOverMesh
  rollOverMesh.position.copy(intersect[0].point);
  rollOverMesh.position.y = rollOverMesh.position.y + lifting;
}

export function calculateIntersectionCircleArea(circle, plane) {
  const radius = circle.geometry.parameters.radius;
  const Smax = Math.PI * radius * radius;
  //начальное значение равно максимально возможной площади пересечения
  let intersectionArea = Smax;
  console.log(Smax, 'Smax')

  //центр шара
  const x0 = circle.position.x;
  const y0 = circle.position.y;
  const z0 = circle.position.z;
  const halfPlaneWidth = plane.geometry.parameters.width / 2;

  //определение выхода сферы за границы плоскости
  //если положение точки, увеличенной на радиус окружности,
  //дальше половины плоскости, значит окружность вышла за пределы плоскости
  let intersectX = (x0 >= 0) ? (x0 + radius) : (Math.abs(x0 - radius));
  let intersectY = (y0 >= 0) ? (y0 + radius) : (Math.abs(y0 - radius));
  let intersectZ = (z0 >= 0) ? (z0 + radius) : (Math.abs(z0 - radius));

  //вариант нахождения сферы отдельно от плоскости не рассчитывается поскольку сфера перемещается относительно плоскости
  //если сфера выходит за границы плоскости частично, нужно понять происходит ли сечение окружности хордой или сегментом
  if (intersectX >= halfPlaneWidth || intersectZ >= halfPlaneWidth || intersectY >= halfPlaneWidth) {
    console.log('сфера вышла за границы плоскости');
    //определим считать площадь для круга, ограниченного прямой или двумя прямыми
    //сдвиг только по x или только по z
    if ((intersectX >= halfPlaneWidth && z0 === 0) || (intersectZ >= halfPlaneWidth && x0 === 0)) {
      //формула вычисления площади для круга, отсеченного одной прямой
      //S = (1/2) * R^2 * (α - sin(α))
      // Угол α в радианах
      const alpha = Math.acos(Math.min(1, Math.max(-1, radius / (radius + intersectX - halfPlaneWidth))));
      intersectionArea = 0.5 * radius * radius * (alpha - Math.sin(alpha));
    } else {
      //формула вычисления площади для круга, отсеченного двумя прямыми
      //TODO ниже расчет неверный
      const effectiveRadius = radius - (halfPlaneWidth - Math.abs(intersectX));
      const segmentHeight = effectiveRadius > 0 ? effectiveRadius : 0; // минимальная высота сегмента

      if (segmentHeight > 0) {
        const alpha1 = Math.acos(Math.min(1, segmentHeight / radius));
        const segmentArea1 = 0.5 * radius * radius * (alpha1 - Math.sin(alpha1));

        const alpha2 = Math.acos(Math.min(1, (radius - effectiveRadius) / radius));
        const segmentArea2 = 0.5 * radius * radius * (alpha2 - Math.sin(alpha2));

        intersectionArea = Smax - (segmentArea1 + segmentArea2);
      }
    }
  }
  return intersectionArea;
}

//TODO разобраться с расчетом ниже, он ошибочный
function calculateIntersectionBoxArea(cube, landscape) {
  let totalArea = 0;

  const plane = new THREE.Plane(); // Плоскость для верхней грани куба
  const vertices = landscape.geometry.attributes.position.array; // Вершины ландшафта

  // Получаем грани куба для поиска пересечения
  const cubeTopFace = getTopFaceOfCube(cube);

  for (let i = 0; i < vertices.length; i += 3) {
      const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);

      // Проверка, находится ли вершина внутри проекции куба на плоскость XY
      if (isInsideCubeProjection(vertex, cube)) {
          // Луч направлен вверх, перпендикулярно плоскости XY
          const ray = new THREE.Ray(vertex, new THREE.Vector3(0, 1, 0));

          // Находим пересечение луча с верхней гранью куба
          const intersectionPoint = rayIntersectPlane(ray, cubeTopFace);

          if (intersectionPoint) {
              // Здесь создаем треугольники и суммируем их площадь
              const triangle = createTriangleFromIntersection(vertex, intersectionPoint);
              const area = calculateTriangleArea(triangle);
              totalArea += area;
          }
      }
  }

  console.log('Total intersection area:', totalArea);
  return totalArea;
}

// Получаем верхнюю грань куба как плоскость
function getTopFaceOfCube(cube) {
  const cubeBoundingBox = new THREE.Box3().setFromObject(cube);
  const topY = cubeBoundingBox.max.y;

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -topY); // Плоскость верхней грани
  return plane;
}

// Проверка, находится ли вершина внутри проекции куба на плоскость XY
function isInsideCubeProjection(vertex, cube) {
  const cubeBoundingBox = new THREE.Box3().setFromObject(cube);
  return (vertex.x >= cubeBoundingBox.min.x && vertex.x <= cubeBoundingBox.max.x) &&
         (vertex.z >= cubeBoundingBox.min.z && vertex.z <= cubeBoundingBox.max.z);
}

// Пересечение луча с плоскостью
function rayIntersectPlane(ray, plane) {
  const intersectionPoint = new THREE.Vector3();
  ray.intersectPlane(plane, intersectionPoint);
  return intersectionPoint;
}

// Создание треугольника из точки ландшафта и точки пересечения
function createTriangleFromIntersection(vertex, intersectionPoint) {
  const pointA = vertex.clone();
  const pointB = intersectionPoint.clone();
  const pointC = new THREE.Vector3(vertex.x + 0.1, vertex.y, vertex.z); // Пример для упрощения

  return [pointA, pointB, pointC];
}

// Вычисление площади треугольника по трём точкам
function calculateTriangleArea(triangle) {
  const [A, B, C] = triangle;
  const AB = new THREE.Vector3().subVectors(B, A);
  const AC = new THREE.Vector3().subVectors(C, A);
  const areaVector = new THREE.Vector3().crossVectors(AB, AC);

  return 0.5 * areaVector.length();
}
//TODO разобраться с подсчетом выше

export function createOrChangeMesh(clickedObject, intersect, scene, type) { //type='circle' или 'box
  if (clickedObject.geometry instanceof THREE.PlaneGeometry) {
    const point = intersect.point;
    let mesh = null;
    const lift = type === 'circle' ? 0.001 : 0;

    // Проверяем, есть ли уже объект с именем 'circle' в сцене
    const existingMesh = scene.getObjectByName(type);

    if (existingMesh) {
      // Если объект уже существует, меняем его позицию
      existingMesh.position.set(point.x, point.y + lift, point.z);
    } else {
      // Если объект не найден, создаем новый
      mesh = type === 'circle' ? makeCircleVisualisation(0x0000FF) : makeBoxVisualisation(0x0000FF);
      mesh.name = type;
      mesh.position.set(point.x, point.y + lift, point.z);
      scene.add(mesh);
    }

    // Рассчитаем площадь пересечения окружности с плоскостью
    const intersectionArea = type === 'circle' ?
    calculateIntersectionCircleArea(existingMesh || mesh, clickedObject) :
    calculateIntersectionBoxArea(existingMesh || mesh, clickedObject) ;
    console.log('Площадь пересечения:', intersectionArea);
  } else {
    console.log('There is no plane clicked');
  }
}
