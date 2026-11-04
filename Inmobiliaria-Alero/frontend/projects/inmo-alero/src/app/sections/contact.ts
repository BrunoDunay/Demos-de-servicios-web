import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CONTACT, PROPERTIES } from '../core/content';
import { Search, whatsappLink } from '../core/search';
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
          <h2 class="section-title" data-reveal [revealDelay]="80">Cuéntanos qué buscas y <em>te llamamos hoy</em>.</h2>
          <p class="section-lead" data-reveal [revealDelay]="140">Respondemos en menos de una hora en horario de oficina. Si ya viste una casa, la agendamos para esta semana.</p>
          <ul class="facts" data-reveal [revealDelay]="200">
            <li><span class="ico"><app-icon name="pin" /></span><div><b>{{ contact.address }}</b><small>{{ contact.city }}</small></div></li>
            <li><span class="ico"><app-icon name="phone" /></span><div><b>{{ contact.phone }}</b><small>Oficina y WhatsApp</small></div></li>
            <li><span class="ico"><app-icon name="mail" /></span><div><b>{{ contact.email }}</b><small>Para enviar documentos</small></div></li>
            <li>
              <span class="ico"><app-icon name="clock" /></span>
              <div class="hours">
                @for (h of contact.hours; track h.days) {
                  <span><small>{{ h.days }}</small><b>{{ h.time }}</b></span>
                }
              </div>
            </li>
          </ul>
        </div>

        <div class="form-wrap" data-reveal="right" [revealDelay]="120">
          @if (!sent()) {
            <form class="form" (submit)="submit($event)" novalidate>
              <fieldset class="field">
                <legend>¿Qué necesitas?</legend>
                <div class="pills">
                  @for (o of intents; track o) {
                    <button type="button" class="pill" [class.on]="search.intent() === o" [attr.aria-pressed]="search.intent() === o" (click)="search.intent.set(o)">{{ o }}</button>
                  }
                </div>
              </fieldset>
              @if (search.intent() !== 'Quiero vender') {
                <label class="field">
                  <span>Propiedad de interés <small>(opcional)</small></span>
                  <select [value]="search.property()" (change)="search.property.set(val($event))">
                    <option value="" [selected]="!search.property()">Aún no elijo, quiero opciones</option>
                    @for (p of properties; track p.id) {
                      <option [value]="p.id + ' · ' + p.title" [selected]="search.property() === p.id + ' · ' + p.title">{{ p.id }} · {{ p.title }}</option>
                    }
                  </select>
                </label>
              } @else {
                <label class="field">
                  <span>¿Dónde está tu casa?</span>
                  <input name="colonia" placeholder="Colonia o fraccionamiento" [value]="area()" (input)="area.set(val($event))" />
                </label>
              }
              <div class="two">
                <label class="field">
                  <span>Nombre</span>
                  <input name="nombre" autocomplete="name" placeholder="Tu nombre" [value]="name()" (input)="name.set(val($event))" [class.invalid]="tried() && !nameOk()" />
                  @if (tried() && !nameOk()) { <em class="err">Escribe tu nombre.</em> }
                </label>
                <label class="field">
                  <span>WhatsApp</span>
                  <input name="telefono" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10 dígitos" [value]="phone()" (input)="phone.set(val($event))" [class.invalid]="tried() && !phoneOk()" />
                  @if (tried() && !phoneOk()) { <em class="err">Revisa que sean 10 dígitos.</em> }
                </label>
              </div>
              <fieldset class="field">
                <legend>¿Cuándo te llamamos?</legend>
                <div class="pills">
                  @for (t of times; track t) {
                    <button type="button" class="pill" [class.on]="time() === t" [attr.aria-pressed]="time() === t" (click)="time.set(t)">{{ t }}</button>
                  }
                </div>
              </fieldset>
              <button class="btn btn-brass submit" type="submit">Enviar por WhatsApp <span class="arrow"><app-icon name="send" [size]="16" /></span></button>
              <p class="legal">Usamos tus datos solo para darte seguimiento. Sin spam.</p>
            </form>
          } @else {
            <div class="preview">
              <div class="chat-head"><span class="avatar"><svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><path d="M6 25 24 10l18 15" fill="none" stroke="#C49A55" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M12 22v15h24V22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg></span><div><b>Alero Bienes Raíces</b><small>en línea</small></div></div>
              <div class="chat"><div class="bubble"><pre>{{ message() }}</pre><span class="meta">ahora · ✓✓</span></div></div>
              <p class="hint">Así nos llega tu mensaje. Solo falta enviarlo y una asesora te contesta.</p>
              <div class="actions">
                <a class="btn btn-brass" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp <span class="arrow"><app-icon name="arrow-up-right" [size]="16" /></span></a>
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
    .grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
    .facts { list-style: none; padding: 0; margin: 32px 0 0; display: grid; gap: 18px; }
    .facts li { display: flex; gap: 14px; align-items: flex-start; }
    .facts b { display: block; }
    .facts small { color: var(--muted); }
    .ico { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--paper); color: var(--pine); box-shadow: var(--shadow-sm); }
    .hours { display: grid; gap: 4px; width: 100%; max-width: 300px; }
    .hours span { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed var(--line); padding-bottom: 4px; }
    .form-wrap { position: sticky; top: 100px; }
    .form, .preview { padding: clamp(24px, 4vw, 38px); border-radius: var(--radius-lg); background: var(--paper); box-shadow: var(--shadow); }
    .field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 18px; border: 0; padding: 0; min-width: 0; }
    .field > span, legend { font-weight: 650; font-size: 0.9rem; padding: 0; }
    .field small { color: var(--muted); font-weight: 500; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
    input, select { min-height: 50px; padding: 0 14px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--bg); font-size: 1rem; width: 100%; transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease; }
    input:focus, select:focus { outline: none; border-color: var(--pine-2); background: #fff; box-shadow: 0 0 0 4px var(--pine-soft); }
    input.invalid { border-color: #c8443a; }
    .err { font-style: normal; color: #b13a31; font-size: 0.84rem; }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .pill { min-height: 42px; padding: 0 16px; border-radius: 10px; background: var(--bg); box-shadow: inset 0 0 0 1.5px var(--line); font-weight: 600; font-size: 0.9rem; transition: background-color 250ms ease, color 250ms ease, box-shadow 250ms ease, transform 200ms var(--ease-out); }
    .pill:active { transform: scale(0.96); }
    .pill.on { background: var(--pine); color: #fff; box-shadow: none; }
    .submit { width: 100%; margin-top: 6px; }
    .legal { margin-top: 12px; text-align: center; font-size: 0.8rem; color: var(--muted); }
    .preview { animation: pop 500ms var(--ease-back); }
    @keyframes pop { from { opacity: 0; transform: scale(0.96) translateY(10px); } }
    .chat-head { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
    .chat-head small { display: block; color: var(--ok); font-size: 0.8rem; }
    .avatar { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: var(--pine); }
    .chat { margin-top: 18px; padding: 18px; border-radius: 18px; background: #efeae2 radial-gradient(circle at 1px 1px, rgb(0 0 0 / 5%) 1px, transparent 0) 0 0 / 14px 14px; }
    .bubble { margin-left: auto; max-width: 94%; padding: 12px 14px 8px; border-radius: 14px 4px 14px 14px; background: #d9fdd3; box-shadow: 0 1px 1px rgb(0 0 0 / 8%); animation: pop 500ms var(--ease-back) 200ms both; }
    pre { margin: 0; font-family: var(--font-body); font-size: 0.92rem; white-space: pre-wrap; }
    .meta { display: block; text-align: right; font-size: 0.72rem; color: #53bdeb; margin-top: 4px; }
    .hint { margin-top: 16px; color: var(--muted); font-size: 0.92rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .form-wrap { position: static; } }
    @media (max-width: 480px) { .two { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  protected readonly search = inject(Search);
  protected readonly contact = CONTACT;
  protected readonly properties = PROPERTIES;
  protected readonly intents = ['Quiero comprar', 'Quiero rentar', 'Quiero vender', 'Asesoría de crédito'];
  protected readonly times = ['Mañana', 'Tarde', 'Cuando sea'];
  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly area = signal('');
  protected readonly time = signal('Tarde');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  protected readonly phoneOk = computed(() => this.phone().replace(/\D/g, '').length === 10);

  protected readonly message = computed(() => {
    const intent = this.search.intent();
    const detail =
      intent === 'Quiero vender'
        ? this.area().trim()
          ? `\nMi casa está en: ${this.area().trim()}.`
          : ''
        : this.search.property()
          ? `\nMe interesa: ${this.search.property()}.`
          : '\nTodavía no elijo propiedad; me gustaría ver opciones.';
    return `¡Hola, Alero! 🏡\nSoy ${this.name().trim()}. ${intent}.${detail}\nPrefiero que me llamen: ${this.time().toLowerCase()}.\nMi WhatsApp: ${this.phone().replace(/\D/g, '')}`;
  });
  protected readonly link = computed(() => whatsappLink(this.message()));

  protected val(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.phoneOk()) this.sent.set(true);
  }
}
