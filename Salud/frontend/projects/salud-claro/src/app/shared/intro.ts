import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { scribble, spiral } from '../core/doodles';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

const KNOT = scribble(150, 150, 120, 110, 40, 11);
const CALM = spiral(150, 150, 118, 4.2, 160);

/**
 * Intro (~3 s), la historia del sitio en corto: sobre papel crema se dibuja rápido una maraña (la ansiedad),
 * se queda quieta un instante y se desenreda en una espiral tranquila (MorphSVG). Aparece "respira." escrito
 * a mano y la hoja sube con la orilla rasgada dejando ver la portada.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <svg class="draw" viewBox="0 0 300 300"><path class="knot" [attr.d]="knot" /></svg>
        <p class="word hand">respira.</p>
        <p class="sub">Claro · psicología</p>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: var(--z-intro); display: grid; place-content: center; justify-items: center; gap: 6px; background: var(--paper); color: var(--ink); animation: fallback-out 600ms ease 5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .draw { width: min(52vmin, 340px); overflow: visible; }
    .knot { fill: none; stroke: var(--ink); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .word { font-size: clamp(3rem, 9vw, 5rem); color: var(--peach-deep); clip-path: inset(0 100% 0 0); }
    .sub { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: var(--sage-deep); opacity: 0; }
    .skip { position: absolute; right: var(--gutter); top: 22px; padding: 8px 0; font-size: 0.78rem; font-weight: 650; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; transition: scale 160ms var(--ease-out); }
    .skip:active { scale: 0.95; }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
  protected readonly knot = KNOT;
  private timeline?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.play());
  }

  private play() {
    const root = this.root()?.nativeElement;
    if (!root) return this.finish();
    const { gsap } = useGsap();
    root.classList.add('is-running');
    this.motion.stop();
    if (prefersReducedMotion()) {
      gsap.to(root, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: () => this.finish() });
      return;
    }
    const q = gsap.utils.selector(root);
    const path = root.querySelector<SVGPathElement>('.knot')!;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const tl = gsap.timeline({ onComplete: () => this.finish() });
    this.timeline = tl;
    tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(q('.draw'), { rotate: 8, duration: 0.25, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 0.9)
      // Se desenreda: la maraña se vuelve espiral
      .to(path, { morphSVG: CALM, strokeDasharray: 'none', duration: 1.1, ease: 'power3.inOut' }, 1.3)
      .to(q('.draw'), { rotate: -90, scale: 0.8, duration: 1.1, ease: 'power3.inOut' }, 1.3)
      .to(q('.word'), { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.out' }, 1.7)
      .to(q('.sub'), { opacity: 1, duration: 0.5 }, 2)
      .addLabel('open', 2.75)
      .call(() => this.motion.introDone.set(true), [], 'open')
      // La hoja sube con la orilla de abajo rasgada
      .fromTo(
        root,
        { clipPath: 'polygon(0 0, 100% 0, 100% 104%, 92% 101%, 84% 105%, 75% 100%, 66% 104%, 58% 99%, 50% 103%, 41% 100%, 33% 105%, 25% 100%, 16% 104%, 8% 100%, 0 103%)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% -2%, 92% -5%, 84% -1%, 75% -6%, 66% -2%, 58% -7%, 50% -3%, 41% -6%, 33% -1%, 25% -6%, 16% -2%, 8% -6%, 0 -3%)', duration: 1, ease: 'power3.inOut' },
        'open',
      );
  }

  protected skip() {
    this.timeline?.kill();
    this.finish();
  }

  private finish() {
    this.motion.introDone.set(true);
    this.motion.resume();
    this.visible.set(false);
  }
}
