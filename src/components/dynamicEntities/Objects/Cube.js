import * as THREE from 'three';

  export class Cube {
    constructor(x, y, z, name, material) {
      this.geometry = new THREE.BoxGeometry(10, 10, 10);
      this.material = material;
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;
      this.mesh.name = name;
    }
  }


