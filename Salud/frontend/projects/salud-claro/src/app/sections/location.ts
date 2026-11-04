import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { DAY_NAMES, FAQ, HOURS, PRACTICE } from '../core/content';
import { fmtHour } from '../core/practice';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Dónde está el consultorio (mapa dibujado, sin cargar Google Maps), horario con el día de hoy marcado y preguntas frecuentes. */
@Component({
  selector: 'app-location',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="consultorio">
      <div class="page grid">
        <div class="where">
          <p class="eyebrow" data-reveal>El consultorio</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Un lugar <em>tranquilo</em>, cerca de todo.</h2>
          <figure class="map" data-reveal [revealDelay]="120" aria-label="Mapa de ubicación">
            <svg viewBox="0 0 400 260" aria-hidden="true">
              <rect width="400" height="260" class="ground" />
              <path class="park" d="M260 150h110v90H260z" />
              <path class="street big" d="M-10 96 L410 70" />
              <path class="street" d="M120 -10 L150 270" />
              <path class="street" d="M250 -10 L238 270" />
              <path class="street" d="M-10 200 L410 186" />
              <path class="street thin" d="M40 -10 L60 270" />
              <path class="street thin" d="M330 -10 L340 140" />
              <text x="20" y="88" class="label">Héroe de Nacozari</text>
              <text x="268" y="200" class="label">Parque</text>
              <g class="pin" transform="translate(196 136)">
                <circle r="26" class="halo" />
                <path d="M0 14c-6-6-12-11-12-18a12 12 0 0 1 24 0c0 7-6 12-12 18z" />
                <circle cy="-4" r="4.5" class="dot" />
              </g>
            </svg>
            <figcaption>
              <app-icon name="pin" [size]="18" />
              <span>{{ address }}<br />{{ city }}</span>
            </figcaption>
          </figure>
          <p class="parking" data-reveal><app-icon name="lock" [size]="16" /> Entrada discreta y sin sala de espera compartida: las sesiones se agendan con espacio entre una y otra.</p>
        </div>

        <div class="side">
          <div class="hours" data-reveal>
            <h3>Horario de sesiones</h3>
            <ul>
              @for (d of week; track d.i) {
                <li [class.today]="today() === d.i">
                  <span>{{ d.name }}@if (today() === d.i) { <small>hoy</small> }</span>
                  <span>{{ d.text }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="faq" data-reveal [revealDelay]="100">
            <h3>Preguntas frecuentes</h3>
            @for (f of faq; track f.q) {
              <details>
                <summary>{{ f.q }}<app-icon name="plus" [size]="18" /></summary>
                <p>{{ f.a }}</p>
              </details>
            }
          </div>
        </div>
      </div>
      <aside class="page" data-reveal>
        <div class="crisis">
          <span class="icon-wrap"><app-icon name="life-buoy" [size]="26" /></span>
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
    .map { position: relative; margin: 8px 0 0; border-radius: var(--radius-l); overflow: hidden; box-shadow: var(--shadow-s); }
    .map svg { width: 100%; height: auto; }
    .ground { fill: var(--mist-2); }
    .park { fill: oklch(86% 0.06 150); }
    .street { fill: none; stroke: var(--paper); stroke-width: 12; stroke-linecap: round; }
    .street.big { stroke-width: 20; }
    .street.thin { stroke-width: 7; }
    .label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; fill: var(--muted); }
    .pin path { fill: var(--forest); }
    .pin .dot { fill: var(--amber); }
    .halo { fill: var(--amber); opacity: 0.25; transform-origin: 0 0; animation: halo 2.6s var(--ease-out) infinite; }
    @keyframes halo { from { scale: 0.3; opacity: 0.5; } to { scale: 1.4; opacity: 0; } }
    figcaption { position: absolute; left: 14px; bottom: 14px; right: 14px; display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 14px; background: oklch(99% 0 0 / 0.9); backdrop-filter: blur(8px); font-size: 0.9rem; font-weight: 600; line-height: 1.4; }
    figcaption .icon { color: var(--moss); margin-top: 1px; }
    .parking { display: flex; gap: 8px; align-items: flex-start; font-size: 0.9rem; color: var(--forest-2); }
    .parking .icon { margin-top: 4px; color: var(--moss); }
    .side { display: grid; gap: 40px; align-content: start; }
    h3 { font-size: 1.8rem; margin-bottom: 14px; }
    .hours ul { list-style: none; margin: 0; padding: 0; }
    .hours li { display: flex; justify-content: space-between; padding: 11px 12px; border-radius: 10px; font-variant-numeric: tabular-nums; }
    .hours li:nth-child(odd) { background: var(--mist-2); }
    .hours li.today { background: var(--forest); color: var(--mist); font-weight: 650; }
    .hours small { margin-left: 8px; padding: 2px 8px; border-radius: 999px; background: var(--amber); color: var(--deep); font-size: 0.72rem; font-weight: 700; }
    details { border-bottom: 1px solid var(--line); }
    summary { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 0; font-weight: 650; cursor: pointer; list-style: none; transition: color 200ms ease; }
    summary::-webkit-details-marker { display: none; }
    summary .icon { flex: none; transition: rotate 300ms var(--ease-out); }
    details[open] summary .icon { rotate: 45deg; }
    @media (hover: hover) and (pointer: fine) { summary:hover { color: var(--moss); } }
    details p { padding: 0 0 18px; color: var(--forest-2); animation: open 400ms var(--ease-out); }
    @keyframes open { from { opacity: 0; translate: 0 -6px; } }
    .crisis { display: flex; gap: 18px; align-items: flex-start; margin-top: clamp(56px, 8vw, 100px); padding-top: 28px; border-top: 1px solid var(--line); }
    .crisis > div { display: grid; gap: 4px; }
    .crisis b { font-size: 1.1rem; font-weight: 600; }
    .icon-wrap { flex: none; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: var(--amber-soft); color: var(--amber-deep); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Location {
  protected readonly faq = FAQ;
  protected readonly address = PRACTICE.address;
  protected readonly city = PRACTICE.city;
  protected readonly today = signal(-1);
  // Lunes primero
  protected readonly week = [1, 2, 3, 4, 5, 6, 0].map((i) => ({ i, name: DAY_NAMES[i], text: HOURS[i] ? `${fmtHour(HOURS[i]![0])} – ${fmtHour(HOURS[i]![1])}` : 'Cerrado' }));

  constructor() {
    afterNextRender(() => this.today.set(new Date().getDay()));
  }
}
