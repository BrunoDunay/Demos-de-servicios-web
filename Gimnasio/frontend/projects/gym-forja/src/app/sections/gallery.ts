import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { GALLERY } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Reveal } from '../shared/reveal';

/** Dos tiras de fotos que se deslizan en sentidos opuestos según el scroll. */
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section gallery" id="galeria">
      <div class="container head">
        <span class="tag" data-reveal>Dentro del box</span>
        <h2 class="title-lg" data-reveal [revealDelay]="80">Hierro, sudor<br /><span class="outline">y comunidad</span></h2>
      </div>
      @for (row of rows; track $index; let r = $index) {
        <div class="row" [attr.data-dir]="r === 0 ? -1 : 1">
          @for (g of row; track g.img) {
            <figure class="shot">
              <img class="photo-bw" [src]="'media/' + g.img + '-sm.webp'" [alt]="g.label" loading="lazy" width="720" height="480" />
              <figcaption>{{ g.label }}</figcaption>
            </figure>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .gallery { overflow: hidden; }
    .head { margin-bottom: 48px; }
    .title-lg { margin-top: 18px; }
    .row { display: flex; gap: 16px; width: max-content; margin-bottom: 16px; will-change: transform; }
    .row[data-dir='1'] { margin-left: -30vw; }
    .shot { position: relative; margin: 0; width: clamp(240px, 26vw, 380px); aspect-ratio: 4 / 3; overflow: hidden; background: var(--bg-3); }
    .row[data-dir='1'] .shot { aspect-ratio: 3 / 4; width: clamp(180px, 18vw, 270px); }
    .shot img { width: 100%; height: 100%; object-fit: cover; transition: transform 900ms var(--ease-expo), filter 500ms ease; }
    .shot::after { content: ''; position: absolute; inset: 0; background: var(--ember); mix-blend-mode: multiply; opacity: 0; transition: opacity 400ms ease; }
    figcaption { position: absolute; z-index: 1; left: 14px; bottom: 12px; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); opacity: 0; transform: translateY(8px); transition: opacity 300ms ease, transform 400ms var(--ease-expo); }
    .shot:hover img { transform: scale(1.08); }
    .shot:hover::after { opacity: 0.7; }
    .shot:hover figcaption { opacity: 1; transform: none; }
  `,
})
export class Gallery {
  protected readonly rows = [GALLERY.slice(0, 5).concat(GALLERY.slice(0, 2)), GALLERY.slice(5).concat(GALLERY.slice(5, 8))];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const ctx = gsap.context(() => {
        host.querySelectorAll<HTMLElement>('.row').forEach((row) => {
          const dir = Number(row.dataset['dir']);
          gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -18 }, { xPercent: dir < 0 ? -18 : 0, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
      }, host);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
