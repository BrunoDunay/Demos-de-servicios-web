import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FIRST_SESSION, MYTHS, SERVICES } from '../core/content';
import { Practice, money } from '../core/practice';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Tipos de terapia, cómo es la primera sesión y mitos que se voltean al tocarlos. */
@Component({
  selector: 'app-therapy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="terapia">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Terapia</p>
          <h2 class="h2" data-reveal [revealDelay]="100">Cuatro formas de <em>acompañarte</em>.</h2>
        </header>
        <div class="services">
          @for (s of services; track s.id; let i = $index) {
            <article class="service" data-reveal [revealDelay]="i * 100">
              <div class="pic"><img [src]="'media/' + s.photo + '-sm.webp'" [alt]="s.title" width="820" height="547" loading="lazy" /></div>
              <div class="body">
                <h3>{{ s.title }}</h3>
                <p>{{ s.text }}</p>
                <p class="price">{{ money(s.price) }} <span>por sesión</span></p>
                <button type="button" class="link" (click)="practice.book(reasonFor(s.id))">Agendar <app-icon name="arrow-right" [size]="16" /></button>
              </div>
            </article>
          }
        </div>

        <div class="first">
          <figure class="room" data-reveal="photo">
            <img src="media/sala.webp" srcset="media/sala-sm.webp 820w, media/sala.webp 1800w" sizes="(max-width: 900px) 100vw, 45vw" alt="Consultorio de Claro con sillones y plantas" width="1800" height="1200" loading="lazy" />
          </figure>
          <div class="first-copy">
            <p class="eyebrow" data-reveal>La primera sesión</p>
            <h2 class="h2" data-reveal [revealDelay]="100">No tienes que saber <em>por dónde empezar</em>.</h2>
            <ol>
              @for (f of first; track f.t; let i = $index) {
                <li data-reveal [revealDelay]="150 + i * 100"><span>{{ i + 1 }}</span><div><b>{{ f.t }}</b><p>{{ f.d }}</p></div></li>
              }
            </ol>
          </div>
        </div>

        <div class="myths">
          <p class="eyebrow" data-reveal>Mitos</p>
          <h3 class="myths-title" data-reveal [revealDelay]="80">Lo que se dice de la terapia <span>(toca una tarjeta)</span></h3>
          <div class="cards">
            @for (m of myths; track m.myth; let i = $index) {
              <button type="button" class="flip" [class.on]="flipped().has(i)" (click)="flip(i)" [attr.aria-pressed]="flipped().has(i)" data-reveal [revealDelay]="i * 90">
                <span class="face front"><small>Mito</small>{{ m.myth }}<app-icon name="sparkle" [size]="18" /></span>
                <span class="face back"><small>En realidad</small>{{ m.truth }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 16px; }
    .services { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 46px; }
    .service { display: grid; grid-template-rows: auto 1fr; border-radius: var(--radius-m); overflow: hidden; background: var(--paper); box-shadow: var(--shadow-s); transition: box-shadow 400ms ease, translate 500ms var(--ease-out); }
    .pic { aspect-ratio: 4 / 3; overflow: hidden; }
    .pic img { width: 100%; height: 100%; object-fit: cover; transition: scale 1200ms var(--ease-calm); }
    .body { display: flex; flex-direction: column; gap: 8px; padding: 20px; }
    .body h3 { font-size: 1.6rem; }
    .body > p:not(.price) { color: var(--forest-2); font-size: 0.95rem; }
    .price { margin-top: auto; padding-top: 10px; font-family: var(--font-display); font-size: 1.5rem; }
    .price span { font-family: var(--font-body); font-size: 0.82rem; color: var(--muted); }
    .link { display: inline-flex; align-items: center; gap: 6px; width: fit-content; font-weight: 600; color: var(--moss); transition: gap 300ms var(--ease-out), scale 160ms var(--ease-out); }
    .link:active { scale: 0.96; }
    @media (hover: hover) and (pointer: fine) {
      .service:hover { box-shadow: var(--shadow-m); translate: 0 -4px; }
      .service:hover .pic img { scale: 1.06; }
      .link:hover { gap: 10px; }
    }
    .first { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(30px, 6vw, 90px); align-items: center; margin-top: var(--section); }
    .room { margin: 0; aspect-ratio: 4 / 4.4; border-radius: var(--radius-l); overflow: hidden; }
    .room img { width: 100%; height: 100%; object-fit: cover; }
    .first-copy { display: grid; gap: 18px; }
    ol { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 22px; }
    li { display: flex; gap: 16px; }
    li > span { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--amber-soft); color: var(--amber-deep); font-family: var(--font-display); font-size: 1.2rem; }
    li b { font-weight: 600; font-size: 1.05rem; }
    li p { color: var(--forest-2); }
    .myths { margin-top: var(--section); display: grid; gap: 14px; }
    .myths-title { font-size: clamp(1.8rem, 3.4vw, 2.6rem); }
    .myths-title span { font-family: var(--font-body); font-size: 0.95rem; color: var(--muted); }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 20px; }
    .flip { position: relative; min-height: 210px; perspective: 900px; text-align: left; transition: scale 160ms var(--ease-out); }
    .flip:active { scale: 0.97; }
    .face { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; padding: 22px; border-radius: var(--radius-m); backface-visibility: hidden; transition: rotate 700ms var(--ease-calm); font-size: 1.05rem; line-height: 1.45; }
    .face small { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em; }
    .front { background: var(--paper); box-shadow: var(--shadow-s); font-family: var(--font-display); font-size: 1.45rem; line-height: 1.2; }
    .front small { font-family: var(--font-body); color: var(--muted); }
    .front .icon { margin-top: auto; color: var(--amber-deep); }
    .back { background: var(--forest); color: var(--mist); rotate: y 180deg; }
    .back small { color: var(--amber); }
    .flip.on .front { rotate: y -180deg; }
    .flip.on .back { rotate: y 0deg; }
    @media (hover: hover) and (pointer: fine) { .flip:not(.on):hover .front { rotate: y -8deg; } }
    @media (max-width: 1000px) { .services, .cards { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 900px) { .first { grid-template-columns: 1fr; } .room { aspect-ratio: 4 / 3; } }
    @media (max-width: 560px) { .services { grid-template-columns: 1fr; } .cards { grid-template-columns: 1fr; } .flip { min-height: 170px; } }
  `,
})
export class Therapy {
  protected readonly practice = inject(Practice);
  protected readonly services = SERVICES;
  protected readonly first = FIRST_SESSION;
  protected readonly myths = MYTHS;
  protected readonly flipped = signal(new Set<number>());
  protected readonly money = money;

  protected flip(i: number) {
    const s = new Set(this.flipped());
    if (s.has(i)) s.delete(i);
    else s.add(i);
    this.flipped.set(s);
  }

  protected reasonFor(id: string) {
    return { individual: 'Terapia individual', pareja: 'Terapia de pareja', adolescentes: 'Adolescentes', linea: 'Terapia individual' }[id] ?? 'Terapia individual';
  }
}
