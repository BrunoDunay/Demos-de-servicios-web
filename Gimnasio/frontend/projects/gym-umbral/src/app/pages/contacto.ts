import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CONTACT, DISCIPLINES, INTERESTS } from '../core/content';
import { Faq } from '../sections/faq';
import { Icon } from '../shared/icon';
import { DoorHero } from '../sections/door-hero';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';
import { ChipGroup } from '../shared/chip-group';

@Component({
  selector: 'app-contacto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DoorHero, Faq, Icon, SplitLines, Reveal, ChipGroup],
  template: `
    <app-door-hero />

    <section class="section contact">
      <div class="container grid">
        <div class="info">
          <span class="label" data-reveal>Visítanos</span>
          <h2 class="h2" splitLines>Te esperamos con <em class="gold">toalla y café.</em></h2>
          <ul class="cards">
            <li data-reveal><app-icon name="pin" [size]="22" /><div><b>{{ contact.address }}</b><span>{{ contact.city }}</span></div></li>
            <li data-reveal [revealDelay]="80"><app-icon name="phone" [size]="22" /><div><b>{{ contact.phone }}</b><span>Llamadas y WhatsApp</span></div></li>
            <li data-reveal [revealDelay]="160"><app-icon name="mail" [size]="22" /><div><b>{{ contact.email }}</b><span>Respondemos en menos de 1 hora</span></div></li>
            <li data-reveal [revealDelay]="240">
              <app-icon name="clock" [size]="22" />
              <div>
                @for (h of contact.hours; track h.days) {
                  <b>{{ h.time }}</b><span>{{ h.days }}</span>
                }
              </div>
            </li>
          </ul>
          <div class="map" data-reveal="clip" role="img" aria-label="Mapa ilustrado de la ubicación de Umbral">
            <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="600" height="300" fill="#15130f" />
              <g stroke="#2a261f" stroke-width="1">
                @for (x of grid; track x) { <line [attr.x1]="x" y1="0" [attr.x2]="x" y2="300" /> }
                @for (y of grid; track y) { <line x1="0" [attr.y1]="y" x2="600" [attr.y2]="y" /> }
              </g>
              <path d="M-20 210 C 120 190, 220 120, 360 140 S 560 90, 640 60" stroke="#3a3328" stroke-width="18" fill="none" />
              <path d="M180 -20 L 260 320" stroke="#2f2a22" stroke-width="10" />
              <path d="M420 -20 L 380 320" stroke="#2f2a22" stroke-width="8" />
              <rect x="440" y="180" width="110" height="70" rx="10" fill="#1f2a1d" />
              <text x="452" y="220" fill="#6c7d5f" font-size="11" letter-spacing="1">PARQUE</text>
              <text x="40" y="196" fill="#6f665a" font-size="10" letter-spacing="2">AV. DE LAS JACARANDAS</text>
            </svg>
            <div class="pin"><span class="pulse"></span><svg viewBox="0 0 40 48"><path d="M8 44V18a12 12 0 0 1 24 0v26" fill="none" stroke="#d8b98a" stroke-width="2.4" stroke-linecap="round" /><path d="M20 13v31" stroke="#f3d5a1" stroke-width="2" stroke-linecap="round" /></svg></div>
          </div>
        </div>

        <div class="form-wrap" id="reserva" data-reveal>
          @if (!sent()) {
            <form (submit)="submit($event)" novalidate>
              <h3>Reserva tu <em class="gold">cortesía</em></h3>
              <div class="row">
                <label class="field">
                  <input name="nombre" autocomplete="name" placeholder=" " [value]="name()" (input)="name.set(val($event))" [class.bad]="tried() && !nameOk()" />
                  <span>Nombre</span>
                </label>
                <label class="field">
                  <input name="whatsapp" type="tel" inputmode="numeric" autocomplete="tel" placeholder=" " [value]="phone()" (input)="phone.set(val($event))" [class.bad]="tried() && !phoneOk()" />
                  <span>WhatsApp (10 dígitos)</span>
                </label>
              </div>
              @if (tried() && (!nameOk() || !phoneOk())) {
                <p class="err">Revisa tu nombre y que el WhatsApp tenga 10 dígitos.</p>
              }
              <label class="field select">
                <select name="interes" (change)="interest.set(val($event))">
                  @for (o of interests(); track o) {
                    <option [value]="o" [selected]="o === interest()">{{ o }}</option>
                  }
                </select>
                <span>Me interesa</span>
              </label>
              <fieldset>
                <legend>Disciplina</legend>
                <div class="chips" chipGroup>
                  @for (d of disciplineNames; track d) {
                    <button type="button" [class.on]="discipline() === d" [attr.aria-pressed]="discipline() === d" (click)="discipline.set(d)">{{ d }}</button>
                  }
                </div>
              </fieldset>
              <fieldset>
                <legend>Horario preferido</legend>
                <div class="chips" chipGroup>
                  @for (t of times; track t) {
                    <button type="button" [class.on]="time() === t" [attr.aria-pressed]="time() === t" (click)="time.set(t)">{{ t }}</button>
                  }
                </div>
              </fieldset>
              @if (classPicked()) {
                <p class="picked"><app-icon name="sparkle" [size]="14" /> Clase elegida: <b>{{ classPicked() }}</b></p>
              }
              <button class="btn btn-solid submit" type="submit" data-cursor="ENVIAR">Enviar por WhatsApp <span class="arrow"><app-icon name="send" [size]="16" /></span></button>
              <p class="legal">Usamos tus datos solo para contactarte. Consulta el aviso de privacidad.</p>
            </form>
          } @else {
            <div class="preview">
              <span class="label">Así nos llega tu mensaje</span>
              <div class="chat">
                <div class="chat-head"><span class="av"><svg viewBox="0 0 40 48"><path d="M8 44V18a12 12 0 0 1 24 0v26" fill="none" stroke="#0d0c0a" stroke-width="3" stroke-linecap="round" /></svg></span><div><b>Umbral</b><small>en línea</small></div></div>
                <div class="bubble"><pre>{{ message() }}</pre><small>ahora ✓✓</small></div>
              </div>
              <div class="actions">
                <a class="btn btn-solid" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp <span class="arrow"><app-icon name="arrow-up-right" [size]="16" /></span></a>
                <button type="button" class="btn btn-quiet" (click)="sent.set(false)">Editar</button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section faq-sec">
      <div class="container faq-grid">
        <div>
          <span class="label" data-reveal>Preguntas frecuentes</span>
          <h2 class="h2" splitLines>Todo lo que <em class="gold">quieres saber.</em></h2>
        </div>
        <app-faq />
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 100px); align-items: start; }
    .h2 { margin-top: 20px; }
    .cards { list-style: none; padding: 0; margin: 40px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
    .cards li { display: flex; gap: 16px; padding: 24px; background: var(--bg); align-items: flex-start; transition: background-color 500ms ease; }
    @media (hover: hover) and (pointer: fine) { .cards li:hover { background: var(--bg-2); } }
    .cards app-icon { color: var(--gold); }
    .cards b { display: block; font-weight: 500; }
    .cards span { display: block; font-size: 0.82rem; color: var(--muted); margin-bottom: 6px; }
    .map { position: relative; margin-top: 18px; aspect-ratio: 2 / 1; overflow: hidden; }
    .map > svg { width: 100%; height: 100%; }
    .pin { position: absolute; left: 50%; top: 42%; width: 44px; height: 52px; margin: -26px 0 0 -22px; }
    .pin svg { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 0 10px rgb(243 213 161 / 60%)); }
    .pulse { position: absolute; left: 50%; bottom: 0; width: 80px; height: 30px; margin-left: -40px; border-radius: 50%; border: 1px solid var(--gold); animation: pulse 2.6s ease-out infinite; }
    @keyframes pulse { from { transform: scale(0.3); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }

    .form-wrap { position: sticky; top: 110px; }
    form, .preview { padding: clamp(28px, 4vw, 48px); background: var(--bg-2); box-shadow: inset 0 0 0 1px var(--line); }
    form h3 { font-size: 2.6rem; margin-bottom: 30px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { position: relative; display: block; margin-bottom: 22px; }
    .field input, .field select { width: 100%; min-height: 58px; padding: 22px 0 8px; background: transparent; border: 0; border-bottom: 1px solid var(--line-2); border-radius: 0; font-size: 1rem; color: var(--ink); appearance: none; transition: border-color 400ms ease; }
    .field select option { background: var(--bg-2); }
    .field span { position: absolute; left: 0; top: 20px; font-size: 0.9rem; color: var(--muted); pointer-events: none; transform-origin: left; transition: transform 500ms var(--ease-out), color 400ms ease; }
    .field input:focus, .field select:focus { outline: none; border-color: var(--gold); }
    .field input:focus + span, .field input:not(:placeholder-shown) + span, .field.select span { transform: translateY(-18px) scale(0.78); color: var(--gold); }
    .field input.bad { border-color: #d9826b; }
    .err { margin: -8px 0 16px; color: #e0957f; font-size: 0.85rem; }
    fieldset { border: 0; padding: 0; margin: 0 0 22px; }
    legend { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
    /* Opciones con el diseño de los botones del sitio; el fondo dorado se desliza (chipGroup). */
    .chips { position: relative; display: flex; flex-wrap: wrap; gap: 8px; }
    .chips button { position: relative; z-index: 1; isolation: isolate; overflow: hidden; min-height: 44px; padding: 0 18px; border-radius: 2px; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-2); box-shadow: inset 0 0 0 1px var(--line-2); transition: color 450ms ease, box-shadow 450ms ease, transform 200ms var(--ease-out); -webkit-tap-highlight-color: transparent; }
    .chips button::before { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(105deg, transparent 30%, rgb(255 236 204 / 22%) 48%, rgb(255 236 204 / 40%) 50%, transparent 68%); transform: translateX(-120%); pointer-events: none; }
    .chips button:active { transform: scale(0.96); }
    .chips button.on { color: #1a1510; box-shadow: inset 0 0 0 1px transparent; transition-delay: 120ms; }
    .chips button.on::before { animation: chip-shine 1s 260ms var(--ease-out) both; }
    @keyframes chip-shine { from { transform: translateX(-120%); } to { transform: translateX(120%); } }
    @media (hover: hover) and (pointer: fine) {
      .chips button:not(.on):hover { color: var(--ink); box-shadow: inset 0 0 0 1px var(--gold); background-color: rgb(216 185 138 / 7%); }
      .chips button:not(.on):hover::before { transform: translateX(120%); transition: transform 900ms var(--ease-out); }
    }
    .picked { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; font-size: 0.9rem; color: var(--ink-2); }
    .picked app-icon { color: var(--gold); }
    .submit { width: 100%; }
    .legal { margin-top: 14px; font-size: 0.78rem; color: var(--muted); text-align: center; }
    .preview { animation: in 800ms var(--ease-out) both; }
    @keyframes in { from { opacity: 0; transform: translateY(18px); } }
    .chat { margin-top: 18px; background: #0b1013; box-shadow: inset 0 0 0 1px var(--line); }
    .chat-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #141c20; }
    .chat-head small { display: block; font-size: 0.74rem; color: #6fc48f; }
    .av { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--gold); }
    .av svg { width: 18px; height: 22px; }
    .bubble { margin: 20px 16px 20px auto; max-width: 88%; padding: 12px 14px 6px; border-radius: 12px 2px 12px 12px; background: #005c4b; animation: in 700ms var(--ease-out) 250ms both; }
    pre { margin: 0; white-space: pre-wrap; font-family: var(--font-body); font-size: 0.92rem; color: #e9edef; }
    .bubble small { display: block; text-align: right; font-size: 0.7rem; color: #8ac7ff; margin-top: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
    .faq-sec { background: var(--bg-2); }
    .faq-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(32px, 6vw, 100px); align-items: start; }
    @media (max-width: 960px) {
      .grid, .faq-grid { grid-template-columns: 1fr; }
      .form-wrap { position: static; }
    }
    @media (max-width: 560px) { .row, .cards { grid-template-columns: 1fr; } }
  `,
})
export default class Contacto {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  protected readonly contact = CONTACT;
  protected readonly grid = Array.from({ length: 13 }, (_, i) => i * 50);
  protected readonly disciplineNames = [...new Set([...DISCIPLINES.map((d) => d.name), 'Movilidad'])];
  protected readonly times = ['Mañana', 'Mediodía', 'Tarde', 'Noche'];

  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly interest = signal(this.route.snapshot.queryParamMap.get('interes') ?? INTERESTS[0]);
  protected readonly discipline = signal(this.guessDiscipline(this.route.snapshot.queryParamMap.get('clase')));
  protected readonly time = signal('Tarde');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly classPicked = computed(() => this.params().get('clase'));
  protected readonly interests = computed(() => (INTERESTS.includes(this.interest()) ? INTERESTS : [this.interest(), ...INTERESTS]));
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  protected readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length === 10);
  protected readonly message = computed(() => {
    const lines = [`Hola, Umbral ✨`, `Soy ${this.name().trim()}.`, `Me interesa: ${this.interest()}.`, `Disciplina: ${this.discipline()}.`];
    if (this.classPicked()) lines.push(`Clase: ${this.classPicked()}.`);
    lines.push(`Horario preferido: ${this.time()}.`, `Mi WhatsApp: ${this.phone().replace(/\D/g, '')}`);
    return lines.join('\n');
  });
  protected readonly link = computed(() => `https://wa.me/?text=${encodeURIComponent(this.message())}`);

  private guessDiscipline(clase: string | null) {
    const found = clase && this.disciplineNames.find((d) => clase.toLowerCase().includes(d.toLowerCase()));
    return found || 'Reformer';
  }

  protected val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.phoneOk()) this.sent.set(true);
  }
}
