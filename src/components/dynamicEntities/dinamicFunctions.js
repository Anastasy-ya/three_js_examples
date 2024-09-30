import * as THREE from 'three';
import { makeCircleVisualisation } from '../DynamicEntities/DinamicObjects'


// Advanced 1
// function calculateIntersectionArea(circle, plane) {
//   const planeWidth = plane.geometry.parameters.width;
//   const halfPlaneWidth = planeWidth / 2;
//   const radius = circle.geometry.parameters.radius;
//   let intersectionArea = 0;
//   const Smax = Math.PI * radius * radius;

//   //центр шара
//   const x0 = circle.position.x;
//   const y0 = circle.position.y;
//   const z0 = circle.position.z;

//   //определение выхода сферы за границы плоскости
//   let intersectX = 0;
//   if (x0 >= 0) {
//     intersectX = x0 + radius
//   } else {
//     intersectX = Math.abs(x0 - radius)
//   }

//   // всегда будет удовлетворять условиям, но пусть будет на случай,
//   // если понадобится двигать сферу во всех плоскостях
//   let intersectY = 0;
//   if (y0 >= 0) {
//     intersectY = y0 + radius
//   } else {
//     intersectY = Math.abs(y0 - radius)
//   }

//   let intersectZ = 0;
//   if (z0 >= 0) {
//     intersectZ = z0 + radius
//   } else {
//     intersectZ = Math.abs(z0 - radius)
//   }

//   //вариант нахождения сферы отдельно от плоскости не рассчитывается поскольку сфера перемещается относительно плоскости
//   //если сфера выходит за границы плоскости частично, нужно понять происходит ли сечение окружности хордой или сегментом
//   if (intersectX >= halfPlaneWidth || intersectZ >= halfPlaneWidth || intersectY >= halfPlaneWidth) {
//     console.log('сфера вышла за границы плоскости');
//     //определим считать площадь для круга, ограниченного прямой или двумя прямыми
//     //сдвиг только по x или только по z
//     if ((intersectX >= halfPlaneWidth && z0 === 0) || (intersectZ >= halfPlaneWidth && x0 === 0)) {
//       //формула вычисления площади для круга, отсеченного одной прямой
//       //не понятно как считать углы S = (1/2) * R^2 * (α - sin(α))
//       intersectionArea = 'считать по формуле вычисления площади части круга, отрезанного хордой'
//     }
//     //формула вычисления площади для круга, отсеченного двумя прямыми
//     //как рассчитать уменьшенный диаметр круга для сегмента в случае, если он занимает меньше 25%? А если он еще и сдвинут?
//     intersectionArea = 'вычислять площадь сегмента с уменьшением диаметра и вычитать получившееся значение из общей плоскости'
//   } else intersectionArea = Smax; // если шар внутри плоскости, получим максимально возможную площадь пересечения
//   return intersectionArea;
// }

// function findPlanes(scene) {
//   let planes = [];

//   scene.traverse((object) => {
//     if (object.isMesh && object.geometry instanceof THREE.PlaneGeometry) {
//       planes.push(object);
//     }
//   });

//   return { planes };
// }

// Функция, вызываемая при движении указателя мыши
export function moveRollOverMesh(rollOverMesh, scene, camera, event = null) {

  const intersect = getIntersectedObject(event, scene, camera);

  if (!intersect || intersect.length === 0) {
    return;
  }
  // Логика перемещения rollOverMesh
  rollOverMesh.position.copy(intersect[0].point);
  rollOverMesh.position.y = rollOverMesh.position.y + 0.01;
}

export const getIntersectedObject = (event, scene, camera) => {
  //приостановить перемещение до загрузки сцены
  if (!scene) return;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Преобразуем координаты клика в нормализованные координаты устройства
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera); // Устанавливаем луч от камеры

  // Возвращаем пересечения с объектами в сцене
  return raycaster.intersectObjects(scene.children);
};

export function createOrChangeCircle(clickedObject, intersect, scene) {
  if (clickedObject.geometry instanceof THREE.PlaneGeometry) {
    const point = intersect.point;
    let circle = null;

    // Проверяем, есть ли уже объект с именем 'circle' в сцене
    const existingCircle = scene.getObjectByName('circle');

    if (existingCircle) {
      // Если объект уже существует, меняем его позицию
      existingCircle.position.set(point.x, point.y + 0.001, point.z);
    } else {
      // Если объект не найден, создаем новый
      circle = makeCircleVisualisation(0x0000FF);
      circle.name = 'circle';
      circle.position.set(point.x, point.y + 0.001, point.z);
      // Круг находится под визуализацией
      scene.add(circle);
    }

    // Рассчитаем площадь пересечения окружности с плоскостью
    const intersectionArea = calculateIntersectionArea(existingCircle || circle, clickedObject);
    console.log('Площадь пересечения:', intersectionArea);
  } else {
    console.log('There is no plane clicked');
  }
}

//удаление объектов сцены
export function deleteSceneObjects(scene) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];

    if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Group)) {
      scene.remove(obj);
    }
  }
}

/////////////////////////
export function calculateIntersectionArea(circle, plane) {
  const radius = circle.geometry.parameters.radius;
  const Smax = Math.PI * radius * radius;
  //начальное значение равно максимально возможной площади пересечения
  let intersectionArea = Smax;
  console.log(Smax, 'Smax')

  // const center = circle.position;
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
      // intersectionArea = 'считать по формуле вычисления площади части круга, отрезанного хордой'
    } else {
      //формула вычисления площади для круга, отсеченного двумя прямыми
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

    //как рассчитать уменьшенный диаметр круга для сегмента в случае, если он занимает меньше 25%? А если он еще и сдвинут?
    // intersectionArea = 'вычислять площадь сегмента с уменьшением диаметра и вычитать получившееся значение из общей плоскости'
  }
  return intersectionArea;
}





