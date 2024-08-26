import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { initScene } from '../ThreeJSScene/ThreeJSScene';
import { createBasic1Objects } from '../basic1/Basic1Objects';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { handleCubeClick, createDecals, createLineToCentresOfGeometry } from '../basic1/Basic1Functions';

const { Sider } = Layout;

// значения клавиш меню
const items = [
  { key: '1', label: 'Basic 1' },
  { key: '2', label: 'Basic 2' },
  { key: '3', label: 'Basic 3' },
];

const App = () => {
  const [selectedObject, setSelectedObject] = useState(
    // JSON.parse(localStorage.getItem("selectedObject")) || 
    '1'); //записать его в локал сторадж заразу
  const [sceneReady, setSceneReady] = useState(false);
  const sceneParamsRef = useRef(null);

  useEffect(() => {
    // инициализация сцены
    const { scene, camera, renderer } = initScene();
    const controls = new OrbitControls(camera, renderer.domElement);

    sceneParamsRef.current = { scene, camera, renderer, controls };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      setSceneReady(true);
    };

    animate();

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

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // удаление старых мешей добавление новых
    const { scene } = sceneParamsRef.current || {};

    if (!scene) return; // Ждём пока сцена инициализируется

    // Удаляем все объекты из сцены. Важно: не использовать для сложных сцен с освещением, хэлперами и проч
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Выбираем объекты для сцены на основе selectedObject
    if (selectedObject === '1' || selectedObject === '2' || selectedObject === '3' || selectedObject === '4') {

      const createdObjects = createBasic1Objects(scene.environment);
      // Добавляем переданные объекты в сцену
      createdObjects.forEach(obj => scene.add(obj));

    } else if (selectedObject === '5') {
      // console.log(selectedObject)

      const createdObjects = createBasic1Objects(scene.environment);
      // Объекты не меняются
      createdObjects.forEach(obj => scene.add(obj));

    } else if (selectedObject === '6') {

      // объекты для третьей сцены

    }

  }, [selectedObject]);

  // обработка клика
  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  console.log(selectedObject)

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

        if ( clickedObject instanceof THREE.Object3D ) { // проверка является ли это Object3D

          // selectedObject === '2' ? handleCubeClick(clickedObject) :
          // selectedObject === '1' ? (  // передан первый эл массива с информацией о пересечениях
          //   createDecals(intersects[0]) !== null && scene.add(createDecals(intersects[0])) // если клик попадет по грани, createDecals вернет null
          // ) :
          // selectedObject === '3' ? console.log() :
          // selectedObject === '4' ? console.log() :
          // selectedObject === '5' ? console.log() :
          // selectedObject === '6' ? console.log() : console.log();
          console.log(selectedObject, 'вторая проверка selectedObject перед выбором функ')
          if (selectedObject === '3') {
            console.log('clicked 3')
            handleCubeClick(clickedObject);
          } else if (selectedObject === '2') {
            console.log('clicked 2')
            // передан первый эл массива с информацией о пересечениях
            // если клик попадет по грани, createDecals вернет null
            createDecals(intersects[0]) !== null && scene.add(createDecals(intersects[0])) 

          } else if (selectedObject === '1') { //TODO поменять значения обратно
            console.log('clicked 1');
            createDecals(intersects[0]) !== null && scene.add(createLineToCentresOfGeometry(intersects[0]));
          } else {
            console.log('Функция для другого пункта меню');
          }
        }

      }
    }
  };



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
            console.log(e.key, 'значение выбранной клавиши записывается в SelectedObject')
            setSelectedObject(e.key)
            // localStorage.setItem("selectedObject", JSON.stringify(selectedObject))
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
