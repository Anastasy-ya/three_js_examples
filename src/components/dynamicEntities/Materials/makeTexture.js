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
  // const opacityTexture = textureLoader.load(opacityImg);
  // const roughnessTexture = textureLoader.load(roughnessImg);
  // const metalnessTexture = textureLoader.load(metalnessImg);

  // Настройка повторения текстур
  const textures = [baseColorTexture, ambientOcclusTexture, heightTexture, normalTexture]; //, metalnessTexture, opacityTexture, roughnessTexture
  textures.forEach(texture => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    }
  });

  // Создание материала с текстурами
  // В случае изменения текстуры не нуждается в правке
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTexture,
    aoMap: ambientOcclusTexture,
    displacementMap: heightTexture, // требуют добавления сегментов чтобы изменить высоту
    displacementScale: displacementScale,
    normalMap: normalTexture,
    // roughnessMap: roughnessTexture,
    // roughness: roughnessTexture ? .5 : undefined,
    // metalnessMap: metalnessTexture,
    // metalness: metalnessTexture ? 1 : undefined, // Если нет карты opacityTexture, использовать значение по умолчанию
    side: THREE.DoubleSide
  });

  return material;
}
