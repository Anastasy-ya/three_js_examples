import * as THREE from 'three';
import { makeGlassMaterial } from '../Materials/GlassMaterial';

const width = 2048;
const height = 2048;
const maxHeight = 20;
const segments = 200;

export function createLandscape(map) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

  const positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const heightValue = Math.random() * maxHeight; // Генерация высоты от 0 до 20
    positionAttribute.setZ(i, heightValue);
  }
  positionAttribute.needsUpdate = true;

  const material = makeGlassMaterial(map)
  const landscape = new THREE.Mesh(geometry, material);
  landscape.rotation.x = -Math.PI / 2;
  // console.log(landscape, 'landscape')
  return landscape;
}

