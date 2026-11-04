import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROOF, TEAM } from '../core/content';
import { CountUp, Reveal } from '../shared/reveal';

/** Lo que no se ve (esterilización, rayos X, años) y el equipo. */
@Component({
  selector: 'app-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, CountUp],
  template: `
    <section class="section proof">
      <div class="page">
        <div class="proof-head">
          <p class="eyebrow" data-reveal>Lo que no se ve</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Limpio de verdad, <em>no solo blanco</em>.</h2>
        </div>
        <div class="proof-grid">
          <figure class="ph a" data-reveal="photo">
            <img src="media/consultorio.webp" srcset="media/consultorio-sm.webp 820w, media/consultorio.webp 1800w" sizes="(max-width: 900px) 100vw, 45vw" alt="Consultorio de Marfil con sillón dental y equipo" width="1800" height="1200" loading="lazy" />
          </figure>
          <ul class="numbers">
            @for (p of proof; track p.label; let i = $index) {
              <li data-reveal [revealDelay]="i * 90">
                <p class="value"><span [countUp]="p.value">{{ p.value }}</span>{{ p.suffix }}</p>
                <p>{{ p.label }}</p>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <section class="section team" id="equipo">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Equipo</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Tres especialistas, <em>un mismo expediente</em>.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Si tu tratamiento necesita a otro especialista, está en la puerta de al lado y ya conoce tu caso.</p>
        </header>
        <div class="cards">
          @for (d of team; track d.name; let i = $index) {
            <article class="card" data-reveal [revealDelay]="i * 110">
              <div class="pic"><img [src]="'media/' + d.photo + '-sm.webp'" [alt]="d.name" width="820" height="547" loading="lazy" [style.object-position]="d.focus" /></div>
              <div class="body">
                <p class="role">{{ d.role }}</p>
                <h3>{{ d.name }}</h3>
                <p class="text">{{ d.text }}</p>
                <p class="license">{{ d.license }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .proof { background: var(--night); color: var(--ivory); }
    .proof .eyebrow { color: var(--mint); }
    .proof-head { display: grid; gap: 16px; max-width: 760px; }
    .proof-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(28px, 5vw, 70px); margin-top: 50px; align-items: center; }
    .ph { margin: 0; aspect-ratio: 4 / 3; border-radius: var(--radius-l); overflow: hidden; }
    .ph img { width: 100%; height: 100%; object-fit: cover; }
    .numbers { list-style: none; margin: 0; padding: 0; display: grid; gap: 28px; }
    .numbers li { display: grid; gap: 6px; padding-top: 22px; border-top: 1px solid oklch(36% 0.04 258); color: oklch(78% 0.02 258); }
    .value { font-family: var(--font-display); font-size: clamp(2.8rem, 6vw, 4.4rem); line-height: 1; color: var(--ivory); font-variant-numeric: tabular-nums; }
    .head { display: grid; gap: 16px; max-width: 720px; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 50px; }
    .card { display: grid; grid-template-rows: auto 1fr; border-radius: var(--radius-l); overflow: hidden; background: var(--white); box-shadow: var(--shadow-s); transition: box-shadow 300ms ease, translate 400ms var(--ease-out); }
    .pic { aspect-ratio: 4 / 3.4; overflow: hidden; }
    .pic img { width: 100%; height: 100%; object-fit: cover; transition: scale 900ms var(--ease-out); }
    .body { display: grid; align-content: start; gap: 8px; padding: 22px 22px 24px; }
    .role { font-size: 0.8rem; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mint-deep); }
    h3 { font-size: 1.7rem; }
    .text { color: var(--ink-2); font-size: 0.97rem; }
    .license { margin-top: 6px; font-size: 0.78rem; color: var(--muted); }
    @media (hover: hover) and (pointer: fine) {
      .card:hover { box-shadow: var(--shadow-m); translate: 0 -4px; }
      .card:hover .pic img { scale: 1.05; }
    }
    @media (max-width: 900px) {
      .proof-grid, .cards { grid-template-columns: 1fr; }
      .cards { max-width: 520px; }
    }
  `,
})
export class Team {
  protected readonly proof = PROOF;
  protected readonly team = TEAM;
}
