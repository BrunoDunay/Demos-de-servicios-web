import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    <header class="nav" [class.is-scrolled]="scrolled()" [class.is-open]="open()">
      <div class="bar container">
        <a href="#inicio" class="brand" aria-label="Brío, ir al inicio" (click)="close()"><app-logo /></a>
        <nav class="links" aria-label="Principal">
          @for (item of nav; track item.href) {
            <a [href]="item.href" class="link">{{ item.label }}</a>
          }
        </nav>
        <a href="#contacto" class="btn btn-primary cta">Prueba gratis</a>
        <button class="burger" type="button" [attr.aria-expanded]="open()" aria-controls="menu-movil" (click)="toggle()">
          <span class="visually-hidden">{{ open() ? 'Cerrar menú' : 'Abrir menú' }}</span>
          <app-icon [name]="open() ? 'close' : 'menu'" [size]="22" />
        </button>
      </div>
      <div class="sheet" id="menu-movil" [attr.aria-hidden]="!open()">
        <nav aria-label="Menú móvil">
          @for (item of nav; track item.href; let i = $index) {
            <a [href]="item.href" class="sheet-link" [style.--i]="i" (click)="close()" [attr.tabindex]="open() ? 0 : -1">
              {{ item.label }} <app-icon name="arrow-up-right" [size]="22" />
            </a>
          }
        </nav>
        <a href="#contacto" class="btn btn-lime sheet-cta" (click)="close()" [attr.tabindex]="open() ? 0 : -1">Agenda tu clase gratis</a>
      </div>
    </header>
  `,
  styles: `
    .nav { position: fixed; inset: 0 0 auto; z-index: 50; padding-top: 14px; transition: padding 300ms var(--ease-out); }
    .bar {
      display: flex; align-items: center; gap: 24px; padding: 10px 10px 10px 18px;
      background: rgb(255 255 255 / 72%); backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
      border-radius: 999px; box-shadow: 0 0 0 1px rgb(18 19 26 / 6%);
      transition: box-shadow 300ms var(--ease-out), background-color 300ms ease;
    }
    .nav.is-scrolled { padding-top: 8px; }
    .nav.is-scrolled .bar { background: rgb(255 255 255 / 88%); box-shadow: 0 0 0 1px rgb(18 19 26 / 6%), var(--shadow); }
    .brand { display: inline-flex; }
    .links { display: flex; gap: 4px; margin-left: auto; }
    .link { position: relative; padding: 10px 14px; border-radius: 999px; font-weight: 550; font-size: 0.95rem; color: var(--ink-2); transition: color 200ms ease, background-color 200ms ease; }
    .link::after { content: ''; position: absolute; left: 50%; bottom: 6px; width: 4px; height: 4px; border-radius: 50%; background: var(--brand); transform: translateX(-50%) scale(0); transition: transform 300ms var(--ease-back); }
    @media (hover: hover) {
      .link:hover { color: var(--brand); background: var(--brand-soft); }
      .link:hover::after { transform: translateX(-50%) scale(1); }
    }
    .cta { min-height: 44px; padding: 0 20px; }
    .burger { display: none; width: 44px; height: 44px; border-radius: 50%; place-items: center; background: var(--ink); color: #fff; margin-left: auto; transition: transform 200ms var(--ease-out); }
    .burger:active { transform: scale(0.94); }
    .sheet { display: none; }

    @media (max-width: 960px) {
      .links, .cta { display: none; }
      .burger { display: grid; }
      .sheet {
        display: flex; flex-direction: column; gap: 24px; position: absolute; left: var(--gutter); right: var(--gutter); top: calc(100% + 8px);
        padding: 20px; border-radius: 28px; background: var(--ink); color: #fff;
        clip-path: inset(0 0 100% 0 round 28px); opacity: 0; pointer-events: none;
        transition: clip-path 300ms var(--ease-out), opacity 200ms ease;
      }
      .nav.is-open .sheet { clip-path: inset(0 0 0 0 round 28px); opacity: 1; pointer-events: auto; transition-duration: 500ms, 300ms; }
      .sheet nav { display: grid; }
      .sheet-link {
        display: flex; justify-content: space-between; align-items: center; padding: 14px 6px; border-bottom: 1px solid rgb(255 255 255 / 10%);
        font-family: var(--font-display); font-size: 1.9rem; font-weight: 700; letter-spacing: -0.03em;
        opacity: 0; transform: translateY(14px); transition: opacity 400ms var(--ease-out), transform 500ms var(--ease-out), color 200ms;
      }
      .nav.is-open .sheet-link { opacity: 1; transform: none; transition-delay: calc(120ms + var(--i) * 50ms); }
      .sheet-link:active { color: var(--lime); }
      .sheet-cta { width: 100%; }
    }
  `,
})
export class Navbar {
  protected readonly nav = NAV;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
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

  protected toggle() {
    this.open.update((v) => !v);
  }

  protected close() {
    this.open.set(false);
  }
}
