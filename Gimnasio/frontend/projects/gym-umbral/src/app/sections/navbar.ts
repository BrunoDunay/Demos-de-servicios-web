import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CONTACT, NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, RouterLink, RouterLinkActive],
  template: `
    <header class="nav" [class.is-solid]="solid()" [class.is-hidden]="hidden() && !open()" [class.is-open]="open()">
      <div class="bar">
        <a routerLink="/" class="brand" aria-label="Umbral, ir al inicio" (click)="close()"><app-logo /></a>
        <nav class="links" aria-label="Principal">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="is-active" class="link">{{ item.label }}</a>
          }
        </nav>
        <a routerLink="/contacto" class="btn cta" data-cursor="RESERVA">Reservar</a>
        <button class="burger" type="button" [attr.aria-expanded]="open()" aria-controls="menu-umbral" (click)="open.set(!open())">
          <span class="visually-hidden">{{ open() ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <i></i><i></i>
        </button>
      </div>

      <div class="panel" id="menu-umbral" [attr.aria-hidden]="!open()">
        <nav aria-label="Menú móvil">
          <a routerLink="/" class="big" style="--i: 0" (click)="close()" [attr.tabindex]="open() ? 0 : -1"><small>00</small><em>Inicio</em></a>
          @for (item of nav; track item.path; let i = $index) {
            <a [routerLink]="item.path" class="big" [style.--i]="i + 1" (click)="close()" [attr.tabindex]="open() ? 0 : -1"><small>0{{ i + 1 }}</small><em>{{ item.label }}</em></a>
          }
        </nav>
        <div class="panel-foot">
          <span><app-icon name="pin" [size]="16" /> {{ contact.address }}</span>
          <span><app-icon name="clock" [size]="16" /> {{ contact.hours[0].days }} · {{ contact.hours[0].time }}</span>
        </div>
      </div>
    </header>
  `,
  styles: `
    .nav { position: fixed; inset: 0 0 auto; z-index: 60; transition: transform 700ms var(--ease-out); }
    .nav.is-hidden { transform: translateY(-100%); }
    .bar { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 92px; padding: 0 var(--gutter); transition: background-color 500ms ease, height 500ms var(--ease-out), box-shadow 500ms ease; }
    .nav.is-solid .bar { height: 76px; background: rgb(13 12 10 / 78%); backdrop-filter: blur(18px) saturate(1.2); -webkit-backdrop-filter: blur(18px) saturate(1.2); box-shadow: 0 1px 0 var(--line); }
    .brand { justify-self: start; }
    .links { display: flex; gap: 38px; }
    .link { position: relative; padding: 8px 0; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-2); transition: color 300ms ease; }
    .link::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--gold); transform: scaleX(0); transform-origin: right; transition: transform 600ms var(--ease-out); }
    .link.is-active { color: var(--ink); }
    @media (hover: hover) and (pointer: fine) { .link:hover { color: var(--ink); } }
    .link.is-active::after { transform: scaleX(1); transform-origin: left; }
    @media (hover: hover) and (pointer: fine) { .link:hover::after { transform: scaleX(1); transform-origin: left; } }
    .cta { justify-self: end; min-height: 46px; padding: 0 24px; font-size: 0.7rem; }
    .burger { display: none; justify-self: end; position: relative; width: 46px; height: 46px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--line-2); transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .burger:active { scale: 0.94; }
    .burger i { position: absolute; left: 14px; right: 14px; height: 1px; background: var(--ink); transition: transform 500ms var(--ease-out), top 500ms var(--ease-out); }
    .burger i:first-of-type { top: 19px; }
    .burger i:last-of-type { top: 26px; }
    .is-open .burger i:first-of-type { top: 22.5px; transform: rotate(45deg); }
    .is-open .burger i:last-of-type { top: 22.5px; transform: rotate(-45deg); }
    .panel { display: none; }
    @media (max-width: 1020px) {
      .bar { grid-template-columns: 1fr auto; }
      .links, .cta { display: none; }
      .burger { display: block; }
      .panel {
        display: flex; flex-direction: column; justify-content: space-between; position: fixed; inset: 0; z-index: 1; padding: 120px var(--gutter) 36px;
        background: var(--bg-2); clip-path: circle(0% at calc(100% - var(--gutter) - 23px) 46px); visibility: hidden; transition: clip-path 520ms var(--ease-in-out), visibility 0s 520ms;
      }
      .is-open .panel { clip-path: circle(150% at calc(100% - var(--gutter) - 23px) 46px); visibility: visible; transition: clip-path 900ms var(--ease-in-out); }
      .panel nav { display: flex; flex-direction: column; gap: 6px; }
      .big { display: flex; align-items: baseline; gap: 16px; font-size: clamp(2.8rem, 12vw, 4.4rem); line-height: 1.1; opacity: 0; transform: translateY(24px); transition: opacity 600ms ease, transform 800ms var(--ease-out), color 300ms ease; }
      .big small { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; color: var(--gold); }
      .big:active { color: var(--gold); }
      .is-open .big { opacity: 1; transform: none; transition-delay: calc(300ms + var(--i) * 70ms); }
      .panel-foot { display: flex; flex-direction: column; gap: 10px; font-size: 0.82rem; color: var(--muted); }
      .panel-foot span { display: flex; gap: 10px; align-items: center; }
    }
  `,
})
export class Navbar {
  protected readonly nav = NAV;
  protected readonly contact = CONTACT;
  protected readonly solid = signal(false);
  protected readonly hidden = signal(false);
  protected readonly open = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        this.solid.set(y > 40);
        if (y > 500 && y > last + 3) this.hidden.set(true);
        else if (y < last - 3 || y < 500) this.hidden.set(false);
        last = y;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.close();
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
      });
    });
  }

  protected close() {
    this.open.set(false);
  }
}
