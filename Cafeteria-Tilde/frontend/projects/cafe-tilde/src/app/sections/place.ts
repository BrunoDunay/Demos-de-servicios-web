import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STRIPS } from '../core/content';
import { Reveal } from '../shared/reveal';

/** El lugar contado con tiras de fotos de cabina, como las que pegamos junto a la caja. */
@Component({
  selector: 'app-place',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section place" id="lugar">
      <div class="container grid">
        <div class="strips">
          @for (s of strips; track $index; let si = $index) {
            <figure class="strip" [class.b]="si === 1" data-reveal [revealDelay]="si * 120">
              @for (img of s; track img) {
                <img [src]="'media/' + img + '-sm.webp'" [alt]="alts[img]" width="720" height="720" loading="lazy" />
              }
              <figcaption>Tilde · Fresno 27</figcaption>
            </figure>
          }
        </div>
        <div class="copy">
          <span class="tag" data-reveal>El lugar</span>
          <h2 class="title" data-reveal [revealDelay]="60">Una casa de 1940 con techos de cuatro metros.</h2>
          <p class="body" data-reveal [revealDelay]="120">
            Antes fue una tlapalería. Le dejamos el piso de pasta y las vigas, pusimos una barra larga y mesas de madera que hizo un carpintero de la colonia.
          </p>
          <p class="body" data-reveal [revealDelay]="160">
            Hay enchufes en casi todas las mesas, el wifi aguanta videollamadas y si traes a tu perro le servimos agua antes que a ti. Los sábados se llena a las once; entre semana a esa hora está tranquilo.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 7vw, 110px); align-items: center; }
    .strips { display: flex; justify-content: center; gap: clamp(18px, 3vw, 34px); }
    .strip { width: min(46%, 210px); margin: 0; padding: 10px 10px 0; background: var(--leche); box-shadow: 0 18px 30px -18px color-mix(in oklch, var(--cafe) 60%, transparent); rotate: -4deg; transition: rotate 400ms var(--ease-out), transform 400ms var(--ease-out); }
    .strip.b { rotate: 3deg; margin-top: 60px; }
    @media (hover: hover) { .strip:hover { rotate: 0deg; transform: translateY(-6px); } }
    .strip img { width: 100%; aspect-ratio: 1; object-fit: cover; margin-bottom: 8px; filter: saturate(0.85) contrast(1.05); }
    figcaption { padding: 4px 0 12px; text-align: center; font-family: var(--font-display); font-size: 0.95rem; }
    .tag { color: var(--jitomate-hondo); }
    .title { margin-top: 14px; font-size: clamp(2.3rem, 4.6vw, 3.8rem); max-width: 16ch; }
    .body { margin-top: 20px; max-width: 46ch; font-size: 1.1rem; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .copy { order: -1; } }
  `,
})
export class Place {
  protected readonly strips = STRIPS;
  protected readonly alts: Record<string, string> = {
    interior: 'Mesas de madera junto a la pared',
    latte: 'Latte servido en la barra',
    mesas: 'Rincón con mesas redondas',
    barra: 'La barra con plantas',
    tostador: 'Granos recién tostados',
    amigos: 'Dos amigos platicando con café',
  };
}
