import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { spiral } from '../core/doodles';

const MARK = spiral(16, 16, 13, 2.6, 60);

/** Logo de Claro: una espiral a mano (la mente en calma) y "claro" en letras condensadas. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><path [attr.d]="mark" /><circle cx="16" cy="16" r="2.2" /></svg>
    @if (word()) {
      <span class="word">claro<small>psicología</small></span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: inherit; }
    .mark { width: 34px; height: 34px; overflow: visible; transition: rotate 900ms var(--ease-smooth-out); }
    .mark path { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
    .mark circle { fill: var(--peach); }
    .word { display: grid; font-family: var(--font-display); font-stretch: 75%; font-size: 1.7rem; font-weight: 800; letter-spacing: -0.02em; line-height: 0.82; text-transform: uppercase; }
    .word small { font-family: var(--font-hand); font-stretch: 100%; font-size: 0.95rem; font-weight: 600; text-transform: none; letter-spacing: 0; color: var(--sage-deep); }
    @media (hover: hover) and (pointer: fine) { :host(:hover) .mark { rotate: -200deg; } }
  `,
})
export class Logo {
  readonly word = input(true);
  protected readonly mark = MARK;
}
