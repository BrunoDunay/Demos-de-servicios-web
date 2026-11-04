import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COACHES } from '../core/content';
import { SplitLines } from '../shared/pointer';
import { DragScroll } from '../shared/drag-scroll';
import { Reveal } from '../shared/reveal';

/** Coaches con reflector: la foto está en blanco y negro y el cursor revela el color donde pasa la luz. */
@Component({
  selector: 'app-coaches-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SplitLines, Reveal, DragScroll],
  template: `
    <section class="section coaches">
      <div class="container">
        <div class="head">
          <span class="label" data-reveal>Coaches de autor</span>
          <h2 class="h2" splitLines>Las manos detrás<br />de <em class="gold">cada clase.</em></h2>
        </div>
        <div class="row" dragScroll>
          @for (c of coaches; track c.name; let i = $index) {
            <article class="card" data-reveal [revealDelay]="i * 120" tabindex="0" (pointermove)="light($event)" (pointerleave)="dark($event)">
              <div class="photo">
                <img class="base" [src]="'media/' + c.img + '-sm.webp'" [alt]="c.name + ', ' + c.role" [style.object-position]="$any(c).pos ?? 'center 25%'" loading="lazy" width="720" height="1080" />
                <img class="color" [src]="'media/' + c.img + '-sm.webp'" alt="" aria-hidden="true" [style.object-position]="$any(c).pos ?? 'center 25%'" loading="lazy" width="720" height="1080" />
                <span class="halo" aria-hidden="true"></span>
                <p class="bio">{{ c.bio }}</p>
              </div>
              <h3>{{ c.name }}</h3>
              <span class="role">{{ c.role }}</span>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { margin-bottom: 60px; }
    .h2 { margin-top: 20px; }
    .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
    .card { outline: none; --mx: 50%; --my: 40%; --r: 0px; transition: --r 700ms var(--ease-out); }
    .card:nth-child(even) { margin-top: 70px; }
    .photo { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--bg-3); border-radius: 220px 220px 0 0; }
    .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.4s var(--ease-out); }
    .base { filter: grayscale(1) brightness(0.62) contrast(1.05); }
    .color {
      filter: sepia(0.18) saturate(1.05) brightness(1.02);
      -webkit-mask-image: radial-gradient(circle var(--r) at var(--mx) var(--my), #000 30%, transparent 72%);
      mask-image: radial-gradient(circle var(--r) at var(--mx) var(--my), #000 30%, transparent 72%);
      transition: transform 1.4s var(--ease-out), -webkit-mask-size 400ms ease;
    }
    .halo { position: absolute; inset: 0; background: radial-gradient(circle calc(var(--r) * 0.7) at var(--mx) var(--my), rgb(243 213 161 / 16%), transparent 70%); mix-blend-mode: screen; pointer-events: none; }
    .card:focus-visible .photo img { transform: scale(1.04); }
    @media (hover: hover) and (pointer: fine) { .card:hover .photo img { transform: scale(1.04); } }
    .photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgb(13 12 10 / 90%), transparent 45%); opacity: 0; transition: opacity 600ms ease; }
    .bio { position: absolute; z-index: 1; left: 22px; right: 22px; bottom: 20px; font-family: var(--font-display); font-style: italic; font-size: 1.3rem; line-height: 1.2; opacity: 0; transform: translateY(16px); transition: opacity 600ms ease, transform 800ms var(--ease-out); }
    .card:focus-visible .photo::after { opacity: 1; }
    @media (hover: hover) and (pointer: fine) { .card:hover .photo::after { opacity: 1; } }
    .card:focus-visible .bio { opacity: 1; transform: none; }
    @media (hover: hover) and (pointer: fine) { .card:hover .bio { opacity: 1; transform: none; } }
    h3 { margin-top: 20px; font-size: 1.9rem; transition: color 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .card:hover h3 { color: var(--gold); } }
    .role { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    @media (hover: none) {
      .color { -webkit-mask-image: none; mask-image: none; }
      .bio { opacity: 1; transform: none; }
      .photo::after { opacity: 1; }
    }
    @media (max-width: 900px) {
      .row { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; margin-inline: calc(var(--gutter) * -1); padding-inline: var(--gutter); scroll-padding-inline: var(--gutter); }
      .row::-webkit-scrollbar { display: none; }
      .card { flex: 0 0 70%; scroll-snap-align: start; }
      .card:nth-child(even) { margin-top: 0; }
    }
  `,
})
export class CoachesRow {
  protected readonly coaches = COACHES;

  protected light(e: PointerEvent) {
    const card = e.currentTarget as HTMLElement;
    const photo = card.querySelector<HTMLElement>('.photo')!;
    const r = photo.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    card.style.setProperty('--r', '170px');
  }

  protected dark(e: PointerEvent) {
    (e.currentTarget as HTMLElement).style.setProperty('--r', '0px');
  }
}
