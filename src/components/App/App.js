import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { initScene } from '../ThreeJSScene/ThreeJSScene';
import { createBasic123Objects, createBasic4Objects } from '../dynamicObjects/dinamicObjects';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { handleCubeClick, createDecals, createLineToCentresOfGeometry, changeSizeAsDistance } from '../dynamicObjects/dinamicFunctions';

const { Sider } = Layout;

// значения клавиш меню
const items = [
  { key: '0', label: 'Free scene' },
  { key: '1', label: 'Basic 1' },
  { key: '2', label: 'Basic 2' },
  { key: '3', label: 'Basic 3' },
  { key: '4', label: 'Basic 4' },
];

const App = () => {
  const [selectedObject, setSelectedObject] = useState('0');
  const [sceneReady, setSceneReady] = useState(false);
  const sceneParamsRef = useRef(null);
  const [changedObjs, setChangedObjs] = useState(null);// для обновленных после использования функции объектов (base4)

  useEffect(() => {
    // инициализация сцены
    const { scene, camera, renderer } = initScene();
    console.log('сцена инициирована')
    const controls = new OrbitControls(camera, renderer.domElement);

    sceneParamsRef.current = { scene, camera, renderer, controls };
    console.log(sceneParamsRef.current, 'сцена записана в sceneParamsRef.current')

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneParamsRef.current.scene, sceneParamsRef.current.camera);
      // console.log('произошел перерендер')
      setSceneReady(true);
    };

    animate();

    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // функция, адаптирующая сцену под размер экрана
  const handleResize = () => {
    const { camera, renderer } = sceneParamsRef.current || {};

    if (camera && renderer) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // задержка срабатывания для предотвращения слишком частых срабатываний
      (function throttle() {
        setTimeout(() => {

          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();

        }, 500);
      }())

    } else {
      console.log('No sceneParams');
    }
  };

  useEffect(() => {
    console.log('сработал юзэффект для добавления новых объектову на сцену')
    // удаление старых мешей добавление новых
    const { scene } = sceneParamsRef.current || {};

    if (!scene) return; // Ждём пока сцена инициализируется

    // Удаляем все объекты из сцены. Важно: не использовать для сложных сцен с освещением, хэлперами и проч
    // попробовать Object.keys(scene.children).forEach(key => scene.remove(scene.children[key]));
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    let createdObjects = []

    // Выбираем объекты для сцены на основе selectedObject
    if (selectedObject === '1' || selectedObject === '2' || selectedObject === '3') {

      createdObjects = createBasic123Objects(scene.environment);
      // Добавляем переданные объекты в сцену
      
    } else if (selectedObject === '4') {

      // объекты изменены т.к. ExtrudeGeometry требует особого подхода
      // объекты создаются либо из измененных, либо из первоначальных
      createdObjects = changedObjs || createBasic4Objects();
      console.log(createdObjects[0].scale, createdObjects[1].scale, 'код отрабатывает как надо и размеры второго меша меняются, почему он не добавляется в сцену??????')
    };
    console.log('добавление в сцену объектов:', createdObjects)
    createdObjects.forEach(obj => scene.add(obj));
    //для 4 пункта нет смысла удалять все объекты и нужно перерендерить сцену после обновления объектов(но это не точно)

  }, [selectedObject, changedObjs]);

  // обработка клика и вызов последующей функции, определяемой выбранным пунктом меню
  const onClick = (event) => {
    if (sceneParamsRef.current) {
      const { scene, camera } = sceneParamsRef.current;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Преобразуем координаты клика в нормализованные координаты устройства
      // event.clientX и event.clientY содержат пиксельные координаты курсора 
      // мыши относительно левого и верхнего краев
      // Пиксельные координаты делятся на ширину и высоту окна соответственно, 
      // чтобы нормализовать их в диапазоне от 0 до 1. Это означает, 
      // что положение мыши в центре окна будет иметь x = 0.5 и y = 0.5.
      // Нормализованные значения затем умножаются на 2 и вычитается 1, чтобы 
      // масштабировать их до диапазона NDC от -1 до 1. Это гарантирует, 
      // что положение мыши представлено последовательно на разных размерах экрана
      // Координата y инвертируется, потому что начало системы координат NDC находится в нижнем левом углу
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera); // Устанавливаем луч от камеры на основании положения мыши

      const intersects = raycaster.intersectObjects(scene.children); // Пересекаем все объекты в сцене

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object; // Получаем объект, на который кликнули первым

        if (clickedObject instanceof THREE.Object3D) { // проверка является ли это Object3D

          if (selectedObject === '0') {

            // пустая сцена

          } else if (selectedObject === '1') {

            handleCubeClick(clickedObject); // функция изменения размера, цвета, поворота по клику

          } else if (selectedObject === '2') {

            // передан первый эл массива с информацией о пересечениях
            // если клик попадет по грани, createDecals вернет null
            createDecals(intersects[0]) !== null && scene.add(createDecals(intersects[0]))

          } else if (selectedObject === '3') {

            // лучи от клика к центру фигуры
            createDecals(intersects[0]) !== null && scene.add(createLineToCentresOfGeometry(intersects[0]));

          } else if (selectedObject === '4') {
            // Получаем массив измененных кубов и добавляем в стейт
            setChangedObjs(changeSizeAsDistance(intersects[0], scene));
          } else {
            console.log('Функция для другого пункта меню');
          }
        }

      }
    }
  };

  // обработка клика
  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject, changedObjs]);

  // Если сцена не загружена, показать спин
  if (!sceneReady) {
    return <Spin
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed'
      }}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 48,
          }}
          spin
        />
      }
    />;
  }

  // меню
  return (
    <Layout style={{ height: '100vh', position: 'fixed' }}>
      <Sider style={{ position: 'fixed' }}>
        <Menu
          mode="vertical"
          onClick={(e) => {
            setSelectedObject(e.key)
          }}
          selectedKeys={selectedObject}
          theme="dark"
          items={items}
          style={{ width: '200px' }}
        />
      </Sider>
    </Layout>
  );
};

export default App;
