//разобраться с осями
// todo раскидать элементы по файлам
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Layout, Menu, Spin, Checkbox  } from 'antd';
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
import {

  // makeChildren,
  // randomPosition,
  moveSphere,
  // makeTexture,
} from '../DynamicEntities/DinamicFunctions.js';
import { getIntersectedObject } from '../DynamicEntities/DinamicFunctions.js';
import { makeTexture } from '../DynamicEntities/Materials/makeTexture.js';
import { makeChildren, makeRandomPosition } from '../DynamicEntities/Interactions/MakeRandomPosition.js';
import { handleCubeClick } from '../DynamicEntities/Interactions/HandleCubeClick.js';
import { createDecals} from '../DynamicEntities/Interactions/CreateDecals.js';
import { createLineToCentresOfGeometry } from '../DynamicEntities/Interactions/CreateLineToCentresOfGeometry.js';
import { changeSizeAsDistance } from '../DynamicEntities/Interactions/ChangeSizeAsDistance.js';
import { moveRollOverMesh } from '../DynamicEntities/DinamicFunctions.js';

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
    { key: '8', label: (
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
    ) },
    { key: '9', label: 'Advanced 4' }
  ];

//   const animateTexture = (texture, speed= 0.01) => {
//     // Анимация текстуры
//     texture.offset.x += speed;
//     texture.offset.y += speed;

