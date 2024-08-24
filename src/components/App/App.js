import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import * as THREE from 'three';

const { Content, Sider } = Layout;

const ThreeJSScene = ({ updateObjects }) => {
  const sceneContainerRef = useRef(null); // Ссылка на DOM-элемент
  const sceneRef = useRef(null); // Ссылка на объекты Three.js
  const [initialized, setInitialized] = useState(false); // Отслеживание инициализации сцены

  useEffect(() => {
    if (initialized) {
      
      return;
    } else {

      console.log('сцена инициирована')
      // Инициализация сцены Three.js
      const scene = new THREE.Scene(); // Создаем сцену
      scene.background = new THREE.Color(0x8DADB2);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Настраиваем камеру
      const renderer = new THREE.WebGLRenderer(); // Создаем рендерер

      renderer.setSize(window.innerWidth, window.innerHeight); // Устанавливаем размер рендерера
      sceneContainerRef.current.appendChild(renderer.domElement); // Добавляем рендерер в DOM-элемент

      camera.position.z = 5; // Устанавливаем начальное положение камеры

      // Сохраняем ссылки на scene, camera и renderer в ref для последующего использования
      sceneRef.current = { scene, camera, renderer };

      const animate = function () {
        requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации
        renderer.render(scene, camera); // Рендерим сцену с текущей камерой
      };

      animate(); // Запускаем анимацию
      setInitialized(true); // Устанавливаем флаг, что сцена инициализирована
    }


  }, [initialized]);

  console.log(sceneContainerRef, 'содержимое сцены')


  useEffect(() => {
    
    if (initialized && sceneRef.current) {
      // Обновляем объекты в сцене, когда изменяется состояние
      console.log(`обновлены объекты`);
      updateObjects(sceneRef.current.scene);
    }
  }, [initialized, updateObjects]);

  return (
    <div className='threejs_scene' ref={sceneContainerRef} style={{ width: '80%', height: '100vh' }} />
  );
};

const App = () => {
  const [selectedObject, setSelectedObject] = useState('1'); // Отслеживание выбранного объекта

  // Функция для обновления объектов в сцене
  const updateObjects = (scene) => {
    // Удаляем все предыдущие объекты из сцены
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Добавляем новые объекты в сцену в зависимости от выбранного состояния
    if (selectedObject === '1') {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0xCBC0AD });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    } else if (selectedObject === '2') {
      const geometry = new THREE.SphereGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x361D2E });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    }
  };

  const items = [
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' },
    { key: '3', label: 'Option 3' },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider>
        <Menu
          mode="inline"
          onClick={(e) => setSelectedObject(e.key)} // Обновляем состояние при выборе элемента меню
          defaultSelectedKeys={['1']}
          theme="dark"
          items={items}
        />
      </Sider>
      <Layout>
        <Content>
          <ThreeJSScene updateObjects={updateObjects} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
