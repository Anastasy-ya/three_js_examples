import * as THREE from 'three';

export class Plane {
  constructor(color, name, side) {
    this.geometry = new THREE.PlaneGeometry(side, side, 500, 500);
    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      opacity: 0.1,
      transmission: 0.9,
      ior: 1.5,
      roughness: 0.2,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = name;
    this.mesh.rotation.x = Math.PI / 2;
  }
};

