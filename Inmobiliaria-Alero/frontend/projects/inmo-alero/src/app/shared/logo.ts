import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Alero: un techo de dos aguas cuyo alero se extiende, con una ventana encendida en latón. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--light]': 'light()' },
  template: `
    <svg class="mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" class="mark-bg" />
      <path class="roof" d="M6 25 24 10l18 15" />
      <path class="walls" d="M12 22v15h24V22" />
      <rect class="window" x="20.5" y="25" width="7" height="7" rx="1" />
    </svg>
    <span class="word">
      <b>Alero</b>
      <small>Bienes raíces</small>
    </span>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); }
    .mark { width: 40px; height: 40px; flex: none; }
    .mark-bg { fill: var(--pine); }
    .roof, .walls { fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .roof { stroke: var(--brass); transition: transform 500ms var(--ease-back); transform-origin: 24px 18px; }
    .window { fill: var(--brass); transition: fill 300ms ease, opacity 300ms ease; }
    .word { display: flex; flex-direction: column; line-height: 1; }
    .word b { font-family: var(--font-display); font-weight: 400; font-size: 1.7rem; letter-spacing: -0.01em; }
    .word small { margin-top: 3px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    :host(.logo--light) { color: #fff; }
    :host(.logo--light) .word small { color: rgb(255 255 255 / 60%); }
    :host(.logo--light) .mark-bg { fill: var(--pine-2); }
    @media (hover: hover) {
      :host(:hover) .roof { transform: translateY(-2px) scaleX(1.06); }
      :host(:hover) .window { animation: flicker 900ms ease; }
    }
    @keyframes flicker { 20%, 60% { opacity: 0.2; } 40%, 100% { opacity: 1; } }
  `,
})
export class Logo {
  readonly light = input(false);
}
