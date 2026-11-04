import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CREDENTIALS, PROMISES, RATES, STORIES } from '../core/content';
import { Practice, money } from '../core/practice';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Sobre Valeria (formación y compromisos), tarifas e historias (anónimas, con permiso). */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section wrap" id="valeria">
      <div class="page grid">
        <figure class="portrait" data-reveal="photo">
          <img src="media/valeria.webp" srcset="media/valeria-sm.webp 820w, media/valeria.webp 1800w" sizes="(max-width: 900px) 100vw, 45vw" alt="Valeria Ríos, psicóloga, durante una sesión" width="1800" height="1200" loading="lazy" />
          <figcaption>Valeria Ríos · Psicóloga clínica</figcaption>
        </figure>
        <div class="copy">
          <p class="eyebrow" data-reveal>Sobre mí</p>
          <h2 class="h2" data-reveal [revealDelay]="100">Soy Valeria. <em>Te escucho con calma</em> y te digo las cosas claras.</h2>
          <p class="lead" data-reveal [revealDelay]="180">Llevo 9 años acompañando a personas con ansiedad, duelos y crisis de pareja. Trabajo con terapia cognitivo-conductual: entendemos qué te pasa y practicamos qué hacer distinto.</p>
          <ul class="creds" data-reveal [revealDelay]="240">
            @for (c of credentials; track c) {
              <li><app-icon name="check" [size]="18" /> {{ c }}</li>
            }
          </ul>
          <div class="promises">
            @for (p of promises; track p.t; let i = $index) {
              <div data-reveal [revealDelay]="300 + i * 80"><b>{{ p.t }}</b><p>{{ p.d }}</p></div>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="tarifas">
      <div class="page rates-grid">
        <div class="rates">
          <p class="eyebrow" data-reveal>Tarifas</p>
          <h2 class="h2" data-reveal [revealDelay]="100">Claras desde <em>el principio</em>.</h2>
          <ul data-reveal [revealDelay]="160">
            @for (r of rates; track r.name) {
              <li><span><b>{{ r.name }}</b><small>{{ r.note }}</small></span><span class="price">{{ money(r.price) }}</span></li>
            }
          </ul>
          <p class="social" data-reveal><app-icon name="heart" [size]="18" /> Si el costo es lo que te detiene, pregúntame por la tarifa solidaria. Nadie debería dejar de ir a terapia por dinero.</p>
          <p class="fine">Paquete de 4 sesiones con 10% de descuento. Factura disponible. Cancelaciones con 24 horas de anticipación sin costo.</p>
        </div>
        <div class="stories">
          <p class="eyebrow" data-reveal>Historias</p>
          @for (s of stories; track s.who; let i = $index) {
            <blockquote data-reveal [revealDelay]="i * 90">
              <p>“{{ s.text }}”</p>
              <footer>{{ s.who }}</footer>
            </blockquote>
          }
          <p class="fine">Compartidas con permiso. Nombres omitidos por confidencialidad.</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--mist-2); }
    .grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(30px, 6vw, 90px); align-items: center; }
    .portrait { position: relative; margin: 0; aspect-ratio: 4 / 5; border-radius: var(--radius-l); overflow: hidden; }
    .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 25% 40%; }
    figcaption { position: absolute; left: 16px; bottom: 16px; padding: 8px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 560; background: oklch(98.6% 0.006 100 / 0.85); backdrop-filter: blur(8px); }
    .copy { display: grid; gap: 18px; justify-items: start; }
    .creds { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 8px; }
    .creds li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.96rem; }
    .creds .icon { color: var(--moss); margin-top: 3px; }
    .promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-top: 12px; width: 100%; }
    .promises > div { padding: 18px; border-radius: var(--radius-m); background: var(--paper); }
    .promises b { display: block; margin-bottom: 6px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 420; }
    .promises p { font-size: 0.9rem; color: var(--forest-2); }
    .rates-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(30px, 6vw, 90px); }
    .rates { display: grid; gap: 16px; align-content: start; }
    .rates ul { list-style: none; margin: 14px 0 0; padding: 0; }
    .rates li { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line); }
    .rates li span:first-child { display: grid; }
    .rates b { font-weight: 560; }
    .rates small { color: var(--muted); font-size: 0.86rem; }
    .price { font-family: var(--font-display); font-size: 1.7rem; white-space: nowrap; }
    .social { display: flex; gap: 10px; align-items: flex-start; padding: 16px 18px; border-radius: var(--radius-m); background: var(--amber-soft); color: var(--forest); font-size: 0.95rem; }
    .social .icon { color: var(--amber-deep); margin-top: 3px; flex: none; }
    .fine { font-size: 0.82rem; color: var(--muted); }
    .stories { display: grid; gap: 18px; align-content: start; }
    blockquote { margin: 0; padding: 22px 0 0; border-top: 1px solid var(--line); }
    blockquote p { font-family: var(--font-display); font-style: italic; font-size: clamp(1.25rem, 2vw, 1.5rem); line-height: 1.35; }
    blockquote footer { margin-top: 8px; font-size: 0.86rem; color: var(--muted); }
    @media (max-width: 900px) {
      .grid, .rates-grid { grid-template-columns: 1fr; }
      .portrait { aspect-ratio: 4 / 4; }
      .promises { grid-template-columns: 1fr; }
    }
  `,
})
export class About {
  protected readonly practice = inject(Practice);
  protected readonly credentials = CREDENTIALS;
  protected readonly promises = PROMISES;
  protected readonly rates = RATES;
  protected readonly stories = STORIES;
  protected readonly money = money;
}
