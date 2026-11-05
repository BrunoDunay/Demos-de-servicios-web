import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DAY_NAMES, HOURS, PRACTICE } from '../core/content';
import { Practice, fmtHour, whatsappLink } from '../core/practice';
import { Icon } from '../shared/icon';
import { Arrow } from '../shared/arrow';
import { Reveal } from '../shared/reveal';

interface Day {
  key: string;
  date: Date;
  weekday: string;
}

interface Cell {
  day: Day;
  off: boolean;
  today: boolean;
}

/** Meses que se pueden ver hacia adelante (el actual cuenta como el primero). */
const MAX_MONTHS = 3;

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const REASONS = ['Primera sesión de valoración', 'Terapia individual', 'Terapia de pareja', 'Adolescentes'];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "Ocupado" de mentira pero estable: el mismo horario sale ocupado cada vez que se abre la página. */
function busy(key: string, hour: number) {
  let h = 0;
  for (const c of key + hour) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

/**
 * Agenda en cinco pasos (tipo, lugar, día en un calendario de hasta 3 meses, hora y datos) en una hoja de cuaderno; la vista previa es una nota a mano. Arma el mensaje y lo muestra como burbuja de
 * WhatsApp antes de abrir la app. Los días se calculan en el navegador (en el prerender no hay "hoy").
 */
@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal, Arrow],
  template: `
    <section class="section" id="agenda">
      <div class="page">
        <header class="head">
          <p class="kicker" data-reveal>Agenda</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Da el primer paso, <span class="peach">a tu ritmo.</span></h2>
          <p class="lead" data-reveal [revealDelay]="160">Elige cómo y cuándo. Te respondo yo, personalmente, el mismo día.</p>
        </header>

        <div class="desk" data-reveal>
          <div class="notebook">
            <p class="label hand">1. ¿qué tipo de sesión?</p>
            <div class="tabs" role="radiogroup" aria-label="Tipo de sesión" #tabs>
              <span class="tabs-pill" aria-hidden="true"></span>
              @for (r of reasons; track r) {
                <button type="button" role="radio" [attr.aria-checked]="clinic.reason() === r" (click)="clinic.reason.set(r)">{{ r }}</button>
              }
            </div>

            <p class="label hand">2. ¿dónde?</p>
            <div class="where">
              <button type="button" [attr.aria-pressed]="online() === false" (click)="online.set(false)"><app-icon name="sofa" [size]="18" /> En el consultorio<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M4 13 C 6 15, 8 17, 10 19 C 13 13, 17 8, 21 4" /></svg></button>
              <button type="button" [attr.aria-pressed]="online()" (click)="online.set(true)"><app-icon name="video" [size]="18" /> En línea<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M4 13 C 6 15, 8 17, 10 19 C 13 13, 17 8, 21 4" /></svg></button>
            </div>

            <div class="cal-head">
              <p class="label hand">3. día</p>
              <div class="cal-nav">
                <button type="button" aria-label="Mes anterior" [disabled]="!canPrev()" (click)="shiftMonth(-1)"><app-icon name="chevron-l" [size]="18" /></button>
                <span class="month hand" aria-live="polite">{{ monthLabel() }}</span>
                <button type="button" aria-label="Mes siguiente" [disabled]="!canNext()" (click)="shiftMonth(1)"><app-icon name="chevron" [size]="18" /></button>
              </div>
            </div>
            <div class="cal">
              <div class="week" aria-hidden="true">
                @for (w of weekLetters; track $index) {
                  <span>{{ w }}</span>
                }
              </div>
              @if (cells().length) {
                @for (m of [monthKey()]; track m) {
                  <div class="grid-days" [class.back]="dir() < 0">
                    @for (c of cells(); track $index) {
                      @if (c) {
                        <button type="button" [disabled]="c.off" [class.today]="c.today" [attr.aria-pressed]="day()?.key === c.day.key" [attr.aria-label]="c.day.weekday + ' ' + c.day.date.getDate()" (click)="pickDay(c.day)">
                          <span>{{ c.day.date.getDate() }}</span>
                          <svg class="loop" viewBox="0 0 40 40" aria-hidden="true"><path pathLength="1" d="M29 7 C 19 1, 5 7, 4 20 C 3 33, 16 38, 26 35 C 37 31, 39 17, 31 9 C 27 5, 22 4, 18 6" /></svg>
                        </button>
                      } @else {
                        <span></span>
                      }
                    }
                  </div>
                }
              } @else {
                <div class="grid-days skeleton" aria-hidden="true">
                  @for (i of skeleton; track i) {
                    <span></span>
                  }
                </div>
              }
            </div>
            <p class="cal-note hand">puedes apartar hasta {{ maxMonths }} meses adelante · los domingos descanso</p>

            <p class="label hand">4. hora</p>
            @if (day()) {
              <div class="slots">
                @for (s of slots(); track s.h; let i = $index) {
                  <button type="button" [disabled]="s.busy" [attr.aria-pressed]="hour() === s.h" (click)="hour.set(s.h)" [style.--i]="i">{{ s.label }}<svg class="under" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 6 C 18 2, 34 9, 50 5 S 80 2, 98 6" /></svg></button>
                }
              </div>
            } @else {
              <p class="hint">Primero elige un día.</p>
            }

            <p class="label hand">5. tus datos</p>
            <div class="fields">
              <label class="field">
                <span>Nombre</span>
                <input type="text" name="name" autocomplete="given-name" [(ngModel)]="name" placeholder="Solo tu nombre de pila está bien" />
              </label>
              <div class="seg" role="group" aria-label="¿Has ido a terapia antes?">
                <button type="button" [attr.aria-pressed]="first()" (click)="first.set(true)">Es mi primera vez<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M4 13 C 6 15, 8 17, 10 19 C 13 13, 17 8, 21 4" /></svg></button>
                <button type="button" [attr.aria-pressed]="!first()" (click)="first.set(false)">Ya he ido<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M4 13 C 6 15, 8 17, 10 19 C 13 13, 17 8, 21 4" /></svg></button>
              </div>
              <label class="field wide">
                <span>Si quieres, cuéntame en una línea qué te trae <small>(opcional)</small></span>
                <textarea name="notes" rows="2" [(ngModel)]="notes" placeholder="No hace falta dar detalles; lo platicamos en sesión"></textarea>
              </label>
            </div>
          </div>

          <aside class="letter" aria-label="Vista previa del mensaje">
            <span class="tape"></span>
            <p class="to hand">para: Lucía</p>
            <p class="msg hand" [class.empty]="!ready()">{{ message() }}</p>
            @if (ready()) {
              <p class="ok">
                <span class="t-success-check" data-state="in"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7.5" /></svg></span>
                Listo para enviar
              </p>
              <a class="btn t-learn" [href]="link()" target="_blank" rel="noopener">Enviar por WhatsApp <app-arrow /></a>
            } @else {
              <p class="missing">{{ missing() }}</p>
            }
            <p class="fine"><app-icon name="lock" [size]="14" /> Tu mensaje solo lo lee Lucía. Sitio demo: el botón abre WhatsApp para que elijas a quién enviarlo.</p>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 18px; max-width: 760px; }
    .desk { display: grid; grid-template-columns: 1.45fr 1fr; gap: clamp(24px, 4vw, 50px); margin-top: 48px; align-items: start; }
    /* Hoja de cuaderno con renglones, margen rojo y espiral */
    .notebook { position: relative; display: grid; gap: 12px; padding: 34px clamp(20px, 3vw, 40px) 34px clamp(54px, 6vw, 80px); background: repeating-linear-gradient(transparent 0 33px, oklch(64% 0.065 245 / 0.2) 33px 34px), var(--card); box-shadow: var(--shadow-lift); min-width: 0; }
    .notebook::before { content: ''; position: absolute; top: 0; bottom: 0; left: clamp(36px, 4vw, 56px); width: 1.5px; background: oklch(62% 0.12 25 / 0.45); }
    .notebook::after { content: ''; position: absolute; top: 14px; bottom: 14px; left: 10px; width: 14px; background: radial-gradient(circle at 7px 7px, var(--paper-3) 5px, transparent 5.5px) 0 0 / 14px 30px repeat-y; }
    .label { margin-top: 6px; font-size: 1.7rem; color: var(--sage-deep); }
    .month { margin-left: 8px; font-size: 1.1rem; color: var(--muted); }
    .tabs { position: relative; display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: var(--paper-2); overflow-x: auto; scrollbar-width: none; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs button { position: relative; z-index: 1; flex: none; padding: 10px 15px; border-radius: 999px; font-size: 0.9rem; font-weight: 650; color: var(--ink-2); transition: color var(--duration-fast) var(--ease-smooth-out), scale 160ms var(--ease-out); }
    .tabs button[aria-checked='true'] { color: var(--ink); }
    .tabs button:active { scale: 0.95; }
    .tabs-pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: 0; border-radius: 999px; background: var(--peach); transition: transform var(--duration-fast) var(--ease-smooth-out), width var(--duration-fast) var(--ease-smooth-out); }
    .where { display: flex; flex-wrap: wrap; gap: 10px; }
    .where button, .seg button { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; font-weight: 650; font-size: 0.92rem; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--line-2); clip-path: polygon(1% 4%, 99% 0, 100% 96%, 0 100%); transition: background-color 250ms ease, translate 400ms var(--ease-bounce), rotate 400ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .where button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--sage-soft); box-shadow: inset 0 0 0 2px var(--sage-deep); translate: 0 -2px; }
    .where button:active, .seg button:active { scale: 0.96; }
    /* Calendario del mes en la hoja: al pasar el cursor se dibuja un círculo a mano alrededor del día */
    .cal-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }
    .cal-nav { display: flex; align-items: center; gap: 6px; }
    .cal-nav button { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--line-2); transition: background-color 200ms ease, rotate 400ms var(--ease-bounce), scale 160ms var(--ease-out), opacity 200ms ease; }
    .cal-nav button:disabled { opacity: 0.3; cursor: default; }
    .cal-nav button:active:not(:disabled) { scale: 0.9; }
    @media (hover: hover) and (pointer: fine) { .cal-nav button:not(:disabled):hover { background: var(--peach-soft); rotate: -8deg; } }
    .cal-nav .month { min-width: 8.5em; text-align: center; font-size: 1.45rem; color: var(--ink); }
    .week, .grid-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .week span { padding-bottom: 4px; text-align: center; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; color: var(--muted); }
    .grid-days { animation: cal-in 420ms var(--ease-smooth-out) both; }
    .grid-days.back { animation-name: cal-back; }
    @keyframes cal-in { from { opacity: 0; translate: 22px 0; rotate: 1deg; } }
    @keyframes cal-back { from { opacity: 0; translate: -22px 0; rotate: -1deg; } }
    .grid-days button { position: relative; display: grid; place-items: center; height: 46px; font-family: var(--font-display); font-stretch: 75%; font-size: 1.35rem; font-weight: 700; transition: color 200ms ease, scale 300ms var(--ease-bounce); }
    .grid-days button > span { position: relative; z-index: 1; }
    .grid-days button.today > span::after { content: 'hoy'; position: absolute; left: 50%; top: 82%; translate: -50% 0; font-family: var(--font-hand); font-size: 0.85rem; font-weight: 500; color: var(--peach-deep); }
    .grid-days button:disabled { color: var(--muted); opacity: 0.4; cursor: not-allowed; }
    .loop { position: absolute; left: 50%; top: 50%; width: 44px; height: 44px; translate: -50% -50%; overflow: visible; pointer-events: none; }
    .loop path { fill: none; stroke: var(--peach-deep); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 420ms var(--ease-smooth-out), fill 300ms ease, opacity 0s 420ms; }
    .grid-days button[aria-pressed='true'] .loop path { opacity: 1; transition-delay: 0s; stroke-dashoffset: 0; stroke-width: 2.6; fill: oklch(78% 0.095 52 / 0.45); }
    .grid-days button[aria-pressed='true'] { scale: 1.08; }
    @media (hover: hover) and (pointer: fine) { .grid-days button:not(:disabled):hover .loop path { stroke-dashoffset: 0; opacity: 1; transition-delay: 0s; } }
    .grid-days button:active:not(:disabled) { scale: 0.92; }
    .skeleton span { height: 46px; border-radius: 50%; background: var(--paper-2); animation: shimmer 1.4s ease-in-out infinite; }
    @keyframes shimmer { 50% { opacity: 0.5; } }
    .cal-note { font-size: 1.2rem; color: var(--muted); }
    /* Palomita a mano en "dónde" y "primera vez": se dibuja al elegir y se asoma al pasar el cursor */
    .tick { width: 18px; height: 18px; margin-left: 2px; overflow: visible; }
    .tick path { fill: none; stroke: var(--sage-deep); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 380ms var(--ease-smooth-out), opacity 0s 380ms; }
    [aria-pressed='true'] > .tick path { stroke-dashoffset: 0; opacity: 1; transition-delay: 0s; }
    @media (hover: hover) and (pointer: fine) {
      .where button:hover, .seg button:hover { rotate: -1deg; }
      .where button:not([aria-pressed='true']):hover .tick path, .seg button:not([aria-pressed='true']):hover .tick path { stroke-dashoffset: 0.55; opacity: 1; transition-delay: 0s; }
    }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 8px; }
    .slots button { position: relative; padding: 9px 8px; font-weight: 650; font-size: 0.88rem; font-variant-numeric: tabular-nums; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--line-2); animation: t-text-in 400ms var(--ease-smooth-out) both; animation-delay: calc(var(--i) * 25ms); transition: background-color 200ms ease, scale 160ms var(--ease-out); }
    .slots button[aria-pressed='true'] { background: var(--ink); color: var(--paper); box-shadow: none; }
    .slots button:disabled { opacity: 0.35; text-decoration: line-through; cursor: not-allowed; }
    /* Al pasar el cursor por una hora se dibuja una raya a mano debajo */
    .under { position: absolute; left: 12%; right: 12%; bottom: 3px; width: 76%; height: 7px; overflow: visible; pointer-events: none; }
    .under path { fill: none; stroke: var(--peach-deep); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 380ms var(--ease-smooth-out), opacity 0s 380ms; }
    .slots button[aria-pressed='true'] .under path { stroke: var(--peach); stroke-dashoffset: 0; opacity: 1; transition-delay: 0s; }
    @media (hover: hover) and (pointer: fine) { .slots button:not(:disabled):hover .under path { stroke-dashoffset: 0; opacity: 1; transition-delay: 0s; } }
    .slots button:active:not(:disabled) { scale: 0.95; }
    .hint { font-size: 0.92rem; color: var(--muted); }
    .fields { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: end; }
    .seg { display: flex; gap: 6px; }
    .field { display: grid; gap: 6px; }
    .field.wide { grid-column: 1 / -1; }
    .field > span { font-size: 0.86rem; font-weight: 650; color: var(--ink-2); }
    .field small { font-weight: 500; color: var(--muted); }
    input, textarea { width: 100%; padding: 12px 4px; border: 0; border-bottom: 2px solid var(--line-2); background: transparent; font-family: var(--font-hand); font-size: 1.5rem; resize: vertical; transition: border-color 200ms ease; }
    input:focus, textarea:focus { outline: none; border-color: var(--peach-deep); }
    /* La carta: nota a mano pegada con cinta */
    .letter { position: sticky; top: 100px; display: grid; gap: 14px; padding: 34px 26px 26px; background: var(--peach-soft); box-shadow: var(--shadow-lift); rotate: 1.5deg; }
    .letter .tape { top: -12px; left: 50%; translate: -50% 0; rotate: -3deg; }
    .to { font-size: 1.6rem; color: var(--sage-deep); }
    .msg { font-size: 1.55rem; line-height: 1.2; white-space: pre-line; min-height: 200px; transition: opacity 300ms ease; }
    .msg.empty { opacity: 0.5; }
    .ok { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--sage-deep); }
    .t-success-check { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--sage-deep); color: var(--card); opacity: 0; }
    .t-success-check path { stroke-dasharray: 20; stroke-dashoffset: 20; }
    .t-success-check[data-state='in'] { animation: t-check-fade 500ms var(--ease-smooth-out) forwards, t-check-rotate 500ms var(--ease-smooth-out) forwards, t-check-blur 500ms var(--ease-smooth-out) forwards, t-check-bob 500ms cubic-bezier(0.34, 1.35, 0.64, 1) forwards; }
    .t-success-check[data-state='in'] path { animation: t-check-draw 500ms var(--ease-smooth-out) 80ms forwards; }
    @keyframes t-check-fade { to { opacity: 1; } }
    @keyframes t-check-rotate { from { rotate: 80deg; } to { rotate: 0deg; } }
    @keyframes t-check-blur { from { filter: blur(8px); } to { filter: blur(0); } }
    @keyframes t-check-bob { from { translate: 0 20px; } to { translate: 0 0; } }
    @keyframes t-check-draw { to { stroke-dashoffset: 0; } }
    .missing { padding: 12px; text-align: center; font-weight: 650; font-size: 0.9rem; border: 1.5px dashed var(--line-2); }
    .fine { display: flex; gap: 6px; align-items: flex-start; font-size: 0.78rem; color: var(--ink-2); }
    .fine .icon { margin-top: 2px; }
    @media (max-width: 900px) {
      .desk { grid-template-columns: 1fr; }
      .letter { position: static; }
      .fields { grid-template-columns: 1fr; }
    }
  `,
})
export class Agenda {
  protected readonly clinic = inject(Practice);
  protected readonly online = signal(false);
  protected readonly reasons = REASONS;
  protected readonly phone = PRACTICE.phone;
  protected readonly today = signal<Date | null>(null);
  /** Primer día del mes que se está viendo. */
  protected readonly view = signal<Date | null>(null);
  protected readonly dir = signal(1);
  protected readonly maxMonths = MAX_MONTHS;
  protected readonly weekLetters = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  protected readonly skeleton = Array.from({ length: 35 }, (_, i) => i);
  protected readonly day = signal<Day | null>(null);
  protected readonly hour = signal<number | null>(null);
  protected readonly first = signal(true);
  protected readonly nameSig = signal('');
  protected readonly notesSig = signal('');

