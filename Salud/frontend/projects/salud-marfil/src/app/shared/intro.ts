import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { ToothStage } from '../core/tooth-stage';

/**
 * Intro (~2.6 s). Fondo azul noche con una luz que gira detrás; el diente 3D (shared/tooth-stage.ts)
 * aparece al centro girando rápido y frena. Las letras de "marfil" suben una por una, una barra cuenta
 * hasta 100 y la cortina se abre hacia arriba en curva. El diente no desaparece: vuela a la portada.
 * Viene en el HTML prerenderizado; si el JS no carga, una animación CSS la retira.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="glow"></div>
        <div class="rings"><i></i><i></i><i></i></div>
        <div class="copy">
          <p class="word">@for (c of letters; track $index) {<span>{{ c }}</span>}</p>
          <p class="sub">Odontología · Aguascalientes</p>
          <div class="bar"><span></span></div>
          <p class="count"><span class="n">0</span>%</p>
        </div>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: var(--z-intro); background: radial-gradient(120% 90% at 50% 30%, var(--navy-2), var(--night) 70%); color: var(--white); overflow: hidden; animation: fallback-out 500ms ease 4.5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .glow { position: absolute; left: 50%; top: 42%; width: 70vmin; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; background: conic-gradient(from 0deg, transparent, oklch(58% 0.18 258 / 0.55), transparent 40%, oklch(80% 0.09 238 / 0.35), transparent 75%); filter: blur(40px); opacity: 0; }
    .rings { position: absolute; left: 50%; top: 42%; translate: -50% -50%; }
    .rings i { position: absolute; left: 50%; top: 50%; border-radius: 50%; border: 1px solid oklch(80% 0.09 238 / 0.22); translate: -50% -50%; scale: 0; }
    .rings i:nth-child(1) { width: 52vmin; height: 52vmin; }
    .rings i:nth-child(2) { width: 72vmin; height: 72vmin; }
    .rings i:nth-child(3) { width: 96vmin; height: 96vmin; }
    .copy { position: absolute; left: 0; right: 0; bottom: 9vh; display: grid; justify-items: center; gap: 10px; }
    .word { display: flex; overflow: hidden; font-family: var(--font-display); font-size: clamp(3rem, 9vw, 6rem); font-weight: 700; letter-spacing: -0.05em; line-height: 0.95; }
    .word span { display: inline-block; translate: 0 110%; }
    .sub { font-size: 0.74rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--sky); opacity: 0; }
    .bar { width: min(240px, 60vw); height: 2px; border-radius: 2px; background: oklch(100% 0 0 / 0.15); overflow: hidden; }
    .bar span { display: block; height: 100%; background: var(--sky); transform-origin: left; scale: 0 1; }
    .count { font-size: 0.78rem; font-variant-numeric: tabular-nums; opacity: 0.6; }
    .skip { position: absolute; right: var(--gutter); top: 22px; padding: 8px 0; font-size: 0.74rem; font-weight: 650; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; transition: scale 160ms var(--ease-out); }
    .skip:active { scale: 0.95; }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly stage = inject(ToothStage);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
  protected readonly letters = 'marfil'.split('');
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
    this.stage.mode.set('intro');
    this.stage.spin = 3;
    if (prefersReducedMotion()) {
      gsap.to(root, { autoAlpha: 0, duration: 0.35, delay: 0.3, onComplete: () => this.finish() });
      return;
    }
    const q = gsap.utils.selector(root);
    const n = root.querySelector<HTMLElement>('.n')!;
    const count = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => this.finish() });
    this.timeline = tl;
    tl.to(q('.glow'), { opacity: 1, rotate: 200, duration: 2.4, ease: 'power2.out' }, 0)
      .to(q('.rings i'), { scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12 }, 0.1)
      .to(q('.word span'), { translate: '0 0%', duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.35)
      .to(q('.sub'), { opacity: 1, duration: 0.6 }, 0.7)
      .to(q('.bar span'), { scale: '1 1', duration: 1.6, ease: 'power2.inOut' }, 0.3)
      .to(count, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => (n.textContent = String(Math.round(count.v))) }, 0.3)
      .addLabel('open', 2.05)
      .to(q('.copy, .rings'), { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 'open')
      .call(() => {
        this.motion.introDone.set(true);
        this.stage.land();
      }, [], 'open+=0.1')
      // La cortina sube con la orilla de abajo en curva (como una sonrisa al revés)
      .fromTo(root, { clipPath: 'ellipse(150% 150% at 50% 0%)' }, { clipPath: 'ellipse(150% 0% at 50% 0%)', duration: 1, ease: 'expo.inOut' }, 'open+=0.05');
  }

  protected skip() {
    this.timeline?.kill();
    this.finish();
  }

  private finish() {
    if (!this.motion.introDone()) {
      this.motion.introDone.set(true);
      this.stage.land();
    }
    this.motion.resume();
    this.visible.set(false);
  }
}
