import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import * as THREE from 'three';
import cubes from '../basic1/Basic1';
import ThreeJSScene from '../ThreeJSScene/ThreeJSScene';

const { Content, Sider } = Layout;

const App = () => {
  const sceneContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [selectedObject, setSelectedObject] = useState('1');
  const cubesRef = useRef(cubes);

  const updateObjects = (scene) => {
    // Удаляем все объекты из сцены
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    if (selectedObject === '1') {
      // Добавляем кубы из basic1
      cubesRef.current.forEach(cube => {
        scene.add(cube);
      });
    } else if (selectedObject === '2') {
      const geometry = new THREE.SphereGeometry();
      const material = new THREE.MeshLambertMaterial({ color: 0x361D2E });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    }
  };

  useEffect(() => {
    const handleCubeClick = (index) => {
      const cube = cubesRef.current[index];
      // Если куб существует, то изменяем его свойства
    if (cube) {
      // Устанавливаем случайный масштаб для куба
      cube.scale.set(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);

      // Устанавливаем случайное вращение для куба
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      // Устанавливаем случайный цвет для куба
      cube.material.color.setHex(Math.random() * 0xffffff);
    }
  };

  // Эта функция обрабатывает событие клика на сцену
  const onClick = (event) => {
    // Если сцена существует, то обрабатываем клик
    if (sceneRef.current) {
      // Получаем ссылки на сцену и камеру
      const { scene, camera } = sceneRef.current;

      // Создаем новый объект Raycaster для определения пересечения с объектами
      const raycaster = new THREE.Raycaster();

      // Создаем новый объект Vector2 для хранения координат мыши
      const mouse = new THREE.Vector2();

      // Устанавливаем координаты мыши в нормализованном виде
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Устанавливаем направление луча исходя из положения мыши и камеры
      raycaster.setFromCamera(mouse, camera);

      // Получаем массив объектов, пересеченных лучом
      const intersects = raycaster.intersectObjects(cubesRef.current);

      // Если есть пересечения, то обрабатываем клик на куб
      if (intersects.length > 0) {
        // Получаем индекс кликнутого куба
        const clickedCubeIndex = cubesRef.current.indexOf(intersects[0].object);

        // Вызываем функцию обработки клика на куб
        handleCubeClick(clickedCubeIndex);
        }
      }
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  const items = [
    { key: '1', label: 'Basic 1' },
    { key: '2', label: 'Basic 2' },
    { key: '3', label: 'Basic 3' },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider style={{ position: 'fixed' }}>
        <Menu
          mode="vertical"
          onClick={(e) => setSelectedObject(e.key)}
          defaultSelectedKeys={['1']}
          theme="dark"
          items={items}
          style={{ width: '200px'}}
        />
      </Sider>
      <Layout>
        <Content>
          <ThreeJSScene 
          updateObjects={updateObjects} 
          sceneContainerRef={sceneContainerRef}
          initialized={initialized}
          sceneRef={sceneRef}
        setInitialized={setInitialized}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

