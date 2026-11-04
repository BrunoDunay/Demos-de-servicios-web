import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Marfil: un diente de un solo trazo con un brillo (la luz de la lámpara) y el nombre. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
      <path class="tooth" d="M10.2 4.5c-3.6 0-5.7 2.8-5.7 6.3 0 2.8 1.1 4.7 2.1 7 .9 2.3 1.2 5 1.9 7.6.5 2 1.3 3.6 2.8 3.6 2.1 0 2.2-4 3-6.6.4-1.3 1-1.9 1.7-1.9s1.3.6 1.7 1.9c.8 2.6.9 6.6 3 6.6 1.5 0 2.3-1.6 2.8-3.6.7-2.6 1-5.3 1.9-7.6 1-2.3 2.1-4.2 2.1-7 0-3.5-2.1-6.3-5.7-6.3-2.6 0-3.8 1.3-5.8 1.3s-3.2-1.3-5.8-1.3z" />
      <path class="shine" d="M9.6 9.2c.4-1.4 1.4-2.2 2.6-2.4" />
    </svg>
    @if (word()) {
      <span class="word">Marfil</span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: inherit; }
    .mark { width: 30px; height: 30px; flex: none; overflow: visible; }
    .tooth { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
    .shine { fill: none; stroke: var(--mint); stroke-width: 2; stroke-linecap: round; transition: translate 500ms var(--ease-spring); }
    .word { font-family: var(--font-display); font-size: 1.55rem; font-weight: 460; letter-spacing: -0.02em; font-variation-settings: 'SOFT' 100, 'WONK' 0; line-height: 1; }
    @media (hover: hover) and (pointer: fine) {
      :host(:hover) .shine { translate: 1.2px -1.2px; }
    }
  `,
})
export class Logo {
  readonly word = input(true);
}
