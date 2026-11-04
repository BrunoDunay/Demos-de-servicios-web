import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CONTACT, DISCIPLINES, LEVELS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="contact" id="contacto">
      <video class="bg" autoplay muted loop playsinline preload="none" poster="media/suelo-poster.jpg" aria-hidden="true">
        <source src="media/suelo.mp4" type="video/mp4" />
      </video>
      <div class="veil"></div>
      <div class="container layout">
        <div class="copy">
          <span class="tag" data-reveal>Primera clase</span>
          <h2 class="title-xl" data-reveal [revealDelay]="80">Tu primera<br />clase es <span class="ember">gratis.</span></h2>
          <p class="lead" data-reveal [revealDelay]="160">Llega 10 minutos antes, con ropa cómoda y agua. Nosotros ponemos el resto: coach, calentamiento y una comunidad que te va a recibir con un choque de manos.</p>
          <ul class="facts" data-reveal [revealDelay]="220">
            <li><app-icon name="pin" [size]="18" />{{ contact.address }}, {{ contact.city }}</li>
            <li><app-icon name="phone" [size]="18" />{{ contact.phone }}</li>
            @for (h of contact.hours; track h.days) {
              <li><app-icon name="clock" [size]="18" /><b>{{ h.days }}</b> {{ h.time }}</li>
            }
          </ul>
        </div>

        <div class="card" data-reveal="right" [revealDelay]="120">
          @if (!sent()) {
            <form (submit)="submit($event)" novalidate>
              <div class="row2">
                <label class="field">
                  <span>Nombre</span>
                  <input name="nombre" autocomplete="given-name" [value]="name()" (input)="name.set(val($event))" [class.bad]="tried() && !nameOk()" placeholder="Tu nombre" />
                </label>
                <label class="field">
                  <span>WhatsApp</span>
                  <input name="whatsapp" type="tel" inputmode="numeric" autocomplete="tel" [value]="phone()" (input)="phone.set(val($event))" [class.bad]="tried() && !phoneOk()" placeholder="10 dígitos" />
                </label>
              </div>
              @if (tried() && (!nameOk() || !phoneOk())) {
                <p class="err">Revisa tu nombre y que el WhatsApp tenga 10 dígitos.</p>
              }
              <fieldset class="field">
                <legend>¿Cómo vienes?</legend>
                <div class="chips">
                  @for (l of levels; track l) {
                    <button type="button" class="chip" [class.on]="level() === l" [attr.aria-pressed]="level() === l" (click)="level.set(l)">{{ l }}</button>
                  }
                </div>
              </fieldset>
              <label class="field">
                <span>Clase que quieres probar</span>
                <select name="clase" (change)="discipline.set(val($event))">
                  @for (d of disciplines; track d.name) {
                    <option [value]="d.name" [selected]="discipline() === d.name">{{ d.name }}</option>
                  }
                </select>
              </label>
              <button class="btn submit" type="submit" data-cursor="ENVIAR">Apartar mi clase <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></button>
            </form>
          } @else {
            <div class="preview">
              <span class="tag">Así nos llega tu mensaje</span>
              <div class="chat">
                <div class="bubble"><pre>{{ message() }}</pre><small>ahora ✓✓</small></div>
              </div>
              <div class="actions">
                <a class="btn" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp <span class="arrow"><app-icon name="arrow-up-right" [size]="18" /></span></a>
                <button type="button" class="btn btn-ghost" (click)="sent.set(false)">Editar</button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .contact { position: relative; padding: var(--section) 0; overflow: hidden; isolation: isolate; }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; opacity: 0.5; }
    .veil { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgb(11 11 12 / 95%) 30%, rgb(11 11 12 / 70%)); }
    .layout { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(32px, 5vw, 80px); align-items: center; }
    .title-xl { margin-top: 18px; }
    .lead { margin-top: 22px; }
    .facts { list-style: none; margin: 30px 0 0; padding: 0; display: grid; gap: 10px; }
    .facts li { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-2); }
    .facts app-icon { color: var(--ember); }
    .facts b { font-weight: 600; color: var(--ink); min-width: 90px; }
    .card { padding: clamp(24px, 3.5vw, 40px); background: rgb(18 18 20 / 92%); border: 1px solid var(--line-2); backdrop-filter: blur(10px); clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%); }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 18px; padding: 0; border: 0; }
    .field > span, legend { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); padding: 0; }
    input, select { min-height: 52px; padding: 0 14px; background: var(--bg); border: 1px solid var(--line-2); border-radius: 0; color: var(--ink); font-size: 1rem; transition: border-color 200ms ease, box-shadow 200ms ease; }
    input:focus, select:focus { outline: none; border-color: var(--ember); box-shadow: 0 0 0 3px rgb(255 91 20 / 20%); }
    input.bad { border-color: #ff4d4d; }
    .err { margin: -6px 0 14px; color: #ff7b6b; font-size: 0.85rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .chip { min-height: 44px; padding: 0 14px; border: 1px solid var(--line-2); font-size: 0.85rem; font-weight: 600; transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 160ms var(--ease-out); }
    .chip:active { transform: scale(0.95); }
    .chip.on { background: var(--ember); border-color: var(--ember); color: var(--bg); }
    .submit { width: 100%; margin-top: 6px; }
    .preview { animation: in 600ms var(--ease-expo) both; }
    @keyframes in { from { opacity: 0; transform: translateY(16px); } }
    .chat { margin-top: 16px; padding: 18px; background: #0d1418; border: 1px solid var(--line); }
    .bubble { margin-left: auto; max-width: 94%; padding: 12px 14px 6px; background: #005c4b; border-radius: 10px 2px 10px 10px; animation: in 600ms var(--ease-expo) 200ms both; }
    pre { margin: 0; white-space: pre-wrap; font-family: var(--font-body); font-size: 0.92rem; color: #e9edef; }
    .bubble small { display: block; text-align: right; color: #8ac7ff; font-size: 0.7rem; margin-top: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
    @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } .veil { background: rgb(11 11 12 / 88%); } }
    @media (max-width: 520px) { .row2 { grid-template-columns: 1fr; gap: 0; } }
  `,
})
export class Contact {
  protected readonly contact = CONTACT;
  protected readonly levels = LEVELS;
  protected readonly disciplines = DISCIPLINES;
  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly level = signal(LEVELS[0]);
  protected readonly discipline = signal(DISCIPLINES[0].name);
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  protected readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length === 10);
  protected readonly message = computed(
    () =>
      `¡Qué onda, Forja! 🔥\nSoy ${this.name().trim()} y quiero mi clase de prueba.\nClase: ${this.discipline()}\nNivel: ${this.level()}\nMi WhatsApp: ${this.phone().replace(/\D/g, '')}`,
  );
  protected readonly link = computed(() => `https://wa.me/?text=${encodeURIComponent(this.message())}`);

  protected val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.phoneOk()) this.sent.set(true);
  }
}
