import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AREAS } from '../core/content';
import { Icon } from '../shared/icon';
import { DragScroll } from '../shared/drag-scroll';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-areas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, DragScroll],
  template: `
    <section class="section areas" id="areas">
      <div class="container">
        <div class="top">
          <div>
            <span class="eyebrow" data-reveal>Instalaciones</span>
            <h2 class="section-title" data-reveal [revealDelay]="80">Todo lo que necesitas, sin filas.</h2>
          </div>
          <p class="section-lead" data-reveal [revealDelay]="160">900 m² divididos en cuatro zonas para que cada quien entrene a su ritmo.</p>
        </div>
      </div>
      <div class="rail container" dragScroll>
        @for (a of areas; track a.title; let i = $index) {
          <article class="card" data-reveal [revealDelay]="i * 100" tabindex="0">
            <img [src]="'media/' + a.img + '-sm.webp'" [attr.srcset]="'media/' + a.img + '-sm.webp 720w, media/' + a.img + '.webp 1000w'" sizes="(max-width: 900px) 78vw, 25vw" [alt]="a.title" width="720" height="480" loading="lazy" />
            <div class="shade"></div>
            <div class="tags">
              @for (t of a.tags; track t) {
                <span>{{ t }}</span>
              }
            </div>
            <div class="body">
              <h3>{{ a.title }}</h3>
              <p>{{ a.text }}</p>
            </div>
            <span class="go"><app-icon name="arrow-up-right" [size]="18" /></span>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .areas { background: var(--bg-2); border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .top { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; margin-bottom: 44px; }
    .rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .card {
      position: relative; aspect-ratio: 3 / 4.3; border-radius: var(--radius); overflow: hidden; color: #fff; isolation: isolate; outline: none;
      transition: transform 500ms var(--ease-out), opacity 700ms var(--ease-out), box-shadow 500ms var(--ease-out);
    }
    .card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transition: transform 900ms var(--ease-out); }
    .shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgb(18 19 26 / 0%) 35%, rgb(18 19 26 / 78%) 100%); transition: background-color 400ms ease; }
    .tags { position: absolute; top: 14px; left: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
    .tags span { padding: 6px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 650; background: rgb(18 19 26 / 42%); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 22%); }
    .body { position: absolute; left: 18px; right: 18px; bottom: 18px; }
    h3 { font-size: 1.6rem; letter-spacing: -0.03em; }
    p { margin-top: 8px; font-size: 0.92rem; color: rgb(255 255 255 / 85%); max-height: 0; opacity: 0; overflow: hidden; transform: translateY(8px); transition: max-height 500ms var(--ease-out), opacity 400ms ease, transform 500ms var(--ease-out); }
    .go { position: absolute; top: 12px; right: 12px; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--lime); color: var(--ink); transform: scale(0.6) rotate(-45deg); opacity: 0; transition: transform 400ms var(--ease-back), opacity 300ms ease; }
    .card:focus-visible { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
    @media (hover: hover) and (pointer: fine) { .card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); } }
    .card:focus-visible img { transform: scale(1.08); }
    @media (hover: hover) and (pointer: fine) { .card:hover img { transform: scale(1.08); } }
    .card:focus-visible p { max-height: 90px; opacity: 1; transform: none; }
    @media (hover: hover) and (pointer: fine) { .card:hover p { max-height: 90px; opacity: 1; transform: none; } }
    .card:focus-visible .go { transform: none; opacity: 1; }
    @media (hover: hover) and (pointer: fine) { .card:hover .go { transform: none; opacity: 1; } }
    .card:focus-visible { box-shadow: 0 0 0 3px var(--brand); }
    @media (hover: none) { p { max-height: 90px; opacity: 1; transform: none; } }
    @media (max-width: 900px) {
      .rail { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; padding-bottom: 8px; scrollbar-width: none; width: 100%; padding-inline: var(--gutter); }
      .rail::-webkit-scrollbar { display: none; }
      .card { flex: 0 0 76%; scroll-snap-align: center; }
    }
  `,
})
export class Areas {
  protected readonly areas = AREAS;
}
