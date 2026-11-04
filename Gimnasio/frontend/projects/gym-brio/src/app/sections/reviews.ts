import { ChangeDetectionStrategy, Component } from '@angular/core';
import { REVIEWS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section reviews" id="opiniones">
      <div class="container head">
        <div>
          <span class="eyebrow" data-reveal>Opiniones</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Lo dicen los vecinos.</h2>
        </div>
        <div class="score" data-reveal [revealDelay]="160">
          <strong>4.9</strong>
          <div>
            <div class="stars">
              @for (s of [1, 2, 3, 4, 5]; track s) {
                <app-icon name="star" [size]="18" [filled]="true" [stroke]="1.5" />
              }
            </div>
            <span>212 reseñas en Google</span>
          </div>
        </div>
      </div>
      @for (row of rows; track $index; let r = $index) {
        <div class="row" [class.reverse]="r === 1">
          @for (copy of [0, 1]; track copy) {
            <div class="track" [attr.aria-hidden]="copy === 1">
              @for (rv of row; track rv.name) {
                <figure class="card">
                  <div class="stars small">
                    @for (s of [1, 2, 3, 4, 5]; track s) {
                      <app-icon name="star" [size]="14" [filled]="true" [stroke]="1.5" />
                    }
                  </div>
                  <blockquote>{{ rv.text }}</blockquote>
                  <figcaption><span class="avatar">{{ rv.name[0] }}</span>{{ rv.name }}</figcaption>
                </figure>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .reviews { overflow: hidden; }
    .head { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; margin-bottom: 44px; }
    .score { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-radius: 20px; background: var(--surface); box-shadow: var(--shadow-sm); }
    .score strong { font-family: var(--font-display); font-size: 2.8rem; line-height: 1; letter-spacing: -0.05em; }
    .score span { font-size: 0.85rem; color: var(--muted); }
    .stars { display: flex; gap: 2px; color: #f5b301; }
    .stars app-icon { fill: currentColor; }
    .row { display: flex; margin-top: 16px; }
    .track { display: flex; gap: 16px; padding-right: 16px; flex: none; animation: scroll 60s linear infinite; }
    .reverse .track { animation-direction: reverse; animation-duration: 70s; }
    @media (hover: hover) and (pointer: fine) { .row:hover .track { animation-play-state: paused; } }
    @keyframes scroll { to { transform: translateX(-100%); } }
    .card { width: 340px; margin: 0; padding: 22px; border-radius: 20px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); display: flex; flex-direction: column; gap: 14px; transition: transform 350ms var(--ease-out), box-shadow 350ms ease; }
    @media (hover: hover) and (pointer: fine) { .card:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: inset 0 0 0 1.5px var(--brand), var(--shadow); } }
    blockquote { margin: 0; font-size: 1rem; color: var(--ink-2); flex: 1; }
    figcaption { display: flex; align-items: center; gap: 10px; font-weight: 650; font-size: 0.92rem; }
    .avatar { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); font-weight: 800; }
    @media (max-width: 560px) { .card { width: 280px; } }
  `,
})
export class Reviews {
  protected readonly rows = [REVIEWS.slice(0, 4), REVIEWS.slice(4)];
}
