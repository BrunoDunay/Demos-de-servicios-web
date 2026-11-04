import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';

/** Interruptor accesible para apagar animaciones. Se guarda en el navegador y recarga la página. */
@Component({
  selector: 'app-motion-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" role="switch" [attr.aria-checked]="reduced()" (click)="toggle()">
      <span class="track"><span class="thumb"></span></span>
      Reducir movimiento
    </button>
  `,
  styles: `
    button { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; font-size: 0.82rem; color: inherit; opacity: 0.8; transition: opacity 200ms ease; }
    @media (hover: hover) and (pointer: fine) { button:hover { opacity: 1; } }
    .track { position: relative; width: 34px; height: 20px; border-radius: 999px; background: currentColor; opacity: 0.35; transition: opacity 200ms ease; }
    .thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 250ms cubic-bezier(0.23, 1, 0.32, 1); }
    [aria-checked='true'] .track { opacity: 1; }
    [aria-checked='true'] .thumb { transform: translateX(14px); background: #000; }
  `,
})
export class MotionToggle {
  protected readonly reduced = signal(false);

  constructor() {
    afterNextRender(() => this.reduced.set(document.documentElement.classList.contains('reduce-motion')));
  }

  protected toggle() {
    const next = !this.reduced();
    try {
      localStorage.setItem('reduce-motion', next ? '1' : '0');
    } catch {}
    location.reload();
  }
}
