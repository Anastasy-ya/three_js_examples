//разобраться с осями
// todo раскидать элементы по файлам
// разделить функции в interactions
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Layout, Menu, Spin, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { initScene } from '../ThreeJSScene/ThreeJSScene';
import {
  createBasic123Objects,
  createBasic4Objects,
  createBasic5Objects,
  createAdvance1Objects,
  createAdvance3Objects,
} from '../DynamicEntities/DinamicObjects.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getIntersectedObject } from '../DynamicEntities/DinamicFunctions.js';
import { makeTexture } from '../DynamicEntities/Materials/makeTexture.js';
import { makeChildren, makeRandomPosition } from '../DynamicEntities/Interactions/MakeRandomPosition.js';
import { handleCubeClick } from '../DynamicEntities/Interactions/HandleCubeClick.js';
import { createDecals } from '../DynamicEntities/Interactions/CreateDecals.js';
import { createLineToCentresOfGeometry } from '../DynamicEntities/Interactions/CreateLineToCentresOfGeometry.js';
import { changeSizeAsDistance } from '../DynamicEntities/Interactions/ChangeSizeAsDistance.js';
import { moveRollOverMesh } from '../DynamicEntities/DinamicFunctions.js';
import { makeCircleVisualisation } from '../DynamicEntities/DinamicObjects.js';
import { createOrChangeCircle } from '../DynamicEntities/DinamicFunctions.js';
// import { handlePointerMove } from '../DynamicEntities/DinamicFunctions.js';
import { deleteSceneObjects } from '../DynamicEntities/DinamicFunctions.js';

import { handleResize } from '../ThreeJSScene/HandleResize.js';

import baseColorImg from '../Assets/texture2/Rubber_Sole_003_basecolor.jpg';
import ambientOcclusImg from '../Assets/texture2/Rubber_Sole_003_ambientOcclusion.jpg';
import heightImg from '../Assets/texture2/Rubber_Sole_003_height.png';
import normalMapImg from '../Assets/texture2/Rubber_Sole_003_normal.jpg';

const { Sider } = Layout;

const App = () => {
  //выяснить почему у вновь созданного объекта цвет старого
  const [selectedObject, setSelectedObject] = useState('6'); //TODO поменять обратно на 0
  const [helperAdded, setHelperAdded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const sceneParamsRef = useRef(null);
  //инициализация текстуры для advanced 3-4 происходит здесь для передачи ей цикла анимации

  const handleCheckboxChange = (e) => {
    setHelperAdded(e.target.checked);
  };

  const menuItems = [
    { key: '0', label: 'Free scene' },
    { key: '1', label: 'Basic 1' },
    { key: '2', label: 'Basic 2' },
    { key: '3', label: 'Basic 3' },
    { key: '4', label: 'Basic 4' },
    { key: '5', label: 'Basic 5' },
    { key: '6', label: 'Advanced 1' },
    { key: '7', label: 'Advanced 2' },
    {
      key: '8', label: (
        <div>
          Advanced 3
          <Checkbox//вынести в отдельный компонент и поместить
            checked={helperAdded}
            onChange={handleCheckboxChange}
            style={{ marginLeft: 25, color: 'gray' }}
          >
            Сетка
          </Checkbox>
        </div>
      )
    },
    { key: '9', label: 'Advanced 4' }
  ];

  // инициализация сцены
  useEffect(() => {
    const { scene, camera, renderer } = initScene();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    sceneParamsRef.current = { scene, camera, renderer, controls };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    setSceneReady(true);

    window.addEventListener('resize', () => handleResize(sceneParamsRef));
    handleResize(sceneParamsRef);

    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', () => handleResize(sceneParamsRef));
    };
  }, []);

  // Функция-обработчик указателя
const handlePointerMove = (frameCount, rollOverMesh, scene, camera) => (event) => {
  frameCount++;
  if (frameCount % 4 !== 0) return;
  // Оптимизация, перехватываем каждый 4-й кадр

  if (!rollOverMesh) return;
  // Проверяем, что объект существует

  moveRollOverMesh(rollOverMesh, scene, camera, event);
  // Вызов перемещения
};


  // Добавление и удаление объектов
  useEffect(() => {
    const { scene, camera } = sceneParamsRef.current || {};
    if (!scene || !camera) return; // Ждём инициализации

    // Удаляем объекты из сцены
    deleteSceneObjects(scene);

    let createdObjects = [];
    let frameCount = 0; // Счётчик для оптимизации
    let pointerMoveHandler = null;

    // Логика по выбранному объекту
    switch (selectedObject) {
      case '1':
      case '2':
      case '3':
        sceneParamsRef.current.camera.position.set(50, 10, 50);
        createdObjects = createBasic123Objects(scene.environment);
        break;
      case '4':
        sceneParamsRef.current.camera.position.set(50, 10, 50);
        createdObjects = createBasic4Objects();
        break;
      case '5':
        sceneParamsRef.current.camera.position.set(50, 10, 50);
        createdObjects = [makeChildren(createBasic5Objects())];
        break;
      case '6':
        sceneParamsRef.current.camera.position.set(7, 2, 7);
        createdObjects = createAdvance1Objects();
        const rollOverMesh = createdObjects.find(mesh => mesh.name === 'rollOverMesh');
        //храню функцию внутри pointerMoveHandler для добавления и удаления слушателя
        pointerMoveHandler = handlePointerMove(frameCount, rollOverMesh, scene, camera);
        window.addEventListener('pointermove', pointerMoveHandler);
        break;
      case '8':
        sceneParamsRef.current.camera.position.set(2000, 300, -500);
        const texture = makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg);
        createdObjects = createAdvance3Objects(2048, 128, helperAdded, texture);
        break;
      case '9':
        // createdObjects = createAdvance1Objects();
        break;
      default:
        // Действия по умолчанию, если нужно
        break;
    }
    createdObjects.forEach(obj => {
      scene.add(obj);
    });

    return () => {
      if (selectedObject === '6') {
        window.removeEventListener('pointermove', pointerMoveHandler);
      }
    };
  }, [selectedObject, helperAdded]);



  const onClick = (event) => {
    if (sceneParamsRef.current) {
      const { scene, camera } = sceneParamsRef.current;
      const intersects = getIntersectedObject(event, scene, camera); // Используем функцию отслеживания луча

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object; // Получаем первый пересечённый объект

        if (clickedObject instanceof THREE.Object3D) {
          if (selectedObject === '1') {
            handleCubeClick(clickedObject);
          } else if (selectedObject === '2') {
            createDecals(intersects[0]) !== null && scene.add(createDecals(intersects[0]));
          } else if (selectedObject === '3') {
            createDecals(intersects[0]) !== null && scene.add(createLineToCentresOfGeometry(intersects[0]));
          } else if (selectedObject === '4') {
            changeSizeAsDistance(intersects[0], scene);
          } else if (selectedObject === '5') {
            makeRandomPosition(scene, camera);
          } else if (selectedObject === '6') {
            createOrChangeCircle(clickedObject, intersects[0], scene, makeCircleVisualisation);
          } else if (selectedObject === '7') {

          } else if (selectedObject === '9') {

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
    // зависимости не удалять
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);



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
          mode='vertical'
          onClick={(e) => {
            setSelectedObject(e.key)
          }}
          selectedKeys={selectedObject}
          theme='dark'
          items={menuItems}
          style={{ width: '200px' }}
        />
      </Sider>
    </Layout>
  );
};

export default App;
