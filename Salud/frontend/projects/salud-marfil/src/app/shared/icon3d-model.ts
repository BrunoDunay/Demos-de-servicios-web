import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/**
 * Íconos de "Lo que no se ve" en 3D: la silueta del ícono (24×24, estilo Lucide) se extruye con bisel y
 * acabado de esmalte; el detalle (palomita, pulso) va encima como un tubo azul brillante.
 */
export type Icon3dName = 'flame' | 'shield' | 'heart';

const ICONS: Record<Icon3dName, { body: string; line?: number[][] }> = {
  flame: {
    body: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  },
  shield: {
    body: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    line: [[8.6, 12], [11, 14.4], [15.4, 9.8]],
  },
  heart: {
    body: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
    line: [[4.5, 11], [8.5, 11], [10, 8], [12.5, 14], [14.5, 10], [19.5, 10]],
  },
};

const DEPTH = 4.2;
const BEVEL = 1.3;

function build(name: Icon3dName): THREE.Group {
  const icon = ICONS[name];
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.body}"/></svg>`);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const body = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: 0.9,
    bevelSegments: 10,
    curveSegments: 40,
  });
  const enamel = new THREE.MeshPhysicalMaterial({ color: '#e9f0ff', roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenColor: new THREE.Color('#9cc4ff') });
  const inner = new THREE.Group();
  inner.add(new THREE.Mesh(body, enamel));

  if (icon.line) {
    const blue = new THREE.MeshPhysicalMaterial({ color: '#1d4dff', roughness: 0.18, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 });
    const z = DEPTH + BEVEL + 0.5;
    const pts = icon.line.map(([x, y]) => new THREE.Vector3(x, y, z));
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    inner.add(new THREE.Mesh(new THREE.TubeGeometry(path, pts.length * 24, 0.95, 18, false), blue));
    // Esferas en las esquinas y puntas para que el trazo se vea redondo
    const ball = new THREE.SphereGeometry(0.95, 20, 14);
    for (const p of pts) {
      const m = new THREE.Mesh(ball, blue);
      m.position.copy(p);
      inner.add(m);
    }
  }

  // El SVG crece hacia abajo: se voltea en Y (three corrige la cara visible con escala negativa) y se centra
  const box = new THREE.Box3().setFromObject(inner);
  const c = box.getCenter(new THREE.Vector3());
  inner.position.set(-c.x, c.y, -c.z);
  inner.scale.y = -1;
  const outer = new THREE.Group();
  outer.add(inner);
  return outer;
}

export interface Icon3dScene {
  render(t: number, pointer: { x: number; y: number }, spin: number, still: boolean): void;
  resize(): void;
  dispose(): void;
}

export function createIcon3d(canvas: HTMLCanvasElement, name: Icon3dName): Icon3dScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 200);
  camera.position.set(0, 0, 58);

  const key = new THREE.DirectionalLight('#ffffff', 2.6);
  key.position.set(-30, 35, 30);
  const rim = new THREE.DirectionalLight('#5b8dff', 4);
  rim.position.set(35, -15, -10);
  scene.add(key, rim, new THREE.AmbientLight('#8fb0ff', 0.15));

  const obj = build(name);
  scene.add(obj);

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  let rx = 0;
  let ry = 0;
  return {
    render(t, pointer, spin, still) {
      const sway = still ? 0 : 1;
      const tx = 0.32 + pointer.y * 0.35 + Math.sin(t * 0.7) * 0.08 * sway;
      const ty = -0.6 + pointer.x * 0.6 + Math.sin(t * 0.5) * 0.35 * sway;
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      obj.rotation.set(rx, ry + spin, 0);
      obj.position.y = Math.sin(t * 1.3) * 0.6 * sway;
      renderer.render(scene, camera);
    },
    resize,
    dispose() {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
