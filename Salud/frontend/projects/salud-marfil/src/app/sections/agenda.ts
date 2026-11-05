import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CLINIC, DAY_NAMES, HOURS, REASONS } from '../core/content';
import { Clinic, fmtHour, whatsappLink } from '../core/clinic';
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

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "Ocupado" de mentira pero estable: el mismo horario sale ocupado cada vez que se abre la página. */
function busy(key: string, hour: number) {
  let h = 0;
  for (const c of key + hour) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

/**
 * Agenda en cuatro pasos (motivo, día en un calendario de hasta 3 meses, hora y datos). Arma el mensaje y lo muestra como burbuja de
 * WhatsApp antes de abrir la app. Los días se calculan en el navegador (en el prerender no hay "hoy").
 */
@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal, Arrow],
  template: `
    <section class="section wrap" id="agenda">
      <p class="giant word" aria-hidden="true">agenda</p>
      <div class="page">
        <header class="head">
          <p class="pill" data-reveal>Agenda en línea</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Aparta tu cita <b>en un minuto</b>.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Elige motivo, día y hora. Te confirmamos por WhatsApp en horario de consultorio.</p>
        </header>

        <div class="app" data-reveal>
          <div class="form">
            <p class="label">¿Para qué es la cita?</p>
            <div class="tabs" role="radiogroup" aria-label="Motivo" #tabs>
              <span class="tabs-pill" aria-hidden="true"></span>
              @for (r of reasons; track r) {
                <button type="button" role="radio" [attr.aria-checked]="clinic.reason() === r" (click)="clinic.reason.set(r)">{{ r }}</button>
              }
            </div>

            <div class="row">
              <p class="label">Elige el día</p>
              <div class="cal-nav">
                <button type="button" aria-label="Mes anterior" [disabled]="!canPrev()" (click)="shiftMonth(-1)"><app-icon name="chevron-l" [size]="18" /></button>
                <p class="month" aria-live="polite">{{ monthLabel() }}</p>
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
                        <button type="button" [disabled]="c.off" [class.today]="c.today" [attr.aria-pressed]="day()?.key === c.day.key" [attr.aria-label]="c.day.weekday + ' ' + c.day.date.getDate()" (click)="pickDay(c.day)" [style.--i]="$index">{{ c.day.date.getDate() }}</button>
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
            <p class="cal-legend"><span><i class="lg-today"></i>Hoy</span><span><i class="lg-off"></i>Domingo o sin lugares</span><span>Hasta {{ maxMonths }} meses adelante</span></p>

            <p class="label">Hora</p>
            @if (day()) {
              <div class="slots">
                @for (s of slots(); track s.h; let i = $index) {
                  <button type="button" [disabled]="s.busy" [attr.aria-pressed]="hour() === s.h" (click)="hour.set(s.h)" [style.--i]="i"><app-icon name="clock" [size]="14" /> {{ s.label }}</button>
                }
              </div>
            } @else {
              <p class="hint">Primero elige un día.</p>
            }

            <div class="fields">
              <label class="field">
                <span>Nombre</span>
                <input type="text" name="name" autocomplete="name" [(ngModel)]="name" placeholder="¿Cómo te llamas?" />
              </label>
              <div class="seg" role="group" aria-label="¿Primera visita?">
                <button type="button" [attr.aria-pressed]="first()" (click)="first.set(true)">Primera vez</button>
                <button type="button" [attr.aria-pressed]="!first()" (click)="first.set(false)">Ya soy paciente</button>
              </div>
              <label class="field wide">
                <span>Algo que debamos saber <small>(opcional)</small></span>
                <textarea name="notes" rows="2" [(ngModel)]="notes" placeholder="Por ejemplo: me duele una muela de abajo"></textarea>
              </label>
            </div>
          </div>

          <aside class="phone" aria-label="Vista previa del mensaje">
            <div class="screen">
              <p class="chat-head"><span class="av"><app-icon name="tooth" [size]="18" /></span><span><b>Marfil</b><small>en línea</small></span></p>
              <div class="chat">
                <p class="bubble" [class.empty]="!ready()">{{ message() }}</p>
              </div>
              @if (ready()) {
                <p class="ok">
                  <span class="t-success-check" data-state="in"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7.5" /></svg></span>
                  Listo para enviar
                </p>
                <a class="btn t-learn" [href]="link()" target="_blank" rel="noopener">Enviar por WhatsApp <app-arrow /></a>
              } @else {
                <p class="missing">{{ missing() }}</p>
              }
            </div>
            <p class="fine">Sitio demo: el botón abre WhatsApp para que elijas a quién enviarlo. Tel. {{ phone }}</p>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { position: relative; overflow: hidden; }
    .word { left: -0.06em; bottom: 0.05em; font-size: clamp(7rem, 22vw, 20rem); color: oklch(50% 0.2 263 / 0.05); }
    .head { position: relative; display: grid; gap: 18px; max-width: 720px; }
    .h2 b { color: var(--royal); }
    .app { position: relative; display: grid; grid-template-columns: 1.45fr 1fr; gap: clamp(20px, 3vw, 40px); margin-top: 44px; padding: clamp(18px, 3vw, 34px); border-radius: var(--radius-xl); background: var(--white); box-shadow: var(--shadow-m); }
    .form { display: grid; gap: 14px; min-width: 0; }
    .label { font-weight: 700; font-size: 0.98rem; }
    .row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-top: 8px; }
    .month { font-size: 0.86rem; font-weight: 600; color: var(--royal); }
    /* transitions.dev "Tabs sliding": la píldora azul viaja al motivo elegido */
    .tabs { position: relative; display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: var(--ice); overflow-x: auto; scrollbar-width: none; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs button { position: relative; z-index: 1; flex: none; padding: 10px 15px; border-radius: 999px; font-size: 0.88rem; font-weight: 600; color: var(--ink-2); transition: color var(--duration-fast) var(--ease-smooth-out), scale 160ms var(--ease-out); }
    .tabs button[aria-checked='true'] { color: var(--white); }
    .tabs button:active { scale: 0.95; }
    .tabs-pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: 0; border-radius: 999px; background: var(--royal); box-shadow: var(--shadow-blue); transition: transform var(--duration-fast) var(--ease-smooth-out), width var(--duration-fast) var(--ease-smooth-out); }
    /* Calendario del mes: lunes a domingo, con flechas para cambiar de mes */
    .cal-nav { display: flex; align-items: center; gap: 6px; }
    .cal-nav button { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--ice); color: var(--royal); transition: background-color 200ms ease, scale 160ms var(--ease-out), opacity 200ms ease; }
    .cal-nav button:disabled { opacity: 0.35; cursor: default; }
    .cal-nav button:active:not(:disabled) { scale: 0.9; }
    @media (hover: hover) and (pointer: fine) { .cal-nav button:not(:disabled):hover { background: var(--royal); color: var(--white); } }
    .cal-nav .month { min-width: 9.5em; text-align: center; }
    .cal { padding: 12px; border-radius: 22px; background: var(--ice); overflow: hidden; }
    .week, .grid-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
    .week span { padding-bottom: 6px; text-align: center; font-size: 0.72rem; font-weight: 700; color: var(--muted); }
    .grid-days { animation: cal-in 420ms var(--ease-smooth-out) both; }
    .grid-days.back { animation-name: cal-back; }
    @keyframes cal-in { from { opacity: 0; translate: 24px 0; } }
    @keyframes cal-back { from { opacity: 0; translate: -24px 0; } }
    .grid-days button { position: relative; aspect-ratio: 1; max-height: 46px; border-radius: 14px; font-family: var(--font-display); font-size: 1.02rem; font-weight: 600; font-variant-numeric: tabular-nums; background: var(--white); transition: background-color 200ms ease, color 200ms ease, box-shadow 200ms ease, scale 300ms var(--ease-bounce); }
    .grid-days button.today::after { content: ''; position: absolute; left: 50%; bottom: 5px; width: 5px; height: 5px; border-radius: 50%; translate: -50% 0; background: var(--royal); }
    .grid-days button:disabled { background: transparent; color: var(--muted); opacity: 0.45; cursor: not-allowed; }
    .grid-days button[aria-pressed='true'] { background: var(--royal); color: var(--white); box-shadow: var(--shadow-blue); scale: 1.06; }
    .grid-days button[aria-pressed='true'].today::after { background: var(--white); }
    @media (hover: hover) and (pointer: fine) { .grid-days button:not(:disabled):not([aria-pressed='true']):hover { box-shadow: inset 0 0 0 1.5px var(--royal); color: var(--royal); } }
    .grid-days button:active:not(:disabled) { scale: 0.92; }
    .skeleton span { aspect-ratio: 1; max-height: 46px; border-radius: 14px; background: var(--white); animation: shimmer 1.4s ease-in-out infinite; }
    @keyframes shimmer { 50% { opacity: 0.5; } }
    .cal-legend { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 0.78rem; color: var(--muted); }
    .cal-legend span { display: inline-flex; align-items: center; gap: 6px; }
    .cal-legend i { width: 8px; height: 8px; border-radius: 50%; }
    .lg-today { background: var(--royal); }
    .lg-off { background: var(--ice-3); }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; }
    .slots button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 999px; font-size: 0.86rem; font-weight: 600; box-shadow: inset 0 0 0 1.5px var(--line); font-variant-numeric: tabular-nums; animation: t-text-in 400ms var(--ease-smooth-out) both; animation-delay: calc(var(--i) * 25ms); transition: background-color 200ms ease, color 200ms ease, box-shadow 200ms ease, scale 160ms var(--ease-out); }
    .slots button[aria-pressed='true'] { background: var(--navy); color: var(--white); box-shadow: none; }
    .slots button:disabled { opacity: 0.35; text-decoration: line-through; cursor: not-allowed; }
    @media (hover: hover) and (pointer: fine) { .slots button:not(:disabled):not([aria-pressed='true']):hover { box-shadow: inset 0 0 0 1.5px var(--royal); color: var(--royal); } }
    .slots button:active:not(:disabled) { scale: 0.95; }
    .hint { font-size: 0.9rem; color: var(--muted); }
    .fields { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: end; margin-top: 8px; }
    .field { display: grid; gap: 6px; }
    .field.wide { grid-column: 1 / -1; }
    .field > span { font-size: 0.86rem; font-weight: 650; color: var(--ink-2); }
    .field small { font-weight: 500; color: var(--muted); }
    input, textarea { width: 100%; padding: 13px 16px; border: 0; border-radius: 14px; font-size: 16px; background: var(--ice); box-shadow: inset 0 0 0 1.5px transparent; transition: box-shadow 200ms ease, background-color 200ms ease; resize: vertical; }
    input:focus, textarea:focus { outline: none; background: var(--white); box-shadow: inset 0 0 0 2px var(--royal); }
    .seg { display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: var(--ice); }
    .seg button { padding: 9px 14px; border-radius: 999px; font-size: 0.84rem; font-weight: 600; transition: background-color 200ms ease, color 200ms ease; }
    .seg button[aria-pressed='true'] { background: var(--white); color: var(--royal); box-shadow: var(--shadow-s); }
    /* Vista previa dentro de un teléfono */
    .phone { display: grid; gap: 12px; align-content: start; }
    .screen { display: flex; flex-direction: column; gap: 14px; min-height: 440px; padding: 18px; border-radius: 34px; background: linear-gradient(180deg, var(--ice-2), var(--ice)); box-shadow: inset 0 0 0 8px var(--navy), inset 0 0 0 9px oklch(40% 0.08 264); padding: 26px 22px 22px; }
    .chat-head { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
    .av { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--royal); color: var(--white); }
    .chat-head span:last-child { display: grid; line-height: 1.25; }
    .chat-head small { font-size: 0.74rem; color: var(--ok); font-weight: 600; }
    .chat { flex: 1; display: flex; align-items: flex-end; justify-content: flex-end; }
    .bubble { max-width: 94%; padding: 12px 14px; border-radius: 18px 18px 4px 18px; background: var(--royal); color: var(--white); font-size: 0.92rem; line-height: 1.45; white-space: pre-line; box-shadow: var(--shadow-blue); transition: opacity 300ms ease; }
    .bubble.empty { opacity: 0.5; }
    .ok { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.92rem; color: var(--ok); }
    /* transitions.dev "Success check": aparece girando, rebota y la palomita se dibuja */
    .t-success-check { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--ok); color: var(--white); opacity: 0; }
    .t-success-check path { stroke-dasharray: 20; stroke-dashoffset: 20; }
    .t-success-check[data-state='in'] { animation: t-check-fade 500ms var(--ease-smooth-out) forwards, t-check-rotate 500ms var(--ease-smooth-out) forwards, t-check-blur 500ms var(--ease-smooth-out) forwards, t-check-bob 500ms cubic-bezier(0.34, 1.35, 0.64, 1) forwards; }
    .t-success-check[data-state='in'] path { animation: t-check-draw 500ms var(--ease-smooth-out) 80ms forwards; }
    @keyframes t-check-fade { to { opacity: 1; } }
    @keyframes t-check-rotate { from { rotate: 80deg; } to { rotate: 0deg; } }
    @keyframes t-check-blur { from { filter: blur(8px); } to { filter: blur(0); } }
    @keyframes t-check-bob { from { translate: 0 20px; } to { translate: 0 0; } }
    @keyframes t-check-draw { to { stroke-dashoffset: 0; } }
    .missing { padding: 14px; border-radius: 999px; text-align: center; font-size: 0.88rem; font-weight: 650; color: var(--ink-2); box-shadow: inset 0 0 0 1.5px var(--line-2); }
    .fine { font-size: 0.76rem; color: var(--muted); text-align: center; }
    @media (max-width: 900px) {
      .app { grid-template-columns: 1fr; }
      .fields { grid-template-columns: 1fr; }
      .screen { min-height: 340px; }
    }
  `,
})
export class Agenda {
  protected readonly clinic = inject(Clinic);
  protected readonly reasons = REASONS;
  protected readonly phone = CLINIC.phone;
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
    let text = `Hola, soy ${who}. Quiero agendar una cita en Marfil para: ${this.clinic.reason().toLowerCase()}, ${when}.`;
    text += this.first() ? '\nEs mi primera visita.' : '\nYa soy paciente.';
    if (this.notesSig().trim()) text += `\n${this.notesSig().trim()}`;
    return text;
  });

  protected readonly link = computed(() => whatsappLink(this.message()));

  protected readonly monthLabel = computed(() => {
    const v = this.view();
    if (!v) return '';
    const t = v.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
    return t[0].toUpperCase() + t.slice(1);
  });

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
    // La píldora de los motivos se mueve al botón elegido (y lo trae a la vista si está fuera)
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
        bar.scrollTo({ left: btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
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
