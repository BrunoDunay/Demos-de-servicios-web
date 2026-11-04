import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { CONTACT, NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    <header class="nav" [class.is-solid]="solid() || open()" [class.is-open]="open()">
      <div class="bar container">
        <a href="#inicio" class="brand" aria-label="Alero, ir al inicio" (click)="close()"><app-logo [light]="!solid() && !open()" /></a>
        <nav class="links" aria-label="Principal">
          @for (item of nav; track item.href) {
            <a [href]="item.href" class="link">{{ item.label }}</a>
          }
        </nav>
        <span class="phone"><app-icon name="phone" [size]="16" /> {{ contact.phone }}</span>
        <a href="#contacto" class="btn btn-brass cta">Agendar visita</a>
        <button class="burger" type="button" [attr.aria-expanded]="open()" aria-controls="menu-movil" (click)="open.set(!open())">
          <span class="visually-hidden">{{ open() ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <app-icon [name]="open() ? 'close' : 'menu'" [size]="22" />
        </button>
      </div>
      <div class="sheet" id="menu-movil" [attr.aria-hidden]="!open()">
        <nav aria-label="Menú móvil" class="container">
          @for (item of nav; track item.href; let i = $index) {
            <a [href]="item.href" class="sheet-link" [style.--i]="i" (click)="close()" [attr.tabindex]="open() ? 0 : -1">
              <span>0{{ i + 1 }}</span>{{ item.label }}
            </a>
          }
          <a href="#contacto" class="btn btn-brass sheet-cta" (click)="close()" [attr.tabindex]="open() ? 0 : -1">Agendar una visita</a>
        </nav>
      </div>
    </header>
  `,
  styles: `
    .nav { position: fixed; inset: 0 0 auto; z-index: 50; color: #fff; transition: color 300ms ease; }
    .nav::before { content: ''; position: absolute; inset: 0; background: rgb(255 255 255 / 92%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 1px 0 var(--line); opacity: 0; transition: opacity 350ms ease; }
    .nav.is-solid { color: var(--ink); }
    .nav.is-solid::before { opacity: 1; }
    .bar { position: relative; display: flex; align-items: center; gap: 26px; height: 78px; }
    .links { display: flex; gap: 4px; margin-left: auto; }
    .link { position: relative; padding: 10px 12px; font-weight: 600; font-size: 0.92rem; opacity: 0.88; transition: opacity 200ms ease; }
    .link::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 5px; height: 2px; background: var(--brass); transform: scaleX(0); transform-origin: right; transition: transform 400ms var(--ease-out); }
    @media (hover: hover) {
      .link:hover { opacity: 1; }
      .link:hover::after { transform: scaleX(1); transform-origin: left; }
    }
    .phone { display: flex; align-items: center; gap: 6px; font-size: 0.88rem; font-weight: 600; opacity: 0.85; }
    .cta { min-height: 44px; padding: 0 18px; font-size: 0.9rem; }
    .burger { display: none; width: 46px; height: 46px; border-radius: 12px; place-items: center; margin-left: auto; background: rgb(255 255 255 / 14%); transition: background-color 300ms ease, transform 200ms var(--ease-out); }
    .is-solid .burger { background: var(--pine-soft); }
    .burger:active { transform: scale(0.94); }
    .sheet { display: none; }

    @media (max-width: 1100px) { .phone { display: none; } }
    @media (max-width: 920px) {
      .links, .cta { display: none; }
      .burger { display: grid; }
      .sheet {
        display: block; position: absolute; left: 0; right: 0; top: 100%; padding: 8px 0 28px; background: #fff; color: var(--ink); box-shadow: var(--shadow);
        clip-path: inset(0 0 100% 0); visibility: hidden; transition: clip-path 320ms var(--ease-in-out), visibility 0s 320ms;
      }
      .nav.is-open .sheet { clip-path: inset(0 0 0 0); visibility: visible; transition: clip-path 550ms var(--ease-in-out); }
      .sheet nav { display: grid; }
      .sheet-link {
        display: flex; align-items: baseline; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); font-family: var(--font-display); font-size: 2rem;
        opacity: 0; transform: translateY(12px); transition: opacity 400ms var(--ease-out), transform 500ms var(--ease-out);
      }
      .sheet-link span { font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; color: var(--brass); }
      .nav.is-open .sheet-link { opacity: 1; transform: none; transition-delay: calc(150ms + var(--i) * 50ms); }
      .sheet-cta { margin-top: 22px; }
    }
  `,
})
export class Navbar {
  protected readonly nav = NAV;
  protected readonly contact = CONTACT;
  protected readonly solid = signal(false);
  protected readonly open = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.solid.set(window.scrollY > 60);
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
