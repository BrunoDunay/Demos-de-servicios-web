import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STEPS } from '../core/content';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section process" id="proceso">
      <div class="container">
        <div class="head">
          <span class="eyebrow" data-reveal>Cómo trabajamos</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">De la primera plática <em>a las llaves</em>.</h2>
        </div>
        <ol class="steps" data-reveal [revealDelay]="120">
          <span class="track" aria-hidden="true"><span class="fill"></span></span>
          @for (s of steps; track s.title; let i = $index) {
            <li [style.--i]="i">
              <span class="dot">{{ i + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .head { max-width: 680px; margin-bottom: 56px; }
    .steps { position: relative; list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
    .track { position: absolute; left: 26px; right: 12%; top: 25px; height: 2px; background: var(--line); }
    .fill { position: absolute; inset: 0; background: var(--brass); transform: scaleX(0); transform-origin: left; }
    .steps.is-in .fill { transition: transform 1800ms var(--ease-in-out) 300ms; transform: scaleX(1); }
    li { position: relative; }
    .dot { position: relative; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--bg); box-shadow: inset 0 0 0 2px var(--line); font-family: var(--font-display); font-size: 1.4rem; color: var(--muted); transition: background-color 400ms ease, color 400ms ease, box-shadow 400ms ease, transform 500ms var(--ease-back); }
    .steps.is-in .dot { background: var(--pine); color: #fff; box-shadow: none; transition-delay: calc(400ms + var(--i) * 420ms); }
    @media (hover: hover) and (pointer: fine) { li:hover .dot { transform: scale(1.1) rotate(-6deg); } }
    h3 { margin-top: 20px; font-size: 1.7rem; }
    p { margin-top: 8px; color: var(--muted); }
    @media (max-width: 860px) {
      .steps { grid-template-columns: 1fr; gap: 26px; }
      .track { left: 25px; right: auto; top: 26px; bottom: 26px; width: 2px; height: auto; }
      .fill { transform: scaleY(0); transform-origin: top; }
      .steps.is-in .fill { transform: scaleY(1); }
      li { padding-left: 74px; }
      .dot { position: absolute; left: 0; top: 0; }
      h3 { margin-top: 8px; }
    }
  `,
})
export class Process {
  protected readonly steps = STEPS;
}
