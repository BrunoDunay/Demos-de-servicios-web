import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ALL_TEETH, TREATMENTS, Treatment, toothName } from '../core/content';
import { Clinic, money } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

interface ToothShape {
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  /** Distancia al centro (0 = incisivo central): ordena la animación de encendido. */
  order: number;
}

// Tamaño de cada tipo de diente según su posición (1 = central … 8 = muela del juicio)
const SIZE: Record<number, [number, number]> = {
  1: [24, 30], 2: [21, 27], 3: [22, 30], 4: [24, 28], 5: [24, 28], 6: [31, 33], 7: [30, 32], 8: [27, 29],
};

/** Coloca 16 dientes sobre medio óvalo, repartidos según su ancho (como una arcada vista desde arriba). */
function arch(list: number[], cy: number, upper: boolean): ToothShape[] {
  const cx = 300, rx = 232, ry = 168;
  const gap = 3.2;
  const widths = list.map((n) => SIZE[n % 10][0] + gap);
  const total = widths.reduce((a, b) => a + b, 0);
  // Ángulos de 200° a 340° (arriba) o de 160° a 20° (abajo)
  const a0 = upper ? 196 : 164, a1 = upper ? 344 : 16;
  let acc = 0;
  return list.map((n, i) => {
    const mid = acc + widths[i] / 2;
    acc += widths[i];
    const a = ((a0 + (a1 - a0) * (mid / total)) * Math.PI) / 180;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    const [w, h] = SIZE[n % 10];
    // Gira cada diente para que siga la curva (perpendicular al radio)
    const rot = (Math.atan2(ry * Math.sin(a), rx * Math.cos(a)) * 180) / Math.PI + 90;
    return { n, x, y, w, h, rot, order: n % 10 };
  });
}

const UPPER = arch(ALL_TEETH.upper, 220, true);
const LOWER = arch(ALL_TEETH.lower, 226, false);

/**
 * Tratamientos como odontograma: eliges un tratamiento y se encienden los dientes donde se hace,
 * del centro hacia atrás. Tocar un diente dice cuál es (numeración FDI) y qué se le hace más seguido.
 */
