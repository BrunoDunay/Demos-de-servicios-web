import { ChangeDetectionStrategy, Component } from '@angular/core';
import { REVIEWS } from '../core/content';
import { DragScroll } from '../shared/drag-scroll';
import { Reveal } from '../shared/reveal';

/** Reseñas escritas en vasos para llevar: el nombre con plumón y el pedido en la funda. */
@Component({
  selector: 'app-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, DragScroll],
  template: `
    <section class="section reviews" id="opiniones">
      <div class="container">
        <div class="head">
          <span class="tag" data-reveal>Reseñas</span>
          <h2 class="title" data-reveal [revealDelay]="60">Lo que nos dejan escrito.</h2>
          <p class="score" data-reveal [revealDelay]="120"><b>4.8</b> de 5 en Google, con 186 reseñas</p>
        </div>
      </div>
      <ul class="shelf" dragScroll>
        @for (r of reviews; track r.name; let i = $index) {
          <li class="cup" data-reveal [revealDelay]="i * 70" [style.--t]="tilts[i % tilts.length] + 'deg'">
            <span class="lid" aria-hidden="true"></span>
            <div class="body">
              <p class="name">{{ r.name }}</p>
              <blockquote>{{ r.text }}</blockquote>
              <span class="sleeve">{{ r.order }}</span>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .reviews { background: var(--menta); overflow: hidden; }
    .head { display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'tag tag' 'title score'; gap: 12px 30px; align-items: end; margin-bottom: 50px; }
    .tag { grid-area: tag; color: var(--menta-hondo); }
    .title { grid-area: title; font-size: clamp(2.4rem, 5vw, 4.2rem); }
    .score { grid-area: score; font-weight: 600; }
    .score b { font-family: var(--font-display); font-weight: 400; font-size: 2.2rem; margin-right: 6px; }
    .shelf { list-style: none; margin: 0; padding: 20px var(--gutter) 30px; display: flex; gap: 22px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
    .shelf::-webkit-scrollbar { display: none; }
    .cup { flex: 0 0 230px; scroll-snap-align: center; display: flex; flex-direction: column; align-items: center; rotate: var(--t); transition: rotate 400ms var(--ease-out), transform 400ms var(--ease-out); }
    @media (hover: hover) { .cup:hover { rotate: 0deg; transform: translateY(-8px); } }
    .lid { width: 100%; height: 26px; border-radius: 10px 10px 4px 4px; background: var(--cafe); box-shadow: inset 0 -6px 0 oklch(20% 0.04 45); }
    .body { position: relative; width: 92%; min-height: 300px; padding: 22px 24px 70px; background: var(--leche); clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%); }
    .name { font-family: var(--font-display); font-size: 1.9rem; color: var(--jitomate-hondo); rotate: -4deg; }
    blockquote { margin: 14px 0 0; font-size: 0.98rem; line-height: 1.45; }
    .sleeve { position: absolute; left: 6%; right: 6%; bottom: 22px; padding: 8px 10px; text-align: center; background: oklch(68% 0.07 65); color: var(--cafe); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    @media (min-width: 1500px) { .shelf { justify-content: center; } }
    @media (max-width: 700px) { .head { grid-template-columns: 1fr; grid-template-areas: 'tag' 'title' 'score'; } }
  `,
})
export class Reviews {
  protected readonly reviews = REVIEWS;
  protected readonly tilts = [-3, 2, -1.5, 3, -2.5, 1.5];
}
