import * as THREE from 'three';

export function makeCircleVisualisation(color) {
  const rollOverGeo = new THREE.CircleGeometry(4, 64);  // Круг с радиусом 4 и 32 сегментами
  const rollOverMaterial = new THREE.MeshBasicMaterial({ color: color, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
  const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

  rollOverMesh.rotation.x = Math.PI / 2;
  rollOverMesh.position.y = .01;
  rollOverMesh.name = 'rollOverMesh';

  // Сделать объект невидимым для raycaster
  rollOverMesh.raycast = () => { };

  return rollOverMesh;
}
