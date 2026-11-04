import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, RouterLink],
  template: `
    <header class="nav" [class.is-solid]="solid()" [class.is-hidden]="hidden() && !open()" [class.is-open]="open()">
      <div class="bar">
        <a routerLink="/" class="brand" aria-label="Forja, ir al inicio" (click)="close()"><app-logo /></a>
        <nav class="links" aria-label="Principal">
          @for (item of nav; track item.href; let i = $index) {
            <a routerLink="/" [fragment]="item.href.slice(1)" class="link"><span>0{{ i + 1 }}</span>{{ item.label }}</a>
          }
        </nav>
        <a routerLink="/" fragment="contacto" class="btn cta">Clase gratis</a>
        <button class="burger" type="button" [attr.aria-expanded]="open()" aria-controls="menu-forja" (click)="open.set(!open())">
          <span class="visually-hidden">{{ open() ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <i></i><i></i>
        </button>
      </div>

      <div class="panel" id="menu-forja" [attr.aria-hidden]="!open()">
        <nav aria-label="Menú móvil">
          @for (item of nav; track item.href; let i = $index) {
            <a routerLink="/" [fragment]="item.href.slice(1)" class="big" [style.--i]="i" (click)="close()" [attr.tabindex]="open() ? 0 : -1">
              <small>0{{ i + 1 }}</small>{{ item.label }}
            </a>
          }
        </nav>
        <div class="panel-foot">
          <span><app-icon name="pin" [size]="16" /> {{ contact.address }}</span>
          <span><app-icon name="clock" [size]="16" /> Lun – Vie {{ contact.hours[0].time }}</span>
        </div>
      </div>
    </header>
  `,
  styles: `
    .nav { position: fixed; inset: 0 0 auto; z-index: 60; transition: transform 500ms var(--ease-expo); }
    .nav.is-hidden { transform: translateY(-100%); }
    .bar {
      position: relative; z-index: 2; display: flex; align-items: center; gap: 28px; height: 78px; padding: 0 var(--gutter);
      background: linear-gradient(rgb(11 11 12 / 70%), rgb(11 11 12 / 0%)); transition: background-color 400ms ease, box-shadow 400ms ease;
    }
    .nav.is-solid .bar { background: rgb(11 11 12 / 86%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 1px 0 var(--line); }
    .links { display: flex; gap: 6px; margin-left: auto; }
    .link { position: relative; display: flex; align-items: baseline; gap: 6px; padding: 10px 12px; font-size: 0.8rem; font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-2); transition: color 250ms ease; }
    .link span { font-family: var(--font-mono); font-size: 0.62rem; color: var(--muted); transition: color 250ms ease; }
    .link::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px; background: var(--ember); transform: scaleX(0); transform-origin: right; transition: transform 450ms var(--ease-expo); }
    @media (hover: hover) {
      .link:hover { color: var(--ink); }
      .link:hover span { color: var(--ember); }
      .link:hover::after { transform: scaleX(1); transform-origin: left; }
    }
    .cta { min-height: 44px; padding: 0 20px; font-size: 0.75rem; }
    .burger { display: none; position: relative; width: 48px; height: 48px; margin-left: auto; background: var(--ember); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
    .burger i { position: absolute; left: 13px; right: 13px; height: 2px; background: var(--bg); transition: transform 400ms var(--ease-expo), top 400ms var(--ease-expo); }
    .burger i:first-of-type { top: 19px; }
    .burger i:last-of-type { top: 27px; }
    .is-open .burger i:first-of-type { top: 23px; transform: rotate(45deg); }
    .is-open .burger i:last-of-type { top: 23px; transform: rotate(-45deg); }
    .panel { display: none; }

    @media (max-width: 980px) {
      .links, .cta { display: none; }
      .burger { display: block; }
      .panel {
        display: flex; flex-direction: column; justify-content: space-between; position: fixed; inset: 0; z-index: 1; padding: 110px var(--gutter) 32px;
        background: var(--bg-2); clip-path: inset(0 0 100% 0); transition: clip-path 700ms var(--ease-in-out); visibility: hidden;
      }
      .is-open .panel { clip-path: inset(0 0 0 0); visibility: visible; }
      .panel nav { display: flex; flex-direction: column; }
      .big {
        display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--line);
        font-family: var(--font-display); font-size: clamp(2.8rem, 13vw, 4.6rem); line-height: 1; text-transform: uppercase;
        transform: translateY(30px); opacity: 0; transition: transform 600ms var(--ease-expo), opacity 400ms ease, color 200ms ease;
      }
      .big small { font-family: var(--font-mono); font-size: 0.7rem; color: var(--ember); margin-top: 8px; }
      .big:active { color: var(--ember); }
      .is-open .big { transform: none; opacity: 1; transition-delay: calc(250ms + var(--i) * 60ms); }
      .panel-foot { display: flex; flex-direction: column; gap: 10px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); }
      .panel-foot span { display: flex; align-items: center; gap: 8px; }
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
        this.solid.set(y > 60);
        this.hidden.set(y > 400 && y > last + 2);
        if (y < last - 2) this.hidden.set(false);
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
