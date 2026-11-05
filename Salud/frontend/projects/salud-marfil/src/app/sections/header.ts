import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Clinic, openStatus } from '../core/clinic';
import { Motion } from '../core/motion';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';


const LINKS = [
  { id: 'tratamientos', label: 'Tratamientos' },
  { id: 'simulador', label: 'Blanqueamiento' },
  { id: 'equipo', label: 'Equipo' },
  { id: 'precios', label: 'Precios' },
  { id: 'visitanos', label: 'Visítanos' },
];

/**
 * Barra flotante de vidrio. Al pasar el cursor por los enlaces, una píldora blanca se desliza
 * debajo del enlace (transitions.dev "Tabs sliding"). En celular, menú a pantalla completa.
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon],
  host: { '[class.hidden]': 'hidden()', '[class.scrolled]': 'scrolled()' },
  template: `
    <div class="bar">
      <a routerLink="/" class="brand" aria-label="Marfil, inicio"><app-logo /></a>
      <nav aria-label="Secciones" #nav (pointerleave)="hover(null)">
        <span class="hl" #hl aria-hidden="true"></span>
        @for (l of links; track l.id) {
          <button type="button" (click)="clinic.go(l.id)" (pointerenter)="hover($event.currentTarget)" (focus)="hover($event.currentTarget)">{{ l.label }}</button>
        }
      </nav>
      <div class="end">
        @if (status(); as s) {
          <span class="status" [class.open]="s.open"><i></i>{{ s.open ? 'Abierto' : 'Cerrado' }}</span>
        }
        <button type="button" class="btn cta" (click)="clinic.book()"><span class="t">Agendar cita</span><span class="ic"><app-icon name="calendar" [size]="15" [stroke]="2.4" /></span></button>
        <button type="button" class="menu-btn" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="menu" aria-label="Menú">
          <span></span><span></span>
        </button>
      </div>
    </div>
    @if (open() || closing()) {
      <div id="menu" class="sheet" [class.closing]="closing()">
        <nav aria-label="Menú">
          @for (l of links; track l.id; let i = $index) {
            <button type="button" [style.--i]="i" (click)="goTo(l.id)"><small>0{{ i + 1 }}</small>{{ l.label }}<app-icon name="arrow-up-right" [size]="22" /></button>
          }
        </nav>
        @if (status(); as s) {
          <p class="sheet-status"><span class="status" [class.open]="s.open"><i></i>{{ s.text }}</span></p>
        }
        <button type="button" class="btn" (click)="goTo('agenda')">Agendar cita <app-icon name="calendar" [size]="18" /></button>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; left: 0; right: 0; top: 14px; z-index: var(--z-header); padding: 0 var(--gutter); transition: translate 450ms var(--ease-smooth-out); pointer-events: none; }
    :host(.hidden) { translate: 0 -130%; }
    .bar { pointer-events: auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: calc(var(--page) - var(--gutter) * 2 + 24px); margin: 0 auto; padding: 8px 8px 8px 10px; border-radius: 999px; background: var(--glass); backdrop-filter: blur(18px) saturate(1.6); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.6), var(--shadow-s); transition: box-shadow 300ms ease, background-color 300ms ease; }
    :host(.scrolled) .bar { background: oklch(99% 0.005 245 / 0.8); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.7), var(--shadow-m); }
    .brand { position: relative; z-index: 2; transition: scale 160ms var(--ease-out); }
    .brand:active { scale: 0.96; }
    nav { position: relative; display: flex; gap: 2px; }
    nav button { position: relative; z-index: 1; padding: 10px 16px; font-size: 0.92rem; font-weight: 600; color: var(--ink-2); border-radius: 999px; transition: color var(--duration-fast) var(--ease-smooth-out), scale 160ms var(--ease-out); }
    nav button:active { scale: 0.95; }
    .hl { position: absolute; top: 0; left: 0; height: 100%; width: 0; border-radius: 999px; background: var(--white); box-shadow: var(--shadow-s); opacity: 0; transition: transform var(--duration-fast) var(--ease-smooth-out), width var(--duration-fast) var(--ease-smooth-out), opacity 200ms ease; pointer-events: none; }
    nav.on .hl { opacity: 1; }
    @media (hover: hover) and (pointer: fine) { nav button:hover { color: var(--royal); } }
    .end { display: flex; align-items: center; gap: 10px; }
    .status { display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 650; color: var(--ink-2); background: var(--white); }
    .status i { width: 7px; height: 7px; border-radius: 50%; background: var(--closed); }
    .status.open i { background: var(--ok); box-shadow: 0 0 0 0 oklch(66% 0.15 155 / 0.5); animation: ping 2.2s var(--ease-out) infinite; }
    @keyframes ping { 70% { box-shadow: 0 0 0 7px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
    /* Al pasar el cursor el botón se oscurece y desde la derecha crece un círculo blanco con el calendario */
    .cta { flex: none; min-height: 44px; padding: 0 20px; gap: 0; font-size: 0.9rem; transition: background-color 300ms ease, padding 400ms var(--ease-smooth-out), scale 160ms var(--ease-out); }
    .cta::before, .cta::after { display: none; }
    .cta .ic { flex: none; display: grid; place-items: center; width: 0; height: 30px; margin-left: 0; border-radius: 50%; background: var(--white); color: var(--royal); scale: 0; overflow: hidden; transition: width 400ms var(--ease-smooth-out), margin-left 400ms var(--ease-smooth-out), scale 450ms var(--ease-bounce); }
    @media (hover: hover) and (pointer: fine) {
      .cta:hover { translate: none; background: var(--navy); padding-right: 7px; }
      .cta:hover .ic { width: 30px; margin-left: 10px; scale: 1; }
      .cta:hover .ic app-icon { animation: cal-flip 500ms var(--ease-bounce) 120ms; }
    }
    @keyframes cal-flip { 0% { rotate: -25deg; scale: 0.6; } 100% { rotate: 0deg; scale: 1; } }
    .menu-btn { display: none; position: relative; z-index: 2; width: 46px; height: 46px; border-radius: 50%; background: var(--navy); transition: scale 160ms var(--ease-out); }
    .menu-btn:active { scale: 0.92; }
    .menu-btn span { position: absolute; left: 14px; right: 14px; height: 2px; border-radius: 2px; background: var(--white); transition: translate 300ms var(--ease-out), rotate 300ms var(--ease-out); }
    .menu-btn span:first-child { top: 19px; }
    .menu-btn span:last-child { top: 26px; }
    .menu-btn[aria-expanded='true'] span:first-child { translate: 0 3.5px; rotate: 45deg; }
    .menu-btn[aria-expanded='true'] span:last-child { translate: 0 -3.5px; rotate: -45deg; }
    .sheet { pointer-events: auto; position: fixed; inset: 0; z-index: 1; display: flex; flex-direction: column; gap: 24px; padding: 100px var(--gutter) 30px; background: var(--navy); color: var(--white); animation: sheet-in 520ms var(--ease-smooth-out) both; }
    .sheet.closing { animation: sheet-out 260ms ease-in both; }
    @keyframes sheet-in { from { clip-path: circle(0 at calc(100% - 40px) 40px); } to { clip-path: circle(150% at calc(100% - 40px) 40px); } }
    @keyframes sheet-out { from { clip-path: circle(150% at calc(100% - 40px) 40px); } to { clip-path: circle(0 at calc(100% - 40px) 40px); } }
    .sheet nav { flex-direction: column; gap: 0; }
    .sheet nav button { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-radius: 0; border-bottom: 1px solid oklch(100% 0 0 / 0.12); font-family: var(--font-display); font-size: 2.1rem; font-weight: 300; color: var(--white); text-align: left; animation: t-text-in 520ms var(--ease-smooth-out) both; animation-delay: calc(120ms + var(--i) * 50ms); }
    .sheet nav button small { font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; color: var(--sky); }
    .sheet nav button .icon { margin-left: auto; color: var(--sky); }
    .sheet .btn { margin-top: auto; }
    .sheet-status .status { background: oklch(100% 0 0 / 0.1); color: var(--white); }
    @media (max-width: 1080px) {
      .bar nav { display: none; }
      .sheet nav { display: flex; }
      .menu-btn { display: block; }
    }
    @media (max-width: 560px) { .cta, .end > .status { display: none; } }
  `,
})
export class Header {
  protected readonly clinic = inject(Clinic);
  private readonly motion = inject(Motion);
  private readonly nav = viewChild<ElementRef<HTMLElement>>('nav');
  private readonly hl = viewChild<ElementRef<HTMLElement>>('hl');
  protected readonly links = LINKS;
  protected readonly open = signal(false);
  protected readonly closing = signal(false);
  protected readonly hidden = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly status = signal<{ open: boolean; text: string } | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.status.set(openStatus());
      const timer = setInterval(() => this.status.set(openStatus()), 60_000);
      let last = scrollY;
      const onScroll = () => {
        const y = scrollY;
        this.scrolled.set(y > 30);
        if (!this.open()) this.hidden.set(y > 500 && y > last + 4 ? true : y < last - 4 ? false : this.hidden());
        last = y;
      };
      addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => {
        clearInterval(timer);
        removeEventListener('scroll', onScroll);
      });
    });
  }

  /** Mueve la píldora debajo del enlace (o la esconde al salir del menú). */
  protected hover(target: EventTarget | null) {
    const nav = this.nav()?.nativeElement;
    const hl = this.hl()?.nativeElement;
    if (!nav || !hl) return;
    if (!(target instanceof HTMLElement)) {
      nav.classList.remove('on');
      return;
    }
    const first = !nav.classList.contains('on');
    if (first) hl.style.transition = 'opacity 200ms ease';
    hl.style.width = `${target.offsetWidth}px`;
    hl.style.transform = `translateX(${target.offsetLeft}px)`;
    nav.classList.add('on');
    if (first) requestAnimationFrame(() => (hl.style.transition = ''));
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
    setTimeout(() => this.closing.set(false), 260);
  }

  protected goTo(id: string) {
    this.close();
    setTimeout(() => this.clinic.go(id), 80);
  }
}
