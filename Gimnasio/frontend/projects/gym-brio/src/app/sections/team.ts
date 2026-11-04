import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TEAM } from '../core/content';
import { DragScroll } from '../shared/drag-scroll';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, DragScroll],
  template: `
    <section class="section team" id="equipo">
      <div class="container">
        <span class="eyebrow" data-reveal>El equipo</span>
        <h2 class="section-title" data-reveal [revealDelay]="80">Coaches que se saben tu nombre.</h2>
        <div class="grid" dragScroll>
          @for (t of team; track t.name; let i = $index) {
            <article class="card" data-reveal [revealDelay]="i * 110">
              <div class="photo">
                <img [src]="'media/' + t.img + '-sm.webp'" [alt]="t.name + ', coach de ' + t.role" width="720" height="900" loading="lazy" />
                <blockquote>“{{ t.quote }}”</blockquote>
              </div>
              <div class="info">
                <h3>{{ t.name }}</h3>
                <span>{{ t.role }}</span>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
    .card { transition: transform 450ms var(--ease-out); }
    .photo { position: relative; aspect-ratio: 4 / 5; border-radius: var(--radius); overflow: hidden; background: var(--bg-2); }
    .photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; transition: transform 900ms var(--ease-out), filter 500ms ease; filter: saturate(0.85); }
    blockquote {
      position: absolute; left: 14px; right: 14px; bottom: 14px; margin: 0; padding: 16px 18px; border-radius: 16px;
      background: var(--lime); color: var(--ink); font-family: var(--font-display); font-size: 1.15rem; font-weight: 650; letter-spacing: -0.02em; line-height: 1.25;
      transform: translateY(calc(100% + 48px)) rotate(-3deg); transition: transform 550ms var(--ease-back);
    }
    .info { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-top: 16px; padding-inline: 4px; }
    h3 { font-size: 1.4rem; letter-spacing: -0.02em; }
    .info span { color: var(--muted); font-size: 0.92rem; }
    @media (hover: hover) {
      .card:hover { transform: translateY(-6px); }
      .card:hover img { transform: scale(1.06); filter: saturate(1.05); }
      .card:hover blockquote { transform: none; }
    }
    @media (hover: none) { blockquote { transform: none; } }
    @media (max-width: 900px) {
      .grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; margin-inline: calc(var(--gutter) * -1); padding-inline: var(--gutter); }
      .grid::-webkit-scrollbar { display: none; }
      .card { flex: 0 0 72%; scroll-snap-align: center; }
    }
  `,
})
export class Team {
  protected readonly team = TEAM;
}
