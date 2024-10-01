import * as THREE from 'three';

//общие функции (для всех пунктов меню)
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

//удаление объектов сцены
export function deleteSceneObjects(scene) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];

    if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Group)) {
      scene.remove(obj);
    }
  }
}
