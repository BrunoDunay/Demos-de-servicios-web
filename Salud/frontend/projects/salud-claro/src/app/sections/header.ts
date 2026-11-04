import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Practice } from '../core/practice';
import { Motion } from '../core/motion';
import { Logo } from '../shared/logo';
import { Magnetic } from '../shared/magnetic';

const LINKS = [
  { id: 'temas', label: '¿Qué te trae?' },
  { id: 'respira', label: 'Respira' },
  { id: 'terapia', label: 'Terapia' },
  { id: 'valeria', label: 'Sobre mí' },
  { id: 'tarifas', label: 'Tarifas' },
];

/** Raya a mano que se dibuja debajo del enlace al pasar el cursor. */
const SQUIGGLE = 'M2 7 C 14 2, 26 11, 38 6 S 62 2, 74 7 S 92 10, 98 5';

/**
 * Encabezado de papel: al pasar el cursor por un enlace se dibuja debajo una raya hecha a mano.
 * Al bajar se esconde y al subir regresa. En celular, menú a pantalla completa que baja como hoja rasgada.
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Magnetic],
  host: { '[class.hidden]': 'hidden()', '[class.solid]': 'solid()' },
  template: `
    <div class="bar page">
      <a routerLink="/" class="brand" aria-label="Claro, inicio"><app-logo /></a>
      <nav aria-label="Secciones">
        @for (l of links; track l.id) {
          <button type="button" (click)="practice.go(l.id)">
            {{ l.label }}
            <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path [attr.d]="squiggle" pathLength="1" /></svg>
          </button>
        }
      </nav>
      <div class="end">
        <button type="button" class="btn cta" magnetic (click)="practice.book()">Agenda una sesión</button>
        <button type="button" class="menu-btn" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="menu" aria-label="Menú">
          <span></span><span></span>
        </button>
      </div>
    </div>
    @if (open() || closing()) {
      <div id="menu" class="sheet" [class.closing]="closing()">
        <nav aria-label="Menú">
          @for (l of links; track l.id; let i = $index) {
            <button type="button" [style.--i]="i" (click)="goTo(l.id)">{{ l.label }}</button>
          }
        </nav>
        <p class="crisis">¿En crisis? Línea de la Vida: <b>800 911 2000</b> (24 h, gratis)</p>
        <button type="button" class="btn peach" (click)="goTo('agenda')">Agenda una sesión</button>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0 0 auto; z-index: var(--z-header); transition: translate 450ms var(--ease-smooth-out), background-color 300ms ease, box-shadow 300ms ease; }
    :host(.solid) { background: oklch(95.6% 0.016 82 / 0.9); backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--line); }
    :host(.hidden) { translate: 0 -105%; }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; height: 78px; }
    .brand { position: relative; z-index: 2; transition: scale 160ms var(--ease-out); }
    .brand:active { scale: 0.96; }
    nav { display: flex; gap: 6px; }
    nav button { position: relative; padding: 10px 12px; font-size: 0.95rem; font-weight: 600; transition: color 250ms ease, scale 160ms var(--ease-out); }
    nav button:active { scale: 0.95; }
    nav svg { position: absolute; left: 10px; right: 10px; bottom: 2px; width: calc(100% - 20px); height: 9px; overflow: visible; }
    nav path { fill: none; stroke: var(--peach-deep); stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 450ms var(--ease-smooth-out); }
    @media (hover: hover) and (pointer: fine) {
      nav button:hover path { stroke-dashoffset: 0; }
      nav button:hover { color: var(--peach-deep); }
    }
    .end { display: flex; align-items: center; gap: 10px; }
    .cta { min-height: 46px; padding: 0 22px; font-size: 0.92rem; }
    .menu-btn { display: none; position: relative; z-index: 2; width: 48px; height: 48px; border-radius: 50%; background: var(--ink); transition: scale 160ms var(--ease-out); }
    .menu-btn:active { scale: 0.92; }
    .menu-btn span { position: absolute; left: 14px; right: 14px; height: 2px; border-radius: 2px; background: var(--paper); transition: translate 300ms var(--ease-out), rotate 300ms var(--ease-out); }
    .menu-btn span:first-child { top: 20px; }
    .menu-btn span:last-child { top: 27px; }
    .menu-btn[aria-expanded='true'] span:first-child { translate: 0 3.5px; rotate: 45deg; }
    .menu-btn[aria-expanded='true'] span:last-child { translate: 0 -3.5px; rotate: -45deg; }
    .sheet { position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; gap: 24px; padding: 104px var(--gutter) 32px; background: var(--peach-soft); animation: sheet-in 600ms var(--ease-smooth-out) both; }
    .sheet.closing { animation: sheet-out 280ms ease-in both; }
    @keyframes sheet-in { from { clip-path: polygon(0 0, 100% 0, 100% -4%, 80% -1%, 60% -5%, 40% -2%, 20% -6%, 0 -2%); } to { clip-path: polygon(0 0, 100% 0, 100% 102%, 80% 105%, 60% 101%, 40% 106%, 20% 102%, 0 105%); } }
    @keyframes sheet-out { from { clip-path: polygon(0 0, 100% 0, 100% 102%, 80% 105%, 60% 101%, 40% 106%, 20% 102%, 0 105%); } to { clip-path: polygon(0 0, 100% 0, 100% -4%, 80% -1%, 60% -5%, 40% -2%, 20% -6%, 0 -2%); } }
    .sheet nav { flex-direction: column; gap: 0; }
    .sheet nav button { padding: 10px 0; text-align: left; font-family: var(--font-display); font-stretch: 75%; font-size: 3.2rem; font-weight: 800; line-height: 1; text-transform: uppercase; animation: t-text-in 520ms var(--ease-smooth-out) both; animation-delay: calc(140ms + var(--i) * 55ms); }
    .sheet nav button:nth-child(even) { color: var(--peach-deep); }
    .crisis { font-size: 0.92rem; color: var(--ink-2); }
    .sheet .btn { margin-top: auto; }
    @media (max-width: 1040px) {
      .bar nav { display: none; }
      .sheet nav { display: flex; }
      .menu-btn { display: block; }
    }
    @media (max-width: 560px) { .cta { display: none; } }
  `,
})
export class Header {
  protected readonly practice = inject(Practice);
  private readonly motion = inject(Motion);
  protected readonly links = LINKS;
  protected readonly squiggle = SQUIGGLE;
  protected readonly open = signal(false);
  protected readonly closing = signal(false);
  protected readonly hidden = signal(false);
  protected readonly solid = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let last = scrollY;
      const onScroll = () => {
        const y = scrollY;
        this.solid.set(y > 30);
        if (!this.open()) this.hidden.set(y > 500 && y > last + 4 ? true : y < last - 4 ? false : this.hidden());
        last = y;
      };
      addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => removeEventListener('scroll', onScroll));
    });
  }

  protected toggle() {
    if (this.open()) this.close();
    else {
      this.open.set(true);
      this.motion.stop();
    }
  }

  private close() {
    this.closing.set(true);
    this.open.set(false);
    this.motion.resume();
    setTimeout(() => this.closing.set(false), 280);
  }

  protected goTo(id: string) {
    this.close();
    setTimeout(() => this.practice.go(id), 80);
  }
}
