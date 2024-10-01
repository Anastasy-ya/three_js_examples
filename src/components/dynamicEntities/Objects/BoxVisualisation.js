import * as THREE from 'three';

export function makeBoxVisualisation(color) {
  const rollOverBox = new THREE.BoxGeometry(32, 32, 32);
  const rollOverMaterial = new THREE.MeshBasicMaterial({ color: color, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
  const rollOverMesh = new THREE.Mesh(rollOverBox, rollOverMaterial);
  rollOverMesh.position.y = 16;
  rollOverMesh.name = 'rollOverBox';

  // Сделать объект невидимым для raycaster
  rollOverMesh.raycast = () => { };

  return rollOverMesh;
}
