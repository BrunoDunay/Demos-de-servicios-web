import { ChangeDetectionStrategy, Component, DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { hasFinePointer, useGsap } from '../core/motion';

/**
 * Botón magnético: con mouse, el botón se acerca un poco al cursor y la gota de color del hover
 * (.btn::before en styles.css) nace justo donde entró el puntero. Uso: <button class="btn" magnetic>.
 */
@Directive({ selector: '[magnetic]' })
export class Magnetic {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!hasFinePointer()) return;
      const { gsap } = useGsap();
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const enter = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      const move = (e: PointerEvent) => {
        if (document.documentElement.classList.contains('reduce-motion')) return;
        const r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.22);
        y((e.clientY - r.top - r.height / 2) * 0.3);
      };
      const leave = (e: PointerEvent) => {
        enter(e);
        x(0);
        y(0);
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}

/** Flecha de "Ver más" de transitions.dev: al pasar el cursor avanza y sus brazos se abren en flecha. */
@Component({
  selector: 'app-arrow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 't-learn-chevron' },
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path class="t-learn-line" d="M3 8h7" />
    <path class="t-learn-arm t-learn-arm-top" d="M6.5 4.5 10 8" />
    <path class="t-learn-arm t-learn-arm-bot" d="M6.5 11.5 10 8" />
  </svg>`,
})
export class Arrow {}
