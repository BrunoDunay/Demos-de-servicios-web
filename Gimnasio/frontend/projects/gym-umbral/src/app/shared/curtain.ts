import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PageTransition } from '../core/transition';

/**
 * Telón de transición entre páginas (lo mueve core/transition.ts): un panel cálido con un hueco
 * en forma de arco. Al salir, el panel sube y el arco se dibuja; al llegar, el hueco del arco
 * crece hasta cubrir la pantalla y deja ver la página nueva.
 */
@Component({
  selector: 'app-curtain',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg class="panel" [attr.viewBox]="'0 0 ' + w() + ' ' + h()" preserveAspectRatio="none">
      <defs>
        <mask id="curtain-hole" maskUnits="userSpaceOnUse" x="0" y="0" [attr.width]="w()" [attr.height]="h()">
          <rect [attr.width]="w()" [attr.height]="h()" fill="#fff" />
          <g [attr.transform]="'translate(' + w() / 2 + ' ' + h() / 2 + ')'">
            <path class="hole" d="M-24 34V-10A24 24 0 0 1 24 -10V34Z" fill="#000" transform="scale(0)" />
          </g>
        </mask>
        <linearGradient id="curtain-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a1712" />
          <stop offset="1" stop-color="#0d0c0a" />
        </linearGradient>
      </defs>
      <rect [attr.width]="w()" [attr.height]="h()" fill="url(#curtain-bg)" mask="url(#curtain-hole)" />
      <g class="mark" [attr.transform]="'translate(' + w() / 2 + ' ' + h() / 2 + ')'">
        <path class="arch" d="M-24 34V-10A24 24 0 0 1 24 -10V34" pathLength="1" />
        <path class="beam" d="M0 -24V34" />
        <path class="base" d="M-36 34H36" />
      </g>
    </svg>
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 150; visibility: hidden; pointer-events: none; }
    .panel { position: absolute; inset: 0; width: 100%; height: 100%; }
    .arch, .base { fill: none; stroke: var(--gold); stroke-width: 1.4; stroke-linecap: round; }
    .arch { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .beam { stroke: var(--glow); stroke-width: 1.4; stroke-linecap: round; filter: drop-shadow(0 0 6px #f3d5a1); opacity: 0; }
    .base { opacity: 0; }
  `,
})
export class Curtain {
  protected readonly w = signal(1440);
  protected readonly h = signal(900);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const transition = inject(PageTransition);
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const fit = () => {
        this.w.set(innerWidth);
        this.h.set(innerHeight);
      };
      fit();
      window.addEventListener('resize', fit);
      transition.register(host);
      const sub = router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => transition.reveal());
      destroyRef.onDestroy(() => {
        sub.unsubscribe();
        window.removeEventListener('resize', fit);
      });
    });
  }
}
