import { ChangeDetectionStrategy, Component, DestroyRef, Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Cursor propio estilo HUD: un punto naranja de 6 px. Sobre botones y enlaces, cuatro esquinas se
 * ajustan al contorno del elemento (como una mira que fija el objetivo) y vuelven al punto al salir.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>
    <span class="dot"></span>
    <span class="tag">{{ label() }}</span>
  `,
  styles: `
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 120; opacity: 0; transition: opacity 300ms ease; }
    :host(.is-on) { opacity: 1; }
    .dot { position: absolute; left: -3px; top: -3px; width: 6px; height: 6px; background: var(--ember); }
    .c { position: absolute; left: 0; top: 0; width: 7px; height: 7px; border: 0 solid var(--ink); opacity: 0.5; transition: border-color 250ms ease, opacity 250ms ease; }
    .tl { border-top-width: 1.5px; border-left-width: 1.5px; }
    .tr { border-top-width: 1.5px; border-right-width: 1.5px; margin-left: -7px; }
    .bl { border-bottom-width: 1.5px; border-left-width: 1.5px; margin-top: -7px; }
    .br { border-bottom-width: 1.5px; border-right-width: 1.5px; margin-left: -7px; margin-top: -7px; }
    :host(.is-locked) .c { border-color: var(--ember); opacity: 1; }
    .tag { position: absolute; left: 0; top: 0; font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.14em; color: var(--ember); white-space: nowrap; opacity: 0; transition: opacity 200ms ease; }
    :host(.is-locked.has-tag) .tag { opacity: 1; }
  `,
})
export class Cursor {
  protected readonly label = signal('');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const { gsap } = useGsap();
      document.documentElement.classList.add('has-cursor');
      const q = (s: string) => host.querySelector<HTMLElement>(s)!;
      const dot = q('.dot');
      const tag = q('.tag');
      const corners = [q('.tl'), q('.tr'), q('.bl'), q('.br')];
      const to = (el: HTMLElement, d: number) => ({ x: gsap.quickTo(el, 'x', { duration: d, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: d, ease: 'power3' }) });
      const dotTo = to(dot, 0.12);
      const cornerTo = corners.map((c) => to(c, 0.38));
      const tagTo = to(tag, 0.38);
      let px = -100;
      let py = -100;
      let target: HTMLElement | null = null;

      const place = () => {
        dotTo.x(px);
        dotTo.y(py);
        let [l, t, r, b] = [px - 11, py - 11, px + 11, py + 11];
        if (target) {
          const rect = target.getBoundingClientRect();
          [l, t, r, b] = [rect.left - 6, rect.top - 6, rect.right + 6, rect.bottom + 6];
        }
        cornerTo[0].x(l);
        cornerTo[0].y(t);
        cornerTo[1].x(r);
        cornerTo[1].y(t);
        cornerTo[2].x(l);
        cornerTo[2].y(b);
        cornerTo[3].x(r);
        cornerTo[3].y(b);
        tagTo.x(r + 8);
        tagTo.y(t - 4);
      };

      const pick = (el: Element | null) => {
        const found = el?.closest<HTMLElement>('a, button, [data-cursor], summary') ?? null;
        // Solo se fijan elementos de tamaño botón; en tarjetas grandes la mira sigue al punto.
        const rect = found?.getBoundingClientRect();
        const lock = found && rect && rect.width * rect.height < 90000 ? found : null;
        if (lock === target) return;
        target = lock;
        host.classList.toggle('is-locked', !!lock);
        const text = lock?.dataset['cursor'] ?? '';
        this.label.set(text);
        host.classList.toggle('has-tag', !!text);
        gsap.to(dot, { scale: lock ? 0 : 1, duration: 0.25, ease: 'power2.out' });
      };

      const move = (e: PointerEvent) => {
        host.classList.add('is-on');
        px = e.clientX;
        py = e.clientY;
        pick(e.target as Element);
        place();
      };
      const scroll = () => {
        pick(document.elementFromPoint(px, py));
        place();
      };
      const down = () => gsap.to(corners, { scale: 0.7, duration: 0.12 });
      const up = () => gsap.to(corners, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      const leave = () => host.classList.remove('is-on');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      document.documentElement.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('scroll', scroll);
        window.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
        document.documentElement.removeEventListener('pointerleave', leave);
      });
    });
  }
}

/** El elemento se acerca al cursor cuando pasa cerca (botones principales). */
@Directive({ selector: '[magnetic]' })
export class Magnetic {
  // Se puede usar como atributo vacío (<span magnetic>) o con fuerza: [magnetic]="0.5".
  readonly magnetic = input<number, string | number>(0.35, { transform: (v) => (v === '' ? 0.35 : Number(v)) });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * this.magnetic());
        yTo((e.clientY - (r.top + r.height / 2)) * this.magnetic());
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
