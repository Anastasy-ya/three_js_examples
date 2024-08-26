import * as THREE from 'three';
// import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import see_background from '../assets/See_background.exr';

export function loadEnvironmentTexture(callback) {
  // const loader = new EXRLoader();
  
  // loader.load(see_background, (texture) => {
  //   texture.mapping = THREE.EquirectangularReflectionMapping;
  //   return (texture);
  // });
  const loader = new RGBELoader();
loader.load('/see_background.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  callback(texture);
});
}
