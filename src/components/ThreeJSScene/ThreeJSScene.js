import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import img from './Industrial_sunset_puresky_4k.exr';

export function initScene() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);
  camera.lookAt(0, 0, 0);
  camera.position.set(50, 10, 50);

//   // AmbientLight
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// // DirectionalLight
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 1, 1); // Позиционируем источник света
// scene.add(directionalLight);

// // PointLight
// const pointLight = new THREE.PointLight(0xff0000, 1, 100);
// pointLight.position.set(5, 5, 5);
// scene.add(pointLight);

// // SpotLight
// const spotLight = new THREE.SpotLight(0x00ff00, 1);
// spotLight.position.set(0, 10, 0);
// spotLight.angle = Math.PI / 4;
// scene.add(spotLight);

// // HemisphereLight
// const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
// scene.add(hemisphereLight);

  // Загрузка окружения .exr
  const loader = new EXRLoader();
  loader.load(img, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // Генерация окружения с использованием PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
    pmremGenerator.dispose();

    // Применяем окружение и фон
    scene.background = exrCubeRenderTarget.texture;
    scene.environment = exrCubeRenderTarget.texture; // Используется для отражения в объектах
  });

  return { scene, camera, renderer};
}


