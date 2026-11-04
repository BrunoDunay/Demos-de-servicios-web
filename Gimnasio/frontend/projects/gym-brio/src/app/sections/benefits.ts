import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BENEFITS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-benefits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="por-que">
      <div class="container layout">
        <div class="head">
          <span class="eyebrow" data-reveal>Por qué Brío</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Un gym que se siente como tu colonia.</h2>
          <p class="section-lead" data-reveal [revealDelay]="160">
            Aquí vienes a entrenar a gusto, con gente que te ubica y te echa porras desde la primera semana.
          </p>
          <figure class="photo" data-reveal="scale" [revealDelay]="200">
            <img src="media/comunidad-sm.webp" srcset="media/comunidad-sm.webp 720w, media/comunidad.webp 1000w" sizes="(max-width: 900px) 90vw, 36vw" alt="Coach platicando con un socio en el área funcional" width="1000" height="667" loading="lazy" />
            <figcaption><b>98%</b> de los socios recomienda Brío a un vecino</figcaption>
          </figure>
        </div>
        <div class="cards">
          @for (b of benefits; track b.title; let i = $index) {
            <article class="card" data-reveal [revealDelay]="i * 90">
              <span class="num" aria-hidden="true">0{{ i + 1 }}</span>
              <span class="ico"><app-icon [name]="b.icon" [size]="24" /></span>
              <h3>{{ b.title }}</h3>
              <p>{{ b.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
    .head { position: sticky; top: 120px; }
    .photo { position: relative; margin: 32px 0 0; border-radius: var(--radius); overflow: hidden; aspect-ratio: 4 / 3; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .photo figcaption { position: absolute; left: 14px; bottom: 14px; right: 14px; padding: 12px 14px; border-radius: 14px; background: rgb(255 255 255 / 88%); backdrop-filter: blur(10px); font-size: 0.9rem; }
    .photo b { color: var(--brand); font-family: var(--font-display); font-size: 1.2rem; margin-right: 4px; }
    .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .card {
      position: relative; padding: 28px 24px 26px; border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-sm); overflow: hidden;
      transition: transform 400ms var(--ease-out), box-shadow 400ms var(--ease-out), background-color 300ms ease, opacity 700ms var(--ease-out);
    }
    .card:nth-child(even) { margin-top: 40px; }
    .num { position: absolute; top: 4px; right: 14px; font-family: var(--font-display); font-weight: 800; font-size: 5.2rem; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px var(--line); transition: color 400ms ease, -webkit-text-stroke-color 400ms ease, transform 500ms var(--ease-back); }
    .ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; background: var(--brand-soft); color: var(--brand); transition: background-color 300ms ease, color 300ms ease, transform 500ms var(--ease-back); }
    h3 { margin-top: 40px; font-size: 1.45rem; letter-spacing: -0.02em; }
    p { margin-top: 10px; color: var(--muted); }
    @media (hover: hover) {
      .card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
      .card:hover .ico { background: var(--brand); color: #fff; transform: rotate(-10deg) scale(1.08); }
      .card:hover .num { color: var(--lime); -webkit-text-stroke-color: var(--lime); transform: translateY(4px) rotate(-6deg); }
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .head { position: static; }
    }
    @media (max-width: 560px) {
      .cards { grid-template-columns: 1fr; }
      .card:nth-child(even) { margin-top: 0; }
    }
  `,
})
export class Benefits {
  protected readonly benefits = BENEFITS;
}
