import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { WEEK, WOD } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Agenda semanal (referencia de post de agenda) + WOD del día con cronómetro AMRAP que funciona. */
@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section schedule" id="horarios">
      <div class="vertical" aria-hidden="true"><span>Semana</span></div>
      <div class="container layout">
        <div class="agenda">
          <span class="tag" data-reveal>Horarios</span>
          <h2 class="title-lg" data-reveal [revealDelay]="80">Agenda<br />semanal</h2>
          <ol class="days">
            @for (d of week; track d.day; let i = $index) {
              <li class="day" [class.is-open]="open() === i" data-reveal [revealDelay]="i * 60">
                <button type="button" class="day-head" [attr.aria-expanded]="open() === i" (click)="open.set(open() === i ? -1 : i)">
                  <span class="date"><small>{{ d.short }}</small><b>{{ dates()[i] ?? '·' }}</b></span>
                  <span class="name">{{ d.day }}</span>
                  <span class="times">{{ summary(d.slots) }}</span>
                  <span class="plus" aria-hidden="true"></span>
                </button>
                <div class="slots" [attr.aria-hidden]="open() !== i">
                  <div class="slots-inner">
                    @for (s of d.slots; track s.time + s.name) {
                      <div class="slot"><b>{{ s.time }}</b><span>{{ s.name }}</span><small>Coach {{ s.coach }}</small></div>
                    }
                  </div>
                </div>
              </li>
            }
          </ol>
        </div>

        <aside class="wod" data-reveal="right" [revealDelay]="120" aria-label="WOD del día">
          <div class="wod-head">
            <span class="tag">WOD de hoy</span>
            <span class="badge">{{ wod.format }}</span>
          </div>
          <h3>“{{ wod.title }}”</h3>
          <ul>
            @for (m of wod.moves; track m; let i = $index) {
              <li><span>0{{ i + 1 }}</span>{{ m }}</li>
            }
          </ul>
          <div class="timer" [class.is-running]="running()" [class.is-done]="remaining() === 0">
            <div class="ring" aria-hidden="true">
              <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="track" /><circle cx="60" cy="60" r="54" class="bar" pathLength="1" [style.stroke-dashoffset]="1 - progress()" /></svg>
            </div>
            <output class="clock" aria-live="polite">{{ display() }}</output>
            <div class="controls">
              <button type="button" class="ctl main" (click)="toggle()" [attr.aria-label]="running() ? 'Pausar' : 'Iniciar'" data-cursor="GO">
                <app-icon [name]="running() ? 'pause' : 'play'" [size]="22" [filled]="!running()" />
              </button>
              <button type="button" class="ctl" (click)="reset()" aria-label="Reiniciar"><app-icon name="reset" [size]="20" /></button>
            </div>
          </div>
          <p class="hint">Dale play y ponte a prueba: 14 minutos, tantas rondas como puedas.</p>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .schedule { position: relative; overflow: hidden; }
    .vertical {
      position: absolute; left: -0.08em; top: 50%; font-family: var(--font-display); font-size: clamp(9rem, 20vw, 20rem); line-height: 1; text-transform: uppercase;
      color: transparent; -webkit-text-stroke: 1px rgb(242 239 232 / 10%); writing-mode: vertical-rl; transform: translateY(-50%) rotate(180deg); pointer-events: none; will-change: transform;
    }
    .layout { position: relative; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(32px, 5vw, 80px); align-items: start; padding-left: clamp(0px, 8vw, 140px); }
    .title-lg { margin-top: 18px; }
    .days { list-style: none; margin: 40px 0 0; padding: 0; border-top: 1px solid var(--line-2); }
    .day { border-bottom: 1px solid var(--line-2); }
    .day-head { width: 100%; display: grid; grid-template-columns: 74px 1fr auto 26px; align-items: center; gap: 18px; padding: 18px 0; text-align: left; transition: padding-left 400ms var(--ease-expo); }
    .day-head:hover { padding-left: 10px; }
    .date { display: flex; flex-direction: column; align-items: center; line-height: 1; }
    .date small { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.16em; color: var(--ember); }
    .date b { font-family: var(--font-display); font-weight: 400; font-size: 2.6rem; margin-top: 4px; min-height: 1em; }
    .name { font-family: var(--font-display); font-size: 1.7rem; text-transform: uppercase; }
    .times { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); }
    .plus { position: relative; width: 22px; height: 22px; }
    .plus::before, .plus::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: var(--ember); transition: transform 400ms var(--ease-expo); }
    .plus::after { transform: rotate(90deg); }
    .is-open .plus::after { transform: rotate(0deg); }
    .slots { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 500ms var(--ease-expo); }
    .is-open .slots { grid-template-rows: 1fr; }
    .slots-inner { overflow: hidden; }
    .slot { display: grid; grid-template-columns: 74px 1fr auto; gap: 18px; padding: 10px 0; border-top: 1px dashed var(--line); }
    .slot:first-child { border-top: 0; }
    .slot b { text-align: center; font-family: var(--font-mono); font-weight: 600; color: var(--ink); }
    .slot small { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
    .is-open .slots-inner { padding-bottom: 14px; }

    .wod { position: sticky; top: 100px; padding: 32px; background: var(--bg-2); border: 1px solid var(--line); clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%); }
    .wod-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .badge { padding: 6px 10px; background: var(--ember); color: var(--bg); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
    .wod h3 { margin-top: 18px; font-size: clamp(2.6rem, 4.4vw, 3.8rem); }
    .wod ul { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 8px; }
    .wod li { display: flex; gap: 12px; font-family: var(--font-mono); font-size: 0.86rem; color: var(--ink-2); }
    .wod li span { color: var(--ember); }
    .timer { position: relative; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 22px; margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--line); }
    .ring { position: relative; width: 108px; height: 108px; grid-row: span 2; }
    .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .ring circle { fill: none; stroke-width: 6; }
    .ring .track { stroke: var(--bg-3); }
    .ring .bar { stroke: var(--ember); stroke-dasharray: 1; transition: stroke-dashoffset 1s linear; }
    .clock { font-family: var(--font-display); font-size: clamp(3.4rem, 6vw, 4.6rem); line-height: 1; font-variant-numeric: tabular-nums; }
    .is-running .clock { color: var(--ember); }
    .is-done .clock { animation: pulse 0.6s ease 3; }
    @keyframes pulse { 50% { color: var(--spark); transform: scale(1.06); } }
    .controls { display: flex; gap: 10px; }
    .ctl { display: grid; place-items: center; width: 50px; height: 50px; border: 1.5px solid var(--line-2); color: var(--ink); transition: background-color 250ms ease, color 250ms ease, transform 200ms var(--ease-out); }
    .ctl.main { background: var(--ember); border-color: var(--ember); color: var(--bg); }
    .ctl:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .ctl:active { transform: scale(0.92); }
    .hint { margin-top: 18px; font-size: 0.85rem; color: var(--muted); }

    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; padding-left: 0; }
      .wod { position: static; }
      .vertical { opacity: 0.5; }
      .times { display: none; }
      .day-head { grid-template-columns: 64px 1fr 26px; }
    }
  `,
})
export class Schedule {
  protected readonly week = WEEK;
  protected readonly wod = WOD;
  protected readonly open = signal(0);
  protected readonly dates = signal<(number | null)[]>([]);
  private readonly total = WOD.minutes * 60;
  protected readonly remaining = signal(this.total);
  protected readonly running = signal(false);
  protected readonly display = computed(() => {
    const r = this.remaining();
    return `${String(Math.floor(r / 60)).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`;
  });
  protected readonly progress = computed(() => 1 - this.remaining() / this.total);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // Fechas de la semana en curso (se calculan en el navegador para que nunca se vean viejas).
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      this.dates.set(this.week.map((_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i).getDate()));
      const today = (now.getDay() + 6) % 7;
      if (today < this.week.length) this.open.set(today);

      if (!prefersReducedMotion()) {
        const { gsap } = useGsap();
        const tween = gsap.to(host.querySelector(".vertical span"), {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        destroyRef.onDestroy(() => tween.scrollTrigger?.kill());
      }
    });
    destroyRef.onDestroy(() => clearInterval(this.timer));
  }

  protected summary(slots: { time: string }[]) {
    return slots.map((s) => s.time).join(' · ');
  }

  protected toggle() {
    if (this.running()) {
      this.running.set(false);
      clearInterval(this.timer);
      return;
    }
    if (this.remaining() === 0) this.remaining.set(this.total);
    this.running.set(true);
    this.timer = setInterval(() => {
      this.remaining.update((r) => Math.max(0, r - 1));
      if (this.remaining() === 0) {
        this.running.set(false);
        clearInterval(this.timer);
      }
    }, 1000);
  }

  protected reset() {
    clearInterval(this.timer);
    this.running.set(false);
    this.remaining.set(this.total);
  }
}
