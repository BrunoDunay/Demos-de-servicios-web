import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Marfil: un diente de un solo trazo con un destello, y el nombre en Outfit. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <path class="tooth" d="M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z" />
        <path class="spark" d="M24.5 3.5v5M22 6h5" />
      </svg>
    </span>
    @if (word()) {
      <span class="word">marfil<small>odontología</small></span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: inherit; }
    .badge { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 13px; background: var(--royal); color: var(--white); box-shadow: var(--shadow-blue); transition: rotate 500ms var(--ease-bounce), scale 300ms var(--ease-out); }
    .mark { width: 26px; height: 26px; overflow: visible; }
    .tooth { fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
    .spark { fill: none; stroke: var(--sky); stroke-width: 2; stroke-linecap: round; transform-origin: 24.5px 6px; transition: rotate 600ms var(--ease-bounce), scale 400ms var(--ease-bounce); }
    .word { display: grid; font-family: var(--font-display); font-size: 1.45rem; font-weight: 700; letter-spacing: -0.04em; line-height: 0.9; }
    .word small { font-size: 0.62rem; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.65; }
    @media (hover: hover) and (pointer: fine) {
      :host(:hover) .badge { rotate: -8deg; scale: 1.05; }
      :host(:hover) .spark { rotate: 90deg; scale: 1.3; }
    }
  `,
})
export class Logo {
  readonly word = input(true);
}
