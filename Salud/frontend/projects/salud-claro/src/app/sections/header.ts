import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Practice } from '../core/practice';
import { Motion } from '../core/motion';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

const LINKS = [
  { id: 'temas', label: '¿Qué te trae?' },
  { id: 'respira', label: 'Respira' },
  { id: 'terapia', label: 'Terapia' },
  { id: 'valeria', label: 'Sobre mí' },
  { id: 'tarifas', label: 'Tarifas' },
];

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon],
  host: { '[class.hidden]': 'hidden()', '[class.solid]': 'solid()' },
  template: `
    <div class="bar page">
      <a routerLink="/" class="brand" aria-label="Claro, inicio"><app-logo /></a>
      <nav aria-label="Secciones">
        @for (l of links; track l.id) {
          <button type="button" (click)="clinic.go(l.id)">{{ l.label }}</button>
        }
      </nav>
      <div class="end">
        <button type="button" class="btn cta" (click)="clinic.book()">Agenda una sesión</button>
        <button type="button" class="menu-btn" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="menu" aria-label="Menú">
          <span></span><span></span>
        </button>
      </div>
    </div>
    @if (open() || closing()) {
      <div id="menu" class="sheet" [class.closing]="closing()">
        <nav aria-label="Menú">
          @for (l of links; track l.id; let i = $index) {
            <button type="button" [style.--i]="i" (click)="goTo(l.id)">{{ l.label }}<app-icon name="arrow-right" [size]="22" /></button>
          }
        </nav>
        <p class="crisis">¿En crisis? Línea de la Vida: <b>800 911 2000</b> (24 h, gratis)</p>
        <button type="button" class="btn amber" (click)="goTo('agenda')">Agenda una sesión <app-icon name="calendar" [size]="18" /></button>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0 0 auto; z-index: var(--z-header); transition: translate 420ms var(--ease-out), background-color 300ms ease, box-shadow 300ms ease; }
    :host(.solid) { background: color-mix(in oklch, var(--mist) 88%, transparent); backdrop-filter: blur(14px) saturate(1.3); box-shadow: 0 1px 0 var(--line); }
    :host(.hidden) { translate: 0 -100%; }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; height: 74px; }
    .brand { position: relative; z-index: 2; transition: scale 160ms var(--ease-out); }
    .brand:active { scale: 0.96; }
    nav { display: flex; gap: 4px; }
    nav button { position: relative; padding: 10px 14px; font-size: 0.93rem; font-weight: 560; color: var(--forest-2); border-radius: 999px; transition: color 200ms ease, background-color 200ms ease, scale 160ms var(--ease-out); }
    nav button:active { scale: 0.95; }
    @media (hover: hover) and (pointer: fine) { nav button:hover { color: var(--forest); background: var(--mist-2); } }
    .end { display: flex; align-items: center; gap: 12px; }
    .cta { min-height: 44px; padding: 0 20px; font-size: 0.9rem; }
    .menu-btn { display: none; position: relative; z-index: 2; width: 46px; height: 46px; border-radius: 50%; background: var(--forest); transition: scale 160ms var(--ease-out); }
    .menu-btn:active { scale: 0.92; }
    .menu-btn span { position: absolute; left: 14px; right: 14px; height: 2px; border-radius: 2px; background: var(--mist); transition: translate 300ms var(--ease-out), rotate 300ms var(--ease-out); }
    .menu-btn span:first-child { top: 19px; }
    .menu-btn span:last-child { top: 26px; }
    .menu-btn[aria-expanded='true'] span:first-child { translate: 0 3.5px; rotate: 45deg; }
    .menu-btn[aria-expanded='true'] span:last-child { translate: 0 -3.5px; rotate: -45deg; }
    .sheet { position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; gap: 26px; padding: 100px var(--gutter) 32px; background: var(--mist); animation: sheet-in 380ms var(--ease-out) both; }
    .sheet.closing { animation: sheet-out 220ms ease-in both; }
    @keyframes sheet-in { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes sheet-out { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 0 100% 0); } }
    .sheet nav { flex-direction: column; gap: 0; }
    .sheet nav button { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-radius: 0; border-bottom: 1px solid var(--line); font-family: var(--font-display); font-size: 2rem; font-weight: 420; color: var(--forest); text-align: left; animation: item-in 520ms var(--ease-expo) both; animation-delay: calc(80ms + var(--i) * 45ms); }
    @keyframes item-in { from { opacity: 0; translate: 0 18px; } }
    .sheet .btn { margin-top: auto; }
    .crisis { font-size: 0.9rem; color: var(--forest-2); }
    @media (max-width: 1060px) {
      nav { display: none; }
      .sheet nav { display: flex; }
      .menu-btn { display: block; }
    }
    @media (max-width: 560px) {
      .cta { display: none; }
    }
  `,
})
export class Header {
  protected readonly clinic = inject(Practice);
  private readonly motion = inject(Motion);
  protected readonly links = LINKS;
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
        if (!this.open()) this.hidden.set(y > 400 && y > last + 4 ? true : y < last - 4 ? false : this.hidden());
        last = y;
      };
      addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => {
        removeEventListener('scroll', onScroll);
      });
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
    setTimeout(() => this.closing.set(false), 220);
  }

  protected goTo(id: string) {
    this.close();
    setTimeout(() => this.clinic.go(id), 60);
  }
}
