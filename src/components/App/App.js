import React, { useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { initScene } from '../ThreeJSScene/ThreeJSScene';
import { createGlassObjects } from '../basic1/Basic1';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import Basic1 from '../basic1/Basic1';
import * as THREE from 'three';

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
  const [objects, setОbjects] = useState([]);
  const [sceneParams, setSceneParams] = useState(null);

  useEffect(() => {
    // инициализация сцены
    const { scene, camera, renderer } = initScene();

    const controls = new OrbitControls(camera, renderer.domElement);

    //добавление объектов
    // const createdObjects = createGlassObjects(scene.environment);
    // // обновление объектов
    // // updateObjects(scene, createdObjects);
    // setОbjects(createdObjects);
    // objects.forEach(obj => scene.add(obj));

    setSceneParams({ scene, camera, renderer, controls });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      setSceneReady(true);
    };

    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneParams) return; // Ждём пока сцена инициализируется

    const { scene } = sceneParams;
    // Удаляем все меши (объекты) из сцены
    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        scene.remove(child);
      }
    });

    // Выбираем объекты для сцены на основе selectedObject
    if (selectedObject === '1') {
      const createdObjects = createGlassObjects(scene.environment);
      // обновление объектов
      setОbjects(createdObjects);
      // Добавляем переданные объекты в сцену
      objects.forEach(obj => scene.add(obj));
      // setObjects(objects);
    } else if (selectedObject === '2') {
      // Создаем и добавляем куб в сцену
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshLambertMaterial({ color: 0x361D2E });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;

      scene.add(cube);
      // setObjects([cube]);
    }

  }, [selectedObject, objects]);


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
  );;
};

export default App;

