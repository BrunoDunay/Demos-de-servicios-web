import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ALL_TEETH, TREATMENTS, Treatment, toothName } from '../core/content';
import { Clinic, money } from '../core/clinic';
import { ToothStage } from '../core/tooth-stage';
import { Icon } from '../shared/icon';
import { Arrow } from '../shared/arrow';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';
import { ToothSlot } from '../shared/tooth-stage';

interface ToothShape {
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  order: number;
}

const SIZE: Record<number, [number, number]> = {
  1: [24, 30], 2: [21, 27], 3: [22, 30], 4: [24, 28], 5: [24, 28], 6: [31, 33], 7: [30, 32], 8: [27, 29],
};

/** Arcada de 16 dientes sobre medio óvalo, repartidos según su ancho (vista desde arriba). */
function arch(list: number[], cy: number, upper: boolean): ToothShape[] {
  const cx = 300, rx = 232, ry = 168;
  const widths = list.map((n) => SIZE[n % 10][0] + 3.2);
  const total = widths.reduce((a, b) => a + b, 0);
  const a0 = upper ? 196 : 164, a1 = upper ? 344 : 16;
  let acc = 0;
  return list.map((n, i) => {
    const mid = acc + widths[i] / 2;
    acc += widths[i];
    const a = ((a0 + (a1 - a0) * (mid / total)) * Math.PI) / 180;
    const [w, h] = SIZE[n % 10];
    const rot = (Math.atan2(ry * Math.sin(a), rx * Math.cos(a)) * 180) / Math.PI + 90;
    return { n, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), w, h, rot, order: n % 10 };
  });
}

const TEETH = [...arch(ALL_TEETH.upper, 220, true), ...arch(ALL_TEETH.lower, 226, false)];

/** Posiciones de los 8 nodos sobre el arco (ángulos de -72° a 72° alrededor del diente, centrado a la izquierda para dejar sitio a las etiquetas). */
const NODES = TREATMENTS.map((_, i) => {
  const a = ((-62 + (124 * i) / (TREATMENTS.length - 1)) * Math.PI) / 180;
  return { x: 34 + 46 * Math.cos(a), y: 50 + 46 * Math.sin(a), a };
});

/**
 * Tratamientos en arco (referencias "Benefits of electric flosser" y "What stains your teeth"):
 * el diente 3D queda al centro, los tratamientos alrededor con su número. Al elegir uno, el arco se llena
 * hasta él, el diente gira y la tarjeta de vidrio cambia con texto que sube desenfocado.
 * En la tarjeta, "Ver en el mapa dental" despliega el odontograma (numeración FDI) con los dientes encendidos.
 */
