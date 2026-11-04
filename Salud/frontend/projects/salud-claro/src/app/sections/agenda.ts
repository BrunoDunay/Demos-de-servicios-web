import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DAY_NAMES, HOURS, PRACTICE } from '../core/content';
import { Practice, fmtHour, whatsappLink } from '../core/practice';
import { Icon } from '../shared/icon';
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
 * Agenda en cinco pasos (tipo, lugar, día, hora y datos). Arma el mensaje y lo muestra como burbuja de
 * WhatsApp antes de abrir la app. Los días se calculan en el navegador (en el prerender no hay "hoy").
 */
@Component({
  selector: 'app-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal],
  template: `
    <section class="section wrap" id="agenda">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Agenda</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Da el primer paso, <em>a tu ritmo</em>.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Elige cómo y cuándo. Te respondo yo, personalmente, el mismo día.</p>
        </header>

        <div class="card" data-reveal>
          <div class="steps">
            <fieldset>
              <legend><span>1</span> ¿Qué tipo de sesión?</legend>
              <div class="chips">
                @for (r of reasons; track r) {
                  <button type="button" [attr.aria-pressed]="clinic.reason() === r" (click)="clinic.reason.set(r)">{{ r }}</button>
                }
              </div>
            </fieldset>

            <fieldset>
              <legend><span>2</span> ¿Dónde?</legend>
              <div class="chips">
                <button type="button" [attr.aria-pressed]="online() === false" (click)="online.set(false)"><app-icon name="sofa" [size]="16" /> En el consultorio</button>
                <button type="button" [attr.aria-pressed]="online()" (click)="online.set(true)"><app-icon name="video" [size]="16" /> En línea</button>
              </div>
            </fieldset>

            <fieldset>
              <legend><span>3</span> Día</legend>
              @if (days().length) {
                <div class="days">
                  @for (d of days(); track d.key) {
                    <button type="button" [attr.aria-pressed]="day()?.key === d.key" (click)="pickDay(d)">
                      <small>{{ d.weekday }}</small><b>{{ d.date.getDate() }}</b><small>{{ d.label }}</small>
                    </button>
                  }
                </div>
              } @else {
                <div class="days skeleton" aria-hidden="true">
                  @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                    <span></span>
                  }
                </div>
              }
            </fieldset>

            <fieldset [disabled]="!day()">
              <legend><span>4</span> Hora</legend>
              @if (day()) {
                <div class="slots">
                  @for (s of slots(); track s.h) {
                    <button type="button" [disabled]="s.busy" [attr.aria-pressed]="hour() === s.h" (click)="hour.set(s.h)">{{ s.label }}</button>
                  }
                </div>
              } @else {
                <p class="hint">Primero elige un día.</p>
              }
            </fieldset>

            <fieldset>
              <legend><span>5</span> Tus datos</legend>
              <label class="field">
                <span>Nombre</span>
                <input type="text" name="name" autocomplete="given-name" [(ngModel)]="name" placeholder="Solo tu nombre de pila está bien" />
              </label>
              <div class="toggle">
                <span>¿Has ido a terapia antes?</span>
                <div class="seg" role="group">
                  <button type="button" [attr.aria-pressed]="first()" (click)="first.set(true)">Es la primera vez</button>
                  <button type="button" [attr.aria-pressed]="!first()" (click)="first.set(false)">Sí</button>
                </div>
              </div>
              <label class="field">
                <span>Si quieres, cuéntame en una línea qué te trae <small>(opcional)</small></span>
                <textarea name="notes" rows="2" [(ngModel)]="notes" placeholder="No hace falta dar detalles; lo platicamos en sesión"></textarea>
              </label>
            </fieldset>
          </div>

          <aside class="preview">
            <p class="chat-head"><span class="avatar"><app-icon name="leaf" [size]="18" /></span><span><b>Valeria · Claro</b><small>Tu mensaje solo lo lee ella</small></span></p>
            <div class="chat">
              <p class="bubble" [class.empty]="!ready()">{{ message() }}</p>
            </div>
            @if (ready()) {
              <a class="btn amber" [href]="link()" target="_blank" rel="noopener">Enviar por WhatsApp <app-icon name="send" [size]="18" /></a>
            } @else {
              <p class="missing">{{ missing() }}</p>
            }
            <p class="fine">Sitio demo: el botón abre WhatsApp para que elijas a quién enviarlo. Tel. {{ phone }}</p>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--mist-2); }
    .head { display: grid; gap: 16px; max-width: 720px; }
    .card { display: grid; grid-template-columns: 1.4fr 1fr; margin-top: 44px; border-radius: var(--radius-l); background: var(--paper); box-shadow: var(--shadow-m); overflow: hidden; }
    .steps { display: grid; gap: 30px; padding: clamp(22px, 3.4vw, 40px); }
    fieldset { border: 0; margin: 0; padding: 0; min-width: 0; display: grid; gap: 14px; transition: opacity 250ms ease; }
    fieldset:disabled { opacity: 0.5; }
    legend { display: flex; align-items: center; gap: 10px; padding: 0; margin-bottom: 14px; font-weight: 700; font-size: 1.05rem; }
    legend span { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--forest); color: var(--mist); font-size: 0.8rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chips button { display: inline-flex; align-items: center; gap: 8px; }
    .chips button, .slots button, .seg button { padding: 10px 15px; border-radius: 999px; font-size: 0.9rem; font-weight: 600; box-shadow: inset 0 0 0 1.5px var(--line); transition: background-color 200ms ease, color 200ms ease, box-shadow 200ms ease, scale 160ms var(--ease-out); }
    .chips button:active, .slots button:active:not(:disabled), .seg button:active, .days button:active { scale: 0.95; }
    [aria-pressed='true'] { background: var(--forest) !important; color: var(--mist) !important; box-shadow: none !important; }
    @media (hover: hover) and (pointer: fine) {
      .chips button:hover, .slots button:not(:disabled):hover, .seg button:hover, .days button:hover { box-shadow: inset 0 0 0 1.5px var(--forest); }
    }
    .days { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 2px; margin: -2px; }
    .days::-webkit-scrollbar { display: none; }
    .days button { flex: none; display: grid; justify-items: center; width: 66px; padding: 10px 0; border-radius: 16px; box-shadow: inset 0 0 0 1.5px var(--line); transition: background-color 200ms ease, color 200ms ease, box-shadow 200ms ease, scale 160ms var(--ease-out); }
    .days b { font-family: var(--font-display); font-size: 1.6rem; font-weight: 500; line-height: 1.1; }
    .days small { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.75; }
    .skeleton span { flex: none; width: 66px; height: 82px; border-radius: 16px; background: var(--mist-2); animation: shimmer 1.4s ease-in-out infinite; }
    @keyframes shimmer { 50% { opacity: 0.5; } }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 8px; }
    .slots button { border-radius: 12px; font-variant-numeric: tabular-nums; }
    .slots button:disabled { opacity: 0.35; text-decoration: line-through; cursor: not-allowed; }
    .hint { font-size: 0.92rem; color: var(--muted); }
    .field { display: grid; gap: 6px; }
    .field > span { font-size: 0.86rem; font-weight: 600; color: var(--forest-2); }
    .field small { font-weight: 500; color: var(--muted); }
    input, textarea { width: 100%; padding: 13px 15px; border: 0; border-radius: 12px; font-size: 16px; background: var(--mist); box-shadow: inset 0 0 0 1.5px var(--line); transition: box-shadow 200ms ease; resize: vertical; }
    input:focus, textarea:focus { outline: none; box-shadow: inset 0 0 0 2px var(--amber-deep); }
    .toggle { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.92rem; font-weight: 600; }
    .seg { display: flex; gap: 6px; }
    .preview { display: flex; flex-direction: column; gap: 16px; padding: clamp(22px, 3vw, 34px); background: oklch(93% 0.025 150); }
    .chat-head { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid oklch(85% 0.03 150); }
    .chat-head .avatar { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--forest); color: var(--mist); }
    .chat-head span:last-child { display: grid; line-height: 1.3; }
    .chat-head small { font-size: 0.78rem; color: var(--muted); }
    .chat { flex: 1; display: flex; align-items: flex-end; justify-content: flex-end; min-height: 170px; }
    .bubble { position: relative; max-width: 92%; padding: 12px 14px; border-radius: 14px 14px 4px 14px; background: oklch(90% 0.08 145); font-size: 0.94rem; line-height: 1.45; white-space: pre-line; box-shadow: 0 1px 1px oklch(0% 0 0 / 0.08); }
    .bubble.empty { opacity: 0.6; }
    .missing { font-size: 0.88rem; font-weight: 600; color: var(--forest-2); text-align: center; padding: 14px; border-radius: 999px; box-shadow: inset 0 0 0 1.5px oklch(80% 0.03 150); }
    .fine { font-size: 0.76rem; color: var(--muted); text-align: center; }
    @media (max-width: 900px) { .card { grid-template-columns: 1fr; } }
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

  constructor() {
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
