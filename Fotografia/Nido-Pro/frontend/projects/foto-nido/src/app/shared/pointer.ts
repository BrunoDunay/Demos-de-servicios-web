import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Cursor de enfoque: una cruz fina como la del visor de una cámara. Sobre enlaces se encoge;
 * sobre fotos con data-cursor se pone roja y muestra la palabra ("Ampliar", "Ver la hoja"…).
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <span class="cross"><i class="h"></i><i class="v"></i></span>
    <span class="label">{{ label() }}</span>
  `,
  styles: `
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 120; opacity: 0; transition: opacity 250ms ease; mix-blend-mode: difference; }
    :host(.is-on) { opacity: 1; }
    :host(.is-photo) { mix-blend-mode: normal; }
    .cross { position: absolute; left: -11px; top: -11px; width: 22px; height: 22px; transition: scale 250ms var(--ease-out), rotate 300ms var(--ease-out); }
    .cross i { position: absolute; background: oklch(96% 0.01 75); transition: background-color 200ms ease; }
    .h { left: 0; right: 0; top: 10.5px; height: 1px; }
    .v { top: 0; bottom: 0; left: 10.5px; width: 1px; }
    :host(.is-link) .cross { scale: 0.6; rotate: 45deg; }
    :host(.is-photo) .cross i { background: var(--hilo); }
    :host(.is-photo) .cross { scale: 1.5; }
    .label { position: absolute; left: 18px; top: 10px; font-family: var(--font-display); font-style: italic; font-size: 1.1rem; color: var(--hilo); white-space: nowrap; opacity: 0; translate: -4px 0; transition: opacity 200ms ease, translate 250ms var(--ease-out); }
    :host(.is-photo) .label { opacity: 1; translate: none; }
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
      const cross = host.querySelector<HTMLElement>('.cross')!;
      const label = host.querySelector<HTMLElement>('.label')!;
      const cx = gsap.quickTo(cross, 'x', { duration: 0.18, ease: 'power3' });
      const cy = gsap.quickTo(cross, 'y', { duration: 0.18, ease: 'power3' });
      const lx = gsap.quickTo(label, 'x', { duration: 0.3, ease: 'power3' });
      const ly = gsap.quickTo(label, 'y', { duration: 0.3, ease: 'power3' });
      let px = -100;
      let py = -100;
      const pick = (el: Element | null) => {
        const photo = el?.closest<HTMLElement>('[data-cursor]');
        const link = el?.closest('a, button, label, summary, select');
        host.classList.toggle('is-photo', !!photo);
        host.classList.toggle('is-link', !photo && !!link);
        if (photo) this.label.set(photo.dataset['cursor'] ?? '');
      };
      const move = (e: PointerEvent) => {
        host.classList.add('is-on');
        px = e.clientX;
        py = e.clientY;
        cx(px);
        cy(py);
        lx(px);
        ly(py);
        pick(e.target as Element);
      };
      const scroll = () => pick(document.elementFromPoint(px, py));
      const leave = () => host.classList.remove('is-on');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('scroll', scroll, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('scroll', scroll);
        document.documentElement.removeEventListener('pointerleave', leave);
      });
    });
  }
}