@Component({
  selector: 'app-odontogram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="tratamientos">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Tratamientos</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Elige un tratamiento y mira <em>dónde</em> se hace.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Así se ve tu boca en nuestra pantalla: un mapa de cada diente. Toca uno para saber cómo se llama.</p>
        </header>

        <div class="tabs" role="tablist" aria-label="Tratamientos" data-reveal>
          @for (t of treatments; track t.id) {
            <button type="button" role="tab" [attr.aria-selected]="active().id === t.id" (click)="select(t)">{{ t.short }}</button>
          }
        </div>

        <div class="board">
          <figure class="chart" data-reveal="photo" [class.kids]="active().id === 'ninos'">
            <svg viewBox="0 20 600 420" role="img" [attr.aria-label]="'Odontograma: ' + active().name">
              <text class="side" x="20" y="227">Derecha</text>
              <text class="side" x="580" y="227" text-anchor="end">Izquierda</text>
              <line class="mid" x1="300" y1="30" x2="300" y2="420" />
              @for (t of teeth; track t.n) {
                <g class="tooth" [class.on]="lit().has(t.n)" [class.picked]="picked() === t.n" [style.--o]="t.order"
                   [attr.transform]="'translate(' + t.x + ' ' + t.y + ') rotate(' + t.rot + ')'"
                   (click)="pick(t.n)" (keydown.enter)="pick(t.n)" tabindex="0" role="button" [attr.aria-label]="label(t.n)">
                  <rect [attr.x]="-t.w / 2" [attr.y]="-t.h / 2" [attr.width]="t.w" [attr.height]="t.h" [attr.rx]="t.order >= 6 ? 9 : t.order >= 4 ? 8 : 7" />
                  @if (t.order >= 4) {
                    <path class="fissure" [attr.d]="'M' + (-t.w / 4) + ' 0 Q 0 ' + (t.h / 5) + ' ' + t.w / 4 + ' 0'" />
                  }
                </g>
              }
              @for (t of teeth; track t.n) {
                <text class="num" [attr.x]="labelX(t)" [attr.y]="labelY(t)" text-anchor="middle" [class.on]="lit().has(t.n)">{{ t.n }}</text>
              }
            </svg>
            <figcaption>
              @if (picked(); as p) {
                <b>{{ p }} · {{ name(p) }}</b>
                <span>Aquí se hace más seguido: {{ usedFor(p) }}</span>
              } @else {
                <b>{{ lit().size }} {{ lit().size === 1 ? 'diente' : 'dientes' }} en este tratamiento</b>
                <span>Toca un diente para ver su nombre</span>
              }
            </figcaption>
          </figure>

          <article class="detail" aria-live="polite">
            @let t = active();
            <p class="kicker">{{ indexOf(t) }} / {{ treatments.length }}</p>
            <h3>{{ t.name }}</h3>
            <p class="text">{{ t.text }}</p>
            <dl>
              <div><dt><app-icon name="calendar" [size]="16" /> Citas</dt><dd>{{ t.sessions }}</dd></div>
              <div><dt><app-icon name="clock" [size]="16" /> Duración</dt><dd>{{ t.time }}</dd></div>
              <div><dt><app-icon name="tooth" [size]="16" /> Desde</dt><dd class="price">{{ money(t.from) }}</dd></div>
            </dl>
            @if (t.note) {
              <p class="note"><app-icon name="info" [size]="16" /> {{ t.note }}</p>
            }
            <button type="button" class="btn" (click)="clinic.book(reasonFor(t))">Agendar valoración <app-icon name="arrow-right" [size]="18" /></button>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 16px; max-width: 760px; }
    .tabs { display: flex; gap: 8px; margin: 40px 0 26px; overflow-x: auto; scrollbar-width: none; padding: 4px 2px; margin-inline: -2px; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs button { flex: none; padding: 11px 18px; border-radius: 999px; font-size: 0.92rem; font-weight: 600; color: var(--ink-2); box-shadow: inset 0 0 0 1.5px var(--line); transition: background-color 220ms ease, color 220ms ease, box-shadow 220ms ease, scale 160ms var(--ease-out); }
    .tabs button:active { scale: 0.95; }
    .tabs button[aria-selected='true'] { background: var(--ink); color: var(--ivory); box-shadow: none; }
    @media (hover: hover) and (pointer: fine) { .tabs button:not([aria-selected='true']):hover { box-shadow: inset 0 0 0 1.5px var(--ink); color: var(--ink); } }
    .board { display: grid; grid-template-columns: 1.25fr 1fr; gap: clamp(20px, 3vw, 40px); align-items: stretch; }
    .chart { position: relative; margin: 0; padding: clamp(14px, 2.4vw, 30px); border-radius: var(--radius-l); background: var(--night); color: var(--ivory); display: grid; gap: 10px; }
    svg { width: 100%; height: auto; overflow: visible; }
    .side { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; fill: oklch(70% 0.03 258); }
    .mid { stroke: oklch(40% 0.04 258); stroke-dasharray: 3 6; }
    .tooth { cursor: pointer; outline: none; }
    .tooth rect { fill: oklch(31% 0.035 258); stroke: oklch(52% 0.04 258); stroke-width: 1.2; transition: fill 500ms var(--ease-out), stroke 500ms var(--ease-out), filter 500ms ease; transition-delay: calc(var(--o) * 45ms); }
    .tooth .fissure { fill: none; stroke: oklch(45% 0.04 258); stroke-width: 1.2; stroke-linecap: round; transition: stroke 500ms ease; transition-delay: calc(var(--o) * 45ms); }
    .tooth.on rect { fill: var(--ivory); stroke: var(--mint); filter: drop-shadow(0 0 7px oklch(80% 0.1 172 / 0.55)); }
    .tooth.on .fissure { stroke: oklch(80% 0.03 85); }
    .tooth.picked rect { stroke: var(--stain); stroke-width: 3; }
    .tooth:focus-visible rect { stroke: var(--stain); stroke-width: 3; }
    @media (hover: hover) and (pointer: fine) { .tooth:hover rect { stroke: var(--mint); stroke-width: 2.4; } }
    .tooth { transition: scale 200ms var(--ease-out); transform-box: fill-box; transform-origin: center; }
    .tooth:active { scale: 0.9; }
    .num { font-size: 10.5px; font-weight: 600; fill: oklch(55% 0.03 258); transition: fill 400ms ease; pointer-events: none; }
    .num.on { fill: var(--mint); }
    figcaption { display: grid; gap: 2px; padding: 12px 6px 0; border-top: 1px solid oklch(34% 0.04 258); min-height: 64px; }
    figcaption b { font-weight: 650; font-size: 0.98rem; }
    figcaption span { font-size: 0.86rem; color: oklch(72% 0.03 258); }
    .detail { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: clamp(22px, 3vw, 36px); border-radius: var(--radius-l); background: var(--white); box-shadow: var(--shadow-m); }
    .kicker { font-size: 0.8rem; font-weight: 650; color: var(--muted); font-variant-numeric: tabular-nums; }
    h3 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
    .text { color: var(--ink-2); }
    dl { display: grid; width: 100%; margin: 4px 0 0; }
    dl div { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-top: 1px solid var(--line); }
    dt { display: inline-flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--muted); }
    dd { margin: 0; font-weight: 600; text-align: right; }
    .price { font-family: var(--font-display); font-size: 1.5rem; font-weight: 500; line-height: 1; }
    .note { display: flex; gap: 8px; align-items: flex-start; padding: 12px 14px; border-radius: var(--radius-s); background: var(--mint-soft); font-size: 0.88rem; color: var(--mint-deep); }
    .note .icon { margin-top: 3px; }
    .detail .btn { margin-top: auto; }
    @media (max-width: 900px) { .board { grid-template-columns: 1fr; } }
  `,
})
export class Odontogram {
  protected readonly clinic = inject(Clinic);
  protected readonly treatments = TREATMENTS;
  protected readonly teeth = [...UPPER, ...LOWER];
  protected readonly active = signal<Treatment>(TREATMENTS[1]);
  protected readonly picked = signal<number | null>(null);
  protected readonly lit = computed(() => new Set(this.active().teeth.map((n) => (n >= 50 ? n - 40 : n))));
  protected readonly money = money;

  protected select(t: Treatment) {
    this.active.set(t);
    this.picked.set(null);
  }

  protected pick(n: number) {
    this.picked.set(this.picked() === n ? null : n);
  }

  protected name(n: number) {
    return toothName(n);
  }

  protected label(n: number) {
    return `Diente ${n}: ${toothName(n)}`;
  }

  protected usedFor(n: number) {
    const list = TREATMENTS.filter((t) => t.id !== 'limpieza' && t.id !== 'ninos' && t.teeth.includes(n)).map((t) => t.short.toLowerCase());
    return list.length ? list.join(', ') : 'limpieza y revisión';
  }

  protected indexOf(t: Treatment) {
    return String(TREATMENTS.indexOf(t) + 1).padStart(2, '0');
  }

  protected reasonFor(t: Treatment) {
    const map: Record<string, string> = { limpieza: 'Revisión y limpieza', blanqueamiento: 'Blanqueamiento', ortodoncia: 'Ortodoncia', implantes: 'Implantes', resinas: 'Resinas o caries', ninos: 'Mi hijo o hija' };
    return map[t.id] ?? 'Otro';
  }

  // Los números van por fuera de la arcada
  protected labelX(t: ToothShape) {
    return 300 + (t.x - 300) * 1.17;
  }

  protected labelY(t: ToothShape) {
    const cy = t.y < 223 ? 220 : 226;
    return cy + (t.y - cy) * 1.2 + 4;
  }
}
