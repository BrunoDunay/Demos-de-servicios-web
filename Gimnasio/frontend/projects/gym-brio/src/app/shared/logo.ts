import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logo de Brío (rediseño 4 nov 2026: ya no es un cuadro azul con el nombre al lado, para no parecerse a Marfil).
 * Solo la palabra "brío" en grueso, la chispa lima como acento de la í y un trazo lima de impulso debajo.
 * Al pasar el cursor la palabra se inclina hacia adelante (como en carrera), el trazo se vuelve a dibujar
 * de un jalón y la chispa gira.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--light]': 'light()' },
  template: `
    <span class="word" aria-label="Brío">
      <span class="letters">br<span class="i">ı<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1l2.3 6.7L19 10l-6.7 2.3L10 19l-2.3-6.7L1 10l6.7-2.3z" /></svg></span>o</span>
      <svg class="swoosh" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 12 C 30 13, 62 9, 97 3" /></svg>
    </span>
    <span class="tag" aria-hidden="true">gym<br />de barrio</span>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); }
    .word { position: relative; display: inline-block; padding-bottom: 4px; font-family: var(--font-display); font-weight: 800; font-size: 2rem; letter-spacing: -0.055em; line-height: 0.9; }
    .letters { display: inline-block; transform-origin: 0 100%; transition: transform 450ms var(--ease-back); }
    .i { position: relative; display: inline-block; }
    .i svg { position: absolute; left: 50%; top: -0.3em; width: 0.56em; height: 0.56em; transform: translateX(-38%); fill: var(--brand); transition: transform 600ms var(--ease-back); }
    .swoosh { position: absolute; left: -2%; right: -6%; bottom: -5px; width: 108%; height: 10px; overflow: visible; }
    .swoosh path { fill: none; stroke: var(--lime-ink); stroke-width: 4.5; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
    .tag { padding-left: 10px; border-left: 2px solid var(--line); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; line-height: 1.15; text-transform: uppercase; color: var(--muted); }
    :host(.logo--light) { color: #fff; }
    :host(.logo--light) .i svg { fill: var(--lime); }
    :host(.logo--light) .swoosh path { stroke: var(--lime); }
    :host(.logo--light) .tag { color: rgb(255 255 255 / 60%); border-color: rgb(255 255 255 / 20%); }
    @media (hover: hover) {
      :host(:hover) .letters { transform: skewX(-10deg) translateX(2px); }
      :host(:hover) .swoosh path { animation: dash 650ms var(--ease-out); }
      :host(:hover) .i svg { transform: translateX(-38%) rotate(180deg) scale(1.25); }
    }
    @keyframes dash { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @media (max-width: 380px) { .tag { display: none; } }
  `,
})
export class Logo {
  readonly light = input(false);
}
