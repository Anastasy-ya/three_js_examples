import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import cubes from '../basic1/Basic1';
import ThreeJSScene from '../ThreeJSScene/ThreeJSScene';

const { Content, Sider } = Layout;

// const ThreeJSScene = ({ updateObjects, initialized, sceneContainerRef, sceneRef, setInitialized }) => {
  

//   useEffect(() => {
//     if (!initialized) {
//       const scene = new THREE.Scene();
//       scene.background = new THREE.Color(0x8DADB2);

//       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       camera.position.set(1, 1, 3.5);
//       camera.lookAt(0, 0, 0);

//       const renderer = new THREE.WebGLRenderer();
//       renderer.setSize(window.innerWidth, window.innerHeight);

//       sceneContainerRef.current.appendChild(renderer.domElement);

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;

//       const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
//       directionalLight1.position.set(0, 0, 5);
//       scene.add(directionalLight1);

//       const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
//       directionalLight2.position.set(5, 0, 0);
//       scene.add(directionalLight2);

//       sceneRef.current = { scene, camera, renderer };

//       const animate = function () {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };

//       animate();
//       setInitialized(true);
//     }

//     const handleResize = () => {
//       if (sceneRef.current) {
//         const { camera, renderer } = sceneRef.current;
//         const width = window.innerWidth;
//         const height = window.innerHeight;

//         renderer.setSize(width, height);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [initialized]);

//   useEffect(() => {
//     if (initialized && sceneRef.current) {
//       updateObjects(sceneRef.current.scene);
//     }
//   }, [initialized, updateObjects]);

//   return <div className='threejs_scene' ref={sceneContainerRef} style={{ width: '80%', height: '100vh' }} />;
// };

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
      if (cube) {
        cube.scale.set(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cube.material.color.setHex(Math.random() * 0xffffff);
      }
    };

    const onClick = (event) => {
      if (sceneRef.current) {
        const { scene, camera } = sceneRef.current;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(cubesRef.current);

        if (intersects.length > 0) {
          const clickedCubeIndex = cubesRef.current.indexOf(intersects[0].object);
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
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' },
    { key: '3', label: 'Option 3' },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider style={{ position: 'fixed' }}>
        <Menu
          mode="inline"
          onClick={(e) => setSelectedObject(e.key)}
          defaultSelectedKeys={['1']}
          theme="dark"
          items={items}
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

