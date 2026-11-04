import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Umbral: un arco de puerta con una línea de luz cálida en el centro (el umbral). */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo' },
  template: `
    <svg class="mark" viewBox="0 0 40 48" aria-hidden="true">
      <path class="arch" d="M8 44V18a12 12 0 0 1 24 0v26" pathLength="1" />
      <path class="beam" d="M20 12v32" />
      <path class="base" d="M2 44h36" />
    </svg>
    @if (withText()) {
      <span class="word">
        <b>UMBRAL</b>
        <small>Boutique fitness club</small>
      </span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 14px; color: var(--ink); }
    .mark { width: 30px; height: 36px; flex: none; overflow: visible; }
    .arch, .base { fill: none; stroke: var(--gold); stroke-width: 1.6; stroke-linecap: round; }
    .arch { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 900ms var(--ease-out); }
    .beam { stroke: var(--glow); stroke-width: 1.4; stroke-linecap: round; filter: drop-shadow(0 0 3px rgb(243 213 161 / 70%)); transition: filter 500ms ease; }
    .word { display: flex; flex-direction: column; line-height: 1; }
    b { font-weight: 500; font-size: 1rem; letter-spacing: 0.46em; margin-right: -0.46em; }
    small { margin-top: 6px; font-size: 0.5rem; font-weight: 600; letter-spacing: 0.34em; text-transform: uppercase; color: var(--muted); }
    @media (hover: hover) {
      :host(:hover) .arch { animation: redraw 1s var(--ease-out); }
      :host(:hover) .beam { filter: drop-shadow(0 0 6px rgb(243 213 161 / 100%)) drop-shadow(0 0 12px rgb(243 213 161 / 60%)); }
    }
    @keyframes redraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  `,
})
export class Logo {
  readonly withText = input(true);
}
