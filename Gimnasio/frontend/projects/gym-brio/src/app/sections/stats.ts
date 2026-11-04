import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STATS } from '../core/content';
import { CountUp, Reveal } from '../shared/reveal';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, Reveal],
  template: `
    <section class="wrap">
      <div class="container">
        <div class="panel" data-reveal="scale">
          <img class="bg" src="media/sala-sm.webp" alt="" aria-hidden="true" loading="lazy" width="720" height="480" />
          <div class="items">
            @for (s of stats; track s.label; let i = $index) {
              <div class="item">
                <strong><span [countUp]="s.value" [decimals]="s.decimals ?? 0">{{ s.value }}</span>{{ s.suffix }}</strong>
                <span>{{ s.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--bg-2); padding-bottom: var(--section); }
    .panel { position: relative; overflow: hidden; border-radius: var(--radius-lg); background: var(--brand); color: #fff; padding: clamp(36px, 6vw, 64px); isolation: isolate; }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.16; mix-blend-mode: luminosity; z-index: -1; }
    .panel::after { content: ''; position: absolute; width: 360px; height: 360px; right: -80px; top: -120px; border-radius: 50%; background: var(--lime); opacity: 0.18; filter: blur(30px); z-index: -1; }
    .items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .item { display: flex; flex-direction: column; gap: 6px; padding-left: 20px; border-left: 1px solid rgb(255 255 255 / 22%); }
    .item:first-child { border-left: 0; padding-left: 0; }
    strong { font-family: var(--font-display); font-size: clamp(2.6rem, 6vw, 4.4rem); line-height: 1; letter-spacing: -0.05em; color: var(--lime); font-variant-numeric: tabular-nums; }
    .item > span { color: rgb(255 255 255 / 82%); font-weight: 500; }
    @media (max-width: 760px) {
      .items { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
      .item:nth-child(3) { border-left: 0; padding-left: 0; }
    }
  `,
})
export class Stats {
  protected readonly stats = STATS;
}
