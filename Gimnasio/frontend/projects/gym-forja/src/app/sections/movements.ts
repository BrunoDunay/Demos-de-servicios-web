import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOVES } from '../shared/figures/box-figures';
import { MoveFigure } from '../shared/figures/move-figure';
import { Reveal } from '../shared/reveal';

/** Glosario: pictogramas animados con el esqueleto de Fitness by Evidence (ver shared/figures). */
@Component({
  selector: 'app-movements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, MoveFigure],
  template: `
    <section class="section moves" id="movimientos">
      <div class="container">
        <div class="head">
          <div>
            <span class="tag" data-reveal>Glosario</span>
            <h2 class="title-lg" data-reveal [revealDelay]="80">El idioma<br />del box</h2>
          </div>
          <p class="lead" data-reveal [revealDelay]="160">Ocho movimientos que vas a dominar desde tu primer mes. Pasa el cursor sobre cada cuadro y míralos en acción.</p>
        </div>
        <div class="wall">
          @for (m of moves; track m.id; let i = $index) {
            <figure class="frame" data-reveal [revealDelay]="(i % 4) * 80" tabindex="0">
              <span class="num">0{{ i + 1 }}</span>
              <div class="art"><app-move-figure [def]="m.def" [ms]="m.ms" [label]="m.name" /></div>
              <figcaption><b>{{ m.name }}</b><span>{{ m.text }}</span></figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .moves { background: var(--bg-2); }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; }
    .title-lg { margin-top: 18px; }
    .wall { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .frame {
      position: relative; margin: 0; padding: 16px 16px 18px; background: var(--bg); outline: none;
      box-shadow: inset 0 0 0 1px var(--line-2);
      transition: box-shadow 400ms ease, transform 500ms var(--ease-expo), background-color 400ms ease;
    }
    .frame::before {
      content: ''; position: absolute; left: 0; top: 0; height: 2px; width: 100%; background: var(--ember);
      transform: scaleX(0); transform-origin: left; transition: transform 600ms var(--ease-expo);
    }
    .frame:hover, .frame:focus-visible { transform: translateY(-4px); background: #0f0f11; box-shadow: inset 0 0 0 1px rgb(255 91 20 / 55%), 0 26px 40px -28px rgb(255 91 20 / 45%); }
    .frame:hover::before, .frame:focus-visible::before { transform: scaleX(1); }
    .num { position: absolute; top: 12px; right: 14px; font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); transition: color 300ms ease; }
    .frame:hover .num { color: var(--ember); }
    .art { aspect-ratio: 1; padding: 6% 4% 0; }
    figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--line); }
    figcaption b { font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.02em; }
    figcaption span { font-size: 0.86rem; color: var(--muted); line-height: 1.45; }
    @media (max-width: 1000px) { .wall { grid-template-columns: repeat(2, 1fr); gap: 10px; } .frame { padding: 12px; } figcaption b { font-size: 1.2rem; } }
    @media (max-width: 520px) { figcaption span { display: none; } }
  `,
})
export class Movements {
  protected readonly moves = MOVES;
}
