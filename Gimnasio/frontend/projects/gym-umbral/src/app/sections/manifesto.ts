import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Reveal } from '../shared/reveal';

/**
 * Manifiesto que se enciende palabra por palabra con el scroll (de penumbra a luz) y queda
 * completamente nítido antes de salir de pantalla. Con mouse, un resplandor cálido sigue al cursor.
 */
@Component({
  selector: 'app-manifesto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section manifesto" #root>
      <div class="glow" aria-hidden="true"></div>
      <figure class="float f1" data-reveal="clip"><img class="warm" src="media/velas-sm.webp" alt="Velas y toallas en el área de recuperación" loading="lazy" width="720" height="480" /></figure>
      <figure class="float f2" data-reveal="clip" [revealDelay]="200"><img class="warm" src="media/detalle-pesas-sm.webp" alt="Mancuernas en el estudio de fuerza" loading="lazy" width="720" height="1080" /></figure>
      <figure class="float f3" data-reveal="clip" [revealDelay]="350"><img class="warm" src="media/lockers-spa-sm.webp" alt="Vestidor con banca de madera" loading="lazy" width="720" height="480" /></figure>
      <div class="container inner">
        <span class="label" data-reveal>Manifiesto</span>
        <p class="text">{{ before }}<em>{{ accent }}</em></p>
        <p class="sign" data-reveal><em>— Renata e Inés, fundadoras</em></p>
      </div>
    </section>
  `,
  styles: `
    .manifesto { position: relative; overflow: hidden; }
    .glow { position: absolute; left: 50%; top: 50%; width: 900px; height: 900px; margin: -450px 0 0 -450px; border-radius: 50%; background: radial-gradient(circle, rgb(243 213 161 / 9%), transparent 60%); pointer-events: none; transition: opacity 600ms ease; }
    .inner { position: relative; z-index: 1; max-width: 1100px; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .text { margin: 34px 0 0; font-family: var(--font-display); font-size: clamp(2.1rem, 4.8vw, 4.4rem); line-height: 1.12; letter-spacing: -0.01em; }
    .text em { color: var(--gold); }
    .sign { margin-top: 36px; font-size: 1.4rem; color: var(--muted); }
    .float { position: absolute; margin: 0; overflow: hidden; }
    .float img { width: 100%; height: 100%; object-fit: cover; }
    .f1 { left: 3%; top: 10%; width: clamp(140px, 15vw, 230px); aspect-ratio: 3 / 2; border-radius: 120px 120px 0 0; }
    .f2 { right: 4%; bottom: 8%; width: clamp(120px, 12vw, 190px); aspect-ratio: 2 / 3; }
    .f3 { left: 8%; bottom: 6%; width: clamp(110px, 10vw, 160px); aspect-ratio: 1; border-radius: 50%; }
    @media (max-width: 900px) { .float { display: none; } }
  `,
})
export class Manifesto {
  protected readonly before = 'Umbral nació de una idea sencilla: que entrenar se sienta como llegar a casa. Bajamos la luz, elegimos el aroma de la entrada y armamos cada playlist para que, al cruzar la puerta, ';
  protected readonly accent = 'el día se quede afuera.';

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = host.querySelector<HTMLElement>('.manifesto')!;
      if (prefersReducedMotion()) return;
      const { gsap, SplitText } = useGsap();
      const text = host.querySelector<HTMLElement>('.text')!;
      let split: { words: Element[]; revert(): void } | undefined;
      const ctx = gsap.context(() => {
        gsap.to(host.querySelector('.f1'), { yPercent: -40, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to(host.querySelector('.f2'), { yPercent: 50, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to(host.querySelector('.f3'), { yPercent: -70, rotate: 8, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      }, host);
      document.fonts.ready.then(() => {
        split = SplitText.create(text, { type: 'words' });
        ctx.add(() => {
          gsap.fromTo(split!.words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: text, start: 'top 82%', end: 'bottom 72%', scrub: 0.6 } });
        });
      });

      // Resplandor que sigue al cursor detrás del texto.
      if (hasFinePointer()) {
        const glow = host.querySelector<HTMLElement>('.glow')!;
        const xTo = gsap.quickTo(glow, 'x', { duration: 1, ease: 'power3' });
        const yTo = gsap.quickTo(glow, 'y', { duration: 1, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          xTo(e.clientX - r.left - r.width / 2);
          yTo(e.clientY - r.top - r.height / 2);
        };
        root.addEventListener('pointermove', move);
        destroyRef.onDestroy(() => root.removeEventListener('pointermove', move));
      }
      destroyRef.onDestroy(() => {
        ctx.revert();
        split?.revert();
      });
    });
  }
}
