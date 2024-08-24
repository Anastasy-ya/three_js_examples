import React, { useRef, useEffect, useState } from 'react';
// import './App.css';
// import { Layout, Menu } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import cubes from '../basic1/Basic1';

// const { Content, Sider } = Layout;

const ThreeJSScene = ({ updateObjects, initialized, sceneContainerRef, sceneRef, setInitialized }) => {
  

  useEffect(() => {
    if (!initialized) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x8DADB2);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(1, 1, 3.5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      sceneContainerRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight1.position.set(0, 0, 5);
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
      directionalLight2.position.set(5, 0, 0);
      scene.add(directionalLight2);

      sceneRef.current = { scene, camera, renderer };

      const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
      setInitialized(true);
    }

    const handleResize = () => {
      if (sceneRef.current) {
        const { camera, renderer } = sceneRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialized]);

  useEffect(() => {
    if (initialized && sceneRef.current) {
      updateObjects(sceneRef.current.scene);
    }
  }, [initialized, updateObjects]);

  return <div className='threejs_scene' ref={sceneContainerRef} style={{ width: '80%', height: '100vh' }} />;
};

export default ThreeJSScene;