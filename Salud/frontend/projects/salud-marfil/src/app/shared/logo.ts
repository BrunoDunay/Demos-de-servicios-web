import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo de Marfil: un diente de un solo trazo con un destello, y el nombre en Outfit. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <path class="tooth" pathLength="1" d="M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z" />
        <path class="spark" d="M24.5 3.5v5M22 6h5" />
      </svg>
    </span>
    @if (word()) {
      <span class="word">marfil<small>odontología</small></span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; color: inherit; }
    .badge { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 13px; background: var(--royal); color: var(--white); box-shadow: var(--shadow-blue); overflow: hidden; transition: scale 300ms var(--ease-out); }
    /* Brillo de esmalte que cruza el cuadro al pasar el cursor */
    .badge::after { content: ''; position: absolute; inset: -20%; background: linear-gradient(120deg, transparent 38%, oklch(100% 0 0 / 0.55) 50%, transparent 62%); translate: -100% 0; pointer-events: none; }
    .mark { position: relative; width: 26px; height: 26px; overflow: visible; }
    .tooth { fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
    .spark { fill: none; stroke: var(--sky); stroke-width: 2; stroke-linecap: round; transform-box: fill-box; transform-origin: center; }
    .word { display: grid; font-family: var(--font-display); font-size: 1.45rem; font-weight: 700; letter-spacing: -0.04em; line-height: 0.9; }
    .word small { font-size: 0.62rem; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.65; transition: letter-spacing 500ms var(--ease-smooth-out), opacity 300ms ease; }
    @media (hover: hover) and (pointer: fine) {
      /* El diente se vuelve a dibujar de un trazo, el destello parpadea y "odontología" se abre un poco */
      :host(:hover) .tooth { animation: redraw 900ms var(--ease-in-out); }
      :host(:hover) .spark { animation: twinkle 900ms var(--ease-bounce); }
      :host(:hover) .badge::after { translate: 100% 0; transition: translate 800ms var(--ease-smooth-out); }
      :host(:hover) .word small { letter-spacing: 0.22em; opacity: 0.9; }
    }
    @keyframes redraw { 0% { stroke-dashoffset: 0; } 45% { stroke-dashoffset: 1; } 100% { stroke-dashoffset: 2; } }
    @keyframes twinkle { 0%, 100% { scale: 1; rotate: 0deg; } 40% { scale: 0; rotate: 45deg; } 75% { scale: 1.5; rotate: 90deg; } }
  `,
})
export class Logo {
  readonly word = input(true);
}
