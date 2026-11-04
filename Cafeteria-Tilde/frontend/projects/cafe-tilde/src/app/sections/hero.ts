import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { openStatus } from '../core/order';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="hero" id="inicio">
      <div class="container grid">
        <div class="copy">
          <span class="tag intro" style="--i: 0">Café de barrio en la Purísima</span>
          <h1 class="title">
            <span class="intro" style="--i: 1">Café de barrio,</span>
            <span class="intro calm" style="--i: 2">sin prisa.</span>
          </h1>
          <p class="lead intro" style="--i: 3">
            Tostamos los martes, horneamos desde las seis y la mesa de la ventana casi siempre está libre antes de las nueve. Quédate o llévatelo.
          </p>
          <div class="actions intro" style="--i: 4">
            <a class="btn btn-jitomate" href="#taza">Arma tu taza <app-icon name="arrow-right" [size]="18" /></a>
            <a class="link" href="#menu">Ver el pizarrón</a>
          </div>
          <p class="small intro" style="--i: 5">Leche de avena sin costo · Wifi que sí sirve · Se aceptan perros</p>
        </div>

        <div class="window intro" style="--i: 2">
          <div class="arch">
            <img src="media/hero.webp" srcset="media/hero-sm.webp 720w, media/hero.webp 1400w" sizes="(max-width: 900px) 86vw, 42vw"
              alt="Barista sirviendo un café filtrado en la barra de Tilde" width="1400" height="1750" fetchpriority="high" />
          </div>
          <!-- Letrero colgante: muestra si está abierto con la hora real del visitante -->
          <div class="sign" [class.flip]="!status().open" [attr.aria-label]="(status().open ? 'Abierto. ' : 'Cerrado. ') + status().line">
            <span class="string" aria-hidden="true"></span>
            <div class="plate" aria-hidden="true">
              <span class="face front">Abierto</span>
              <span class="face back">Cerrado</span>
            </div>
            <small aria-hidden="true">{{ status().line }}</small>
          </div>
          <span class="stamp" aria-hidden="true">tostado<br />los martes</span>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero { padding: clamp(130px, 15vw, 170px) 0 clamp(64px, 8vw, 110px); }
    .grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(32px, 6vw, 90px); align-items: center; }
    .intro { animation: rise 700ms var(--ease-out) both; animation-delay: calc(var(--i) * 70ms + 60ms); }
    @keyframes rise { from { opacity: 0; translate: 0 18px; } }
    .tag { color: var(--jitomate-hondo); }
    .title { margin-top: 18px; font-size: clamp(3.4rem, 8.6vw, 7.6rem); line-height: 0.92; }
    .title span { display: block; }
    .calm { color: var(--jitomate); }
    .lead { margin-top: 26px; max-width: 30ch; font-size: clamp(1.1rem, 1.6vw, 1.3rem); line-height: 1.5; }
    .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 34px; }
    .small { margin-top: 30px; font-size: 0.9rem; font-weight: 600; color: var(--cafe-soft); }

    .window { position: relative; padding-top: 70px; }
    .arch { aspect-ratio: 4 / 5; border-radius: 999px 999px 18px 18px; overflow: hidden; background: var(--crema-2); box-shadow: 0 0 0 10px var(--cafe), 0 0 0 14px var(--crema), 0 0 0 16px var(--cafe); }
    .arch img { width: 100%; height: 100%; object-fit: cover; }

    .sign { position: absolute; left: -26px; top: 0; display: flex; flex-direction: column; align-items: center; transform-origin: 50% 0; animation: sway 4.5s ease-in-out infinite; perspective: 600px; }
    .string { width: 64px; height: 34px; border: 2px solid var(--cafe); border-bottom: 0; border-radius: 50% 50% 0 0 / 100% 100% 0 0; margin-bottom: -2px; }
    .plate { position: relative; width: 150px; height: 58px; transform-style: preserve-3d; transition: transform 700ms var(--ease-in-out); }
    .face { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 10px; backface-visibility: hidden; font-family: var(--font-display); font-size: 1.6rem; box-shadow: 0 8px 18px -10px color-mix(in oklch, var(--cafe) 60%, transparent); }
    .front { background: var(--menta); color: var(--menta-hondo); }
    .back { background: var(--cafe); color: var(--crema); transform: rotateY(180deg); }
    .sign.flip .plate { transform: rotateY(180deg); }
    .sign small { margin-top: 8px; padding: 4px 10px; border-radius: 999px; background: var(--leche); font-size: 0.74rem; font-weight: 800; white-space: nowrap; }
    @keyframes sway { 0%, 100% { rotate: -2.5deg; } 50% { rotate: 2.5deg; } }

    .stamp { position: absolute; right: -14px; bottom: 34px; display: grid; place-items: center; width: 112px; height: 112px; border-radius: 50%; background: var(--mantequilla); font-family: var(--font-display); font-size: 1.08rem; line-height: 1.05; text-align: center; rotate: 12deg; box-shadow: 0 0 0 4px var(--crema), 0 0 0 6px var(--cafe); }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .window { max-width: 440px; width: 100%; margin: 6px auto 0; }
      .sign { left: -6px; }
      .stamp { right: -4px; width: 96px; height: 96px; font-size: 0.95rem; }
    }
  `,
})
export class Hero {
  // En el prerender no se sabe la hora del visitante; se calcula ya en el navegador.
  protected readonly status = signal({ open: true, line: 'Todos los días' });

  constructor() {
    afterNextRender(() => this.status.set(openStatus()));
  }
}
