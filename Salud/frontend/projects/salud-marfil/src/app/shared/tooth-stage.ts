import { ChangeDetectionStrategy, Component, DestroyRef, Directive, ElementRef, afterNextRender, computed, inject, input, viewChild } from '@angular/core';
import { ToothStage } from '../core/tooth-stage';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';

/** Marca un lugar donde debe aparecer el diente: <div toothSlot="hero"></div>. */
@Directive({ selector: '[toothSlot]' })
export class ToothSlot {
  readonly toothSlot = input.required<string>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const stage = inject(ToothStage);
    afterNextRender(() => stage.register(this.toothSlot(), el));
    inject(DestroyRef).onDestroy(() => stage.unregister(this.toothSlot(), el));
  }
}

interface Box {
  x: number;
  y: number;
  s: number;
}

/**
 * Lienzo fijo del tamaño de la ventana (sin eventos de puntero) donde se dibuja el diente.
 * Three.js se carga aparte (import dinámico) para no pesar en la primera carga.
 * Solo dibuja cuando el lugar de tratamientos está en pantalla.
 */
@Component({
  selector: 'app-tooth-stage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.over]': 'over()', 'aria-hidden': 'true' },
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host { position: fixed; inset: 0; z-index: var(--z-stage); pointer-events: none; }
    :host(.over) { z-index: calc(var(--z-intro) + 5); }
    canvas { width: 100%; height: 100%; opacity: 0; transition: opacity 600ms ease; }
    canvas.ready { opacity: 1; }
  `,
})
export class ToothStageView {
  private readonly stage = inject(ToothStage);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  protected readonly over = computed(() => this.stage.mode() === 'intro');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(async () => {
      const canvas = this.canvas().nativeElement;
      let three: typeof import('./tooth-model');
      try {
        three = await import('./tooth-model');
      } catch {
        return;
      }
      const scene = three.createToothScene(canvas);
      const { gsap } = useGsap();
      canvas.classList.add('ready');

      const cur: Box = { x: innerWidth / 2, y: innerHeight / 2, s: Math.min(innerWidth, innerHeight) * 0.42 };
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let rotY = -0.6;
      let turnY = 0;
      let wasVisible = true;
      let vh = innerHeight;

      const onResize = () => {
        vh = innerHeight;
        scene.resize();
      };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / innerHeight - 0.5) * 2;
      };
      addEventListener('resize', onResize);
      if (hasFinePointer()) addEventListener('pointermove', onPointer, { passive: true });

      const rectBox = (el: HTMLElement | undefined): Box | null => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (!r.width) return null;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.height };
      };

      // El diente vive solo en el centro del menú de tratamientos (no viaja por la página)
      const target = (): Box | null => (this.stage.mode() === 'intro' ? null : rectBox(this.stage.slots.get('treat')));
      let placed = false;

      const tick = (_t: number, dt: number) => {
        const t = target();
        if (!t) {
          placed = false;
          if (wasVisible) {
            scene.renderer.clear();
            wasVisible = false;
          }
          return;
        }
        if (!placed) {
          Object.assign(cur, t);
          placed = true;
        }
        // Sigue al scroll casi sin retraso
        cur.x += (t.x - cur.x) * 0.35;
        cur.y += (t.y - cur.y) * 0.35;
        cur.s += (t.s - cur.s) * 0.35;
        const visible = cur.y + cur.s / 2 > -40 && cur.y - cur.s / 2 < vh + 40;
        if (!visible) {
          if (wasVisible) scene.renderer.clear();
          wasVisible = false;
          return;
        }
        wasVisible = true;

        // De píxeles a unidades del mundo en el plano z = 0 (cámara a 9 unidades, fov 30°)
        const worldH = 2 * 9 * Math.tan((15 * Math.PI) / 180);
        const u = worldH / vh;
        scene.pivot.position.set((cur.x - innerWidth / 2) * u, -(cur.y - vh / 2) * u, 0);
        scene.pivot.scale.setScalar((cur.s * u) / 3);

        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;
        const still = prefersReducedMotion();
        rotY += (still ? 0 : dt / 1000) * (0.35 + this.stage.spin * 6);
        this.stage.spin *= 0.94;
        turnY += (this.stage.turn() * (Math.PI / 4) - turnY) * 0.06;
        scene.pivot.rotation.set(0.32 + pointer.y * 0.25, rotY + turnY + pointer.x * 0.5, 0.12 + Math.sin(rotY * 0.6) * 0.06);
        scene.tooth.position.y = still ? 0 : Math.sin(performance.now() / 900) * 0.06;
        scene.render();
      };
      gsap.ticker.add(tick);

      destroyRef.onDestroy(() => {
        gsap.ticker.remove(tick);
        removeEventListener('resize', onResize);
        removeEventListener('pointermove', onPointer);
        scene.dispose();
      });
    });
  }
}
