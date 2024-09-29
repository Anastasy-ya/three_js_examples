import * as THREE from 'three';
import { generateUVs } from '../Interactions/GenerateUVs';

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

  // Генерация UV-координат для текстуры
  generateUVs(geometry);

  objects.push(geometry);

  return objects;
}

// Генерация шестиугольников generateUVs makeTexture
//TODO разобраться с зонами ответственности функций
export function generateHexGrid(planeSize, hexRadius, helper, textureMaterial) {
  //формула для вычисления высоты правильного шестиугольника корень из 3 * радиус
  const hexHeight = Math.sqrt(3) * hexRadius; // Высота шестиугольника
  const hexWidth = 2 * hexRadius; // Ширина шестиугольника
  const offsetX = hexWidth * 0.75; // Смещение по X
  const offsetY = hexHeight; // Смещение по Y

  //создаю переменные вне цикла for TODO создавать в зависимости от helper, если хэлпер не включен, переменные не нужны, но и в цикле несколько раз создавать нет смысла
  const [hexGeometry] = createHexagon(hexRadius, helper);
  // применение текстуры, временное решение, TODO переделать в применение по клику
  const material = textureMaterial || new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
  // console.log(material, 'material')
  const materialHelper = new THREE.LineBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

  const hexGroup = new THREE.Group(); // Группа для всех шестиугольников
  //начина с отрицательных значений для крайней точки плоскости по осям
  // до положительного значения крайней точки с шагом смещения
  let string = 1;//counter
  for (let x = (-planeSize / 2); x < planeSize / 2 + hexRadius; x += offsetX) {
    string += 1;
    // Смещение по Y для четных строк чтобы замостить всю плоскость
    // перенесено из второго цикла чтобы уменьшить кол-во операций
    const shiftY = string % 2 === 0 ? offsetY / 2 : 0;

    for (let y = (-planeSize / 2) + hexRadius / 2; y < planeSize / 2 + hexRadius; y += offsetY) {
      const mesh = new THREE.Mesh(hexGeometry, material);

      mesh.position.set(x, y - shiftY, 5);
      // второй параметр сдвигает каждый четный ряд,
      // последний параметр поднимает шестиугольники над плоскостью чтобы они не совпадали с ней
      hexGroup.add(mesh);

      if (helper) {//TODO вынести в отдельную ф-ю
        const edgesGeometry = new THREE.EdgesGeometry(hexGeometry);
        const line = new THREE.LineSegments(edgesGeometry, materialHelper);
        line.position.set(x, y - shiftY, 5);
        hexGroup.add(line);
      }
    }
  }
  hexGroup.rotation.x = -Math.PI / 2; // Поворот всей группы по оси X

  return hexGroup;
}
