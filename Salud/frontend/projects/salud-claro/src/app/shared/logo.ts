import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Claro: un círculo abierto (el claro del bosque) con un punto de luz, y el nombre en itálica. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
      <path class="ring" d="M24.5 8.5A11 11 0 1 0 27 16" />
      <circle class="sun" cx="25.5" cy="11.8" r="2.4" />
    </svg>
    @if (word()) {
      <span class="word">Claro</span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: inherit; }
    .mark { width: 30px; height: 30px; flex: none; overflow: visible; }
    .ring { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
    .sun { fill: var(--amber); transition: translate 600ms var(--ease-out); }
    .word { font-family: var(--font-display); font-style: italic; font-size: 1.7rem; font-weight: 400; letter-spacing: -0.01em; line-height: 1; }
    @media (hover: hover) and (pointer: fine) { :host(:hover) .sun { translate: -1px 1.5px; } }
  `,
})
export class Logo {
  readonly word = input(true);
}
