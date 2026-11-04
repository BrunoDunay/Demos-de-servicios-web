import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Intro (~1.8 s): sobre azul noche se dibuja el diente del logo de un solo trazo, se enciende la luz
 * de la lámpara dental (un círculo de luz que pasa por encima) y la pantalla se abre en un arco,
 * como una sonrisa. Viene en el HTML prerenderizado; si el JS no carga, una animación CSS la retira.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="lamp"></div>
        <svg class="tooth" viewBox="0 0 32 32">
          <path class="t" pathLength="1" d="M10.2 4.5c-3.6 0-5.7 2.8-5.7 6.3 0 2.8 1.1 4.7 2.1 7 .9 2.3 1.2 5 1.9 7.6.5 2 1.3 3.6 2.8 3.6 2.1 0 2.2-4 3-6.6.4-1.3 1-1.9 1.7-1.9s1.3.6 1.7 1.9c.8 2.6.9 6.6 3 6.6 1.5 0 2.3-1.6 2.8-3.6.7-2.6 1-5.3 1.9-7.6 1-2.3 2.1-4.2 2.1-7 0-3.5-2.1-6.3-5.7-6.3-2.6 0-3.8 1.3-5.8 1.3s-3.2-1.3-5.8-1.3z" />
          <path class="s" pathLength="1" d="M9.6 9.2c.4-1.4 1.4-2.2 2.6-2.4" />
        </svg>
        <p class="word">Marfil</p>
        <p class="sub">Odontología · Aguascalientes</p>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: var(--z-intro); display: grid; place-content: center; justify-items: center; gap: 14px; background: var(--night); color: var(--ivory); animation: fallback-out 500ms ease 4.5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .lamp { position: absolute; width: 70vmax; aspect-ratio: 1; border-radius: 50%; left: 50%; top: 50%; translate: -50% -50%; background: radial-gradient(closest-side, oklch(97% 0.02 90 / 0.22), transparent 70%); opacity: 0; pointer-events: none; }
    .tooth { width: clamp(64px, 12vw, 96px); overflow: visible; }
    .t, .s { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
    .t { stroke: var(--ivory); stroke-width: 1.2; }
    .s { stroke: var(--mint); stroke-width: 1.6; }
    .word { font-family: var(--font-display); font-size: clamp(2.6rem, 7vw, 4rem); line-height: 1; letter-spacing: -0.02em; font-variation-settings: 'SOFT' 100; opacity: 0; }
    .sub { font-size: 0.74rem; font-weight: 650; letter-spacing: 0.22em; text-transform: uppercase; color: var(--mint); opacity: 0; }
    .skip { position: absolute; right: var(--gutter); top: 22px; padding: 8px 0; font-size: 0.72rem; font-weight: 650; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; transition: scale 160ms var(--ease-out); }
    .skip:active { scale: 0.95; }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
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
      gsap.to(root, { autoAlpha: 0, duration: 0.35, delay: 0.2, onComplete: () => this.finish() });
      return;
    }
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ onComplete: () => this.finish() });
    this.timeline = tl;
    tl.to(q('.t'), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.1)
      .to(q('.s'), { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, 0.95)
      .fromTo(q('.lamp'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.85)
      .fromTo(q('.word'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.9)
      .fromTo(q('.sub'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.05)
      .addLabel('open', 1.75)
      .call(() => this.motion.introDone.set(true), [], 'open')
      // Se abre en arco, como una sonrisa
      .fromTo(root, { clipPath: 'ellipse(150% 150% at 50% 0%)' }, { clipPath: 'ellipse(150% 0% at 50% 0%)', duration: 0.85, ease: 'expo.inOut' }, 'open');
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
