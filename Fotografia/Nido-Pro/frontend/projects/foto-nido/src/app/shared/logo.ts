import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Nido: la palabra en itálica con una puntada de hilo rojo debajo, como el lomo cosido de un álbum. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--light]': 'light()' },
  template: `
    <span class="word">Nido</span>
    <svg class="stitch" viewBox="0 0 64 8" aria-hidden="true"><path d="M2 4h60" /></svg>
  `,
  styles: `
    :host { display: inline-flex; flex-direction: column; align-items: flex-start; color: var(--ink); line-height: 1; }
    .word { font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 2.1rem; letter-spacing: -0.02em; }
    .stitch { width: 100%; height: 6px; margin-top: 2px; overflow: visible; }
    .stitch path { fill: none; stroke: var(--hilo); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 6 5; transition: stroke-dashoffset 600ms var(--ease-out); }
    :host(.logo--light) { color: var(--paper); }
    @media (hover: hover) { :host(:hover) .stitch path { stroke-dashoffset: -22; } }
  `,
})
export class Logo {
  readonly light = input(false);
}
