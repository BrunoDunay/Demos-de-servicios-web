import { Injectable, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { prefersReducedMotion, useGsap } from './motion';

/**
 * Transición entre páginas con el arco de Umbral (ver shared/curtain.ts):
 * - cover: el telón sube desde abajo, el arco se dibuja y se enciende su línea de luz.
 * - reveal: con la página nueva ya debajo, el hueco del arco crece hasta salir de la pantalla.
 * Se usa como guard canDeactivate en cada ruta.
 */
@Injectable({ providedIn: 'root' })
export class PageTransition {
  private el?: HTMLElement;
  private covering = false;

  register(el: HTMLElement) {
    this.el = el;
  }

  cover(): Promise<boolean> {
    const el = this.el;
    if (!el || prefersReducedMotion() || this.covering) return Promise.resolve(true);
    this.covering = true;
    const { gsap } = useGsap();
    const q = gsap.utils.selector(el);
    const hole = el.querySelector<SVGPathElement>('.hole')!;
    hole.setAttribute('transform', 'scale(0)');
    return new Promise((resolve) => {
      gsap
        .timeline({ onComplete: () => resolve(true) })
        .set(el, { visibility: 'visible' })
        .set(q('.mark'), { opacity: 1 })
        .set(q('.arch'), { strokeDashoffset: 1 })
        .set(q('.beam, .base'), { opacity: 0 })
        .fromTo(q('.panel'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' })
        .to(q('.base'), { opacity: 1, duration: 0.25 }, 0.4)
        .to(q('.arch'), { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.42)
        .to(q('.beam'), { keyframes: { opacity: [0, 0.9, 0.3, 1] }, duration: 0.35, ease: 'none' }, 0.72);
    });
  }

  reveal() {
    const el = this.el;
    if (!el || !this.covering) return;
    const { gsap } = useGsap();
    const q = gsap.utils.selector(el);
    const hole = el.querySelector<SVGPathElement>('.hole')!;
    const door = { s: 0 };
    // Tamaño final: lo bastante grande para que el arco cubra toda la pantalla.
    const end = (Math.max(innerWidth, innerHeight) / 24) * 1.6;
    gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.set(el, { visibility: 'hidden' });
          this.covering = false;
        },
      })
      .to(q('.beam'), { opacity: 0, duration: 0.2 })
      .to(door, { s: 1, duration: 0.35, ease: 'power2.out', onUpdate: () => hole.setAttribute('transform', `scale(${door.s})`) }, 0.05)
      .to(q('.mark'), { opacity: 0, duration: 0.3 }, 0.3)
      .to(door, { s: end, duration: 1, ease: 'expo.in', onUpdate: () => hole.setAttribute('transform', `scale(${door.s})`) }, 0.4);
  }
}

export const leavePage: CanDeactivateFn<unknown> = () => inject(PageTransition).cover();
