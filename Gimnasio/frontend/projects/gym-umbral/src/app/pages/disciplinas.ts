import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DAYS, DISCIPLINES, SCHEDULE, ScheduleClass, TIMES } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { DisciplinesHero } from '../sections/disciplines-hero';
import { PlayInView } from '../shared/in-view-video';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

const FILTERS: { id: 'todas' | ScheduleClass['discipline']; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'reformer', label: 'Reformer' },
  { id: 'ride', label: 'Ride' },
  { id: 'fuerza', label: 'Fuerza' },
  { id: 'movilidad', label: 'Movilidad' },
];

@Component({
  selector: 'app-disciplinas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplinesHero, PlayInView, RouterLink, Icon, SplitLines, Reveal],
  template: `
    <app-disciplines-hero />

    @for (d of disciplines; track d.id; let i = $index) {
      <section class="section discipline" [id]="d.id" [class.flip]="i % 2 === 1">
        <div class="container layout">
          <div class="collage">
            <figure class="main" data-reveal="clip">
              @if (d.arch) {
                <video [playInView]="'media/' + d.arch + '.mp4'" [attr.poster]="'media/' + d.arch + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
              } @else {
                <img class="warm" [src]="'media/' + d.img + '-sm.webp'" [attr.srcset]="'media/' + d.img + '-sm.webp 720w, media/' + d.img + '.webp 1600w'" sizes="(max-width: 900px) 92vw, 44vw" [alt]="d.name" loading="lazy" />
                <span class="stage" aria-hidden="true"><i></i><i></i></span>
              }
            </figure>
            <span class="ring" aria-hidden="true"></span>
            <figure class="small s1" data-reveal="clip" [revealDelay]="200"><img class="warm" [src]="'media/' + d.gallery[0] + '-sm.webp'" [alt]="d.name + ', estudio'" loading="lazy" /></figure>
            <figure class="small s2" data-reveal="clip" [revealDelay]="350"><img class="warm" [src]="'media/' + d.gallery[2] + '-sm.webp'" [alt]="d.name + ', detalle'" loading="lazy" /></figure>
          </div>
          <div class="copy">
            <span class="label" data-reveal>0{{ i + 1 }} · {{ d.name }}</span>
            <h2 class="display" splitLines>{{ d.name }}</h2>
            <p class="tag" data-reveal><em>{{ d.tagline }}</em></p>
            <p class="long" data-reveal>{{ d.long }}</p>
            <dl data-reveal>
              @for (s of d.specs; track s[0]) {
                <div><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
              }
            </dl>
            <ul data-reveal>
              @for (b of d.benefits; track b) {
                <li><app-icon name="sparkle" [size]="14" />{{ b }}</li>
              }
            </ul>
            <a routerLink="/contacto" [queryParams]="{ interes: 'Primera sesión de cortesía', clase: d.name }" class="btn" data-reveal data-cursor="RESERVA">Reservar {{ d.name }} <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a>
          </div>
        </div>
      </section>
    }

    <section class="section schedule" id="horario">
      <div class="container">
        <div class="head">
          <div>
            <span class="label" data-reveal>Horario semanal</span>
            <h2 class="h2" splitLines>Encuentra <em class="gold">tu hora.</em></h2>
          </div>
          <div class="filters" role="group" aria-label="Filtrar por disciplina" data-reveal>
            @for (f of filters; track f.id) {
              <button type="button" [class.on]="filter() === f.id" [attr.aria-pressed]="filter() === f.id" (click)="filter.set(f.id)">
                @if (f.id !== 'todas') { <i [class]="'dot ' + f.id"></i> }
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <div class="table" data-reveal role="table" aria-label="Horario de clases">
          <div class="row header" role="row">
            <span role="columnheader"></span>
            @for (d of days; track d) {
              <span role="columnheader">{{ d }}</span>
            }
          </div>
          @for (t of times; track t) {
            <div class="row" role="row">
              <span class="time" role="rowheader">{{ t }}</span>
              @for (d of days; track d; let di = $index) {
                @let c = at(t, di);
                <span role="cell" class="cell">
                  @if (c) {
                    <a routerLink="/contacto" [queryParams]="{ interes: 'Primera sesión de cortesía', clase: c.name + ' · ' + d + ' ' + t }" class="class" [class]="'class ' + c.discipline" [class.dim]="filter() !== 'todas' && filter() !== c.discipline" data-cursor="RESERVA">
                      <b>{{ c.name }}</b><small>{{ c.coach }}</small>
                    </a>
                  }
                </span>
              }
            </div>
          }
        </div>

        <div class="mobile-list">
          <div class="day-tabs" role="tablist" aria-label="Día">
            @for (d of days; track d; let di = $index) {
              <button type="button" role="tab" [attr.aria-selected]="day() === di" [class.on]="day() === di" (click)="day.set(di)">{{ d }}</button>
            }
          </div>
          @for (c of dayClasses(); track c.time + c.name) {
            <a routerLink="/contacto" [queryParams]="{ interes: 'Primera sesión de cortesía', clase: c.name + ' · ' + days[day()] + ' ' + c.time }" class="m-class" [class.dim]="filter() !== 'todas' && filter() !== c.discipline">
              <span class="time">{{ c.time }}</span>
              <span><b>{{ c.name }}</b><small>con {{ c.coach }}</small></span>
              <i [class]="'dot ' + c.discipline"></i>
            </a>
          } @empty {
            <p class="empty">Sin clases este día. Ven al lounge o al sauna.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(40px, 7vw, 120px); align-items: center; }
    .flip .collage { order: 2; }
    .collage { position: relative; padding-bottom: 14%; }
    .collage figure { margin: 0; overflow: hidden; background: var(--bg-3); }
    .collage img, .collage video { width: 100%; height: 100%; object-fit: cover; }
    .main { position: relative; aspect-ratio: 4 / 5.4; width: 74%; border-radius: 1000px 1000px 0 0; }
    /* Contorno dorado del arco, desplazado detrás del video; se dibuja con el scroll. */
    .ring { position: absolute; left: 4%; top: -3%; width: 74%; aspect-ratio: 4 / 5.4; border: 1px solid rgb(216 185 138 / 45%); border-bottom: 0; border-radius: 1000px 1000px 0 0; pointer-events: none; clip-path: inset(0 0 100% 0); }
    .flip .ring { left: auto; right: 4%; }
    .stage { position: absolute; inset: 0; mix-blend-mode: screen; pointer-events: none; }
    .stage i { position: absolute; left: 50%; top: -10%; width: 80%; height: 120%; translate: -50% 0; transform-origin: 50% 0; background: linear-gradient(180deg, rgb(243 196 140 / 30%), transparent 70%); clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%); filter: blur(8px); animation: sweep 7s ease-in-out infinite; }
    .stage i:nth-child(2) { background: linear-gradient(180deg, rgb(201 123 90 / 30%), transparent 70%); animation-duration: 9s; animation-delay: -3s; }
    @keyframes sweep { 0%, 100% { rotate: -22deg; opacity: 0.4; } 50% { rotate: 22deg; opacity: 1; } }
    .small { position: absolute; }
    .s1 { right: 0; top: 12%; width: 36%; aspect-ratio: 3 / 4; }
    .s2 { right: 8%; bottom: 0; width: 44%; aspect-ratio: 4 / 3; }
    .flip .main { margin-left: auto; }
    .flip .s1 { right: auto; left: 0; }
    .flip .s2 { right: auto; left: 8%; }
    .copy .display { margin-top: 18px; }
    .tag { margin-top: 10px; font-size: clamp(1.4rem, 2.4vw, 2rem); color: var(--gold); }
    .long { margin-top: 20px; color: var(--ink-2); font-weight: 300; max-width: 520px; }
    dl { display: flex; gap: 40px; margin: 30px 0; padding: 22px 0; border-block: 1px solid var(--line); }
    dt { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    dd { margin: 4px 0 0; font-family: var(--font-display); font-size: 1.7rem; }
    ul { list-style: none; padding: 0; margin: 0 0 34px; display: grid; gap: 12px; }
    li { display: flex; gap: 12px; align-items: center; color: var(--ink-2); font-weight: 300; }
    li app-icon { color: var(--gold); }

    .schedule { background: var(--bg-2); }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 44px; }
    .h2 { margin-top: 20px; }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; }
    .filters button { display: inline-flex; align-items: center; gap: 8px; min-height: 42px; padding: 0 18px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; box-shadow: inset 0 0 0 1px var(--line-2); color: var(--ink-2); transition: background-color 400ms ease, color 400ms ease, box-shadow 400ms ease; }
    @media (hover: hover) and (pointer: fine) { .filters button:hover { box-shadow: inset 0 0 0 1px var(--gold); color: var(--ink); } }
    .filters button.on { background: var(--ink); color: var(--bg); box-shadow: none; }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .reformer { --c: #d8b98a; } .ride { --c: #c97b5a; } .fuerza { --c: #a9b4a0; } .movilidad { --c: #8fa3b8; }
    .dot { background: var(--c); }
    .table { border-top: 1px solid var(--line); }
    .row { display: grid; grid-template-columns: 74px repeat(7, 1fr); border-bottom: 1px solid var(--line); }
    .row.header span { padding: 14px 8px; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    .time { padding: 16px 0; font-family: var(--font-display); font-size: 1.3rem; color: var(--ink-2); }
    .cell { padding: 6px; border-left: 1px solid var(--line); min-height: 76px; }
    .class { display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 10px 12px; border-left: 2px solid var(--c); background: color-mix(in srgb, var(--c) 9%, transparent); transition: background-color 400ms ease, opacity 500ms ease, transform 500ms var(--ease-out); }
    .class b { font-weight: 600; font-size: 0.82rem; line-height: 1.25; }
    .class small { font-size: 0.7rem; color: var(--muted); }
    @media (hover: hover) and (pointer: fine) { .class:hover { background: color-mix(in srgb, var(--c) 22%, transparent); transform: translateY(-2px); } }
    .class.dim, .m-class.dim { opacity: 0.15; }
    .mobile-list { display: none; }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .flip .collage { order: 0; }
      .table { display: none; }
      .mobile-list { display: block; }
      .day-tabs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; margin-bottom: 14px; }
      .day-tabs button { flex: none; min-height: 44px; padding: 0 16px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; box-shadow: inset 0 0 0 1px var(--line-2); }
      .day-tabs button.on { background: var(--gold); color: var(--bg); box-shadow: none; }
      .m-class { display: grid; grid-template-columns: 64px 1fr 12px; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line); transition: opacity 400ms ease; }
      .m-class b { display: block; font-weight: 600; }
      .m-class small { color: var(--muted); }
      .empty { padding: 20px 0; color: var(--muted); }
    }
  `,
})
export default class Disciplinas {
  protected readonly disciplines = DISCIPLINES;
  protected readonly filters = FILTERS;
  protected readonly days = DAYS;
  protected readonly times = TIMES;
  protected readonly filter = signal<(typeof FILTERS)[number]['id']>('todas');
  protected readonly day = signal(0);
  protected readonly dayClasses = computed(() => SCHEDULE.filter((c) => c.day === this.day()).sort((a, b) => a.time.localeCompare(b.time)));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const today = (new Date().getDay() + 6) % 7;
      this.day.set(today);
      if (prefersReducedMotion()) {
        host.querySelectorAll<HTMLElement>('.ring').forEach((r) => (r.style.clipPath = 'none'));
        return;
      }
      const { gsap } = useGsap();
      const ctx = gsap.context(() => {
        host.querySelectorAll<HTMLElement>('.collage').forEach((c) => {
          gsap.to(c.querySelector('.ring'), { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: c, start: 'top 85%', end: 'center 45%', scrub: true } });
          gsap.fromTo(c.querySelector('.main > *'), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
          gsap.to(c.querySelector('.s1'), { yPercent: -25, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
          gsap.to(c.querySelector('.s2'), { yPercent: 18, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }, host);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }

  protected at(time: string, day: number) {
    return SCHEDULE.find((c) => c.time === time && c.day === day);
  }
}
