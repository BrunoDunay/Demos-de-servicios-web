import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Album, whatsappLink } from '../core/booking';
import { CONTACT, NOTES, RATES, SESSION_TYPES } from '../core/content';
import { Reveal } from '../shared/reveal';
import { Running } from '../shared/running';

/**
 * Reserva escrita como una frase para completar ("Me llamo ___ y quiero una sesión de ___").
 * Al enviarla, el mensaje aparece como una tarjeta escrita a mano con el enlace a WhatsApp.
 * A la izquierda, las notas al margen (preguntas frecuentes).
 */
@Component({
  selector: 'app-reserve',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Running],
  template: `
    <section class="section reserve" id="reserva" running="Reserva">
      <div class="page">
        <p class="folio" data-reveal><span><b>Reserva</b> · te contesto yo, por WhatsApp</span><span>p. 60</span></p>
        <div class="layout">
          <aside class="notes">
            <h3 data-reveal>Notas al margen</h3>
            @for (n of notes; track n.q; let i = $index) {
              <div class="note" data-reveal [revealDelay]="i * 60">
                <p class="q">{{ n.q }}</p>
                <p class="a">{{ n.a }}</p>
              </div>
            }
            <p class="contact" data-reveal>{{ contact.studio }}, {{ contact.city }}<br />{{ contact.phone }} · {{ contact.email }}</p>
          </aside>

          <div class="write">
            @if (!sent()) {
              <form (submit)="submit($event)" novalidate data-reveal>
                <p class="sentence">
                  Hola, Inés. Me llamo
                  <span class="blank w-name">
                    <input name="nombre" autocomplete="name" placeholder="tu nombre" aria-label="Tu nombre" [value]="name()" (input)="name.set(val($event))" [attr.aria-invalid]="tried() && !nameOk()" />
                  </span>
                  y quiero una sesión de
                  <span class="blank select">
                    <select aria-label="Tipo de sesión" (change)="album.session.set(val($event))">
                      @for (s of sessions; track s) {
                        <option [value]="s" [selected]="album.session() === s">{{ s }}</option>
                      }
                    </select>
                  </span>.
                  {{ dateLead() }}
                  <span class="blank w-date">
                    <input type="date" name="fecha" aria-label="Fecha" [value]="date()" (input)="date.set(val($event))" />
                  </span>
                  y me interesa
                  <span class="blank select">
                    <select aria-label="Paquete" (change)="album.pack.set(val($event))">
                      @for (p of packs; track p) {
                        <option [value]="p" [selected]="album.pack() === p">{{ p }}</option>
                      }
                    </select>
                  </span>.
                  Mi WhatsApp es
                  <span class="blank w-phone">
                    <input name="telefono" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10 dígitos" aria-label="Tu WhatsApp" [value]="phone()" (input)="phone.set(val($event))" [attr.aria-invalid]="tried() && !phoneOk()" />
                  </span>.
                </p>
                @if (tried() && (!nameOk() || !phoneOk())) {
                  <p class="err" role="alert">{{ !nameOk() ? 'Falta tu nombre.' : 'El WhatsApp debe tener 10 dígitos.' }}</p>
                }
                <div class="send">
                  <button class="btn" type="submit">Escribirle a Inés</button>
                  <span class="small">Apartas tu fecha con $1,000. El resto, el día de la sesión.</span>
                </div>
              </form>
            } @else {
              <div class="card">
                <p class="to">Para Inés</p>
                @for (line of lines(); track $index) {
                  <p class="hand" [style.--i]="$index">{{ line }}</p>
                }
                <p class="from" [style.--i]="lines().length">{{ name().trim() }}</p>
              </div>
              <div class="after">
                <a class="btn" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp</a>
                <button type="button" class="thread" (click)="sent.set(false)">Corregir algo</button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: clamp(40px, 7vw, 120px); margin-top: clamp(40px, 6vw, 80px); align-items: start; }
    .notes h3 { font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .note { padding: 18px 0; border-bottom: 1px solid var(--line); }
    .q { font-family: var(--font-display); font-style: italic; font-size: 1.3rem; line-height: 1.2; }
    .a { margin-top: 6px; font-size: 0.95rem; color: var(--ink-2); }
    .contact { margin-top: 26px; font-size: 0.9rem; color: var(--muted); }

    .sentence { font-family: var(--font-display); font-weight: 340; font-size: clamp(1.8rem, 3.2vw, 2.9rem); line-height: 1.55; }
    .blank { display: inline-block; position: relative; vertical-align: baseline; }
    .blank::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0.18em; height: 1px; background: var(--ink); transition: background-color 200ms ease, height 200ms ease; }
    .blank:focus-within::after { background: var(--hilo); height: 2px; }
    .blank input, .blank select { border: 0; background: transparent; padding: 0 4px; font-family: var(--font-display); font-style: italic; font-size: inherit; color: var(--hilo); outline: none; }
    .blank input::placeholder { color: color-mix(in oklch, var(--ink) 30%, transparent); font-style: italic; }
    .blank input[aria-invalid='true'] { color: var(--hilo); }
    .w-name input { width: 7.5em; }
    .w-phone input { width: 6.2em; }
    .w-date input { width: 6.6em; font-size: 0.7em; }
    .select select { appearance: none; padding-right: 0.7em; cursor: pointer; background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a8432f' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") right center / 0.5em no-repeat; }
    .err { margin-top: 14px; color: var(--hilo); font-weight: 600; }
    .send { display: flex; flex-wrap: wrap; align-items: center; gap: 18px 26px; margin-top: 34px; }
    .small { font-size: 0.9rem; color: var(--muted); }

    .card { position: relative; padding: clamp(28px, 4vw, 48px); background: var(--paper-2); box-shadow: 0 1px 0 var(--line), 0 30px 50px -40px var(--ink); rotate: -1deg; animation: card 600ms var(--ease-out); }
    @keyframes card { from { opacity: 0; translate: 0 16px; rotate: -3deg; } }
    .card::before { content: ''; position: absolute; left: 24px; right: 24px; top: 14px; height: 2px; background: repeating-linear-gradient(90deg, var(--hilo) 0 7px, transparent 7px 11px); }
    .to { font-size: 0.74rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .hand { margin-top: 10px; font-family: var(--font-display); font-style: italic; font-size: clamp(1.4rem, 2.3vw, 1.9rem); line-height: 1.3; animation: ink 600ms var(--ease-out) both; animation-delay: calc(var(--i) * 140ms + 200ms); }
    .from { margin-top: 18px; text-align: right; font-family: var(--font-display); font-style: italic; font-size: 1.6rem; color: var(--hilo); animation: ink 600ms var(--ease-out) both; animation-delay: calc(var(--i) * 140ms + 300ms); }
    @keyframes ink { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
    .after { display: flex; flex-wrap: wrap; align-items: center; gap: 20px 28px; margin-top: 30px; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .notes { order: 2; } }
  `,
})
export class Reserve {
  protected readonly album = inject(Album);
  protected readonly contact = CONTACT;
  protected readonly notes = NOTES;
  protected readonly sessions = SESSION_TYPES;
  protected readonly packs = ['la que me recomiendes', ...RATES.map((r) => `el paquete ${r.name}`)];
  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly date = signal('');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  protected readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length === 10);
  protected readonly dateLead = computed(() => (this.album.session() === 'newborn' ? 'Mi bebé nace alrededor del' : 'La fecha que tengo en mente es el'));

  private readonly niceDate = computed(() =>
    this.date() ? new Date(this.date() + 'T12:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' }) : '',
  );

  protected readonly lines = computed(() => [
    `Me llamo ${this.name().trim()} y quiero una sesión de ${this.album.session()}.`,
    this.niceDate() ? `${this.dateLead()} ${this.niceDate()}.` : 'Todavía no tengo la fecha exacta.',
    `Me interesa ${this.album.pack()}.`,
    `Mi WhatsApp es ${this.phone().replace(/\D/g, '')}.`,
  ]);
  protected readonly link = computed(() => whatsappLink(`Hola, Inés.\n${this.lines().join('\n')}`));

  protected val(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.phoneOk()) this.sent.set(true);
  }
}
