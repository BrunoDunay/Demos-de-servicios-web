import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Album } from '../core/booking';
import { Chapter } from '../core/content';
import { Reveal } from '../shared/reveal';
import { Drift, Running } from '../shared/running';

/**
 * Un capítulo del álbum (newborn, maternidad, familia, primer año). Comparten tipografía y
 * piezas, pero cada uno tiene su propia composición, como las páginas de una revista.
 */
@Component({
  selector: 'app-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Drift, Running],
  template: `
    @let c = chapter();
    <section class="section chapter" [class]="'chapter v' + variant()" [id]="c.id" [running]="c.num + ' · ' + c.title">
      @if (variant() === 2) {
        <figure class="bleed" drift>
          <img [src]="'media/' + c.photos[0].img + '.webp'" [attr.srcset]="'media/' + c.photos[0].img + '-sm.webp 720w, media/' + c.photos[0].img + '.webp 1600w'" sizes="100vw"
            [alt]="c.photos[0].alt" [attr.width]="c.photos[0].w" [attr.height]="c.photos[0].h" loading="lazy" />
          <figcaption class="caption">{{ c.photos[0].caption }}</figcaption>
        </figure>
      }
      <div class="page">
        <p class="folio" data-reveal><span><b>{{ c.num }}</b> · {{ c.session }}</span><span>p. {{ c.page }}</span></p>
        <div class="layout">
          <header class="ch-head">
            <span class="numeral" data-reveal aria-hidden="true">{{ c.num }}</span>
            <h2 data-reveal [revealDelay]="80">{{ c.title }}</h2>
          </header>

          <ul class="spec" data-reveal [revealDelay]="120">
            @for (s of c.spec; track s) {
              <li>{{ s }}</li>
            }
          </ul>

          <div class="text">
            @for (p of c.text; track p; let i = $index) {
              <p [class.drop]="i === 0" data-reveal [revealDelay]="160 + i * 60">{{ p }}</p>
            }
            <button type="button" class="thread" data-reveal [revealDelay]="260" (click)="album.book(c.session.toLowerCase())">Reservar {{ c.session.toLowerCase() }} <span class="arrow">→</span></button>
          </div>

          @if (c.quote) {
            <blockquote class="pull" data-reveal [revealDelay]="120"><span aria-hidden="true">“</span>{{ c.quote }}</blockquote>
          }

          @for (ph of photos(); track ph.img; let i = $index) {
            <figure [class]="'ph ph' + i" [class.tall]="ph.h > ph.w">
              <div class="frame" data-reveal="photo" [revealDelay]="i * 120" drift>
                <img [src]="'media/' + ph.img + '-sm.webp'" [attr.srcset]="'media/' + ph.img + '-sm.webp 720w, media/' + ph.img + '.webp ' + ph.w + 'w'"
                  sizes="(max-width: 900px) 92vw, 50vw" [alt]="ph.alt" [attr.width]="ph.w" [attr.height]="ph.h" loading="lazy" />
              </div>
              <figcaption class="caption">{{ ph.caption }}</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .folio { margin-bottom: clamp(40px, 6vw, 80px); }
    .layout { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(14px, 2vw, 28px); row-gap: clamp(28px, 4vw, 56px); align-items: start; }
    .ch-head { display: flex; align-items: flex-end; gap: 18px; }
    .numeral { font-family: var(--font-display); font-weight: 300; font-size: clamp(5rem, 11vw, 10rem); line-height: 0.8; color: var(--hilo); }
    h2 { font-size: clamp(2.8rem, 6vw, 5.6rem); padding-bottom: 0.08em; }
    .spec { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-2); }
    .spec li::before { content: ''; display: inline-block; width: 18px; height: 1px; margin: 0 12px 4px 0; background: var(--hilo); vertical-align: middle; }
    .text p { max-width: 46ch; font-size: 1.1rem; color: var(--ink-2); }
    .text p + p { margin-top: 16px; }
    .drop::first-letter { float: left; margin: 0.06em 0.1em 0 0; font-family: var(--font-display); font-size: 4.6em; line-height: 0.8; color: var(--ink); }
    .text .thread { margin-top: 26px; }
    .pull { margin: 0; font-family: var(--font-display); font-style: italic; font-weight: 340; font-size: clamp(1.7rem, 2.8vw, 2.6rem); line-height: 1.15; color: var(--ink); }
    .pull span { color: var(--hilo); margin-right: 0.08em; }
    figure { margin: 0; }
    .frame { overflow: hidden; background: var(--paper-2); }
    .frame img { width: 100%; height: 100%; object-fit: cover; }
    .ph .frame { aspect-ratio: 3 / 2; }
    .ph.tall .frame { aspect-ratio: 2 / 3; }
    figcaption { margin-top: 10px; }

    /* I. Foto alta a la izquierda; texto, cita y una foto chica a la derecha; foto ancha abajo */
    .v1 .ph0 { grid-column: 1 / 7; grid-row: 1 / 6; }
    .v1 .ch-head { grid-column: 8 / 13; grid-row: 1; }
    .v1 .spec { grid-column: 8 / 13; grid-row: 2; }
    .v1 .text { grid-column: 8 / 12; grid-row: 3; }
    .v1 .pull { grid-column: 8 / 13; grid-row: 4; }
    .v1 .ph1 { grid-column: 9 / 13; grid-row: 5; }
    .v1 .ph2 { grid-column: 3 / 10; grid-row: 6; margin-top: 40px; }

    /* II. Foto a sangre arriba; luego texto y dos fotos cruzadas */
    .bleed { position: relative; height: 82svh; overflow: hidden; margin-bottom: clamp(60px, 8vw, 110px); }
    .bleed img { width: 100%; height: 100%; object-fit: cover; }
    .bleed figcaption { position: absolute; left: var(--gutter); bottom: 22px; color: var(--paper); }
    .v2 .ch-head { grid-column: 1 / 8; grid-row: 1; }
    .v2 .spec { grid-column: 1 / 8; grid-row: 2; }
    .v2 .text { grid-column: 2 / 7; grid-row: 3; }
    .v2 .pull { grid-column: 2 / 7; grid-row: 4; }
    .v2 .ph0 { display: none; }
    .v2 .ph1 { grid-column: 8 / 12; grid-row: 1 / 4; }
    .v2 .ph2 { grid-column: 6 / 13; grid-row: 4 / 6; margin-top: 30px; }

    /* III. Título a la izquierda y tres fotos verticales en escalera */
    .v3 .ch-head { grid-column: 1 / 7; grid-row: 1; }
    .v3 .spec { grid-column: 1 / 7; grid-row: 2; }
    .v3 .text { grid-column: 8 / 12; grid-row: 1 / 3; align-self: end; }
    .v3 .ph0 { grid-column: 1 / 5; grid-row: 3; }
    .v3 .ph1 { grid-column: 5 / 9; grid-row: 3; margin-top: 90px; }
    .v3 .ph2 { grid-column: 9 / 13; grid-row: 3; margin-top: 180px; }

    /* IV. Foto grande a la izquierda que invade el margen, texto a la derecha, foto alta encimada */
    .v4 .ph0 { grid-column: 1 / 8; grid-row: 1 / 4; margin-left: calc(var(--gutter) * -1); }
    .v4 .ph1 { grid-column: 6 / 9; grid-row: 3 / 5; margin-top: 50%; position: relative; z-index: 1; box-shadow: 0 0 0 10px var(--paper); }
    .v4 .ch-head { grid-column: 9 / 13; grid-row: 1; }
    .v4 .spec { grid-column: 9 / 13; grid-row: 2; }
    .v4 .text { grid-column: 9 / 13; grid-row: 3; }
    .v4 .pull { grid-column: 9 / 13; grid-row: 4; }

    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .layout > * { grid-column: 1 !important; grid-row: auto !important; margin: 0 !important; }
      .v1 .ph0, .v4 .ph0 { order: -1; }
      .v4 .ph1 { box-shadow: none; }
      .ph1, .ph2 { width: 82%; }
      .ph2 { justify-self: end; }
      .bleed { height: 60svh; }
    }
  `,
})
export class ChapterView {
  readonly chapter = input.required<Chapter>();
  readonly variant = input.required<number>();
  protected readonly album = inject(Album);
  protected readonly photos = computed(() => this.chapter().photos);
}
