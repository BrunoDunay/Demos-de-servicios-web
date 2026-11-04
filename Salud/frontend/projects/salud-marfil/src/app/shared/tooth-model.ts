import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Muela 3D hecha con código (sin archivos .glb): una corona girada con cuatro cúspides y dos raíces curvas
 * que nacen dentro del cuello. Material de esmalte brillante
 * con reflejos de un cuarto de estudio (RoomEnvironment) y una luz azul de contorno.
 */
export function toothGeometry(detail = 128): THREE.BufferGeometry {
  // Corona: perfil girado desde el cuello hasta el centro de la cara de masticar
  const crownProfile = [
    [0.0, -0.32], [0.5, -0.3], [0.7, -0.12], [0.82, 0.12], [0.95, 0.36], [1.0, 0.58], [0.98, 0.78],
    [0.9, 0.92], [0.74, 1.0], [0.5, 0.99], [0.25, 0.92], [0.0, 0.88],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const crown = new THREE.LatheGeometry(new THREE.SplineCurve(crownProfile).getSpacedPoints(70), detail);
  const pos = crown.attributes['position'] as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    const a = Math.atan2(v.z, v.x);
    let { x, y, z } = v;
    // Un poco más ancha de frente que de lado
    x *= 1.08;
    z *= 0.94;
    // Cúspides: cuatro bultos suaves sobre la cara de masticar y un surco al centro
    if (y > 0.7) {
      const t = Math.min(1, (y - 0.7) / 0.3);
      const rr = Math.min(1, r / 0.9);
      const cusps = 0.5 + 0.5 * Math.cos(4 * (a - Math.PI / 4));
      y += t * (0.16 * cusps * Math.sin(rr * Math.PI) - 0.05 * (1 - rr));
    }
    pos.setXYZ(i, x, y, z);
  }

  // Raíces: dos conos curvos que nacen dentro del cuello y se abren hacia abajo
  const rootProfile = [[0.0, -1.62], [0.12, -1.58], [0.22, -1.4], [0.32, -0.9], [0.4, -0.4], [0.44, 0.0], [0.0, 0.05]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const roots = [-1, 1].map((side) => {
    const g = new THREE.LatheGeometry(new THREE.SplineCurve(rootProfile).getSpacedPoints(50), 48);
    const p2 = g.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < p2.count; i++) {
      v.fromBufferAttribute(p2, i);
      const depth = Math.max(0, -v.y / 1.6);
      p2.setXYZ(i, v.x * 0.95 + side * (0.36 + depth * depth * 0.32), v.y - 0.05, v.z * 0.82 - depth * depth * 0.1);
    }
    return g;
  });

  const geo = mergeGeometries([crown, ...roots])!;
  geo.computeVertexNormals();
  geo.center();
  return geo;
}

export interface ToothScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tooth: THREE.Mesh;
  pivot: THREE.Group;
  render: () => void;
  resize: () => void;
  dispose: () => void;
}

export function createToothScene(canvas: HTMLCanvasElement, opts: { tint?: string; rim?: string } = {}): ToothScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.2, 9);

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(opts.tint ?? '#f3f6fb'),
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    sheen: 0.4,
    sheenColor: new THREE.Color('#dfe9ff'),
    sheenRoughness: 0.5,
    ior: 1.6,
    specularIntensity: 0.9,
  });
  const tooth = new THREE.Mesh(toothGeometry(), material);
  const pivot = new THREE.Group();
  pivot.add(tooth);
  scene.add(pivot);

  const key = new THREE.DirectionalLight('#ffffff', 1.6);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(new THREE.Color(opts.rim ?? '#4f7dff'), 3.2);
  rim.position.set(-4, -1, -3);
  const fill = new THREE.HemisphereLight('#ffffff', '#9fb6e8', 0.6);
  scene.add(key, rim, fill);

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const render = () => renderer.render(scene, camera);
  const dispose = () => {
    tooth.geometry.dispose();
    material.dispose();
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
  return { renderer, scene, camera, tooth, pivot, render, resize, dispose };
}
