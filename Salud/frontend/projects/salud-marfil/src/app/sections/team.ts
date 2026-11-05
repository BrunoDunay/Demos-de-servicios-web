import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CLINIC, REVIEWS, TEAM } from '../core/content';
import { Clinic } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';

/**
 * Equipo como tarjetas de app de citas (referencia "Tracey Clifford"): foto arriba con el nombre encima,
 * botones redondos de vidrio y una fila de datos. Se inclinan en 3D con brillo al pasar el cursor.
 * Debajo, las opiniones en un mazo de tarjetas: al tocar la de arriba sale volando y queda la siguiente.
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
      <div class="page rgrid">
        <div class="rcopy">
          <p class="pill" data-reveal>Opiniones</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Lo que dicen <b>al salir</b>.</h2>
          <p class="score" data-reveal [revealDelay]="140"><b>{{ rating }}</b><span>★★★★★<br />{{ count }} reseñas en Google</span></p>
          <div class="progress" data-reveal [revealDelay]="200">
            <p class="counter"><b>{{ pad(index() + 1) }}</b> / {{ pad(reviews.length) }}</p>
            <div class="dots" aria-hidden="true">
              @for (r of reviews; track $index) {
                <i [class.on]="$index === index()"></i>
              }
            </div>
          </div>
          <p class="hint" data-reveal [revealDelay]="240">Toca la tarjeta para leer la siguiente.</p>
        </div>

        <div class="deck" data-reveal [revealDelay]="120" role="button" tabindex="0" aria-label="Ver la siguiente opinión" (click)="next()" (keydown.enter)="next()" (keydown.space)="$event.preventDefault(); next()">
          @for (rv of reviews; track $index; let i = $index) {
            <article [class]="'rv tone-' + (i % 3)" [class.top]="depth(i) === 0" [class.second]="depth(i) === 1" [class.out]="leaving() && depth(i) === 0" [style.--k]="depth(i)" [style.z-index]="reviews.length - depth(i)" [attr.aria-hidden]="depth(i) !== 0">
              <span class="quote" aria-hidden="true">“</span>
              <p class="stars" aria-hidden="true">★★★★★</p>
              <blockquote>{{ rv.text }}</blockquote>
              <p class="by"><span class="avatar">{{ rv.name[0] }}</span><span><b>{{ rv.name }}</b><small>{{ rv.when }} · Google</small></span><span class="num">{{ pad(i + 1) }}</span></p>
            </article>
          }
        </div>
        <p class="visually-hidden" aria-live="polite">{{ reviews[index()].name }}: {{ reviews[index()].text }}</p>
      </div>
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
    .rgrid { display: grid; grid-template-columns: 1fr 1.15fr; gap: clamp(36px, 6vw, 90px); align-items: center; }
    .rcopy { display: grid; gap: 20px; justify-items: start; }
    .score { display: flex; align-items: center; gap: 12px; }
    .score b { font-family: var(--font-display); font-size: 4rem; font-weight: 600; line-height: 1; color: var(--royal); }
    .score span { font-size: 0.86rem; color: var(--muted); line-height: 1.4; }
    .progress { display: flex; align-items: center; gap: 18px; }
    .counter { font-family: var(--font-display); font-size: 1.1rem; color: var(--muted); font-variant-numeric: tabular-nums; }
    .counter b { color: var(--ink); font-weight: 600; }
    .dots { display: flex; gap: 6px; }
    .dots i { width: 8px; height: 8px; border-radius: 99px; background: var(--ice-3); transition: width 400ms var(--ease-smooth-out), background-color 300ms ease; }
    .dots i.on { width: 26px; background: var(--royal); }
    .hint { font-size: 0.9rem; color: var(--muted); }
    /* Mazo: todas las tarjetas en la misma celda; --k es su lugar en la pila (0 = arriba). Se ven 3. */
    .deck { display: grid; padding: 10px 40px 66px 10px; cursor: pointer; outline: none; -webkit-user-select: none; user-select: none; }
    .deck:focus-visible .rv.top { box-shadow: 0 0 0 3px var(--royal), var(--shadow-m); }
    .rv { grid-area: 1 / 1; position: relative; display: grid; align-content: start; gap: 16px; min-height: 330px; padding: clamp(26px, 3vw, 38px); border-radius: var(--radius-l); box-shadow: var(--shadow-m);
      --d: min(var(--k), 3);
      translate: calc(var(--d) * 14px) calc(var(--d) * 22px); rotate: calc(var(--d) * 2.5deg); scale: calc(1 - var(--d) * 0.04);
      opacity: clamp(0, 3 - var(--k), 1);
      transition: translate 650ms var(--ease-bounce), rotate 650ms var(--ease-bounce), scale 650ms var(--ease-bounce), opacity 300ms ease; }
    .tone-0 { background: var(--white); }
    .tone-1 { background: linear-gradient(150deg, var(--royal), var(--navy)); color: var(--white); }
    .tone-2 { background: var(--ice-2); }
    @media (hover: hover) and (pointer: fine) {
      /* Al pasar el cursor la de arriba se levanta y la de atrás se asoma */
      .deck:hover .rv.top { rotate: -1.5deg; translate: -4px -6px; }
      .deck:hover .rv.second { translate: 24px 32px; rotate: 4.5deg; }
    }
    /* La de arriba sale volando hacia la derecha y la siguiente sube */
    .rv.out { animation: fly 480ms cubic-bezier(0.55, 0, 0.75, 0.4) forwards; }
    @keyframes fly { to { translate: 115% -14%; rotate: 22deg; opacity: 0; } }
    .quote { position: absolute; right: 28px; top: -6px; font-family: var(--font-display); font-size: 9rem; font-weight: 700; line-height: 1; opacity: 0.12; }
    .stars { color: var(--stain); letter-spacing: 3px; }
    blockquote { margin: 0; font-family: var(--font-display); font-size: clamp(1.25rem, 2vw, 1.6rem); font-weight: 400; line-height: 1.32; letter-spacing: -0.01em; }
    .by { display: flex; align-items: center; gap: 12px; margin-top: auto; padding-top: 10px; font-size: 0.92rem; }
    .by > span:nth-child(2) { display: grid; line-height: 1.3; }
    .by small { opacity: 0.65; }
    .num { margin-left: auto; font-family: var(--font-display); font-weight: 600; opacity: 0.4; }
    .avatar { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--royal); color: var(--white); font-weight: 700; }
    .tone-1 .avatar { background: var(--white); color: var(--royal); }
    @media (max-width: 960px) {
      .cards { grid-template-columns: 1fr; max-width: 460px; }
      .rgrid { grid-template-columns: 1fr; }
      .deck { padding: 6px 30px 56px 4px; }
      .rv { min-height: 300px; }
    }
  `,
})
export class Team {
  protected readonly clinic = inject(Clinic);
  protected readonly team = TEAM;
  protected readonly reviews = REVIEWS;
  protected readonly rating = CLINIC.rating;
  protected readonly count = CLINIC.reviews;
  protected readonly index = signal(0);
  protected readonly leaving = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  /** Lugar de cada tarjeta en la pila: 0 es la de arriba. */
  protected depth(i: number) {
    const n = this.reviews.length;
    return (i - this.index() + n) % n;
  }

  protected pad(n: number) {
    return String(n).padStart(2, '0');
  }

  /** La tarjeta de arriba sale volando y pasa al fondo; después de la última vuelve la primera. */
  protected next() {
    if (this.leaving()) {
      clearTimeout(this.timer);
      this.advance();
    }
    this.leaving.set(true);
    this.timer = setTimeout(() => this.advance(), 420);
  }

  private advance() {
    this.leaving.set(false);
    this.index.set((this.index() + 1) % this.reviews.length);
  }
}
