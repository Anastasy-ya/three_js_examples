import * as THREE from 'three';

export function makeTexture(
  baseColorImg,
  ambientOcclusImg = null,
  heightImg = null,
  normalMapImg = null,
  opacityImg = null,
  roughnessImg = null,
  metalnessImg = null,
  displacementScale = 0.2
) {
  const textureLoader = new THREE.TextureLoader();

  // Загрузка текстур
  const baseColorTexture = textureLoader.load(baseColorImg);
  const ambientOcclusTexture = textureLoader.load(ambientOcclusImg);
  const heightTexture = textureLoader.load(heightImg);
  const normalTexture = textureLoader.load(normalMapImg);

  // Настройка повторения текстур
  const textures = [baseColorTexture, ambientOcclusTexture, heightTexture, normalTexture];
  textures.forEach(texture => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    }
  });

  const material = new THREE.MeshStandardMaterial({
    map: baseColorTexture,
    aoMap: ambientOcclusTexture,
    displacementMap: heightTexture, // требует добавления сегментов чтобы изменить высоту
    displacementScale: displacementScale,
    normalMap: normalTexture,
    side: THREE.DoubleSide
  });

  return material;
}
