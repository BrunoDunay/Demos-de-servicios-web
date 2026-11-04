import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { PlayInView } from '../shared/in-view-video';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

const ITEMS = [
  { img: 'merch-chamarra', name: 'Chamarra Umbral', detail: 'Nylon mate, forro térmico y arco bordado en oro.', price: '$2,450' },
  { img: 'merch-playera', name: 'Playera técnica', detail: 'Malla transpirable de secado rápido, sin costuras en el hombro.', price: '$890' },
  { img: 'merch-gorra', name: 'Gorra Atelier', detail: 'Sarga lavada, arco bordado en hilo dorado y ajuste de latón.', price: '$690' },
  { img: 'merch-active', name: 'Línea Active', detail: 'Top de manga larga y short sin costuras, en tono tierra.', price: '$1,350' },
];

/**
 * "Atelier Umbral": la marca fuera del club. Composición de póster (referencia "diseño de sección"):
 * título y valores a la izquierda, socia caminando con la playera del club a la derecha, y abajo las
 * prendas con hover de luz y un video del piso de la sala.
 */
@Component({
  selector: 'app-atelier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PlayInView, SplitLines, Reveal],
  template: `
    <section class="section atelier" aria-labelledby="atelier-title">
      <div class="container top">
        <div class="copy">
          <span class="label" data-reveal>Atelier Umbral</span>
          <h2 class="h2" id="atelier-title" splitLines>La puerta también<br /><em class="gold">se lleva puesta.</em></h2>
          <p class="lead" data-reveal>Una colección corta por temporada, hecha en México para entrenar y para todo lo que viene después.</p>
          <ul class="values">
            <li data-reveal><span class="ico"><app-icon name="sparkle" [size]="18" /></span><div><b>Edición de temporada</b><span>Pocas piezas, numeradas, que no se repiten.</span></div></li>
            <li data-reveal [revealDelay]="100"><span class="ico"><app-icon name="user" [size]="18" /></span><div><b>Solo para socios</b><span>Se compra en recepción, con tu código.</span></div></li>
            <li data-reveal [revealDelay]="200"><span class="ico"><app-icon name="heart" [size]="18" /></span><div><b>Kit de bienvenida</b><span>Playera y botella al entrar con Platinum o Diamond.</span></div></li>
          </ul>
          <a routerLink="/contacto" [queryParams]="{ interes: 'Atelier Umbral' }" class="link-line" data-reveal>Aparta tu talla <app-icon name="arrow-right" [size]="16" /></a>
        </div>
        <figure class="hero-img" data-reveal="clip">
          <img class="warm" src="media/merch-caminando.webp?v=3" alt="Socia caminando hacia la sala con la playera de Umbral" loading="lazy" />
          <figcaption><b>Playera Umbral</b><span>Negro · Algodón pima</span></figcaption>
        </figure>
      </div>

      <div class="container row">
        @for (it of items; track it.img; let i = $index) {
          <article class="item" data-reveal [revealDelay]="i * 90" (pointermove)="light($event)">
            <div class="frame"><img [src]="'media/' + it.img + '-sm.webp?v=3'" [alt]="it.name" loading="lazy" /><span class="sheen"></span></div>
            <div class="meta"><h3>{{ it.name }}</h3><span class="price">{{ it.price }}</span></div>
            <p>{{ it.detail }}</p>
          </article>
          @if (i === 1) {
            <article class="item film" data-reveal [revealDelay]="180" aria-hidden="true">
              <div class="frame"><video playInView="media/v-suelo.mp4" poster="media/v-suelo-poster.jpg" muted loop playsinline preload="none"></video></div>
              <p class="film-note"><em>Hecha para el piso de la sala.</em></p>
            </article>
          }
        }
      </div>
    </section>
  `,
  styles: `
    .atelier { position: relative; overflow: hidden; }
    .top { display: grid; grid-template-columns: 1fr 0.8fr; gap: clamp(40px, 7vw, 120px); align-items: center; }
    .h2 { margin-top: 20px; }
    .lead { margin-top: 22px; max-width: 460px; }
    .values { list-style: none; margin: 34px 0 32px; padding: 0; display: grid; gap: 20px; }
    .values li { display: flex; gap: 18px; align-items: center; }
    .ico { display: grid; place-items: center; width: 48px; height: 48px; flex: none; border-radius: 50%; color: var(--gold); box-shadow: inset 0 0 0 1px var(--line-2); }
    .values b { display: block; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; }
    .values span { font-size: 0.92rem; color: var(--ink-2); font-weight: 300; }
    .hero-img { position: relative; margin: 0; aspect-ratio: 3 / 4.6; overflow: hidden; border-radius: 1000px 1000px 0 0; background: var(--bg-3); }
    .hero-img img { width: 100%; height: 115%; object-fit: cover; object-position: 50% 30%; filter: sepia(0.22) saturate(0.85) contrast(1.05); will-change: transform; }
    .hero-img figcaption { position: absolute; left: 24px; bottom: 22px; display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; background: rgb(13 12 10 / 60%); backdrop-filter: blur(8px); box-shadow: inset 0 0 0 1px var(--line-2); }
    .hero-img figcaption b { font-family: var(--font-display); font-weight: 400; font-size: 1.2rem; }
    .hero-img figcaption span { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }

    .row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: clamp(60px, 8vw, 110px); }
    .item { --mx: 50%; --my: 30%; display: flex; flex-direction: column; }
    .frame { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--bg-3); }
    .frame img, .frame video { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease-out), filter 600ms ease; filter: brightness(0.86) saturate(0.9); }
    .sheen { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 500ms ease; background: radial-gradient(circle 160px at var(--mx) var(--my), rgb(243 213 161 / 26%), transparent 70%); mix-blend-mode: screen; }
    @media (hover: hover) and (pointer: fine) { .item:hover .frame img { transform: scale(1.06); filter: brightness(1) saturate(1); } }
    @media (hover: hover) and (pointer: fine) { .item:hover .sheen { opacity: 1; } }
    .meta { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-top: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line); transition: border-color 400ms ease; }
    @media (hover: hover) and (pointer: fine) { .item:hover .meta { border-color: var(--gold); } }
    .meta h3 { font-size: 1.35rem; }
    .price { font-size: 0.78rem; letter-spacing: 0.12em; color: var(--gold); }
    .item p { margin-top: 8px; font-size: 0.84rem; color: var(--ink-2); font-weight: 300; }
    .film .frame { border-radius: 1000px 1000px 0 0; }
    .film-note { font-family: var(--font-display); font-size: 1.15rem !important; color: var(--gold) !important; }
    @media (max-width: 1000px) {
      .top { grid-template-columns: 1fr; }
      .hero-img { max-width: 420px; }
      .row { grid-template-columns: repeat(2, 1fr); }
      .film { display: none; }
    }
  `,
})
export class Atelier {
  protected readonly items = ITEMS;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const ctx = gsap.context(() => {
        gsap.fromTo(host.querySelector('.hero-img img'), { yPercent: -8 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: host.querySelector('.hero-img'), start: 'top bottom', end: 'bottom top', scrub: true } });
      }, host);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }

  protected light(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.querySelector('.frame')!.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
}
