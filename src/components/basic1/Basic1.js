import * as THREE from 'three';

//TODO добавить больше цветов и материалов и сделать полноценный рандом

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube1 = new THREE.Mesh(geometry, material1);
cube1.position.x = -1.5;

const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 1.5;

const cubes = [cube1, cube2];

export default cubes;

