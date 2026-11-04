import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STATS } from '../core/content';
import { CountUp, Reveal } from '../shared/reveal';

/** Números grandes que asoman detrás de una repisa (como la referencia de infografía). */
@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, Reveal],
  template: `
    <section class="stats">
      <div class="container grid">
        @for (s of stats; track s.label; let i = $index) {
          <div class="item" data-reveal [revealDelay]="i * 110">
            <div class="num"><span [countUp]="s.value">{{ s.value }}</span></div>
            <div class="shelf"></div>
            <p><b>0{{ i + 1 }}</b>{{ s.label }}</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .stats { padding: clamp(70px, 9vw, 120px) 0; background: var(--bg); border-block: 1px solid var(--line); }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .num { height: clamp(96px, 12vw, 170px); overflow: hidden; display: flex; align-items: flex-start; }
    .num span { font-family: var(--font-display); font-size: clamp(7rem, 15vw, 13.5rem); line-height: 0.82; color: var(--ink); font-variant-numeric: tabular-nums; }
    .item:nth-child(2) .num span { color: var(--ember); }
    .item:nth-child(4) .num span { color: transparent; -webkit-text-stroke: 2px var(--ink); }
    .shelf { height: 14px; margin-top: -2px; background: linear-gradient(rgb(0 0 0 / 70%), transparent); border-top: 2px solid var(--line-2); }
    p { display: flex; gap: 10px; margin-top: 14px; font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-2); }
    p b { color: var(--ember); font-weight: 600; }
    @media (max-width: 860px) { .grid { grid-template-columns: repeat(2, 1fr); row-gap: 44px; } }
  `,
})
export class Stats {
  protected readonly stats = STATS;
}
