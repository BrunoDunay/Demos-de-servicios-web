import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Intro (~2.4 s): pantalla de niebla. Aparece "Respira." al ritmo de una inhalación, el círculo del logo
 * crece como un pulmón y la niebla se abre hacia los lados dejando ver el bosque de la portada.
 * Viene en el HTML prerenderizado; si el JS no carga, una animación CSS la retira.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="half l"></div>
        <div class="half r"></div>
        <div class="center">
          <svg class="mark" viewBox="0 0 32 32">
            <path class="ring" pathLength="1" d="M24.5 8.5A11 11 0 1 0 27 16" />
            <circle class="sun" cx="25.5" cy="11.8" r="2.4" />
          </svg>
          <p class="word">Respira.</p>
        </div>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: var(--z-intro); color: var(--forest); animation: fallback-out 600ms ease 5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .half { position: absolute; top: -10%; bottom: -10%; width: 62%; background: radial-gradient(120% 70% at 50% 50%, var(--mist) 55%, oklch(96.4% 0.012 140 / 0.85) 75%, transparent 100%); filter: blur(10px); }
    .half.l { left: -6%; }
    .half.r { right: -6%; }
    .center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 18px; }
    .mark { width: 64px; height: 64px; overflow: visible; }
    .ring { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sun { fill: var(--amber); transform-origin: 25.5px 11.8px; scale: 0; }
    .word { font-family: var(--font-display); font-style: italic; font-size: clamp(2.6rem, 8vw, 4.4rem); line-height: 1; opacity: 0; }
    .skip { position: absolute; right: var(--gutter); top: 22px; padding: 8px 0; font-size: 0.78rem; font-weight: 560; opacity: 0.7; transition: scale 160ms var(--ease-out); }
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
      gsap.to(root, { autoAlpha: 0, duration: 0.4, delay: 0.2, onComplete: () => this.finish() });
      return;
    }
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ onComplete: () => this.finish() });
    this.timeline = tl;
    // Una inhalación (1.4 s): el anillo se dibuja y crece, aparece la palabra
    tl.to(q('.ring'), { strokeDashoffset: 0, duration: 1.3, ease: 'sine.inOut' }, 0.1)
      .to(q('.mark'), { scale: 1.25, duration: 1.4, ease: 'sine.inOut' }, 0.1)
      .to(q('.sun'), { scale: 1, duration: 0.6, ease: 'back.out(2)' }, 1)
      .fromTo(q('.word'), { opacity: 0, filter: 'blur(10px)', y: 8 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.1, ease: 'sine.out' }, 0.3)
      // Exhalación: todo se calma y la niebla se abre
      .to(q('.mark'), { scale: 1, duration: 1, ease: 'sine.inOut' }, 1.6)
      .addLabel('open', 1.8)
      .call(() => this.motion.introDone.set(true), [], 'open')
      .to(q('.center'), { opacity: 0, filter: 'blur(8px)', duration: 0.6, ease: 'sine.in' }, 'open')
      .to(q('.half.l'), { xPercent: -95, duration: 1.2, ease: 'power2.inOut' }, 'open')
      .to(q('.half.r'), { xPercent: 95, duration: 1.2, ease: 'power2.inOut' }, 'open')
      .to(q('.half'), { opacity: 0, duration: 0.9, ease: 'sine.in' }, 'open+=0.4');
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