  get name() {
    return this.nameSig();
  }
  set name(v: string) {
    this.nameSig.set(v);
  }
  get notes() {
    return this.notesSig();
  }
  set notes(v: string) {
    this.notesSig.set(v);
  }

  protected readonly slots = computed(() => {
    const d = this.day();
    if (!d) return [];
    const hours = HOURS[d.date.getDay()]!;
    const now = new Date();
    const isToday = sameDay(d.date, now);
    const out: { h: number; label: string; busy: boolean }[] = [];
    for (let h = hours[0]; h <= hours[1] - 1; h += 1) {
      const past = isToday && h <= now.getHours() + 1;
      out.push({ h, label: fmtHour(h), busy: past || busy(d.key, h) });
    }
    return out;
  });

  protected readonly ready = computed(() => !!(this.day() && this.hour() !== null && this.nameSig().trim().length > 1));

  protected readonly missing = computed(() => {
    if (!this.day()) return 'Elige un día';
    if (this.hour() === null) return 'Elige una hora';
    return 'Escribe tu nombre';
  });

  protected readonly message = computed(() => {
    const d = this.day();
    const h = this.hour();
    const who = this.nameSig().trim() || '(tu nombre)';
    const when = d && h !== null ? `${d.weekday === 'hoy' ? 'hoy' : 'el ' + d.weekday} ${d.date.getDate()} de ${MONTHS[d.date.getMonth()]} a las ${fmtHour(h)}` : 'el día y la hora que elijas';
    const where = this.online() ? 'en línea' : 'en el consultorio';
    let text = `Hola, Lucía. Soy ${who} y me gustaría agendar: ${this.clinic.reason().toLowerCase()}, ${where}, ${when}.`;
    text += this.first() ? '\nEs la primera vez que voy a terapia.' : '\nYa he ido a terapia antes.';
    if (this.notesSig().trim()) text += `\n${this.notesSig().trim()}`;
    return text;
  });

