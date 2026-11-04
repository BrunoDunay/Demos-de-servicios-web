import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { STEPS } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Reveal } from '../shared/reveal';

/** Tu primera visita en 4 pasos. Una línea de hilo dental se va llenando al bajar y enciende cada paso. */
@Component({
  selector: 'app-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section" id="primera-visita">
      <div class="page grid">
        <header class="head">
          <p class="eyebrow" data-reveal>Tu primera visita</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Sin sorpresas, <em>ni en la boca ni en la cuenta</em>.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Antes de tocar un diente sabes qué tienes, qué te recomendamos y cuánto cuesta. Tú decides el orden.</p>
          <figure class="photo" data-reveal="photo">
            <img src="media/consulta-charla.webp" srcset="media/consulta-charla-sm.webp 820w, media/consulta-charla.webp 1800w" sizes="(max-width: 900px) 100vw, 40vw" alt="Doctora explicando el plan de tratamiento a un paciente" width="1800" height="1200" loading="lazy" />
          </figure>
        </header>
        <ol class="steps" #list>
          <span class="rail" aria-hidden="true"><span class="fill"></span></span>
          @for (s of steps; track s.n) {
            <li>
              <span class="dot" aria-hidden="true"></span>
              <p class="n">{{ s.n }}</p>
              <h3>{{ s.title }}</h3>
              <p class="time">{{ s.time }}</p>
              <p class="text">{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 100px); }
    .head { display: grid; align-content: start; gap: 18px; position: sticky; top: 110px; height: fit-content; }
    .photo { margin: 14px 0 0; aspect-ratio: 3 / 2; border-radius: var(--radius-l); overflow: hidden; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .steps { position: relative; list-style: none; margin: 0; padding: 0 0 0 44px; display: grid; gap: clamp(48px, 7vw, 90px); }
    .rail { position: absolute; left: 11px; top: 10px; bottom: 10px; width: 2px; border-radius: 2px; background: var(--line); overflow: hidden; }
    .fill { position: absolute; inset: 0; background: var(--mint); transform-origin: top; scale: 1 0; }
    .reduce-motion .fill { scale: 1 1; }
    li { position: relative; display: grid; gap: 6px; }
    .dot { position: absolute; left: -44px; top: 4px; width: 24px; height: 24px; border-radius: 50%; background: var(--ivory); box-shadow: inset 0 0 0 2px var(--line-2); transition: box-shadow 400ms var(--ease-out), background-color 400ms ease; }
    li.on .dot { background: var(--mint); box-shadow: inset 0 0 0 2px var(--mint), 0 0 0 6px var(--mint-soft); }
    .n { font-size: 0.8rem; font-weight: 700; color: var(--mint-deep); letter-spacing: 0.1em; }
    h3 { font-size: clamp(1.8rem, 3vw, 2.4rem); }
    .time { font-size: 0.9rem; font-weight: 600; color: var(--muted); }
    .text { color: var(--ink-2); max-width: 46ch; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .head { position: static; }
    }
  `,
})
export class Visit {
  protected readonly steps = STEPS;
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const list = this.list().nativeElement;
      const items = Array.from(list.querySelectorAll('li'));
      if (prefersReducedMotion()) {
        items.forEach((li) => li.classList.add('on'));
        return;
      }
      const { gsap, ScrollTrigger } = useGsap();
      const tween = gsap.to(list.querySelector('.fill'), { scale: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } });
      const triggers = items.map((li) => ScrollTrigger.create({ trigger: li, start: 'top 62%', onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') }));
      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        triggers.forEach((t) => t.kill());
      });
    });
  }
}
