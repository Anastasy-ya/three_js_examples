import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { initScene } from '../ThreeJSScene/ThreeJSScene';
import { createBasic1Objects } from '../basic1/Basic1Objects';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { handleCubeClick } from '../basic1/Basic1Functions';

const { Sider } = Layout;

// значения клавиш меню
const items = [
  { key: '1', label: 'Basic 1' },
  { key: '2', label: 'Basic 2' },
  { key: '3', label: 'Basic 3' },
];

const App = () => {
  const [selectedObject, setSelectedObject] = useState('1');
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
    if (selectedObject === '1') {
      const createdObjects = createBasic1Objects(scene.environment);
      // Добавляем переданные объекты в сцену
      createdObjects.forEach(obj => scene.add(obj));
    } else if (selectedObject === '2') {
      // const geometry = new THREE.BoxGeometry(100, 100, 100);
      // const material = new THREE.MeshLambertMaterial({ color: 0x361D2E });
      // const cube = new THREE.Mesh(geometry, material);
      // cube.castShadow = true;

      // scene.add(cube);
    }

  }, [selectedObject]);

  // обработка клика
  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  const onClick = (event) => {
    if (sceneParamsRef.current) { // Используем sceneParamsRef для доступа к текущей сцене и камере
      const { scene, camera } = sceneParamsRef.current; // Деструктуризация нужных объектов
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
  
      // Преобразуем координаты клика в нормализованные координаты устройства (NDC)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera); // Устанавливаем луч от камеры на основании положения мыши
  
      const intersects = raycaster.intersectObjects(scene.children); // Пересекаем все объекты в сцене
  
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object; // Получаем объект, на который кликнули
        handleCubeClick(clickedObject); // Вызываем функцию обработки клика, передавая объект
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
          onClick={(e) => setSelectedObject(e.key)}
          defaultSelectedKeys={['1']}
          theme="dark"
          items={items}
          style={{ width: '200px' }}
        />
      </Sider>
    </Layout>
  );
};

export default App;
