import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { Album } from '../core/booking';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { Running } from '../shared/running';

/** Las páginas del álbum de la portada, de la primera a la última. */
const PAGES = [
  { img: 'nb-manta', w: 1400, h: 2097, alt: 'Recién nacido dormido, envuelto en una manta café', caption: 'Lía, 9 días. Estudio Nido.' },
  { img: 'mt-campo', w: 1000, h: 1500, alt: 'Pareja esperando bebé en un campo de pasto alto', caption: 'Andrea y Luis, semana 31. La espera.' },
  { img: 'fm-campo', w: 1000, h: 1500, alt: 'Familia con tres hijos sentada en el pasto al atardecer', caption: 'Los Rangel, en el campo. Los de casa.' },
  { img: 'pa-globo', w: 1000, h: 1500, alt: 'Bebé de un año junto a un globo y su pastel', caption: 'Regina, un año. El primer pastel.' },
];

/**
 * Portada: la copia chica al centro, entre "Lo pequeño" y "dura poco.". Al bajar, la sección se queda
 * fija y la copia se voltea como la hoja de un álbum, girando sobre su lomo: debajo aparece la siguiente
 * (la espera, los de casa, el primer pastel). La primera página es la misma copia con la que termina
 * la intro de revelado.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Running],
  template: `
    <section class="hero" id="inicio" #root running="">
      <div class="stage">
        <div class="book">
          @for (p of pages; track p.img; let i = $index) {
            <figure class="page" [style.z-index]="pages.length - i">
              <img
                [src]="'media/' + p.img + '.webp'"
                [attr.srcset]="'media/' + p.img + '-sm.webp 720w, media/' + p.img + '.webp 1400w'"
                sizes="(max-width: 760px) 58vw, 330px"
                [alt]="p.alt"
                [attr.width]="p.w"
                [attr.height]="p.h"
                [attr.fetchpriority]="i === 0 ? 'high' : null"
                [attr.loading]="i === 0 ? 'eager' : 'lazy'"
              />
              <span class="shade" aria-hidden="true"></span>
            </figure>
          }
        </div>
        <p class="top a-fade">Fotografía de recién nacidos y familia · Aguascalientes</p>
        <h1 class="words">
          <span class="w w1"><span class="in">Lo pequeño</span></span>
          <span class="w w2"><span class="in"><em>dura poco.</em></span></span>
        </h1>
        <p class="caption cap a-fade" aria-live="polite">{{ pages[page()].caption }}</p>
        <div class="over">
          <p>Fotografío los primeros días, la espera y a los de casa. Sin prisa, en un estudio tibio, con alguien que sabe cargar a un bebé.</p>
          <button type="button" class="thread" (click)="album.indexOpen.set(true)">Abrir el índice <span class="arrow">→</span></button>
        </div>
        <span class="hint a-fade" aria-hidden="true">Baja para pasar las páginas</span>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; height: 100svh; }
    .stage { position: relative; height: 100svh; overflow: hidden; }
    /* El álbum: las páginas apiladas en la misma caja que la copia de la intro */
    .book { position: absolute; left: 50%; top: 50%; width: var(--print-w); height: var(--print-h); translate: -50% -50%; perspective: 1400px; }
    .page { position: absolute; inset: 0; margin: 0; overflow: hidden; transform-origin: left center; backface-visibility: hidden; will-change: transform; }
    .page img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
    /* Sombra que aparece mientras la hoja gira, para que se lea el volumen */
    .shade { position: absolute; inset: 0; background: oklch(18% 0.02 45); opacity: 0; pointer-events: none; }
    .top { position: absolute; left: 0; right: 0; top: 104px; text-align: center; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
    .words { position: absolute; inset: 0; pointer-events: none; font-size: clamp(3rem, 7.2vw, 7.6rem); font-weight: 300; line-height: 1; }
    .w { position: absolute; top: 50%; overflow: hidden; padding: 0.06em 0.08em 0.14em; translate: 0 -50%; white-space: nowrap; }
    .w .in { display: inline-block; }
    .w1 { right: calc(50% + var(--print-w) / 2 + 2.4vw); }
    .w2 { left: calc(50% + var(--print-w) / 2 + 2.4vw); }
    .w2 em { color: var(--hilo); font-weight: 340; }
    .cap { position: absolute; left: 0; right: 0; top: calc(50% + var(--print-h) / 2 + 14px); text-align: center; }
    .over { position: absolute; left: var(--gutter); bottom: clamp(34px, 7vh, 70px); max-width: 420px; opacity: 0; }
    .over p { font-family: var(--font-display); font-size: clamp(1.35rem, 2vw, 1.85rem); line-height: 1.2; font-weight: 340; }
    .over .thread { margin-top: 16px; }
    .hint { position: absolute; left: 0; right: 0; bottom: 28px; text-align: center; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    @media (max-width: 760px) {
      .w { translate: none; left: 0; right: 0; text-align: center; }
      .w1 { top: auto; bottom: calc(50% + var(--print-h) / 2 + 8px); }
      .w2 { top: calc(50% + var(--print-h) / 2 + 44px); }
      .cap { top: calc(50% + var(--print-h) / 2 + 12px); }
      .words { font-size: clamp(2.6rem, 12vw, 3.6rem); }
      .top { top: 92px; padding: 0 var(--gutter); }
      .over { right: var(--gutter); bottom: 24px; }
      .over p { font-size: 1.1rem; }
    }
  `,
})
export class Hero {
  protected readonly album = inject(Album);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  protected readonly pages = PAGES;
  protected readonly page = signal(0);
  private ready = false;
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const { gsap } = useGsap();
      if (prefersReducedMotion()) {
        root.querySelector<HTMLElement>('.over')!.style.opacity = '1';
        return;
      }
      const q = gsap.utils.selector(root);
      gsap.set(q('.w .in'), { yPercent: 110 });
      gsap.set(q('.a-fade'), { opacity: 0 });

      const ctx = gsap.context(() => {
        const pages = q('.page');
        const shades = q('.shade');
        const turns = pages.length - 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: `+=${turns * 55 + 40}%`,
            pin: true,
            scrub: 0.6,
            // El pie de foto sigue a la página que está abierta
            onUpdate: (self) => this.page.set(Math.min(turns, Math.floor(self.progress * (turns + 0.6) + 0.5))),
          },
          defaults: { ease: 'none' },
        });
        tl.to(q('.top, .hint'), { opacity: 0, duration: 0.3 }, 0);
        // Cada hoja gira sobre su lomo (borde izquierdo) hasta quedar de canto y deja ver la siguiente
        for (let i = 0; i < turns; i++) {
          tl.to(pages[i], { rotateY: -96, duration: 1, ease: 'power1.in' }, i)
            .to(shades[i], { opacity: 0.55, duration: 1, ease: 'power1.in' }, i)
            .set(pages[i], { autoAlpha: 0 }, i + 1);
        }
        // Al final, el texto de presentación
        tl.fromTo(q('.over'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, turns - 0.2);
      }, root);
      destroyRef.onDestroy(() => ctx.revert());
      this.ready = true;
      if (this.motion.introDone()) this.play();
    });

    effect(() => {
      if (this.motion.introDone() && this.ready) this.play();
    });
  }

  /** Entrada después de la intro: las palabras suben desde su máscara. */
  private play() {
    if (this.played) return;
    this.played = true;
    const { gsap } = useGsap();
    const q = gsap.utils.selector(this.root().nativeElement);
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .to(q('.w .in'), { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.1)
      .to(q('.a-fade'), { opacity: 1, duration: 0.9, stagger: 0.08 }, 0.5);
  }
}
