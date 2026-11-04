import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Brío: símbolo (una "b" con chispa) + palabra "brío", donde el acento de la í es la chispa lima. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--light]': 'light()' },
  template: `
    <svg class="mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" class="mark-bg" />
      <rect x="12" y="9" width="6.5" height="29" rx="3.25" class="mark-fg" />
      <circle cx="24.5" cy="28" r="8" fill="none" class="mark-ring" stroke-width="6.5" />
      <path class="mark-spark" d="M37 5l1.9 5.1 5.1 1.9-5.1 1.9L37 19l-1.9-5.1-5.1-1.9 5.1-1.9z" />
    </svg>
    <span class="word" aria-label="Brío">br<span class="i">ı<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1l2.3 6.7L19 10l-6.7 2.3L10 19l-2.3-6.7L1 10l6.7-2.3z" /></svg></span>o</span>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); }
    .mark { width: 38px; height: 38px; flex: none; transition: transform 400ms var(--ease-back); }
    .mark-bg { fill: var(--brand); }
    .mark-fg { fill: #fff; }
    .mark-ring { stroke: #fff; }
    .mark-spark { fill: var(--lime); transform-origin: 37px 12px; transition: transform 500ms var(--ease-back); }
    .word { font-family: var(--font-display); font-weight: 800; font-size: 1.7rem; letter-spacing: -0.045em; line-height: 1; }
    .i { position: relative; display: inline-block; }
    .i svg { position: absolute; left: 50%; top: -0.2em; width: 0.42em; height: 0.42em; transform: translateX(-38%); fill: var(--brand); transition: transform 500ms var(--ease-back); }
    :host(.logo--light) { color: #fff; }
    :host(.logo--light) .i svg { fill: var(--lime); }
    @media (hover: hover) {
      :host(:hover) .mark { transform: rotate(-8deg) scale(1.05); }
      :host(:hover) .mark-spark { transform: rotate(90deg) scale(1.25); }
      :host(:hover) .i svg { transform: translateX(-38%) rotate(90deg) scale(1.2); }
    }
  `,
})
export class Logo {
  readonly light = input(false);
}
