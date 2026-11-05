import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CREDENTIALS, PROMISES, RATES, STORIES } from '../core/content';
import { torn } from '../core/doodles';
import { Practice, money } from '../core/practice';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';

/**
 * Sobre mí: foto en un arco verde salvia con la firma a mano; la formación se palomea sola al aparecer
 * (transitions.dev "Checkbox check": la caja se llena y la palomita se dibuja). Tarifas en un recibo con
 * orilla dentada y un interruptor de paquete que rebota; historias en tiras de papel rasgado.
 */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Tilt],
  template: `
    <section class="section wrap" id="psicologa">
      <div class="page grid">
        <figure class="portrait" data-reveal="photo">
          <div class="arch"><img src="media/psicologa.webp" srcset="media/psicologa-sm.webp 820w, media/psicologa.webp 1800w" sizes="(max-width: 900px) 90vw, 40vw" alt="Lucía Arenas, psicóloga, durante una sesión" width="1800" height="1200" loading="lazy" /></div>
          <figcaption class="hand">Lucía <svg viewBox="0 0 160 20" aria-hidden="true"><path pathLength="1" d="M4 12 C 40 4, 90 18, 156 6" /></svg></figcaption>
        </figure>
        <div class="copy">
          <p class="kicker" data-reveal>Sobre mí</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Te escucho con calma <span class="peach">y te digo las cosas claras.</span></h2>
          <p class="lead" data-reveal [revealDelay]="160">Llevo 9 años acompañando a personas con ansiedad, duelos y crisis de pareja. Trabajo con terapia cognitivo-conductual: entendemos qué te pasa y practicamos qué hacer distinto.</p>
          <ul class="creds">
            @for (c of credentials; track c; let i = $index) {
              <li data-reveal [revealDelay]="200 + i * 120">
                <span class="box" [style.--d]="(400 + i * 160) + 'ms'"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength="1" /></svg></span>
                {{ c }}
              </li>
            }
          </ul>
          <div class="promises">
            @for (p of promises; track p.t; let i = $index) {
              <div class="index" [style.--r]="['-1.5deg', '1deg', '-0.6deg'][i]" data-reveal [revealDelay]="300 + i * 90"><b>{{ p.t }}</b><p>{{ p.d }}</p></div>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="tarifas">
      <div class="page rates-grid">
        <div class="rates-col">
          <p class="kicker" data-reveal>Tarifas</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Claras desde <span class="sage">el principio.</span></h2>
          <div tilt="6" data-reveal [revealDelay]="140">
            <div class="receipt t-tilt-card">
              <p class="r-head"><b>claro · psicología</b><span>recibo de ejemplo</span></p>
              <ul>
                @for (r of rates; track r.name) {
                  <li><span><b>{{ r.name }}</b><small>{{ r.note }}</small></span><i class="dots"></i><span class="price">@for (c of priceChars(r.price); track $index + c + pack()) {<em class="t-pop" [style.animation-delay.ms]="$index * 35">{{ c }}</em>}</span></li>
                }
              </ul>
              <button type="button" class="toggle" role="switch" [attr.aria-checked]="pack()" [class.is-init]="touched()" [attr.data-on]="pack()" (click)="flipPack()">
                <span class="track"><span class="thumb"></span></span>
                Paquete de 4 sesiones (10% menos)
              </button>
              <p class="solidaria hand">¿el costo te detiene? pregúntame por la tarifa solidaria ♡</p>
            </div>
          </div>
        </div>
        <div class="stories">
          <p class="kicker" data-reveal>Historias</p>
          @for (s of stories; track s.who; let i = $index) {
            <blockquote [style.clip-path]="strips[i]" [style.--r]="['-1deg', '0.8deg', '-0.5deg', '1.2deg'][i]" data-reveal [revealDelay]="i * 90">
              <p class="hand">“{{ s.text }}”</p>
              <footer>{{ s.who }}</footer>
            </blockquote>
          }
          <p class="fine">Compartidas con permiso. Nombres omitidos por confidencialidad.</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--sage-soft); }
    .grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(30px, 6vw, 90px); align-items: center; }
    .portrait { position: relative; margin: 0; }
    .arch { aspect-ratio: 3 / 4; border-radius: 999px 999px 18px 18px; overflow: hidden; background: var(--sage); box-shadow: 18px 18px 0 var(--sage); }
    .arch img { width: 100%; height: 100%; object-fit: cover; object-position: 28% 40%; }
    figcaption { position: absolute; right: -6%; bottom: 6%; font-size: clamp(3rem, 6vw, 4.6rem); color: var(--ink); rotate: -8deg; }
    figcaption svg { width: 70%; margin-top: -8px; overflow: visible; }
    figcaption path { fill: none; stroke: var(--peach-deep); stroke-width: 3; stroke-linecap: round; }
    .copy { display: grid; gap: 18px; justify-items: start; }
    .creds { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 10px; }
    .creds li { display: flex; gap: 12px; align-items: center; font-size: 0.98rem; }
    /* transitions.dev "Checkbox check": la caja se llena y después se dibuja la palomita */
    .box { display: grid; place-items: center; flex: none; width: 22px; height: 22px; border-radius: 6px; box-shadow: inset 0 0 0 2px var(--sage-deep); background: transparent; transition: background-color 250ms var(--ease-smooth-out) var(--d); }
    .box svg { width: 14px; overflow: visible; }
    .box path { fill: none; stroke: var(--card); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 400ms var(--ease-smooth-out) calc(var(--d) + 200ms); }
    .is-in .box { background: var(--sage-deep); }
    .is-in .box path { stroke-dashoffset: 0; }
    .promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; width: 100%; margin-top: 10px; }
    .index { padding: 18px; background: var(--card); box-shadow: var(--shadow-paper); rotate: var(--r); background-image: linear-gradient(oklch(62% 0.12 25 / 0.45), oklch(62% 0.12 25 / 0.45)); background-size: 100% 1.5px; background-position: 0 44px; background-repeat: no-repeat; transition: rotate 450ms var(--ease-bounce), translate 450ms var(--ease-bounce); }
    @media (hover: hover) and (pointer: fine) { .index:hover { rotate: 0deg; translate: 0 -4px; } }
    .index b { display: block; margin-bottom: 16px; font-family: var(--font-display); font-stretch: 75%; font-size: 1.4rem; font-weight: 800; text-transform: uppercase; }
    .index p { font-size: 0.9rem; color: var(--ink-2); }
    .rates-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(30px, 6vw, 90px); }
    .rates-col { display: grid; gap: 18px; align-content: start; }
    /* Recibo: papel blanco con orilla dentada abajo */
    .receipt { display: grid; gap: 14px; padding: 26px 26px 40px; background: var(--card); box-shadow: var(--shadow-lift); rotate: -1deg; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), 96% 100%, 92% calc(100% - 10px), 88% 100%, 84% calc(100% - 10px), 80% 100%, 76% calc(100% - 10px), 72% 100%, 68% calc(100% - 10px), 64% 100%, 60% calc(100% - 10px), 56% 100%, 52% calc(100% - 10px), 48% 100%, 44% calc(100% - 10px), 40% 100%, 36% calc(100% - 10px), 32% 100%, 28% calc(100% - 10px), 24% 100%, 20% calc(100% - 10px), 16% 100%, 12% calc(100% - 10px), 8% 100%, 4% calc(100% - 10px), 0 100%); }
    .r-head { display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1.5px dashed var(--line-2); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .r-head span { color: var(--muted); }
    .receipt ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
    .receipt li { display: flex; align-items: baseline; gap: 8px; padding: 8px 0; }
    .receipt li span:first-child { display: grid; }
    .receipt b { font-weight: 650; }
    .receipt small { font-size: 0.8rem; color: var(--muted); }
    .dots { flex: 1; min-width: 16px; border-bottom: 2px dotted var(--line-2); translate: 0 -5px; }
    .price { display: inline-flex; font-family: var(--font-display); font-stretch: 75%; font-size: 1.7rem; font-weight: 800; white-space: nowrap; overflow: hidden; }
    .price em { font-style: normal; }
    .toggle { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; font-size: 0.92rem; font-weight: 650; text-align: left; }
    .track { position: relative; flex: none; width: 50px; height: 30px; border-radius: 999px; background: var(--paper-3); transition: background-color 250ms ease; }
    .thumb { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: var(--card); box-shadow: var(--shadow-paper); }
    .toggle[data-on='true'] .track { background: var(--peach-deep); }
    .toggle[data-on='true'] .thumb { translate: 20px 0; }
    .toggle.is-init[data-on='true'] .thumb { animation: t-toggle-on 350ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
    .toggle.is-init[data-on='false'] .thumb { animation: t-toggle-off 350ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
    @keyframes t-toggle-on { 0% { translate: 0 0; } 55% { translate: 23px 0; } 80% { translate: 19px 0; } 100% { translate: 20px 0; } }
    @keyframes t-toggle-off { 0% { translate: 20px 0; } 55% { translate: -3px 0; } 80% { translate: 1px 0; } 100% { translate: 0 0; } }
    .solidaria { font-size: 1.5rem; color: var(--peach-deep); }
    .stories { display: grid; gap: 16px; align-content: start; }
    blockquote { margin: 0; padding: 20px 24px; background: var(--card); box-shadow: var(--shadow-paper); rotate: var(--r); }
    blockquote p { font-size: clamp(1.4rem, 2.2vw, 1.75rem); line-height: 1.15; }
    blockquote footer { margin-top: 6px; font-size: 0.84rem; color: var(--muted); }
    .fine { font-size: 0.82rem; color: var(--muted); }
    @media (max-width: 900px) {
      .grid, .rates-grid { grid-template-columns: 1fr; }
      .portrait { max-width: 420px; justify-self: center; }
      figcaption { right: 0; }
    }
    /* Microinteracciones: la firma se vuelve a subrayar y las historias se enderezan al leerlas */
    figcaption path { stroke-dasharray: 1; }
    blockquote { transition: rotate 450ms var(--ease-bounce), translate 450ms var(--ease-bounce), box-shadow 400ms ease; }
    @media (hover: hover) and (pointer: fine) {
      .portrait:hover figcaption path { animation: redraw 900ms var(--ease-smooth-out); }
      .portrait:hover figcaption { rotate: -5deg; }
      blockquote:hover { rotate: 0deg; translate: 6px 0; box-shadow: var(--shadow-lift); }
    }
    figcaption { transition: rotate 500ms var(--ease-bounce); }
    @keyframes redraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  `,
})
export class About {
  protected readonly practice = inject(Practice);
  protected readonly credentials = CREDENTIALS;
  protected readonly promises = PROMISES;
  protected readonly rates = RATES;
  protected readonly stories = STORIES;
  protected readonly strips = [21, 22, 23, 24].map((s) => torn(s, 2.4, 14));
  protected readonly pack = signal(false);
  protected readonly touched = signal(false);
  protected readonly money = money;

  protected flipPack() {
    this.touched.set(true);
    this.pack.set(!this.pack());
  }

  protected priceChars(n: number) {
    return money(this.pack() ? Math.round((n * 0.9) / 10) * 10 : n).split('');
  }
}
