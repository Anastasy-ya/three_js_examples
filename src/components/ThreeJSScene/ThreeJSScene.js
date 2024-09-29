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


