import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STATS } from '../core/content';
import { CountUp, Reveal } from '../shared/reveal';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, Reveal],
  template: `
    <section class="stats" aria-label="Alero en números">
      <div class="container row">
        @for (s of stats; track s.label; let i = $index) {
          <div class="stat" data-reveal [revealDelay]="i * 90">
            <strong><span [countUp]="s.value" [decimals]="s.decimals ?? 0">{{ s.value }}</span>{{ s.suffix }}</strong>
            <span>{{ s.label }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .stats { background: var(--pine); color: #fff; padding: 34px 0; }
    .row { display: grid; grid-template-columns: repeat(4, 1fr); }
    .stat { display: flex; flex-direction: column; gap: 4px; padding: 8px 24px; border-left: 1px solid rgb(255 255 255 / 14%); }
    .stat:first-child { border-left: 0; padding-left: 0; }
    strong { font-family: var(--font-display); font-weight: 400; font-size: clamp(2.2rem, 4vw, 3.2rem); line-height: 1; color: var(--brass-2); font-variant-numeric: tabular-nums; }
    .stat > span { font-size: 0.9rem; color: rgb(255 255 255 / 72%); }
    @media (max-width: 760px) {
      .row { grid-template-columns: 1fr 1fr; gap: 20px 0; }
      .stat:nth-child(3) { border-left: 0; padding-left: 0; }
    }
  `,
})
export class Stats {
  protected readonly stats = STATS;
}
