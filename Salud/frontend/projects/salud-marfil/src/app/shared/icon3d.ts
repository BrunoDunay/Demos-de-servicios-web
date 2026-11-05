import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../core/motion';
import type { Icon3dName } from './icon3d-model';

/**
 * Ícono 3D en su propio lienzo (Three.js se carga aparte y solo cuando la tarjeta se acerca a la pantalla).
 * Se mece solo, se orienta hacia el cursor cuando está sobre su tarjeta (.t-tilt) y da una vuelta al entrar.
 */
@Component({
  selector: 'app-icon3d',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host { display: block; }
    canvas { width: 100%; height: 100%; opacity: 0; scale: 0.7; transition: opacity 600ms ease, scale 900ms var(--ease-bounce); }
    canvas.ready { opacity: 1; scale: 1; }
  `,
})
export class Icon3d {
  readonly name = input.required<Icon3dName>();
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const card = host.closest<HTMLElement>('.t-tilt') ?? host;
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let spin = 0;
      let spinTarget = 0;
      let visible = false;
      let raf = 0;
      let scene: import('./icon3d-model').Icon3dScene | undefined;
      let loading = false;
      const t0 = performance.now();

      const loop = () => {
        raf = 0;
        if (!visible || !scene) return;
        pointer.x += (pointer.tx - pointer.x) * 0.1;
        pointer.y += (pointer.ty - pointer.y) * 0.1;
        spin += (spinTarget - spin) * 0.06;
        scene.render((performance.now() - t0) / 1000, pointer, spin, prefersReducedMotion());
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!raf) raf = requestAnimationFrame(loop);
      };

      const io = new IntersectionObserver(async ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !scene && !loading) {
          loading = true;
          try {
            const mod = await import('./icon3d-model');
            scene = mod.createIcon3d(canvas, this.name());
            canvas.classList.add('ready');
          } catch (err) {
            console.error('icon3d', err);
            return;
          }
        }
        if (visible) start();
      }, { rootMargin: '200px' });
      io.observe(host);

      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const enter = () => (spinTarget += Math.PI * 2);
      const leave = () => {
        pointer.tx = 0;
        pointer.ty = 0;
      };
      const onResize = () => scene?.resize();
      if (hasFinePointer()) {
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
      }
      card.addEventListener('pointerenter', enter);
      addEventListener('resize', onResize);

      destroyRef.onDestroy(() => {
        io.disconnect();
        cancelAnimationFrame(raf);
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
        card.removeEventListener('pointerenter', enter);
        removeEventListener('resize', onResize);
        scene?.dispose();
      });
    });
  }
}
