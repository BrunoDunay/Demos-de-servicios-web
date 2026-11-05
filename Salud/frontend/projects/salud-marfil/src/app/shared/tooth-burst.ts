import { DestroyRef, Directive, afterNextRender, inject } from '@angular/core';
import { prefersReducedMotion } from '../core/motion';

const TOOTH =
  'M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z';

/** Formas de caer: a veces salen como fuente, a veces se abren de lado, a veces casi solo se desploman. */
const STYLES = [
  { count: [4, 6], vx: 70, vy: [-170, -110] },
  { count: [3, 5], vx: 120, vy: [-90, -40] },
  { count: [5, 7], vx: 40, vy: [-60, -10] },
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Al hacer clic en cualquier parte: un pulso azul pequeño y unos dientitos que brincan y caen poco
 * (unos 100 px) desde donde se hizo clic, girando y desvaneciéndose. Cada clic sale distinto.
 * Se pone una vez en <app-root toothBurst>. Con "Reducir movimiento" no hace nada.
 */
@Directive({ selector: '[toothBurst]' })
export class ToothBurst {
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const layer = document.createElement('div');
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;z-index:95;pointer-events:none;overflow:hidden;contain:strict';
      document.body.appendChild(layer);
      let live = 0;

      const pulse = (x: number, y: number) => {
        const ring = document.createElement('span');
        ring.style.cssText = `position:absolute;left:${x - 18}px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;border:2px solid oklch(58% 0.18 258);`;
        layer.appendChild(ring);
        ring.animate([{ scale: 0.2, opacity: 0.9 }, { scale: 1, opacity: 0 }], { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }).onfinish = () => ring.remove();
      };

      const tooth = (x: number, y: number, vx: number, vy: number, delay: number) => {
        const size = rand(11, 17);
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        el.setAttribute('viewBox', '0 0 32 32');
        el.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;overflow:visible;filter:drop-shadow(0 2px 2px oklch(25% 0.08 264 / 0.25))`;
        el.innerHTML = `<path d="${TOOTH}" fill="white" stroke="oklch(50% 0.2 263)" stroke-width="2.6" stroke-linejoin="round"/>`;
        layer.appendChild(el);
        live++;
        // Trayectoria con gravedad, muestreada en cuadros clave
        const g = rand(780, 980);
        const dur = rand(720, 980);
        const spin = rand(-320, 320);
        const frames: Keyframe[] = [];
        const steps = 14;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * (dur / 1000);
          const k = i / steps;
          frames.push({
            transform: `translate(${(vx * t).toFixed(1)}px, ${(vy * t + 0.5 * g * t * t).toFixed(1)}px) rotate(${(spin * k).toFixed(0)}deg) scale(${k < 0.15 ? 0.4 + k * 4 : 1})`,
            opacity: k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4,
          });
        }
        el.animate(frames, { duration: dur, delay, easing: 'linear', fill: 'backwards' }).onfinish = () => {
          el.remove();
          live--;
        };
      };

      const onDown = (e: PointerEvent) => {
        if (prefersReducedMotion() || (e.pointerType === 'mouse' && e.button !== 0)) return;
        if (live > 30) return;
        const { clientX: x, clientY: y } = e;
        pulse(x, y);
        const s = STYLES[Math.floor(Math.random() * STYLES.length)];
        const n = Math.round(rand(s.count[0], s.count[1]));
        const lean = rand(-30, 30);
        for (let i = 0; i < n; i++) tooth(x, y, lean + rand(-s.vx, s.vx), rand(s.vy[0], s.vy[1]), i * rand(10, 35));
      };
      addEventListener('pointerdown', onDown, { passive: true });
      destroyRef.onDestroy(() => {
        removeEventListener('pointerdown', onDown);
        layer.remove();
      });
    });
  }
}
