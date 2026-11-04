import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { VALUES } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Manifiesto estilo póster "uno de nosotros": foto en blanco y negro y texto que se enciende al hacer scroll. */
@Component({
  selector: 'app-manifesto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section manifesto" id="manifiesto">
      <div class="container layout">
        <figure class="poster" data-reveal="clip">
          <img class="photo-bw" src="media/magnesia.webp" srcset="media/magnesia-sm.webp 720w, media/magnesia.webp 1400w" sizes="(max-width: 980px) 92vw, 44vw" alt="Tres atletas de Forja con magnesia en las manos antes de entrenar" width="1400" height="930" loading="lazy" />
          <figcaption>
            <span class="big">No eres<br />un número.</span>
            <span class="tape">Gente real · Disciplina real</span>
          </figcaption>
        </figure>
        <div class="copy">
          <span class="tag" data-reveal>Manifiesto</span>
          <p class="statement">
            A las seis de la mañana ya hay catorce personas calentando, contando en voz alta y esperando al que llega tarde. Aquí entrenas con nombre y apellido, y la última repetición la hace todo el grupo contigo.
          </p>
          <ul class="values">
            @for (v of values; track v.title; let i = $index) {
              <li data-reveal [revealDelay]="i * 100">
                <span class="ico"><app-icon [name]="v.icon" [size]="22" /></span>
                <div>
                  <h3>{{ v.title }}</h3>
                  <p>{{ v.text }}</p>
                </div>
              </li>
            }
          </ul>
          <p class="sign" data-reveal>Llegas solo. <span class="ember">Te quedas en equipo.</span></p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 96px); align-items: center; }
    .poster { position: relative; margin: 0; aspect-ratio: 4 / 5; overflow: hidden; }
    .poster img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); transition: transform 1.4s var(--ease-expo), filter 600ms ease; }
    .poster:hover img { transform: scale(1.02); filter: grayscale(0.2) contrast(1.1); }
    figcaption { position: absolute; inset: auto 0 0 0; padding: 28px; background: linear-gradient(transparent, rgb(11 11 12 / 85%)); }
    .big { display: block; font-family: var(--font-display); font-size: clamp(3rem, 6vw, 5.6rem); line-height: 0.88; text-transform: uppercase; }
    .tape { display: inline-block; margin-top: 16px; padding: 6px 12px; background: var(--ember); color: var(--bg); font-family: var(--font-mono); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; transform: rotate(-2deg); }
    .statement { margin-top: 22px; font-size: clamp(1.4rem, 2.5vw, 2.15rem); line-height: 1.25; font-weight: 600; letter-spacing: -0.01em; }
    .statement :is(.word) { color: rgb(242 239 232 / 18%); }
    .values { list-style: none; margin: 40px 0 0; padding: 0; display: grid; gap: 4px; }
    .values li { display: flex; gap: 18px; align-items: center; padding: 18px 0; border-top: 1px solid var(--line); transition: padding-left 400ms var(--ease-expo); }
    .values li:hover { padding-left: 10px; }
    .ico { flex: none; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; border: 1.5px solid var(--line-2); color: var(--ember); transition: background-color 300ms ease, color 300ms ease, transform 500ms var(--ease-expo); }
    .values li:hover .ico { background: var(--ember); color: var(--bg); transform: rotate(-12deg); }
    h3 { font-size: 1.5rem; letter-spacing: 0.02em; }
    .values p { color: var(--muted); }
    .sign { margin-top: 32px; font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); text-transform: uppercase; line-height: 1; }
    @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class Manifesto {
  protected readonly values = VALUES;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap, SplitText } = useGsap();
      const statement = host.querySelector<HTMLElement>('.statement')!;
      const split = SplitText.create(statement, { type: 'words', wordsClass: 'word' });
      const ctx = gsap.context(() => {
        gsap.fromTo(
          split.words,
          { color: 'rgba(242,239,232,0.16)' },
          { color: 'rgba(242,239,232,1)', stagger: 0.08, ease: 'none', scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true } },
        );
      }, host);
      destroyRef.onDestroy(() => {
        ctx.revert();
        split.revert();
      });
    });
  }
}
