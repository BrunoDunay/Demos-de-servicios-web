import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Booking, whatsappLink } from '../core/booking';
import { CONTACT, PLANS, SCHEDULE } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section contact" id="contacto">
      <div class="container grid">
        <div class="info">
          <span class="eyebrow" data-reveal>Contacto</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Tu primera clase va por nuestra cuenta.</h2>
          <p class="section-lead" data-reveal [revealDelay]="140">Déjanos tus datos y te escribimos por WhatsApp para apartarte lugar. Así de fácil.</p>

          <ul class="facts" data-reveal [revealDelay]="200">
            <li><span class="ico"><app-icon name="pin" /></span><div><b>{{ contact.address }}</b><small>{{ contact.city }}</small></div></li>
            <li><span class="ico"><app-icon name="phone" /></span><div><b>{{ contact.phone }}</b><small>Llamadas y WhatsApp</small></div></li>
            <li>
              <span class="ico"><app-icon name="clock" /></span>
              <div class="hours">
                @for (h of contact.hours; track h.days) {
                  <span><small>{{ h.days }}</small><b>{{ h.time }}</b></span>
                }
              </div>
            </li>
          </ul>

          <div class="map" data-reveal="scale" [revealDelay]="240" role="img" aria-label="Mapa ilustrado de la ubicación de Brío">
            <svg viewBox="0 0 520 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="520" height="220" fill="#e8e5dc" />
              <rect x="300" y="24" width="140" height="80" rx="18" fill="#d6ecb8" />
              <g stroke="#fff" stroke-linecap="round">
                <path d="M-10 70H540" stroke-width="16" />
                <path d="M-10 160H540" stroke-width="10" />
                <path d="M120 -10V240" stroke-width="12" />
                <path d="M250 -10V240" stroke-width="8" />
                <path d="M400 120l140 -60" stroke-width="8" />
                <path d="M30 -10l80 240" stroke-width="6" />
              </g>
              <text x="318" y="70" font-size="12" fill="#5a7a3a" font-weight="700">Parque Los Pinos</text>
              <text x="140" y="64" font-size="11" fill="#8a8678" font-weight="700">AV. DE LAS ARBOLEDAS</text>
            </svg>
            <div class="pin">
              <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#2F4BFF" /><rect x="12" y="9" width="6.5" height="29" rx="3.25" fill="#fff" /><circle cx="24.5" cy="28" r="8" fill="none" stroke="#fff" stroke-width="6.5" /><path d="M37 5l1.9 5.1 5.1 1.9-5.1 1.9L37 19l-1.9-5.1-5.1-1.9 5.1-1.9z" fill="#D9FF4A" /></svg>
              <span>Brío</span>
            </div>
          </div>
        </div>

        <div class="form-wrap" data-reveal="right" [revealDelay]="120">
          @if (!sent()) {
            <form class="form" (submit)="submit($event)" novalidate>
              <h3>Aparta tu clase gratis</h3>
              <label class="field">
                <span>Tu nombre</span>
                <input name="nombre" autocomplete="given-name" placeholder="¿Cómo te llamas?" [value]="name()" (input)="name.set(val($event))" [class.invalid]="tried() && !nameOk()" />
                @if (tried() && !nameOk()) { <em>Escribe tu nombre para saber cómo saludarte.</em> }
              </label>
              <label class="field">
                <span>WhatsApp</span>
                <input name="telefono" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10 dígitos" [value]="phone()" (input)="phone.set(val($event))" [class.invalid]="tried() && !phoneOk()" />
                @if (tried() && !phoneOk()) { <em>Revisa que sean 10 dígitos.</em> }
              </label>
              <label class="field">
                <span>Me interesa</span>
                <select name="interes" [value]="booking.interest()" (change)="booking.interest.set(val($event))">
                  @for (o of options(); track o) {
                    <option [value]="o" [selected]="o === booking.interest()">{{ o }}</option>
                  }
                </select>
              </label>
              <fieldset class="field">
                <legend>¿A qué hora te acomoda?</legend>
                <div class="pills">
                  @for (t of times; track t) {
                    <button type="button" class="pill" [class.on]="time() === t" [attr.aria-pressed]="time() === t" (click)="time.set(t)">{{ t }}</button>
                  }
                </div>
              </fieldset>
              <button class="btn btn-primary submit" type="submit">
                Enviar por WhatsApp <span class="btn-icon"><app-icon name="send" [size]="15" /></span>
              </button>
              <p class="legal">Solo usamos tus datos para contactarte sobre tu clase.</p>
            </form>
          } @else {
            <div class="preview">
              <div class="chat-head"><span class="avatar">b</span><div><b>Brío Gimnasio</b><small>en línea</small></div></div>
              <div class="chat">
                <div class="bubble">
                  <pre>{{ message() }}</pre>
                  <span class="meta">ahora · ✓✓</span>
                </div>
              </div>
              <p class="hint">Así nos llega tu mensaje, con tus datos listos. Solo falta enviarlo.</p>
              <div class="actions">
                <a class="btn btn-primary" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp <span class="btn-icon"><app-icon name="arrow-up-right" [size]="15" /></span></a>
                <button type="button" class="btn btn-ghost" (click)="sent.set(false)">Editar datos</button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .contact { background: var(--bg-2); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
    .facts { list-style: none; padding: 0; margin: 32px 0 0; display: grid; gap: 18px; }
    .facts li { display: flex; gap: 14px; align-items: flex-start; }
    .facts b { display: block; }
    .facts small { color: var(--muted); }
    .ico { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: var(--surface); color: var(--brand); box-shadow: var(--shadow-sm); }
    .hours { display: grid; gap: 4px; width: 100%; max-width: 300px; }
    .hours span { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed var(--line); padding-bottom: 4px; }
    .map { position: relative; margin-top: 28px; height: 200px; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); }
    .map svg { width: 100%; height: 100%; }
    .pin { position: absolute; left: 44%; top: 40%; display: flex; flex-direction: column; align-items: center; animation: hop 2.4s var(--ease-out) infinite; }
    .pin span { margin-top: 4px; padding: 4px 10px; border-radius: 999px; background: var(--ink); color: #fff; font-size: 0.75rem; font-weight: 700; }
    @keyframes hop { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }

    .form-wrap { position: sticky; top: 110px; }
    .form, .preview { padding: clamp(24px, 4vw, 40px); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow); }
    .form h3 { font-size: 1.7rem; margin-bottom: 22px; }
    .field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 18px; border: 0; padding: 0; }
    .field > span, legend { font-weight: 650; font-size: 0.92rem; padding: 0; }
    input, select { min-height: 52px; padding: 0 16px; border-radius: 14px; border: 1.5px solid var(--line); background: var(--bg); font-size: 1rem; transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease; }
    input:focus, select:focus { outline: none; border-color: var(--brand); background: #fff; box-shadow: 0 0 0 4px var(--brand-soft); }
    input.invalid { border-color: #e5484d; }
    em { font-style: normal; color: #c62f34; font-size: 0.85rem; }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .pill { min-height: 44px; padding: 0 18px; border-radius: 999px; background: var(--bg); box-shadow: inset 0 0 0 1.5px var(--line); font-weight: 600; transition: background-color 250ms ease, color 250ms ease, box-shadow 250ms ease, transform 200ms var(--ease-out); }
    .pill:active { transform: scale(0.95); }
    .pill.on { background: var(--ink); color: #fff; box-shadow: none; }
    .submit { width: 100%; margin-top: 8px; }
    .legal { margin-top: 12px; text-align: center; font-size: 0.8rem; color: var(--muted); }

    .preview { animation: pop 500ms var(--ease-back); }
    @keyframes pop { from { opacity: 0; transform: scale(0.96) translateY(10px); } }
    .chat-head { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
    .chat-head small { display: block; color: var(--ok); font-size: 0.8rem; }
    .avatar { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--brand); color: #fff; font-family: var(--font-display); font-weight: 800; font-size: 1.3rem; }
    .chat { margin-top: 18px; padding: 18px; border-radius: 18px; background: #efeae2 radial-gradient(circle at 1px 1px, rgb(0 0 0 / 5%) 1px, transparent 0) 0 0 / 14px 14px; }
    .bubble { margin-left: auto; max-width: 92%; padding: 12px 14px 8px; border-radius: 14px 4px 14px 14px; background: #d9fdd3; box-shadow: 0 1px 1px rgb(0 0 0 / 8%); animation: pop 500ms var(--ease-back) 200ms both; }
    pre { margin: 0; font-family: var(--font-body); font-size: 0.92rem; white-space: pre-wrap; }
    .meta { display: block; text-align: right; font-size: 0.72rem; color: #53bdeb; margin-top: 4px; }
    .hint { margin-top: 16px; color: var(--muted); font-size: 0.92rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .form-wrap { position: static; }
    }
  `,
})
export class Contact {
  protected readonly booking = inject(Booking);
  protected readonly contact = CONTACT;
  protected readonly times = ['Mañana', 'Mediodía', 'Tarde', 'Noche'];

  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly time = signal('Tarde');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);

  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  protected readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length === 10);

  protected readonly options = computed(() => {
    const base = ['Clase de prueba gratis', ...PLANS.map((p) => `Plan ${p.name}`)];
    const classes = new Set(SCHEDULE.flatMap((d) => d.classes.map((c) => `${c.name} · ${d.day} ${c.time}`)));
    const current = this.booking.interest();
    return base.includes(current) || !classes.has(current) ? base : [current, ...base];
  });

  protected readonly message = computed(
    () =>
      `¡Hola, Brío! 👋\nSoy ${this.name().trim()}.\nMe interesa: ${this.booking.interest()}.\nHorario: ${this.time()}.\nMi WhatsApp: ${this.phone().replace(/\D/g, '')}`,
  );
  protected readonly link = computed(() => whatsappLink(this.message()));

  protected val(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.phoneOk()) this.sent.set(true);
  }
}
