import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CLINIC, DAY_NAMES, HOURS, REASONS } from '../core/content';
import { Clinic, fmtHour, whatsappLink } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Arrow, Magnetic } from '../shared/magnetic';
import { Reveal } from '../shared/reveal';

interface Day {
  key: string;
  date: Date;
  weekday: string;
  label: string;
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "Ocupado" de mentira pero estable: el mismo horario sale ocupado cada vez que se abre la página. */
function busy(key: string, hour: number) {
  let h = 0;
  for (const c of key + hour) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

/**
 * Agenda en cuatro pasos (motivo, día, hora y datos). Arma el mensaje y lo muestra como burbuja de
 * WhatsApp antes de abrir la app. Los días se calculan en el navegador (en el prerender no hay "hoy").
 */
@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal, Arrow, Magnetic],
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
              <p class="month">{{ monthLabel() }}</p>
            </div>
            @if (days().length) {
              <div class="days">
                @for (d of days(); track d.key) {
                  <button type="button" [attr.aria-pressed]="day()?.key === d.key" (click)="pickDay(d)">
                    <small>{{ d.weekday }}</small><b>{{ d.date.getDate() }}</b>
                  </button>
                }
              </div>
            } @else {
              <div class="days skeleton" aria-hidden="true">
                @for (i of [1, 2, 3, 4, 5, 6, 7]; track i) {
                  <span></span>
                }
              </div>
            }

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
                <a class="btn t-learn" magnetic [href]="link()" target="_blank" rel="noopener">Enviar por WhatsApp <app-arrow /></a>
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
    .row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px; }
    .month { font-size: 0.86rem; font-weight: 600; color: var(--royal); }
    /* transitions.dev "Tabs sliding": la píldora azul viaja al motivo elegido */
    .tabs { position: relative; display: flex; gap: 3px; padding: 4px; border-radius: 999px; background: var(--ice); overflow-x: auto; scrollbar-width: none; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs button { position: relative; z-index: 1; flex: none; padding: 10px 15px; border-radius: 999px; font-size: 0.88rem; font-weight: 600; color: var(--ink-2); transition: color var(--duration-fast) var(--ease-smooth-out), scale 160ms var(--ease-out); }
    .tabs button[aria-checked='true'] { color: var(--white); }
    .tabs button:active { scale: 0.95; }
    .tabs-pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: 0; border-radius: 999px; background: var(--royal); box-shadow: var(--shadow-blue); transition: transform var(--duration-fast) var(--ease-smooth-out), width var(--duration-fast) var(--ease-smooth-out); }
    .days { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px 2px 8px; margin: -4px -2px -8px; }
    .days::-webkit-scrollbar { display: none; }
    .days button { flex: none; display: grid; justify-items: center; gap: 2px; width: 58px; padding: 10px 0 12px; border-radius: 999px; background: var(--ice); transition: background-color 250ms ease, color 250ms ease, translate 400ms var(--ease-bounce), box-shadow 250ms ease; }
    .days small { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.7; }
    .days b { font-family: var(--font-display); font-size: 1.45rem; font-weight: 600; line-height: 1.1; }
    .days button[aria-pressed='true'] { background: var(--royal); color: var(--white); translate: 0 -4px; box-shadow: var(--shadow-blue); }
    @media (hover: hover) and (pointer: fine) { .days button:not([aria-pressed='true']):hover { background: var(--ice-2); translate: 0 -2px; } }
    .days button:active { scale: 0.94; }
    .skeleton span { flex: none; width: 58px; height: 70px; border-radius: 999px; background: var(--ice); animation: shimmer 1.4s ease-in-out infinite; }
    @keyframes shimmer { 50% { opacity: 0.5; } }
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
  protected readonly days = signal<Day[]>([]);
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
    const isToday = d.date.toDateString() === now.toDateString();
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
    const when = d && h !== null ? `el ${d.weekday.toLowerCase()} ${d.date.getDate()} de ${MONTHS[d.date.getMonth()]} a las ${fmtHour(h)}` : 'el día y la hora que elijas';
    let text = `Hola, soy ${who}. Quiero agendar una cita en Marfil para: ${this.clinic.reason().toLowerCase()}, ${when}.`;
    text += this.first() ? '\nEs mi primera visita.' : '\nYa soy paciente.';
    if (this.notesSig().trim()) text += `\n${this.notesSig().trim()}`;
    return text;
  });

  protected readonly link = computed(() => whatsappLink(this.message()));

  protected readonly monthLabel = computed(() => {
    const d = this.day() ?? this.days()[0];
    if (!d) return '';
    const t = d.date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
    return t[0].toUpperCase() + t.slice(1);
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
      const list: Day[] = [];
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      while (list.length < 12) {
        const hours = HOURS[d.getDay()];
        const now = new Date();
        const todayClosed = d.toDateString() === now.toDateString() && (!hours || now.getHours() >= hours[1] - 2);
        if (hours && !todayClosed) {
          const date = new Date(d);
          const isToday = date.toDateString() === now.toDateString();
          list.push({ key: date.toISOString().slice(0, 10), date, weekday: isToday ? 'Hoy' : DAY_NAMES[date.getDay()].slice(0, 3), label: MONTHS[date.getMonth()] });
        }
        d.setDate(d.getDate() + 1);
      }
      this.days.set(list);
    });
  }

  protected pickDay(d: Day) {
    this.day.set(d);
    this.hour.set(null);
  }
}
