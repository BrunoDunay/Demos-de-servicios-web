import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { DAY_NAMES, FAQ, HOURS, PRACTICE } from '../core/content';
import { fmtHour } from '../core/practice';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/**
 * El consultorio: mapa dibujado a mano (sin cargar Google Maps), horario en tarjeta de fichero con el día
 * de hoy marcado, preguntas frecuentes con el acordeón de transitions.dev y el aviso de crisis con la
 * Línea de la Vida (dato real).
 */
@Component({
  selector: 'app-location',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="consultorio">
      <div class="page grid">
        <div class="where">
          <p class="kicker" data-reveal>El consultorio</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Un lugar <span class="sage">tranquilo</span>, cerca de todo.</h2>
          <figure class="map" data-reveal [revealDelay]="120">
            <span class="tape"></span>
            <svg viewBox="0 0 400 270" aria-label="Mapa dibujado del consultorio">
              <path class="park" d="M262 160 C 300 150, 360 158, 380 176 L 384 250 C 340 258, 290 254, 262 246 Z" />
              <path class="street big" d="M-10 98 C 120 88, 260 84, 410 70" />
              <path class="street" d="M122 -10 C 128 80, 140 180, 150 280" />
              <path class="street" d="M250 -10 C 246 90, 242 180, 236 280" />
              <path class="street" d="M-10 206 C 120 200, 260 196, 410 188" />
              <text x="22" y="84" class="label">Héroe de Nacozari</text>
              <text x="282" y="214" class="label">parque</text>
              <path class="route" d="M30 250 C 80 230, 110 214, 140 210 S 180 160, 196 140" />
              <g class="pin" transform="translate(196 132)">
                <path d="M0 16 C-7 9-13 3-13-5 a13 13 0 0 1 26 0 c0 8-6 14-13 21z" />
                <circle cy="-5" r="4.5" />
              </g>
              <text x="210" y="124" class="here">¡aquí!</text>
            </svg>
            <figcaption><app-icon name="pin" [size]="16" /> {{ address }}, {{ city }}</figcaption>
          </figure>
          <p class="private" data-reveal><app-icon name="lock" [size]="16" /> Entrada discreta y sin sala de espera compartida: las sesiones se agendan con espacio entre una y otra.</p>
        </div>

        <div class="side">
          <div class="hours" data-reveal>
            <h3>Horario</h3>
            <ul>
              @for (d of week; track d.i) {
                <li [class.today]="today() === d.i">
                  <span>{{ d.name }}@if (today() === d.i) { <small class="hand">hoy</small> }</span>
                  <span>{{ d.text }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="faq" data-reveal [revealDelay]="100">
            <h3>Preguntas</h3>
            @for (f of faq; track f.q; let i = $index) {
              <div class="acc" [attr.data-open]="open() === i">
                <button type="button" class="acc-head" (click)="open.set(open() === i ? -1 : i)" [attr.aria-expanded]="open() === i">
                  {{ f.q }}
                  <svg class="chev" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m4 6 4 4 4-4" /></svg>
                </button>
                <div class="acc-panel"><div class="acc-inner"><p>{{ f.a }}</p></div></div>
              </div>
            }
          </div>
        </div>
      </div>
      <aside class="page" data-reveal>
        <div class="crisis">
          <span class="ico"><app-icon name="life-buoy" [size]="26" /></span>
          <div>
            <b>Si estás en crisis o pensando en hacerte daño, no esperes a una cita.</b>
            <p>Llama a la Línea de la Vida: <strong>800 911 2000</strong> (gratis, las 24 horas, en todo el país) o al <strong>911</strong>.</p>
          </div>
        </div>
      </aside>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 80px); }
    .where { display: grid; align-content: start; gap: 18px; }
    .map { position: relative; margin: 10px 0 0; padding: 14px; background: var(--card); box-shadow: var(--shadow-lift); rotate: -1.2deg; }
    .map .tape { top: -12px; left: 18%; rotate: -6deg; }
    .map svg { width: 100%; height: auto; background: var(--paper); }
    .park { fill: var(--sage-soft); stroke: var(--sage); stroke-width: 1.5; stroke-dasharray: 4 5; }
    .street { fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; opacity: 0.5; }
    .street.big { stroke-width: 2.6; opacity: 0.7; }
    .label { font-family: var(--font-hand); font-size: 17px; font-weight: 600; fill: var(--ink-2); }
    .route { fill: none; stroke: var(--peach-deep); stroke-width: 2.4; stroke-dasharray: 6 7; stroke-linecap: round; }
    .pin path { fill: var(--peach-deep); }
    .pin circle { fill: var(--card); }
    .here { font-family: var(--font-hand); font-size: 24px; font-weight: 700; fill: var(--peach-deep); }
    figcaption { display: flex; gap: 8px; align-items: center; padding-top: 12px; font-size: 0.9rem; font-weight: 600; }
    .private { display: flex; gap: 8px; align-items: flex-start; font-size: 0.92rem; color: var(--ink-2); }
    .private .icon { margin-top: 4px; color: var(--sage-deep); }
    .side { display: grid; gap: 40px; align-content: start; }
    h3 { margin-bottom: 14px; font-size: 2.4rem; text-transform: uppercase; }
    .hours ul { list-style: none; margin: 0; padding: 10px 18px; background: var(--card); box-shadow: var(--shadow-paper); background-image: linear-gradient(oklch(62% 0.12 25 / 0.4), oklch(62% 0.12 25 / 0.4)); background-size: 100% 1.5px; background-position: 0 2px; background-repeat: no-repeat; }
    .hours li { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid oklch(64% 0.065 245 / 0.2); font-variant-numeric: tabular-nums; }
    .hours li:last-child { border-bottom: 0; }
    .hours li.today { font-weight: 700; background: linear-gradient(transparent 55%, var(--peach-soft) 55%, var(--peach-soft) 90%, transparent 90%); }
    .hours small { margin-left: 8px; font-size: 1.3rem; color: var(--peach-deep); }
    .acc { border-bottom: 1.5px dashed var(--line-2); }
    .acc-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; padding: 16px 0; font-weight: 650; text-align: left; transition: color 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .acc-head:hover { color: var(--peach-deep); } }
    .chev { flex: none; transition: transform var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .chev { transform: scaleY(-1); }
    .acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-panel { grid-template-rows: 1fr; }
    .acc-inner { overflow: hidden; opacity: 0; filter: blur(var(--blur-small)); transition: opacity var(--duration-fast) var(--ease-smooth-out), filter var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-inner { opacity: 1; filter: none; }
    .acc-inner p { padding: 0 0 16px; color: var(--ink-2); }
    .crisis { display: flex; gap: 18px; align-items: flex-start; margin-top: clamp(56px, 8vw, 100px); padding: 24px 26px; background: var(--peach-soft); box-shadow: var(--shadow-paper); rotate: -0.6deg; }
    .crisis > div { display: grid; gap: 4px; }
    .crisis b { font-size: 1.1rem; }
    .ico { flex: none; display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; background: var(--card); color: var(--peach-deep); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Location {
  protected readonly faq = FAQ;
  protected readonly address = PRACTICE.address;
  protected readonly city = PRACTICE.city;
  protected readonly today = signal(-1);
  protected readonly open = signal(0);
  protected readonly week = [1, 2, 3, 4, 5, 6, 0].map((i) => ({ i, name: DAY_NAMES[i], text: HOURS[i] ? `${fmtHour(HOURS[i]![0])} – ${fmtHour(HOURS[i]![1])}` : 'Sin sesiones' }));

  constructor() {
    afterNextRender(() => this.today.set(new Date().getDay()));
  }
}
