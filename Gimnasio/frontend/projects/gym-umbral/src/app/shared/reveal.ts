import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

// Un solo IntersectionObserver para toda la página: agrega .is-in cuando el elemento entra en pantalla.
let observer: IntersectionObserver | undefined;
const callbacks = new WeakMap<Element, () => void>();

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        callbacks.get(entry.target)?.();
        observer!.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  return observer;
}

export function onEnterView(el: Element, cb: () => void): () => void {
  callbacks.set(el, cb);
  getObserver().observe(el);
  return () => getObserver().unobserve(el);
}

/** Uso: <div data-reveal> o data-reveal="left|right|scale" y [revealDelay]="120". */
@Directive({ selector: '[data-reveal]' })
export class Reveal {
  readonly revealDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (this.revealDelay()) el.style.setProperty('--d', `${this.revealDelay()}ms`);
      const stop = onEnterView(el, () => {});
      destroyRef.onDestroy(stop);
    });
  }
}

/** Cuenta de 0 al valor cuando el número entra en pantalla. El HTML prerenderizado ya trae el valor final. */
@Directive({ selector: '[countUp]' })
export class CountUp {
  readonly countUp = input.required<number>();
  readonly decimals = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (document.documentElement.classList.contains('reduce-motion')) return;
      const target = this.countUp();
      const decimals = this.decimals();
      const format = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      el.textContent = format(0);
      const stop = onEnterView(el, () => {
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = format(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      destroyRef.onDestroy(stop);
    });
  }
}
