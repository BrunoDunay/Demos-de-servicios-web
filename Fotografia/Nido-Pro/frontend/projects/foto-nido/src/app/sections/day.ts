import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { DAY } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Reveal } from '../shared/reveal';
import { Running } from '../shared/running';

/** Un día de sesión newborn contado por horas. Un hilo rojo se va cosiendo con el scroll. */
@Component({
  selector: 'app-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Running],
  template: `
    <section class="section day" id="dia" running="Un día de sesión" #root>
      <div class="page">
        <p class="folio" data-reveal><span><b>Un día de sesión</b> · newborn</span><span>p. 44</span></p>
        <div class="layout">
          <div class="intro">
            <h2 data-reveal>De las 9:30 <em>a la galería</em>.</h2>
            <p data-reveal [revealDelay]="80">Así se ve una sesión newborn de verdad, con sus pausas. Las de maternidad y familia son más cortas y casi siempre al atardecer.</p>
            <figure class="still" data-reveal="photo" [revealDelay]="140">
              <img src="media/nb-luz-sm.webp" alt="Mamá cargando a su bebé recién nacido junto a la ventana" width="720" height="1080" loading="lazy" />
            </figure>
          </div>
          <ol class="hours">
            <span class="seam" aria-hidden="true"></span>
            @for (h of day; track h.time; let i = $index) {
              <li data-reveal [revealDelay]="i * 40">
                <span class="time">{{ h.time }}</span>
                <div>
                  <h3>{{ h.title }}</h3>
                  <p>{{ h.text }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(40px, 7vw, 120px); margin-top: clamp(40px, 6vw, 80px); align-items: start; }
    .intro { position: sticky; top: 110px; }
    h2 { font-size: clamp(2.6rem, 5vw, 4.6rem); }
    h2 em { color: var(--hilo); }
    .intro p { margin-top: 20px; max-width: 40ch; font-size: 1.08rem; color: var(--ink-2); }
    .still { margin: 34px 0 0; width: 58%; aspect-ratio: 2 / 3; overflow: hidden; }
    .still img { width: 100%; height: 100%; object-fit: cover; }
    .hours { position: relative; list-style: none; margin: 0; padding: 0 0 0 34px; }
    .seam { position: absolute; left: 0; top: 10px; bottom: 10px; width: 2px; background: repeating-linear-gradient(180deg, var(--hilo) 0 9px, transparent 9px 15px); }
    li { position: relative; display: grid; grid-template-columns: 130px 1fr; gap: 20px; padding: 26px 0; border-bottom: 1px solid var(--line); }
    li::before { content: ''; position: absolute; left: -38px; top: 38px; width: 9px; height: 9px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 2px var(--hilo); }
    .time { font-family: var(--font-display); font-size: 2rem; line-height: 1; font-variant-numeric: lining-nums; }
    h3 { font-family: var(--font-body); font-weight: 600; font-size: 1.05rem; letter-spacing: 0; line-height: 1.3; }
    li p { margin-top: 6px; color: var(--ink-2); }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .intro { position: static; }
      .still { display: none; }
      li { grid-template-columns: 1fr; gap: 6px; }
    }
  `,
})
export class Day {
  protected readonly day = DAY;
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const destroyRef = inject(DestroyRef);
    // El hilo de la línea de tiempo se "cose" conforme bajas.
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const root = this.root().nativeElement;
      const seam = root.querySelector<HTMLElement>('.seam')!;
      const tween = gsap.fromTo(seam, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: root.querySelector('.hours'), start: 'top 70%', end: 'bottom 60%', scrub: true } });
      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });
  }
}