//     // Обеспечить цикличность текстуры
//     if (texture.offset.x > 1) texture.offset.x = 0;
//     if (texture.offset.y > 1) texture.offset.y = 0;
// };

  // инициализация сцены
  useEffect(() => {
    const { scene, camera, renderer } = initScene();
    const controls = new OrbitControls(camera, renderer.domElement);

    sceneParamsRef.current = { scene, camera, renderer, controls };

    const animate = () => {
      requestAnimationFrame(animate);

      // animateTexture(texture)


      controls.update();
      renderer.render(scene, camera);
      setSceneReady(true);
    };

    animate();

    window.addEventListener('resize', () => handleResize(sceneParamsRef));
    handleResize(sceneParamsRef);

    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', () => handleResize(sceneParamsRef));
    };
  }, []);

  //удаление объектов сцены
  function deleteSceneObjects(scene) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];

      if ((obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Group)) {
        scene.remove(obj);
      }
    }
  }

  // удаление старых мешей добавление новых
  // useEffect(() => {
  //   const { scene } = sceneParamsRef.current || {};
  //   if (!scene) return; // Ждём пока сцена инициализируется

  //   // Удаляем все объекты из сцены. Важно: не использовать для сложных сцен с освещением, хэлперами и проч
  //   deleteSceneObjects(scene);

  //   let createdObjects = []

  //   // Выбираем объекты для сцены на основе selectedObject
  //   if (selectedObject === '1' || selectedObject === '2' || selectedObject === '3') {
  //     sceneParamsRef.current.camera.position.set(50, 10, 50);
  //     createdObjects = createBasic123Objects(scene.environment);
  //   } else if (selectedObject === '4') {
  //     sceneParamsRef.current.camera.position.set(50, 10, 50);
  //     // объекты изменены т.к. ExtrudeGeometry требует особого подхода
  //     createdObjects = createBasic4Objects();
  //   } else if (selectedObject === '5') {
  //     sceneParamsRef.current.camera.position.set(50, 10, 50);
  //     createdObjects = [makeChildren(createBasic5Objects())];
  //   } else if (selectedObject === '6') {
  //     sceneParamsRef.current.camera.position.set(7, 2, 7);
  //     createdObjects = createAdvance1Objects();

  //     //найдем объект rollOverMesh
  //     const rollOverMesh = createdObjects.find(mesh => mesh.name === 'rollOverMesh');

  //     //не забыть обновить сцену но КАК? я не могу это делать в useEffect
  //   // Перерисовываем сцену (обновляем визуализацию)
  //   // render();
  //     window.addEventListener('pointermove', (event) => {
  //       moveRollOverMesh(rollOverMesh, event);
  //   });

  //     //навешивание слушателей
  //   } else if (selectedObject === '7') {
  //     // createdObjects = createAdvance1Objects();
  //   } else if (selectedObject === '8') {
  //     sceneParamsRef.current.camera.position.set(2000, 300, -500);
  //     const texture = makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg)
  //     console.log(texture, 'texture')
  //     createdObjects = createAdvance3Objects(2048, 128, helperAdded, texture);//, opacityImg, roughnessImg

  //   } else if (selectedObject === '9') {
  //     // createdObjects = createAdvance1Objects();
  //   };
  //   createdObjects.forEach(obj => {
  //     // console.log(obj, 'obj')
  //     scene.add(obj)
  //   });
  //   return () => {
  //     window.removeEventListener('pointermove', (event) => {
  //       moveRollOverMesh(rollOverMesh, event);
  //   }); //добавить удаление слушателя для движения мыши
  //   };
  //   //changedObjs не нужен в зависимостях тк он вызывает ненужное удаление объектов при их изменении
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedObject, helperAdded]);
  useEffect(() => {
    const { scene } = sceneParamsRef.current || {};
    if (!scene) return; // Ждём пока сцена инициализируется

    // Удаляем все объекты из сцены
    deleteSceneObjects(scene);

    let createdObjects = [];

    // Обработчик для движения мыши, вынесен за пределы условия
    const handlePointerMove = (event) => {
      const rollOverMesh = createdObjects.find(mesh => mesh.name === 'rollOverMesh');
      if (rollOverMesh) {
        moveRollOverMesh(rollOverMesh, sceneParamsRef.current, event);//event,
      }
    };

    // Выбираем объекты для сцены на основе selectedObject
    if (selectedObject === '1' || selectedObject === '2' || selectedObject === '3') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      createdObjects = createBasic123Objects(scene.environment);
    } else if (selectedObject === '4') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      createdObjects = createBasic4Objects();
    } else if (selectedObject === '5') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      createdObjects = [makeChildren(createBasic5Objects())];
    } else if (selectedObject === '6') {
      sceneParamsRef.current.camera.position.set(7, 2, 7);
      createdObjects = createAdvance1Objects();

      window.addEventListener('pointermove', handlePointerMove);
    } else if (selectedObject === '7') {
      // createdObjects = createAdvance1Objects();
    } else if (selectedObject === '8') {
      sceneParamsRef.current.camera.position.set(2000, 300, -500);
      const texture = makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg);
      console.log(texture, 'texture');
      createdObjects = createAdvance3Objects(2048, 128, helperAdded, texture);
    } else if (selectedObject === '9') {
      // createdObjects = createAdvance1Objects();
    }

    createdObjects.forEach(obj => {
      scene.add(obj);
    });

    // Cleanup-функция для удаления объектов и событий
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [selectedObject, helperAdded]);



  // // TODO перенести в interactions
  // const getIntersectedObject = (event, scene, camera) => {
  //   const raycaster = new THREE.Raycaster();
  //   const mouse = new THREE.Vector2();

  //   // Преобразуем координаты клика в нормализованные координаты устройства
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //   raycaster.setFromCamera(mouse, camera); // Устанавливаем луч от камеры

  //   // Возвращаем пересечения с объектами в сцене
  //   return raycaster.intersectObjects(scene.children);
  // };

  const onClick = (event) => {
    if (sceneParamsRef.current) {
      const { scene, camera } = sceneParamsRef.current;
      const intersects = getIntersectedObject(event, scene, camera); // Используем функцию отслеживания луча

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object; // Получаем первый пересечённый объект

        if (clickedObject instanceof THREE.Object3D) {
          if (selectedObject === '0') {
            // Пустая сцена
          } else if (selectedObject === '1') {
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
            //здесь будет функция добавления
            // moveSphere(intersects[0], scene);
          }
        }
      }
    }
  };

// console.log(sceneParamsRef, 'sceneParamsRef')

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
