import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { CONTACT } from '../core/content';
import { openStatus } from '../core/order';
import { Reveal } from '../shared/reveal';

/** La puerta del café: el horario rotulado en el vidrio y cómo llegar. */
@Component({
  selector: 'app-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section visit" id="visita">
      <div class="container grid">
        <div class="door" data-reveal role="img" [attr.aria-label]="'Puerta de Tilde con el horario: ' + hoursText">
          <div class="glass">
            <p class="vinyl-name">Tilde</p>
            <p class="vinyl-sub">café · pan · desayunos</p>
            <ul class="vinyl-hours">
              @for (h of contact.hours; track h.days; let i = $index) {
                <li [class.today]="today() === i"><span>{{ h.days }}</span><span>{{ h.time }}</span></li>
              }
            </ul>
            <p class="push">empuje</p>
          </div>
          <span class="handle" aria-hidden="true"></span>
        </div>

        <div class="copy">
          <span class="tag" data-reveal>Visítanos</span>
          <h2 class="title" data-reveal [revealDelay]="60">Fresno 27, a media cuadra del jardín.</h2>
          <p class="state" data-reveal [revealDelay]="100" [class.closed]="!status().open">
            <span class="dot" aria-hidden="true"></span>{{ status().open ? 'Abierto ahora.' : 'Cerrado ahora.' }} {{ status().line }}.
          </p>
          <p class="body" data-reveal [revealDelay]="140">
            Si vienes del centro, camina por Madero hacia el jardín de la Purísima y da vuelta en Fresno. Hay lugar para bicis en la entrada y estacionamiento en la calle después de las 7 de la noche.
          </p>
          <dl class="facts" data-reveal [revealDelay]="180">
            <div><dt>Dirección</dt><dd>{{ contact.address }}, {{ contact.city }}</dd></div>
            <div><dt>Teléfono</dt><dd>{{ contact.phone }}</dd></div>
            <div><dt>Instagram</dt><dd><a class="link" href="#">{{ '@' + contact.instagram }}</a></dd></div>
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .visit { background: var(--cafe); color: var(--crema); }
    .grid { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: clamp(40px, 7vw, 110px); align-items: center; }
    .door { position: relative; aspect-ratio: 5 / 9; max-width: 340px; width: 100%; margin-inline: auto; padding: 18px; border-radius: 160px 160px 10px 10px; background: oklch(42% 0.06 55); box-shadow: inset 0 0 0 6px oklch(34% 0.05 50); }
    .glass {
      height: 100%; border-radius: 142px 142px 4px 4px; padding: 64px 26px 26px; display: flex; flex-direction: column; align-items: center; text-align: center;
      background: linear-gradient(160deg, oklch(36% 0.03 200 / 90%), oklch(24% 0.03 220) 55%, oklch(30% 0.03 200)); color: var(--leche);
      box-shadow: inset 0 0 0 2px oklch(60% 0.03 200 / 30%);
    }
    .vinyl-name { font-family: var(--font-display); font-size: 3.4rem; line-height: 1; }
    .vinyl-sub { margin-top: 6px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.85; }
    .vinyl-hours { list-style: none; margin: 34px 0 0; padding: 0; width: 100%; display: grid; gap: 8px; font-size: 0.9rem; font-weight: 700; }
    .vinyl-hours li { display: flex; justify-content: space-between; gap: 10px; padding: 6px 10px; border-radius: 8px; }
    .vinyl-hours li.today { background: var(--mantequilla); color: var(--cafe); }
    .push { margin-top: auto; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.6; }
    .handle { position: absolute; right: 32px; top: 52%; width: 10px; height: 70px; border-radius: 6px; background: var(--mantequilla); box-shadow: 0 4px 0 var(--mantequilla-hondo); }
    .tag { color: var(--mantequilla); }
    .title { margin-top: 14px; font-size: clamp(2.3rem, 4.6vw, 3.8rem); max-width: 16ch; color: var(--leche); }
    .state { display: flex; align-items: center; gap: 10px; margin-top: 22px; font-weight: 800; font-size: 1.1rem; color: var(--menta); }
    .state.closed { color: var(--crema-2); }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: currentColor; }
    .body { margin-top: 16px; max-width: 48ch; font-size: 1.08rem; opacity: 0.9; }
    .facts { margin: 30px 0 0; display: grid; gap: 14px; }
    .facts div { display: grid; grid-template-columns: 110px 1fr; gap: 16px; padding-top: 14px; border-top: 1px solid color-mix(in oklch, var(--crema) 18%, transparent); }
    dt { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.6; padding-top: 3px; }
    dd { margin: 0; font-weight: 600; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .door { max-width: 280px; } }
  `,
})
export class Visit {
  protected readonly contact = CONTACT;
  protected readonly hoursText = CONTACT.hours.map((h) => `${h.days} ${h.time}`).join(', ');
  protected readonly status = signal({ open: true, line: 'Abrimos los siete días' });
  protected readonly today = signal(-1);

  constructor() {
    afterNextRender(() => {
      this.status.set(openStatus());
      const d = new Date().getDay();
      this.today.set(CONTACT.hours.findIndex((h) => h.from.includes(d)));
    });
  }
}
