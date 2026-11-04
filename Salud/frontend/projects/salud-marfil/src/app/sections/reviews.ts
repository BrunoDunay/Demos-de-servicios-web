import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CLINIC, REVIEWS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Reseñas tipo Google en una fila que se desliza (scroll-snap). */
@Component({
  selector: 'app-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="opiniones">
      <div class="page head">
        <div>
          <p class="eyebrow" data-reveal>Opiniones</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Lo que dicen <em>al salir</em>.</h2>
        </div>
        <div class="score" data-reveal [revealDelay]="140">
          <p class="big">{{ rating }}</p>
          <div>
            <p class="stars" aria-label="5 estrellas">
              @for (s of five; track $index) {
                <app-icon name="star" [size]="18" [filled]="true" />
              }
            </p>
            <p class="count">{{ count }} reseñas en Google</p>
          </div>
        </div>
      </div>
      <ul class="row" data-reveal>
        @for (r of reviews; track r.name) {
          <li>
            <p class="stars small" aria-label="5 estrellas">
              @for (s of five; track $index) {
                <app-icon name="star" [size]="14" [filled]="true" />
              }
            </p>
            <blockquote>“{{ r.text }}”</blockquote>
            <p class="who"><span class="avatar">{{ r.name[0] }}</span><b>{{ r.name }}</b><span>{{ r.when }}</span></p>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 24px; }
    .head > div:first-child { display: grid; gap: 16px; }
    .score { display: flex; align-items: center; gap: 14px; }
    .big { font-family: var(--font-display); font-size: 4rem; line-height: 1; }
    .stars { display: flex; gap: 2px; color: var(--stain); }
    .count { font-size: 0.88rem; color: var(--muted); }
    .row { list-style: none; margin: 44px 0 0; padding: 4px max(var(--gutter), calc((100vw - var(--page)) / 2 + var(--gutter))) 20px; display: flex; gap: 18px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: max(var(--gutter), calc((100vw - var(--page)) / 2 + var(--gutter))); scrollbar-width: none; }
    .row::-webkit-scrollbar { display: none; }
    li { flex: none; width: min(380px, 82vw); scroll-snap-align: start; display: grid; gap: 16px; align-content: start; padding: 26px; border-radius: var(--radius-l); background: var(--white); box-shadow: var(--shadow-s); }
    blockquote { margin: 0; font-family: var(--font-display); font-size: 1.28rem; line-height: 1.35; }
    .who { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 0.9rem; margin-top: auto; }
    .who span:last-child { color: var(--muted); font-size: 0.82rem; }
    .avatar { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--mint-soft); color: var(--mint-deep); font-weight: 700; }
  `,
})
export class Reviews {
  protected readonly reviews = REVIEWS;
  protected readonly rating = CLINIC.rating;
  protected readonly count = CLINIC.reviews;
  protected readonly five = [1, 2, 3, 4, 5];
}
