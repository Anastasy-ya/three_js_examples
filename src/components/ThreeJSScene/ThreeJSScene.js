import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import img from './industrial_sunset_puresky_4k.exr';

// import * as THREE from 'three';
// import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

export function initScene() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 150, 500);

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  // scene.add(ambientLight);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(200, 200, 100);
  // scene.add(directionalLight);

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
    scene.background = texture;
    scene.environment = exrCubeRenderTarget.texture;

    // Запускаем рендеринг
    animate();
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  return { scene, camera, renderer, };
}


