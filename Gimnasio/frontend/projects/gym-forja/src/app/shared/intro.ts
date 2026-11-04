import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Intro de marca (motion graphics): el hexágono se calienta y se dibuja, la F se martilla
 * con chispas, el metal se enfría y la pantalla se abre en diagonal para mostrar el sitio.
 * Viene en el HTML prerenderizado para tapar la página desde el primer cuadro; si el JS no carga,
 * una animación CSS la retira sola a los 5 s.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="door door-a"></div>
        <div class="door door-b"></div>
        <svg class="seam" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="100" y1="0" x2="0" y2="100" pathLength="1" /></svg>

        <div class="stage">
          <div class="heat"></div>
          <div class="mark-wrap">
            <svg class="mark" viewBox="0 0 64 64">
              <path class="hex" pathLength="1" d="M32 7 53.6 19.5v25L32 57 10.4 44.5v-25z" />
              <rect class="f f-stem" x="24" y="20" width="6.5" height="25" />
              <rect class="f f-top" x="30.4" y="20" width="11.6" height="6.5" />
              <rect class="f f-mid" x="30.4" y="31" width="8.6" height="6.5" />
            </svg>
            <div class="sparks">
              @for (i of sparks; track i) {
                <i></i>
              }
            </div>
          </div>
          <div class="word">
            @for (l of letters; track $index) {
              <span>{{ l }}</span>
            }
          </div>
          <p class="motto">Uno de los nuestros</p>
        </div>

        <div class="hud hud-l"><span class="status">Calentando el hierro</span><b class="temp">0000°C</b></div>
        <div class="hud hud-r">Box funcional<br />Aguascalientes · Est. 2019</div>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar intro →</button>
        <div class="flash"></div>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; color: var(--ink); animation: fallback-out 600ms ease 5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .door { position: absolute; inset: -2px; background: var(--bg); }
    .door-a { clip-path: polygon(0 0, 100% 0, 0 100%); }
    .door-b { clip-path: polygon(100% 0, 100% 100%, 0 100%); }
    .seam { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .seam line { stroke: var(--ember); stroke-width: 0.28; stroke-dasharray: 1; stroke-dashoffset: 1; }

    .stage { position: relative; display: flex; flex-direction: column; align-items: center; }
    .heat { position: absolute; top: 50%; left: 50%; width: 520px; height: 520px; margin: -340px 0 0 -260px; border-radius: 50%; background: radial-gradient(circle, rgb(255 91 20 / 55%), rgb(255 91 20 / 0%) 62%); opacity: 0; transform: scale(0.6); pointer-events: none; }
    .mark-wrap { position: relative; width: clamp(120px, 18vw, 170px); aspect-ratio: 1; }
    .mark { width: 100%; height: 100%; overflow: visible; }
    .hex { fill: none; stroke: var(--ember); stroke-width: 4.5; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; filter: drop-shadow(0 0 8px rgb(255 91 20 / 80%)); }
    .f { fill: var(--ember); opacity: 0; }
    .sparks { position: absolute; inset: 0; pointer-events: none; }
    .sparks i { position: absolute; left: 50%; top: 52%; width: 2px; height: 16px; margin: -8px 0 0 -1px; background: linear-gradient(var(--spark), var(--ember)); opacity: 0; box-shadow: 0 0 6px var(--spark); }
    .word { opacity: 0; display: flex; gap: 0.06em; margin-top: 26px; overflow: hidden; font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5.4rem); letter-spacing: 0.1em; line-height: 1; padding-left: 0.1em; }
    .word span { display: inline-block; }
    .motto { opacity: 0; margin-top: 12px; font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--muted); }
    .hud { position: absolute; bottom: clamp(20px, 4vw, 40px); font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
    .hud-l { left: clamp(20px, 4vw, 48px); display: flex; flex-direction: column; gap: 6px; }
    .hud-l b { font-family: var(--font-display); font-weight: 400; font-size: 2.4rem; letter-spacing: 0.02em; color: var(--ember); line-height: 1; font-variant-numeric: tabular-nums; }
    .hud-r { right: clamp(20px, 4vw, 48px); text-align: right; line-height: 1.7; }
    .skip { position: absolute; top: clamp(20px, 4vw, 40px); right: clamp(20px, 4vw, 48px); font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); padding: 10px 0; transition: color 200ms ease; }
    .skip:hover { color: var(--ember); }
    .flash { position: absolute; inset: 0; background: #fff4e6; opacity: 0; pointer-events: none; mix-blend-mode: screen; }
    @media (max-width: 600px) { .hud-r { display: none; } }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
  protected readonly letters = 'FORJA'.split('');
  protected readonly sparks = Array.from({ length: 18 }, (_, i) => i);
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
    const tempEl = root.querySelector<HTMLElement>('.temp')!;
    const statusEl = root.querySelector<HTMLElement>('.status')!;
    const heat = { v: 0 };
    const rand = gsap.utils.random;
    const angles = this.sparks.map(() => rand(-170, -10) * (Math.PI / 180));

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => this.finish() });
    this.timeline = tl;

    tl.set(q('.f'), { opacity: 0 })
      .set(q('.sparks i'), { rotation: (i: number) => (angles[i] * 180) / Math.PI + 90 })
      // 1. Calentar: termómetro, brillo y trazo del hexágono
      .to(heat, { v: 1350, duration: 1.15, ease: 'power2.in', onUpdate: () => (tempEl.textContent = `${String(Math.round(heat.v)).padStart(4, '0')}°C`) }, 0)
      .to(q('.heat'), { opacity: 1, scale: 1, duration: 1.15, ease: 'power2.in' }, 0)
      .to(q('.hex'), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.12)
      // 2. Martillar la F
      .fromTo(q('.f-top'), { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'expo.out' }, 1.0)
      .fromTo(q('.f-mid'), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'expo.out' }, 1.08)
      .fromTo(q('.f-stem'), { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power4.in' }, 1.16)
      .addLabel('impact', 1.38)
      .to(q('.flash'), { opacity: 0.9, duration: 0.04, ease: 'none' }, 'impact')
      .to(q('.flash'), { opacity: 0, duration: 0.4 }, 'impact+=0.04')
      .to(q('.mark-wrap'), { keyframes: { x: [-9, 8, -6, 4, -2, 0], y: [5, -5, 3, -2, 1, 0] }, duration: 0.42, ease: 'none' }, 'impact')
      .fromTo(
        q('.sparks i'),
        { opacity: 1, x: 0, y: 0, scaleY: 1.2 },
        {
          opacity: 0,
          scaleY: 0.2,
          x: (i: number) => Math.cos(angles[i]) * rand(90, 220),
          y: (i: number) => Math.sin(angles[i]) * rand(70, 200) + 30,
          duration: () => rand(0.5, 0.95),
          ease: 'expo.out',
        },
        'impact',
      )
      // 3. Enfriar: el hexágono pasa de naranja a acero
      .to(q('.hex'), { stroke: '#f2efe8', filter: 'drop-shadow(0 0 0px rgba(255,91,20,0))', duration: 0.9, ease: 'power1.out' }, 'impact+=0.12')
      .to(q('.heat'), { opacity: 0.22, scale: 1.35, duration: 1.1 }, 'impact')
      .call(() => (statusEl.textContent = 'Listo para entrenar'), [], 'impact+=0.3')
      .set(q('.word'), { opacity: 1 }, 'impact+=0.18')
      .fromTo(q('.word span'), { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'expo.out', stagger: 0.05 }, 'impact+=0.18')
      .fromTo(q('.motto'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 'impact+=0.55')
      // 4. Salida: se apaga el escenario y la pantalla se abre en diagonal
      .addLabel('exit', 'impact+=1.35')
      .to(q('.stage, .hud, .skip'), { opacity: 0, scale: 1.08, duration: 0.35, ease: 'power2.in' }, 'exit')
      .to(q('.seam line'), { strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, 'exit+=0.05')
      .call(() => this.motion.introDone.set(true), [], 'exit+=0.4')
      .to(q('.door-a'), { xPercent: -100, yPercent: -100, duration: 1, ease: 'expo.inOut' }, 'exit+=0.4')
      .to(q('.door-b'), { xPercent: 100, yPercent: 100, duration: 1, ease: 'expo.inOut' }, 'exit+=0.4')
      .to(q('.seam'), { opacity: 0, duration: 0.3 }, 'exit+=0.55');
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
