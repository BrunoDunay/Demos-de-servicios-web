import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DAY_NAMES, HOURS, PRACTICE } from '../core/content';
import { Practice, fmtHour, whatsappLink } from '../core/practice';
import { Icon } from '../shared/icon';
import { Arrow, Magnetic } from '../shared/magnetic';
import { Reveal } from '../shared/reveal';

interface Day {
  key: string;
  date: Date;
  weekday: string;
  label: string;
}

const REASONS = ['Primera sesión de valoración', 'Terapia individual', 'Terapia de pareja', 'Adolescentes'];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "Ocupado" de mentira pero estable: el mismo horario sale ocupado cada vez que se abre la página. */
function busy(key: string, hour: number) {
  let h = 0;
  for (const c of key + hour) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}

/**
 * Agenda en cinco pasos (tipo, lugar, día, hora y datos) en una hoja de cuaderno; la vista previa es una nota a mano. Arma el mensaje y lo muestra como burbuja de
 * WhatsApp antes de abrir la app. Los días se calculan en el navegador (en el prerender no hay "hoy").
 */
@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal, Arrow, Magnetic],
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
              <button type="button" [attr.aria-pressed]="online() === false" (click)="online.set(false)"><app-icon name="sofa" [size]="18" /> En el consultorio</button>
              <button type="button" [attr.aria-pressed]="online()" (click)="online.set(true)"><app-icon name="video" [size]="18" /> En línea</button>
            </div>

            <p class="label hand">3. día <span class="month">{{ monthLabel() }}</span></p>
            @if (days().length) {
              <div class="days">
                @for (d of days(); track d.key) {
                  <button type="button" [attr.aria-pressed]="day()?.key === d.key" (click)="pickDay(d)"><small>{{ d.weekday }}</small><b>{{ d.date.getDate() }}</b></button>
                }
              </div>
            } @else {
              <div class="days skeleton" aria-hidden="true">
                @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                  <span></span>
                }
              </div>
            }

            <p class="label hand">4. hora</p>
            @if (day()) {
              <div class="slots">
                @for (s of slots(); track s.h; let i = $index) {
                  <button type="button" [disabled]="s.busy" [attr.aria-pressed]="hour() === s.h" (click)="hour.set(s.h)" [style.--i]="i">{{ s.label }}</button>
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
                <button type="button" [attr.aria-pressed]="first()" (click)="first.set(true)">Es mi primera vez</button>
                <button type="button" [attr.aria-pressed]="!first()" (click)="first.set(false)">Ya he ido</button>
              </div>
              <label class="field wide">
                <span>Si quieres, cuéntame en una línea qué te trae <small>(opcional)</small></span>
                <textarea name="notes" rows="2" [(ngModel)]="notes" placeholder="No hace falta dar detalles; lo platicamos en sesión"></textarea>
              </label>
            </div>
          </div>

          <aside class="letter" aria-label="Vista previa del mensaje">
            <span class="tape"></span>
            <p class="to hand">para: Valeria</p>
            <p class="msg hand" [class.empty]="!ready()">{{ message() }}</p>
            @if (ready()) {
              <p class="ok">
                <span class="t-success-check" data-state="in"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7.5" /></svg></span>
                Listo para enviar
              </p>
              <a class="btn t-learn" magnetic [href]="link()" target="_blank" rel="noopener">Enviar por WhatsApp <app-arrow /></a>
            } @else {
              <p class="missing">{{ missing() }}</p>
            }
            <p class="fine"><app-icon name="lock" [size]="14" /> Tu mensaje solo lo lee Valeria. Sitio demo: el botón abre WhatsApp para que elijas a quién enviarlo.</p>
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
    .where button, .seg button { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; font-weight: 650; font-size: 0.92rem; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--line-2); clip-path: polygon(1% 4%, 99% 0, 100% 96%, 0 100%); transition: background-color 250ms ease, translate 400ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .where button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--sage-soft); box-shadow: inset 0 0 0 2px var(--sage-deep); translate: 0 -2px; }
    .where button:active, .seg button:active { scale: 0.96; }
    .days { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px 2px 8px; margin: -4px -2px -8px; }
    .days::-webkit-scrollbar { display: none; }
    .days button { flex: none; display: grid; justify-items: center; width: 58px; padding: 8px 0 10px; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--line-2); border-radius: 50% 45% 48% 52% / 40% 44% 50% 46%; transition: background-color 250ms ease, translate 400ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .days small { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--muted); }
    .days b { font-family: var(--font-display); font-stretch: 75%; font-size: 1.6rem; font-weight: 800; line-height: 1.1; }
    .days button[aria-pressed='true'] { background: var(--peach); box-shadow: inset 0 0 0 2px var(--peach-deep); translate: 0 -4px; }
    .days button:active { scale: 0.94; }
    .skeleton span { flex: none; width: 58px; height: 64px; border-radius: 50%; background: var(--paper-2); animation: shimmer 1.4s ease-in-out infinite; }
    @keyframes shimmer { 50% { opacity: 0.5; } }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 8px; }
    .slots button { padding: 9px 8px; font-weight: 650; font-size: 0.88rem; font-variant-numeric: tabular-nums; background: var(--card); box-shadow: inset 0 0 0 1.5px var(--line-2); animation: t-text-in 400ms var(--ease-smooth-out) both; animation-delay: calc(var(--i) * 25ms); transition: background-color 200ms ease, scale 160ms var(--ease-out); }
    .slots button[aria-pressed='true'] { background: var(--ink); color: var(--paper); box-shadow: none; }
    .slots button:disabled { opacity: 0.35; text-decoration: line-through; cursor: not-allowed; }
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
    const where = this.online() ? 'en línea' : 'en el consultorio';
    let text = `Hola, Valeria. Soy ${who} y me gustaría agendar: ${this.clinic.reason().toLowerCase()}, ${where}, ${when}.`;
    text += this.first() ? '\nEs la primera vez que voy a terapia.' : '\nYa he ido a terapia antes.';
    if (this.notesSig().trim()) text += `\n${this.notesSig().trim()}`;
    return text;
  });

  protected readonly link = computed(() => whatsappLink(this.message()));

  protected readonly monthLabel = computed(() => {
    const d = this.day() ?? this.days()[0];
    return d ? d.date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) : '';
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
