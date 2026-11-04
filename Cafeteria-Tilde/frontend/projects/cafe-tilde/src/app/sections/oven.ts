import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { OVEN } from '../core/content';
import { Order, money, nowHours } from '../core/order';
import { DragScroll } from '../shared/drag-scroll';
import { Reveal } from '../shared/reveal';

const clock = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

/** Lo que sale del horno a lo largo del día, comparado con la hora real del visitante. */
@Component({
  selector: 'app-oven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, DragScroll],
  template: `
    <section class="section oven" id="horno">
      <div class="container">
        <div class="head">
          <span class="tag" data-reveal>Pan del día</span>
          <h2 class="title" data-reveal [revealDelay]="60">¿Qué salió del horno?</h2>
          <p class="now" data-reveal [revealDelay]="120" aria-live="polite">{{ sentence() }}</p>
        </div>

        <div class="line" data-reveal [revealDelay]="160">
          <span class="rail" aria-hidden="true"><span class="fill" [style.transform]="'scaleX(' + progress() + ')'"></span></span>
          <ol class="stops" dragScroll>
            @for (o of oven; track o.name; let i = $index) {
              <li [class]="'stop ' + state(i)">
                <span class="time">{{ o.label }}</span>
                <div class="ph"><img [src]="'media/' + o.img + '-sm.webp'" [alt]="o.name" width="720" height="720" loading="lazy" /></div>
                <h3>{{ o.name }}</h3>
                <p class="detail">{{ o.detail }}</p>
                <span class="badge">{{ badge(i) }}</span>
                <button type="button" class="grab" (click)="order.add(o.name, o.price)">Apartar uno · {{ money(o.price) }}</button>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: `
    .oven { background: var(--jitomate); color: var(--leche); }
    .head { display: grid; grid-template-columns: auto 1fr; grid-template-areas: 'tag tag' 'title now'; gap: 14px 40px; align-items: end; margin-bottom: 56px; }
    .tag { grid-area: tag; color: var(--mantequilla); }
    .title { grid-area: title; font-size: clamp(2.6rem, 6vw, 5rem); }
    .now { grid-area: now; max-width: 36ch; justify-self: end; font-size: 1.15rem; font-weight: 600; }
    .line { position: relative; }
    .rail { position: absolute; left: 0; right: 0; top: 46px; height: 4px; border-radius: 4px; background: color-mix(in oklch, var(--leche) 25%, transparent); }
    .fill { position: absolute; inset: 0; border-radius: inherit; background: var(--mantequilla); transform-origin: left; transition: transform 900ms var(--ease-out); }
    .stops { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; }
    .stop { display: flex; flex-direction: column; }
    .time { align-self: flex-start; padding: 4px 12px; border-radius: 999px; background: var(--leche); color: var(--jitomate-hondo); font-family: var(--font-display); font-size: 1.15rem; }
    .ph { width: 100%; aspect-ratio: 1; margin-top: 18px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 6px var(--leche); transition: box-shadow 300ms ease, scale 300ms var(--ease-out); }
    .ph img { width: 100%; height: 100%; object-fit: cover; }
    h3 { margin-top: 18px; font-size: 1.5rem; }
    .detail { margin-top: 6px; font-size: 0.95rem; opacity: 0.88; }
    .badge { align-self: flex-start; margin-top: 12px; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; background: color-mix(in oklch, var(--leche) 18%, transparent); }
    .grab { align-self: flex-start; margin-top: 12px; font-weight: 800; font-size: 0.9rem; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; transition: text-underline-offset 200ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .grab:hover { text-underline-offset: 7px; } }
    .grab:active { translate: 0 1px; }
    .stop.later .ph { filter: saturate(0.5); opacity: 0.7; }
    .stop.next .ph { box-shadow: 0 0 0 6px var(--mantequilla); }
    .stop.next .badge { background: var(--mantequilla); color: var(--cafe); }
    .stop.out .badge { background: var(--leche); color: var(--jitomate-hondo); }
    @media (max-width: 980px) {
      .head { grid-template-columns: 1fr; grid-template-areas: 'tag' 'title' 'now'; }
      .now { justify-self: start; }
      .rail { display: none; }
      .stops { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 62%; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: none; }
      .stops::-webkit-scrollbar { display: none; }
      .stop { scroll-snap-align: start; }
    }
  `,
})
export class Oven {
  protected readonly oven = OVEN;
  protected readonly order = inject(Order);
  protected readonly money = money;
  /** Hora del visitante en horas decimales. Antes de que cargue el navegador, se asume media mañana. */
  protected readonly now = signal(10.5);
  private readonly ready = signal(false);

  protected readonly nextIndex = computed(() => {
    const i = OVEN.findIndex((o) => o.at > this.now());
    return i === -1 ? OVEN.length : i;
  });

  protected readonly progress = computed(() => {
    const first = OVEN[0].at;
    const last = OVEN[OVEN.length - 1].at;
    return Math.max(0, Math.min(1, (this.now() - first) / (last - first)));
  });

  protected readonly sentence = computed(() => {
    if (!this.ready()) return 'Desde las 7:30 sale algo nuevo cada par de horas.';
    const h = this.now();
    const next = OVEN[this.nextIndex()];
    if (h < OVEN[0].at) return `Son las ${clock(h)}. Las conchas salen a las 7:30; el café ya está listo antes.`;
    if (!next) return `Son las ${clock(h)}. Ya salió todo lo de hoy; lo que quede, se va con descuento después de las 19:00.`;
    const mins = Math.round((next.at - h) * 60);
    const wait = mins >= 60 ? `a las ${next.label}` : `en ${mins} minutos`;
    return `Son las ${clock(h)}. ${next.name === 'Galletas de avena' ? 'Las galletas salen' : `${next.name} sale`} ${wait}.`;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.now.set(nowHours());
      this.ready.set(true);
      const t = setInterval(() => this.now.set(nowHours()), 60_000);
      destroyRef.onDestroy(() => clearInterval(t));
    });
  }

  protected state(i: number) {
    const n = this.nextIndex();
    return i < n ? 'out' : i === n ? 'next' : 'later';
  }

  protected badge(i: number) {
    const s = this.state(i);
    if (!this.ready()) return `Sale a las ${OVEN[i].label}`;
    if (s === 'out') return i === this.nextIndex() - 1 ? 'Recién salido' : 'Ya salió';
    if (s === 'next') return 'Es lo que sigue';
    return `Sale a las ${OVEN[i].label}`;
  }
}
