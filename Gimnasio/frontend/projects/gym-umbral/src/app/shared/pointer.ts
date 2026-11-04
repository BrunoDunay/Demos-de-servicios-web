import { ChangeDetectionStrategy, Component, DestroyRef, Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Cursor propio: un punto de luz cálida (6 px) con un halo muy tenue que lo sigue con retraso.
 * Sobre enlaces y botones el punto se encoge y aparece un aro fino; si el elemento tiene
 * data-cursor, una etiqueta pequeña acompaña al aro. Todo se anima con GSAP (transform y opacidad).
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="halo"></div>
    <div class="ring"></div>
    <div class="dot"></div>
    <div class="tag"><span>{{ label() }}</span></div>
  `,
  styles: `
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 1000; opacity: 0; transition: opacity 500ms ease; }
    :host(.is-on) { opacity: 1; }
    .halo, .ring, .dot, .tag { position: absolute; left: 0; top: 0; will-change: transform; }
    .halo { width: 260px; height: 260px; margin: -130px 0 0 -130px; border-radius: 50%; background: radial-gradient(circle, rgb(243 213 161 / 7%) 0%, rgb(243 213 161 / 0%) 65%); mix-blend-mode: screen; }
    .dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; background: var(--glow); box-shadow: 0 0 8px 1px rgb(243 213 161 / 70%); }
    .ring { width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; border: 1px solid rgb(216 185 138 / 65%); opacity: 0; transform: scale(0.4); }
    .tag { margin: -7px 0 0 26px; overflow: hidden; }
    .tag span { display: block; font-size: 0.58rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); white-space: nowrap; transform: translateY(110%); }
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
      const [halo, ring, dot, tag, tagText] = [q('.halo'), q('.ring'), q('.dot'), q('.tag'), q('.tag span')];
      const follow = (el: HTMLElement, d: number) => ({ x: gsap.quickTo(el, 'x', { duration: d, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: d, ease: 'power3' }) });
      const f = [follow(dot, 0.1), follow(ring, 0.32), follow(tag, 0.32), follow(halo, 0.9)];
      let hovering: HTMLElement | null = null;

      const setHover = (el: HTMLElement | null) => {
        if (el === hovering) return;
        hovering = el;
        const text = el?.dataset['cursor'] ?? '';
        if (text) this.label.set(text);
        gsap.to(ring, { opacity: el ? 1 : 0, scale: el ? 1 : 0.4, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(dot, { scale: el ? 0.5 : 1, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(tagText, { yPercent: text ? 0 : 110, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      };

      const move = (e: PointerEvent) => {
        host.classList.add('is-on');
        for (const t of f) {
          t.x(e.clientX);
          t.y(e.clientY);
        }
        setHover((e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], summary, label'));
      };
      const down = () => gsap.to(ring, { scale: 0.82, duration: 0.15, overwrite: 'auto' });
      const up = () => gsap.to(ring, { scale: hovering ? 1 : 0.4, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      const leave = () => host.classList.remove('is-on');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      document.documentElement.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
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
  readonly magnetic = input<number, string | number>(0.3, { transform: (v) => (v === '' ? 0.3 : Number(v)) });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
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

/** Títulos que se revelan línea por línea (máscara) al entrar en pantalla. Uso: <h2 splitLines>. */
@Directive({ selector: '[splitLines]' })
export class SplitLines {
  readonly splitDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const show = () => {
        el.style.visibility = 'visible';
        el.style.animation = 'none';
      };
      if (prefersReducedMotion()) return show();
      const { gsap, SplitText } = useGsap();
      document.fonts.ready.then(() => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        show();
        const tween = gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
          delay: this.splitDelay() / 1000,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
        destroyRef.onDestroy(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split.revert();
        });
      });
    });
  }
}
