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
  handleCubeClick,
  createDecals,
  createLineToCentresOfGeometry,
  changeSizeAsDistance,
  makeChildren,
  randomPosition,
  moveSphere,
  makeTexture,
} from '../DynamicEntities/DinamicFunctions.js';
import { handleResize } from '../ThreeJSScene/HandleResize.js';
// import { menuItems } from '../Constants.js';

// import baseColorImg from '../Assets/texture/Wood_Wicker_011_basecolor.png';
// import ambientOcclusImg from '../Assets/texture/Wood_Wicker_011_ambientOcclusion.png';
// import heightImg from '../Assets/texture/Wood_Wicker_011_height.png';
// import normalMapImg from '../Assets/texture/Wood_Wicker_011_normal.png';
// import opacityImg from '../Assets/texture/Wood_Wicker_011_opacity.png';
// import roughnessImg from '../Assets/texture/Wood_Wicker_011_roughness.png';
// // import metalnessImg from '../Assets/texture/';

import baseColorImg from '../Assets/texture2/Rubber_Sole_003_basecolor.jpg';
import ambientOcclusImg from '../Assets/texture2/Rubber_Sole_003_ambientOcclusion.jpg';
import heightImg from '../Assets/texture2/Rubber_Sole_003_height.png';
import normalMapImg from '../Assets/texture2/Rubber_Sole_003_normal.jpg';
// import opacityImg from '../Assets/texture2/';
// import roughnessImg from '../Assets/texture/Wood_Wicker_011_roughness.png';
// import metalnessImg from '../Assets/texture/';


const { Sider } = Layout;
const ornamentalTexture = makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg)

const App = () => {
  const [selectedObject, setSelectedObject] = useState('0'); //пункт меню
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
        Пункт 8
        <Checkbox//вынести в отдельный компонент и поместить
          checked={helperAdded}
          onChange={handleCheckboxChange}
          style={{ marginLeft: 18 }}
        >
          Сетка
        </Checkbox>
      </div>
    ) },
    { key: '9', label: 'Advanced 4' }
  ];

  const animateTexture = (texture, speed= 0.01) => {
    // Анимация текстуры
    texture.offset.x += speed;
    texture.offset.y += speed;

    // Обеспечить цикличность текстуры
    if (texture.offset.x > 1) texture.offset.x = 0;
    if (texture.offset.y > 1) texture.offset.y = 0;
};

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
  useEffect(() => {

    const { scene } = sceneParamsRef.current || {};
    if (!scene) return; // Ждём пока сцена инициализируется

    // Удаляем все объекты из сцены. Важно: не использовать для сложных сцен с освещением, хэлперами и проч
    deleteSceneObjects(scene);

    let createdObjects = []

    //todo эта временно здесь, убрать позже
    // const setupScene = async () => {
    //   return createdObjects = await createAdvance3Objects(2048, 128, true, makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg, opacityImg, roughnessImg));
    // }



    // Выбираем объекты для сцены на основе selectedObject
    if (selectedObject === '1' || selectedObject === '2' || selectedObject === '3') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      //todo удали makeTexture
      createdObjects = createBasic123Objects(scene.environment);//, opacityImg, roughnessImg
    } else if (selectedObject === '4') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      // объекты изменены т.к. ExtrudeGeometry требует особого подхода
      createdObjects = createBasic4Objects();
    } else if (selectedObject === '5') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      createdObjects = [makeChildren(createBasic5Objects())];
    } else if (selectedObject === '6') {
      sceneParamsRef.current.camera.position.set(50, 10, 50);
      createdObjects = createAdvance1Objects();
    } else if (selectedObject === '7') {
      // createdObjects = createAdvance1Objects();
    } else if (selectedObject === '8') {
      sceneParamsRef.current.camera.position.set(2000, 300, -500);
      const texture = makeTexture(baseColorImg, ambientOcclusImg, heightImg, normalMapImg)
      //TODOдобавить кнопку, включающую хэлперы и заменить true на стейт
      createdObjects = createAdvance3Objects(2048, 128, helperAdded, texture);//, opacityImg, roughnessImg

    } else if (selectedObject === '9') {
      // createdObjects = createAdvance1Objects();
    };
    createdObjects.forEach(obj => {
      console.log(obj, 'obj')
      scene.add(obj)
    });
    //changedObjs не нужен в зависимостях тк он вызывает ненужное удаление объектов при их изменении
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject, helperAdded]);


  // обработка клика и вызов последующей функции, определяемой выбранным пунктом меню
  const onClick = (event) => {
    if (sceneParamsRef.current) {
      const { scene, camera } = sceneParamsRef.current;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Преобразуем координаты клика в нормализованные координаты устройства
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

        if (clickedObject instanceof THREE.Object3D) {

          if (selectedObject === '0') {
            // пустая сцена
          } else if (selectedObject === '1') {
            handleCubeClick(clickedObject);
          } else if (selectedObject === '2') {
            // передан первый эл массива с информацией о пересечениях
            // если клик попадет по грани, createDecals вернет null
            // функция createDecals получает объект данных первого пересечения луча с объектом сцены
            // если этот объект существует, в сцену добавляется новый объект,
            //расположенный на поверхности куба
            createDecals(intersects[0]) !== null && scene.add(createDecals(intersects[0]))
          } else if (selectedObject === '3') {
            // лучи от клика к центру фигуры
            // аналогично примеру выше, но в сцену добавляется объект, тянущийся к центру куба
            createDecals(intersects[0]) !== null && scene.add(createLineToCentresOfGeometry(intersects[0]));
          } else if (selectedObject === '4') {
            // функция changeSizeAsDistance получает данные
            //о пересечении луча с первым объектом сцены и меняет размер объектов
            changeSizeAsDistance(intersects[0], scene);
          } else if (selectedObject === '5') {
            randomPosition(scene, camera);
          } else if (selectedObject === '6') {
            moveSphere(intersects[0], scene);
          } else if (selectedObject === '7') { //8 пункт не требует функции активации
            // moveSphere(intersects[0], scene);
          } else if (selectedObject === '9') {
            // moveSphere(intersects[0], scene);
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
