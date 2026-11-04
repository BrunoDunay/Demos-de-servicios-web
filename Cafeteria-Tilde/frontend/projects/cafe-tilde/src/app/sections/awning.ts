import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, effect, inject, signal } from '@angular/core';
import { NAV_LEFT, NAV_RIGHT } from '../core/content';
import { Order } from '../core/order';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

/** Encabezado: una barra crema con el toldo a rayas colgando debajo, como la entrada del café. */
@Component({
  selector: 'app-awning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    <header class="head" [class.tucked]="tucked()" [class.open]="open()">
      <div class="bar">
        <nav class="side left" aria-label="Principal">
          @for (n of left; track n.href) {
            <a [href]="n.href" class="nav-link">{{ n.label }}</a>
          }
        </nav>
        <a href="#inicio" class="brand" aria-label="Tilde, ir al inicio" (click)="open.set(false)"><app-logo /></a>
        <div class="side right">
          <nav aria-label="Secundario" class="right-links">
            @for (n of right; track n.href) {
              <a [href]="n.href" class="nav-link">{{ n.label }}</a>
            }
          </nav>
          <button type="button" class="bag" [class.bump]="bumping()" (click)="order.open.set(true)" [attr.aria-label]="'Abrir tu bolsa, ' + order.count() + ' productos'">
            <app-icon name="bag" [size]="19" />
            <span class="count" [class.has]="order.count() > 0">{{ order.count() }}</span>
          </button>
          <button type="button" class="burger" [attr.aria-expanded]="open()" aria-controls="menu-movil" (click)="open.set(!open())">
            <span class="visually-hidden">{{ open() ? 'Cerrar menú' : 'Abrir menú' }}</span>
            <app-icon [name]="open() ? 'close' : 'menu'" [size]="22" />
          </button>
        </div>
      </div>
      <div class="valance" aria-hidden="true"></div>
      <nav class="drop" id="menu-movil" aria-label="Menú móvil" [attr.aria-hidden]="!open()">
        @for (n of all; track n.href; let i = $index) {
          <a [href]="n.href" [style.--i]="i" (click)="open.set(false)" [attr.tabindex]="open() ? 0 : -1">{{ n.label }}</a>
        }
      </nav>
    </header>
  `,
  styles: `
    .head { position: fixed; inset: 0 0 auto; z-index: 50; }
    .bar {
      position: relative; z-index: 2; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px;
      height: 74px; padding: 0 var(--gutter); background: var(--crema);
      transition: height 300ms var(--ease-out);
    }
    .tucked .bar { height: 62px; }
    .side { display: flex; align-items: center; gap: 6px; }
    .right { justify-content: flex-end; }
    .right-links { display: flex; gap: 6px; }
    .nav-link { padding: 8px 12px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; transition: background-color 200ms ease, color 200ms ease; }
    @media (hover: hover) { .nav-link:hover { background: var(--crema-2); color: var(--jitomate-hondo); } }
    .brand { justify-self: center; }
    .bag { position: relative; display: grid; place-items: center; width: 48px; height: 48px; margin-left: 6px; border-radius: 14px; background: var(--cafe); color: var(--crema); box-shadow: 0 4px 0 oklch(18% 0.04 45); transition: transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out); }
    .bag:active { transform: translateY(3px); box-shadow: 0 1px 0 oklch(18% 0.04 45); }
    .count { position: absolute; right: -6px; top: -6px; display: grid; place-items: center; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 999px; background: var(--crema-2); color: var(--cafe); font-size: 0.75rem; font-weight: 800; box-shadow: 0 0 0 2px var(--crema); transition: background-color 200ms ease; }
    .count.has { background: var(--mantequilla); }
    .bag.bump { animation: bump 420ms var(--ease-out); }
    @keyframes bump { 35% { transform: translateY(-5px) rotate(-6deg); } }
    .burger { display: none; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: var(--crema-2); transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .burger:active { scale: 0.94; }

    /* Toldo: rayas jitomate/crema y orilla ondulada (cada onda cae justo en una raya) */
    .valance {
      position: relative; z-index: 1; height: 34px; margin-top: -1px;
      background: repeating-linear-gradient(90deg, var(--jitomate) 0 32px, var(--leche) 32px 64px);
      -webkit-mask: radial-gradient(16px 14px at 16px 20px, #000 98%, transparent) 0 0 / 32px 34px repeat-x, linear-gradient(#000 0 0) top / 100% 20px no-repeat;
      mask: radial-gradient(16px 14px at 16px 20px, #000 98%, transparent) 0 0 / 32px 34px repeat-x, linear-gradient(#000 0 0) top / 100% 20px no-repeat;
      transform-origin: top; transition: transform 300ms var(--ease-out);
      filter: drop-shadow(0 6px 4px color-mix(in oklch, var(--cafe) 18%, transparent));
    }
    .tucked .valance { transform: scaleY(0.62); }
    .drop { display: none; }

    @media (max-width: 860px) {
      .bar { grid-template-columns: auto 1fr auto; }
      .left, .right-links { display: none; }
      .brand { grid-column: 1; justify-self: start; }
      .right { grid-column: 3; }
      .burger { display: grid; }
      .drop {
        display: grid; position: absolute; left: var(--gutter); right: var(--gutter); top: calc(100% - 6px); z-index: 0; padding: 26px 22px 18px;
        background: var(--cafe); border-radius: 0 0 22px 22px; color: var(--crema);
        clip-path: inset(0 0 100% 0); visibility: hidden; transition: clip-path 300ms var(--ease-out), visibility 0s 300ms;
      }
      .open .drop { clip-path: inset(0 0 0 0); visibility: visible; transition: clip-path 300ms var(--ease-out); }
      .drop a { padding: 12px 4px; border-bottom: 1px solid color-mix(in oklch, var(--crema) 14%, transparent); font-family: var(--font-display); font-size: 1.9rem; opacity: 0; translate: 0 8px; transition: opacity 250ms ease, translate 300ms var(--ease-out); }
      .drop a:last-child { border-bottom: 0; }
      .open .drop a { opacity: 1; translate: none; transition-delay: calc(60ms + var(--i) * 40ms); }
    }
  `,
})
export class Awning {
  protected readonly order = inject(Order);
  protected readonly left = NAV_LEFT;
  protected readonly right = NAV_RIGHT;
  protected readonly all = [...NAV_LEFT, ...NAV_RIGHT];
  protected readonly tucked = signal(false);
  protected readonly open = signal(false);
  protected readonly bumping = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    let timer: ReturnType<typeof setTimeout> | undefined;
    effect(() => {
      if (!this.order.bump()) return;
      this.bumping.set(false);
      requestAnimationFrame(() => this.bumping.set(true));
      clearTimeout(timer);
      timer = setTimeout(() => this.bumping.set(false), 450);
    });
    afterNextRender(() => {
      const onScroll = () => this.tucked.set(window.scrollY > 40);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.open.set(false);
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
      });
    });
  }
}