@Component({
  selector: 'app-treatments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Tilt, ToothSlot, Arrow],
  template: `
    <section class="section treat" id="tratamientos">
      <p class="giant word" aria-hidden="true">cuidado</p>
      <div class="page">
        <header class="head">
          <p class="pill dark" data-reveal>Tratamientos</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Todo lo que tu sonrisa necesita, <b>en un solo lugar</b>.</h2>
        </header>

        <div class="tabs" role="tablist" aria-label="Tratamientos">
          @for (t of treatments; track t.id; let i = $index) {
            <button type="button" role="tab" [attr.aria-selected]="active() === i" (click)="select(i)">{{ t.short }}</button>
          }
        </div>

        <div class="layout">
          <div class="orbit" [style.--p]="progress()">
            <svg class="ring" viewBox="0 0 100 100" aria-hidden="true">
              <path class="track" [attr.d]="arcPath" pathLength="1" />
              <path class="fill" [attr.d]="arcPath" pathLength="1" />
            </svg>
            <div class="slot" toothSlot="treat"></div>
            @for (t of treatments; track t.id; let i = $index) {
              <button type="button" class="node" [class.on]="active() === i" [class.past]="i < active()" [style.left.%]="nodes[i].x" [style.top.%]="nodes[i].y" (click)="select(i)" [attr.aria-label]="t.name">
                <span class="num">0{{ i + 1 }}</span>
                <span class="label">{{ t.short }}</span>
              </button>
            }
          </div>

          <div tilt="6">
            <article class="card t-tilt-card" aria-live="polite">
              @let t = current();
              @for (k of [t.id]; track k) {
                <div class="t-reveal">
                  <p class="pill dark" style="--i: 0">Tratamiento 0{{ active() + 1 }}</p>
                  <h3 style="--i: 1">{{ t.name }}</h3>
                  <p class="text" style="--i: 2">{{ t.text }}</p>
                  <dl style="--i: 3">
                    <div><dt>Citas</dt><dd>{{ t.sessions }}</dd></div>
                    <div><dt>Duración</dt><dd>{{ t.time }}</dd></div>
                    <div><dt>Desde</dt><dd class="price">@for (c of digits(t.from); track $index) {<span class="t-pop" [style.animation-delay.ms]="$index * 40">{{ c }}</span>}</dd></div>
                  </dl>
                  @if (t.note) {
                    <p class="note" style="--i: 4"><app-icon name="info" [size]="16" /> {{ t.note }}</p>
                  }
                </div>
              }

              <div class="acc" [attr.data-open]="map()">
                <button type="button" class="acc-head" (click)="map.set(!map())" [attr.aria-expanded]="map()">
                  <app-icon name="tooth" [size]="18" /> Ver dónde se hace en el mapa dental
                  <svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m4 6 4 4 4-4" /></svg>
                </button>
                <div class="acc-panel">
                  <div class="acc-inner">
                    <svg class="chart" viewBox="0 20 600 420" role="img" [attr.aria-label]="'Mapa dental: ' + t.name">
                      @for (s of teeth; track s.n) {
                        <g class="tooth" [class.lit]="lit().has(s.n)" [style.--o]="s.order" [attr.transform]="'translate(' + s.x + ' ' + s.y + ') rotate(' + s.rot + ')'" (click)="picked.set(s.n)">
                          <rect [attr.x]="-s.w / 2" [attr.y]="-s.h / 2" [attr.width]="s.w" [attr.height]="s.h" [attr.rx]="s.order >= 6 ? 9 : 7" />
                        </g>
                      }
                    </svg>
                    <p class="picked">{{ picked() ? picked() + ' · ' + name(picked()!) : 'Toca un diente para saber cómo se llama' }}</p>
                  </div>
                </div>
              </div>

              <button type="button" class="btn on-dark t-learn" (click)="clinic.book(reasonFor(t))">Agendar valoración <app-arrow /></button>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .treat { position: relative; background: radial-gradient(90% 70% at 20% 30%, var(--navy-2), var(--night) 75%); color: var(--white); overflow: hidden; }
    .word { right: -0.08em; top: 0.1em; font-size: clamp(7rem, 22vw, 21rem); color: oklch(100% 0 0 / 0.04); }
    .head { position: relative; display: grid; gap: 18px; max-width: 760px; }
    .h2 b { color: var(--sky); }
    .tabs { display: none; }
    .layout { position: relative; display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(20px, 3vw, 48px); align-items: center; margin-top: 30px; }
    .orbit { position: relative; aspect-ratio: 1; }
    .ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .ring path { fill: none; stroke-linecap: round; }
    .track { stroke: oklch(100% 0 0 / 0.12); stroke-width: 0.5; }
    .fill { stroke: var(--sky); stroke-width: 0.7; stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p)); transition: stroke-dashoffset 700ms var(--ease-smooth-out); filter: drop-shadow(0 0 1.5px oklch(80% 0.09 238)); }
    .slot { position: absolute; left: 34%; top: 50%; width: 36%; aspect-ratio: 1 / 1.2; translate: -50% -50%; }
    .node { position: absolute; translate: -50% -50%; display: flex; align-items: center; gap: 12px; }
    .num { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; font-family: var(--font-display); font-size: 1.15rem; font-weight: 500; color: var(--white); background: oklch(35% 0.1 264 / 0.7); backdrop-filter: blur(8px); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.18), 0 8px 22px -8px oklch(0% 0 0 / 0.5); transition: background-color 300ms ease, color 300ms ease, scale 400ms var(--ease-bounce), box-shadow 300ms ease; }
    .label { position: absolute; left: calc(100% + 10px); white-space: nowrap; font-size: 0.95rem; font-weight: 600; color: oklch(85% 0.03 250); transition: color 300ms ease, translate 400ms var(--ease-smooth-out); }
    .node.past .num { background: oklch(58% 0.18 258 / 0.55); }
    .node.on .num { background: var(--white); color: var(--royal); scale: 1.18; box-shadow: 0 0 0 6px oklch(80% 0.09 238 / 0.25), 0 12px 30px -8px oklch(58% 0.18 258); }
    .node.on .label { color: var(--white); translate: 6px 0; }
    .node:active .num { scale: 0.92; }
    @media (hover: hover) and (pointer: fine) {
      .node:not(.on):hover .num { scale: 1.1; background: var(--royal-2); }
      .node:hover .label { color: var(--white); translate: 4px 0; }
    }
    .card { display: grid; gap: 18px; padding: clamp(24px, 3vw, 36px); border-radius: var(--radius-l); background: linear-gradient(150deg, oklch(42% 0.14 264 / 0.75), oklch(26% 0.09 264 / 0.75)); backdrop-filter: blur(22px) saturate(1.4); box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.25), inset 0 0 0 1px oklch(100% 0 0 / 0.12), 0 40px 80px -30px oklch(0% 0 0 / 0.7); overflow: hidden; }
    .t-reveal { display: grid; gap: 14px; }
    h3 { font-size: clamp(1.9rem, 3vw, 2.6rem); font-weight: 600; }
    .text { color: oklch(86% 0.03 250); }
    dl { display: grid; margin: 0; }
    dl div { display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-top: 1px solid oklch(100% 0 0 / 0.12); }
    dt { color: oklch(76% 0.03 250); font-size: 0.9rem; }
    dd { margin: 0; font-weight: 600; text-align: right; }
    .price { font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; line-height: 1; overflow: hidden; }
    .note { display: flex; gap: 8px; align-items: flex-start; padding: 12px 14px; border-radius: var(--radius-s); background: oklch(80% 0.09 238 / 0.14); color: var(--sky); font-size: 0.88rem; }
    .note .icon { margin-top: 3px; }
    /* transitions.dev "Accordion expand": crece con grid-rows, sin medir alturas */
    .acc { border-radius: var(--radius-m); background: oklch(100% 0 0 / 0.06); }
    .acc-head { display: flex; align-items: center; gap: 10px; width: 100%; padding: 14px 16px; font-size: 0.92rem; font-weight: 600; text-align: left; }
    .chev { margin-left: auto; transition: transform var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .chev { transform: scaleY(-1); }
    .acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-panel { grid-template-rows: 1fr; }
    .acc-inner { overflow: hidden; opacity: 0; filter: blur(var(--blur-small)); transition: opacity var(--duration-fast) var(--ease-smooth-out), filter var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-inner { opacity: 1; filter: none; }
    .chart { width: 100%; height: auto; padding: 0 12px; }
    .tooth { cursor: pointer; }
    .tooth rect { fill: oklch(32% 0.07 264); stroke: oklch(55% 0.08 258); stroke-width: 1.2; transition: fill 500ms var(--ease-smooth-out), stroke 500ms ease, filter 500ms ease; transition-delay: calc(var(--o) * 40ms); }
    .tooth.lit rect { fill: var(--white); stroke: var(--sky); filter: drop-shadow(0 0 6px oklch(80% 0.09 238 / 0.7)); }
    .picked { padding: 0 16px 14px; font-size: 0.84rem; color: oklch(80% 0.03 250); }
    .card > .btn { justify-self: start; }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; }
      .orbit { aspect-ratio: auto; height: min(70vw, 380px); }
      .ring, .node { display: none; }
      .slot { width: auto; height: 100%; aspect-ratio: 1 / 1.2; }
      /* En celular los nodos pasan a una fila de pestañas con píldora deslizante */
      .tabs { display: flex; gap: 6px; margin-top: 30px; padding: 4px; border-radius: 999px; background: oklch(100% 0 0 / 0.08); overflow-x: auto; scrollbar-width: none; }
      .tabs::-webkit-scrollbar { display: none; }
      .tabs button { flex: none; padding: 10px 16px; border-radius: 999px; font-size: 0.9rem; font-weight: 600; color: oklch(82% 0.03 250); transition: background-color var(--duration-fast) var(--ease-smooth-out), color var(--duration-fast) var(--ease-smooth-out), scale 160ms var(--ease-out); }
      .tabs button[aria-selected='true'] { background: var(--white); color: var(--navy); }
      .tabs button:active { scale: 0.95; }
    }
  `,
})
export class Treatments {
  protected readonly clinic = inject(Clinic);
  private readonly stage = inject(ToothStage);
  protected readonly treatments = TREATMENTS;
  protected readonly nodes = NODES;
  protected readonly teeth = TEETH;
  protected readonly active = signal(1);
  protected readonly map = signal(false);
  protected readonly picked = signal<number | null>(null);
  protected readonly current = computed(() => TREATMENTS[this.active()]);
  protected readonly progress = computed(() => this.active() / (TREATMENTS.length - 1));
  protected readonly lit = computed(() => new Set(this.current().teeth.map((n) => (n >= 50 ? n - 40 : n))));
  protected readonly money = money;
  /** Arco de -72° a 72° alrededor del diente (centro 40,50) */
  protected readonly arcPath = (() => {
    const p = (deg: number) => {
      const a = (deg * Math.PI) / 180;
      return `${(34 + 46 * Math.cos(a)).toFixed(2)} ${(50 + 46 * Math.sin(a)).toFixed(2)}`;
    };
    return `M ${p(-62)} A 46 46 0 0 1 ${p(62)}`;
  })();

  protected select(i: number) {
    if (i === this.active()) return;
    this.active.set(i);
    this.picked.set(null);
    this.stage.setTurn(i);
  }

  protected digits(n: number) {
    return money(n).split('');
  }

  protected name(n: number) {
    return toothName(n);
  }

  protected reasonFor(t: Treatment) {
    const map: Record<string, string> = { limpieza: 'Revisión y limpieza', blanqueamiento: 'Blanqueamiento', ortodoncia: 'Ortodoncia', implantes: 'Implantes', resinas: 'Resinas o caries', ninos: 'Mi hijo o hija' };
    return map[t.id] ?? 'Otro';
  }
}
