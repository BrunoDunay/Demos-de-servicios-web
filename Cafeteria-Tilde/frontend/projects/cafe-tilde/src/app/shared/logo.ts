import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Tilde: la palabra en Abril Fatface y la virgulilla (~) como vapor sobre la "i". */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--light]': 'light()' },
  template: `
    <span class="word" aria-label="Tilde café">
      T<span class="i">ı<svg viewBox="0 0 30 12" aria-hidden="true"><path d="M2 9C6 2 10 2 15 6s9 4 13-3" /></svg></span>lde
    </span>
    <span class="sub" aria-hidden="true">café · Fresno 27</span>
  `,
  styles: `
    :host { display: inline-flex; flex-direction: column; align-items: center; line-height: 1; color: var(--cafe); }
    .word { font-family: var(--font-display); font-size: 2.1rem; letter-spacing: -0.01em; }
    .i { position: relative; display: inline-block; }
    .i svg { position: absolute; left: 50%; top: -0.08em; width: 0.62em; translate: -50% 0; fill: none; stroke: var(--jitomate); stroke-width: 3.4; stroke-linecap: round; stroke-dasharray: 34; stroke-dashoffset: 0; }
    .sub { margin-top: 3px; font-size: 0.58rem; font-weight: 800; letter-spacing: 0.24em; text-transform: uppercase; opacity: 0.75; }
    :host(.logo--light) { color: var(--crema); }
    :host(.logo--light) .i svg { stroke: var(--mantequilla); }
    @media (hover: hover) {
      :host(:hover) .i svg { animation: steam 700ms var(--ease-out); }
    }
    @keyframes steam { from { stroke-dashoffset: 34; translate: -50% 5px; opacity: 0; } to { stroke-dashoffset: 0; translate: -50% 0; opacity: 1; } }
  `,
})
export class Logo {
  readonly light = input(false);
}