  protected readonly link = computed(() => whatsappLink(this.message()));

  protected readonly monthLabel = computed(() => this.view()?.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).replace(' de ', ' ') ?? '');

  protected readonly monthKey = computed(() => this.view()?.toISOString().slice(0, 7) ?? '');

  /** Cuántos meses adelante está el mes que se ve. */
  private readonly offset = computed(() => {
    const v = this.view();
    const t = this.today();
    return v && t ? (v.getFullYear() - t.getFullYear()) * 12 + v.getMonth() - t.getMonth() : 0;
  });
  protected readonly canPrev = computed(() => this.offset() > 0);
  protected readonly canNext = computed(() => this.offset() < MAX_MONTHS - 1);

  /** Celdas del mes (null = hueco antes del día 1, la semana empieza en lunes). */
  protected readonly cells = computed<(Cell | null)[]>(() => {
    const v = this.view();
    const now = this.today();
    if (!v || !now) return [];
    const out: (Cell | null)[] = Array.from({ length: (v.getDay() + 6) % 7 }, () => null);
    const last = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    for (let n = 1; n <= last; n++) {
      const date = new Date(v.getFullYear(), v.getMonth(), n);
      const hours = HOURS[date.getDay()];
      const isToday = sameDay(date, now);
      const off = date < start || !hours || (isToday && now.getHours() >= hours[1] - 2);
      const weekday = isToday ? 'hoy' : DAY_NAMES[date.getDay()].toLowerCase();
      out.push({ day: { key: date.toISOString().slice(0, 10), date, weekday }, off, today: isToday });
    }
    return out;
  });

  private readonly tabs = viewChild<ElementRef<HTMLElement>>('tabs');

  constructor() {
    // La píldora durazno se mueve al tipo de sesión elegido (transitions.dev "Tabs sliding")
    effect(() => {
      const reason = this.clinic.reason();
      const bar = this.tabs()?.nativeElement;
      if (!bar || typeof requestAnimationFrame === 'undefined') return;
      requestAnimationFrame(() => {
        const btn = Array.from(bar.querySelectorAll<HTMLElement>('button')).find((b) => b.textContent?.trim() === reason);
        const pill = bar.querySelector<HTMLElement>('.tabs-pill');
        if (!btn || !pill) return;
        pill.style.width = `${btn.offsetWidth}px`;
        pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
      });
    });
    afterNextRender(() => {
      const now = new Date();
      this.today.set(now);
      this.view.set(new Date(now.getFullYear(), now.getMonth(), 1));
    });
  }

  protected shiftMonth(step: number) {
    const v = this.view();
    if (!v) return;
    this.dir.set(step);
    this.view.set(new Date(v.getFullYear(), v.getMonth() + step, 1));
  }

  protected pickDay(d: Day) {
    this.day.set(d);
    this.hour.set(null);
  }
}
