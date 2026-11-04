import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CLINIC, REVIEWS, TEAM } from '../core/content';
import { Clinic } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';

/**
 * Equipo como tarjetas de app de citas (referencia "Tracey Clifford"): foto arriba con el nombre encima,
 * botones redondos de vidrio y una fila de datos. Se inclinan en 3D con brillo al pasar el cursor.
 * Debajo, opiniones en dos filas que se deslizan en sentidos contrarios (se pausan con el cursor).
 */
@Component({
  selector: 'app-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Icon, Tilt],
  template: `
    <section class="section" id="equipo">
      <div class="page">
        <header class="head">
          <p class="pill" data-reveal>Equipo</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Tres especialistas, <b>un mismo expediente</b>.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Si tu tratamiento necesita a otro especialista, está en la puerta de al lado y ya conoce tu caso.</p>
        </header>
        <div class="cards">
          @for (d of team; track d.name; let i = $index) {
            <div tilt="8" data-reveal [revealDelay]="i * 110">
              <article class="doc t-tilt-card">
                <div class="photo">
                  <img [src]="'media/' + d.photo + '-sm.webp'" [alt]="d.name" width="820" height="547" loading="lazy" [style.object-position]="d.focus" />
                  <div class="actions">
                    <button type="button" aria-label="Escribir por WhatsApp" (click)="clinic.book()"><app-icon name="chat" [size]="18" /></button>
                    <button type="button" aria-label="Agendar con esta especialista" (click)="clinic.book()"><app-icon name="calendar" [size]="18" /></button>
                  </div>
                  <div class="who">
                    <h3>{{ d.name }}</h3>
                    <p>{{ d.role }} · <span>★ {{ d.stats[2] }}</span></p>
                  </div>
                </div>
                <dl class="stats">
                  <div><dt>Experiencia</dt><dd>{{ d.stats[0] }}</dd></div>
                  <div><dt>Pacientes</dt><dd>{{ d.stats[1] }}</dd></div>
                  <div><dt>Reseñas</dt><dd>{{ d.stats[2] }}</dd></div>
                </dl>
                <p class="text">{{ d.text }}</p>
                <p class="license">{{ d.license }}</p>
              </article>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section reviews" id="opiniones">
      <div class="page rhead">
        <h2 class="h2" data-reveal>Lo que dicen <b>al salir</b>.</h2>
        <p class="score" data-reveal [revealDelay]="100"><b>{{ rating }}</b><span>★★★★★<br />{{ count }} reseñas en Google</span></p>
      </div>
      @for (row of rows; track $index; let r = $index) {
        <div class="marquee" [class.rev]="r === 1" aria-label="Opiniones de pacientes">
          <ul>
            @for (rv of row; track $index) {
              <li [attr.aria-hidden]="$index >= reviews.length">
                <p class="stars" aria-hidden="true">★★★★★</p>
                <blockquote>“{{ rv.text }}”</blockquote>
                <p class="by"><span class="avatar">{{ rv.name[0] }}</span><b>{{ rv.name }}</b><small>{{ rv.when }}</small></p>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
  styles: `
    .head { display: grid; gap: 18px; max-width: 760px; }
    .h2 b { color: var(--royal); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 50px; }
    .doc { display: grid; gap: 16px; padding: 10px 10px 22px; border-radius: var(--radius-l); background: var(--white); box-shadow: var(--shadow-m); overflow: hidden; }
    .photo { position: relative; aspect-ratio: 4 / 4.2; border-radius: calc(var(--radius-l) - 8px); overflow: hidden; background: linear-gradient(160deg, var(--royal-2), var(--navy)); }
    .photo img { width: 100%; height: 100%; object-fit: cover; transition: scale 1200ms var(--ease-smooth-out); }
    .photo::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, oklch(22% 0.08 264 / 0.88)); pointer-events: none; }
    .actions { position: absolute; top: 12px; right: 12px; z-index: 2; display: grid; gap: 8px; }
    .actions button { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: var(--white); background: oklch(100% 0 0 / 0.2); backdrop-filter: blur(10px); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.35); transition: background-color 250ms ease, color 250ms ease, scale 160ms var(--ease-out); }
    .actions button:active { scale: 0.9; }
    @media (hover: hover) and (pointer: fine) {
      .actions button:hover { background: var(--white); color: var(--royal); }
      .doc:hover .photo img { scale: 1.06; }
    }
    .who { position: absolute; left: 16px; right: 16px; bottom: 14px; z-index: 2; color: var(--white); }
    .who h3 { font-size: 1.55rem; font-weight: 600; }
    .who p { font-size: 0.86rem; opacity: 0.88; }
    .who span { color: var(--stain); }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0 6px; padding: 12px 0; border-radius: 16px; background: var(--ice); }
    .stats div { display: grid; justify-items: center; }
    .stats div + div { border-left: 1px solid var(--line); }
    .stats dt { font-size: 0.72rem; color: var(--muted); }
    .stats dd { margin: 0; font-weight: 700; font-size: 0.95rem; }
    .text { margin: 0 8px; color: var(--ink-2); font-size: 0.94rem; }
    .license { margin: 0 8px; font-size: 0.76rem; color: var(--muted); }
    .reviews { padding-top: 0; overflow: hidden; }
    .rhead { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 40px; }
    .score { display: flex; align-items: center; gap: 12px; }
    .score b { font-family: var(--font-display); font-size: 4rem; font-weight: 600; line-height: 1; color: var(--royal); }
    .score span { font-size: 0.86rem; color: var(--muted); line-height: 1.4; }
    .marquee { overflow: hidden; padding: 8px 0; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
    .marquee ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 18px; width: max-content; animation: slide 60s linear infinite; }
    .marquee.rev ul { animation-direction: reverse; animation-duration: 70s; }
    @media (hover: hover) and (pointer: fine) { .marquee:hover ul { animation-play-state: paused; } }
    @keyframes slide { to { translate: calc(-50% - 9px) 0; } }
    .marquee li { width: 360px; display: grid; gap: 12px; align-content: start; padding: 24px; border-radius: var(--radius-m); background: var(--white); box-shadow: var(--shadow-s); transition: translate 400ms var(--ease-bounce), box-shadow 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .marquee li:hover { translate: 0 -6px; box-shadow: var(--shadow-m); } }
    .stars { color: var(--stain); letter-spacing: 2px; }
    blockquote { margin: 0; font-size: 1rem; line-height: 1.5; }
    .by { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
    .by small { color: var(--muted); }
    .avatar { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--royal); color: var(--white); font-weight: 700; }
    @media (max-width: 960px) {
      .cards { grid-template-columns: 1fr; max-width: 460px; }
      .marquee li { width: 290px; }
    }
  `,
})
export class Team {
  protected readonly clinic = inject(Clinic);
  protected readonly team = TEAM;
  protected readonly reviews = REVIEWS;
  protected readonly rating = CLINIC.rating;
  protected readonly count = CLINIC.reviews;
  // Cada fila va duplicada para que el desplazamiento sea continuo
  protected readonly rows = [
    [...REVIEWS, ...REVIEWS],
    [...REVIEWS.slice().reverse(), ...REVIEWS.slice().reverse()],
  ];
}
