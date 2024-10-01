import * as THREE from 'three';
import { createRoundedBoxGeometry } from './Objects/RoundedBoxGeometry';
import { makeGlassMaterial } from './Materials/GlassMaterial';
import { makeFrostedGlass } from './Materials/FrostedGlass';
import { Cube } from './Objects/Cube';
import { Plane } from './Objects/Plane';
import { generateHexGrid } from './Objects/HexGrid';
import { moveRollOverMesh } from './Interactions/Advanced_1_2';
import { createLandscape } from './Objects/Landscape';
import { makeCircleVisualisation } from '../DynamicEntities/Objects/CircleVisualisation';
import { makeBoxVisualisation } from '../DynamicEntities/Objects/BoxVisualisation';

const frostedGlass = makeFrostedGlass(0x00ffff);

// Объекты для первых трех пунктов меню basic1-3
export function createBasic123Objects(environmentTexture) {
  const objects = [];

  // Создание геометрии с закругленными углами
  const glassGeometry = createRoundedBoxGeometry(10, 10, 10, 2 / 3, 2); // Радиус скругления = 10, плавность = 10
  const glassMaterial = makeGlassMaterial(environmentTexture);
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh.position.x = -10;
  glassMesh.name = 'куб со скруглением граней';

  // создание куба
  const cube = new Cube(10, 0, 0, 'куб', frostedGlass).mesh;
  objects.push(glassMesh, cube);
  return objects;
}

//basic4
export function createBasic4Objects() {
  const cubes = [];
  cubes.push(new Cube(-15, 0, 0, 'box_1', frostedGlass).mesh);
  cubes.push(new Cube(15, 0, 0, 'box_2', frostedGlass).mesh);
  return cubes;
}

//basic5
export function createBasic5Objects() {
  const cubes = [];
  cubes.push(new Cube(0, 0, 0, 'box_1', frostedGlass).mesh);
  cubes.push(new Cube(10, 0, 10, 'box_2', frostedGlass).mesh);
  cubes.push(new Cube(10, 0, 10, 'box_3', frostedGlass).mesh);
  return cubes;
}

//advanced1
export function createAdvance1Objects() {
  const objects = [];
  const plane = new Plane(0x67595e, 'plane_1', 8).mesh;
  objects.push(plane);
  const circleVisualisation = makeCircleVisualisation(0xffffff);
  objects.push(circleVisualisation);
  moveRollOverMesh(circleVisualisation);
  return objects;
}

//advanced2
export function createAdvance2Objects() {
  const objects = [];

  const landscape = createLandscape();
  objects.push(landscape);
  const boxVisualisation = makeBoxVisualisation(0xffffff);
  objects.push(boxVisualisation);
  moveRollOverMesh(boxVisualisation);

  return objects;
}

//advanced3
export function createAdvance3Objects(planeSize, hexRadius, helper, textureMaterial) {// helper true/false
  const objects = [];
  const plane = new Plane(0x67595e, 'plane_1', 2048).mesh;
  objects.push(plane);
  // сетка шестиугольников
  const hexGroup = generateHexGrid(planeSize, hexRadius, helper, textureMaterial);
  objects.push(hexGroup);
  return objects;
}
