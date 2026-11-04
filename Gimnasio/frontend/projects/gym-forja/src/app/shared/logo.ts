import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Forja: hexágono (como la cabeza de una mancuerna) con una F de acero al rojo vivo. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo' },
  template: `
    <svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
      <path class="hex" d="M32 7 53.6 19.5v25L32 57 10.4 44.5v-25z" />
      <path class="f" d="M24 20h18v6.5H30.5v4.5H39v6.5h-8.5V45H24z" />
    </svg>
    @if (withText()) {
      <span class="word">
        <b>FORJA</b>
        <small>BOX FUNCIONAL</small>
      </span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 12px; color: var(--ink); }
    .mark { width: 40px; height: 40px; flex: none; transition: transform 600ms var(--ease-expo); }
    .hex { fill: none; stroke: currentColor; stroke-width: 5; stroke-linejoin: round; transition: stroke 300ms ease; }
    .f { fill: var(--ember); transition: transform 500ms var(--ease-expo); transform-origin: 32px 32px; }
    .word { display: flex; flex-direction: column; line-height: 1; }
    b { font-family: var(--font-display); font-weight: 400; font-size: 1.65rem; letter-spacing: 0.08em; }
    small { margin-top: 3px; font-family: var(--font-mono); font-size: 0.56rem; letter-spacing: 0.28em; color: var(--muted); }
    @media (hover: hover) {
      :host(:hover) .mark { transform: rotate(60deg); }
      :host(:hover) .f { transform: rotate(-60deg) scale(1.06); }
      :host(:hover) .hex { stroke: var(--ember); }
    }
  `,
})
export class Logo {
  readonly withText = input(true);
}
