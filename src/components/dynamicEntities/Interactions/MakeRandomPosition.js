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


export function makeRandomPosition(scene, camera) {

  const cameraPosition = camera.position.clone();
  console.log(cameraPosition, 'cameraPosition')

  scene.traverse((object) => {
    if (object.isMesh && object.geometry.type === 'BoxGeometry') {
      updateCubePosition(object, cameraPosition);
    }
  });
}
