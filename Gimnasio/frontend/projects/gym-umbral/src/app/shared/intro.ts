import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Intro de marca (motion graphics), con la lógica de la intro de Audi de las referencias:
 * la luz construye la escena.
 * 1. En negro, el arco del logo se enciende como un tubo de neón (parpadeo + resplandor).
 * 2. Aparece UMBRAL y la línea de la base se alarga por toda la pantalla: una tira LED.
 * 3. La luz de la tira "ilumina" la página: el velo negro se abre desde la línea hacia arriba y
 *    hacia abajo y deja ver la portada real (no depende de una imagen dentro del logo).
 * 4. El logo vuela a su lugar en la barra de navegación.
 * Viene en el HTML prerenderizado para tapar desde el primer cuadro; si el JS no carga, una
 * animación CSS lo retira sola.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="veil"></div>
        <canvas class="motes"></canvas>
        <div class="strip"><i></i></div>
        <div class="flare"></div>
        <div class="mark-wrap">
          <svg class="mark" viewBox="0 0 40 48">
            <g class="glow">
              <path class="arch arch-l" d="M8 44V18a12 12 0 0 1 12-12" pathLength="1" />
              <path class="arch arch-r" d="M32 44V18A12 12 0 0 0 20 6" pathLength="1" />
              <path class="beam" d="M20 12v32" />
              <path class="base" d="M2 44h36" />
            </g>
          </svg>
        </div>
        <div class="word">
          <span class="letters">@for (l of letters; track $index) {<b>{{ l }}</b>}</span>
          <small>Boutique fitness club · Aguascalientes</small>
        </div>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: 200; pointer-events: none; animation: fallback-out 900ms ease 7s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    .veil { position: absolute; inset: 0; background: #050504; }
    .motes { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; }
    .strip { position: absolute; left: 0; right: 0; top: 0; height: 2px; transform: scaleX(0.05); opacity: 0; }
    .strip i { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, #f3d5a1 18%, #fff3dc 50%, #f3d5a1 82%, transparent); box-shadow: 0 0 10px 1px rgb(243 213 161 / 90%), 0 0 40px 6px rgb(243 213 161 / 45%), 0 0 120px 30px rgb(216 185 138 / 20%); }
    .flare { position: absolute; left: 50%; top: 0; width: 70vw; height: 220px; margin: -110px 0 0 -35vw; border-radius: 50%; background: radial-gradient(ellipse at center, rgb(243 213 161 / 28%), rgb(243 213 161 / 0%) 62%); opacity: 0; }
    .mark-wrap { position: absolute; left: 50%; top: 44%; width: 110px; height: 132px; margin: -66px 0 0 -55px; transform-origin: center; }
    .mark { width: 100%; height: 100%; overflow: visible; }
    .glow { filter: drop-shadow(0 0 3px rgb(243 213 161 / 90%)) drop-shadow(0 0 14px rgb(243 213 161 / 55%)); }
    .arch, .base { fill: none; stroke: #e8c99a; stroke-width: 1.3; stroke-linecap: round; }
    .arch { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .base { opacity: 0; }
    .beam { stroke: #fff1d6; stroke-width: 1.2; stroke-linecap: round; opacity: 0; }
    .word { position: absolute; left: 0; right: 0; top: calc(44% + 96px); display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .letters { display: flex; gap: 0.62em; margin-right: -0.62em; font-size: clamp(1.1rem, 2vw, 1.45rem); font-weight: 500; color: var(--ink); }
    .letters b { font-weight: 500; opacity: 0; }
    .word small { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; color: var(--muted); opacity: 0; }
    .skip { position: absolute; top: clamp(20px, 4vw, 40px); right: clamp(20px, 4vw, 56px); pointer-events: auto; font-size: 0.64rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); padding: 10px 0; transition: color 300ms ease, scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .skip:active { scale: 0.95; }
    @media (hover: hover) and (pointer: fine) { .skip:hover { color: var(--gold); } }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
  protected readonly letters = 'UMBRAL'.split('');
  private timeline?: gsap.core.Timeline;
  private raf = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => typeof cancelAnimationFrame !== 'undefined' && cancelAnimationFrame(this.raf));
    afterNextRender(() => requestAnimationFrame(() => this.play()));
  }

  private play() {
    const root = this.root()?.nativeElement;
    if (!root) return this.finish();
    const { gsap } = useGsap();
    root.classList.add('is-running');
    this.motion.stop();

    if (prefersReducedMotion()) {
      gsap.to(root, { autoAlpha: 0, duration: 0.5, delay: 0.2, onComplete: () => this.finish() });
      return;
    }

    const q = gsap.utils.selector(root);
    const veil = q('.veil')[0] as HTMLElement;
    const markWrap = q('.mark-wrap')[0] as HTMLElement;
    const rect = markWrap.getBoundingClientRect();
    const lineY = rect.top + rect.height * (44 / 48);
    gsap.set(q('.strip, .flare'), { top: lineY });

    // Velo con un hueco horizontal que crece desde la tira de luz.
    const light = { h: 0 };
    const setVeil = () => {
      const h = light.h;
      const soft = Math.max(40, h * 0.55);
      const mask = `linear-gradient(to bottom, #000 ${lineY - h - soft}px, transparent ${lineY - h}px, transparent ${lineY + h}px, #000 ${lineY + h + soft}px)`;
      veil.style.maskImage = mask;
      veil.style.webkitMaskImage = mask;
    };
    const maxH = Math.max(lineY, innerHeight - lineY) + 60;

    // Polvo suspendido que brilla cerca de la tira.
    this.startMotes(q('.motes')[0] as HTMLCanvasElement, lineY);

    // Destino del logo: la marca de la barra de navegación.
    const navMark = document.querySelector<HTMLElement>('.nav .brand .mark');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => this.finish() });
    this.timeline = tl;
    tl
      // 1. El neón se enciende: la base y la línea central parpadean, el arco sube desde la base
      .to(q('.base'), { keyframes: { opacity: [0, 0.7, 0.1, 0.9, 0.35, 1] }, duration: 0.7, ease: 'none' }, 0.35)
      .to(q('.arch'), { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 0.55)
      .to(q('.beam'), { keyframes: { opacity: [0, 0.8, 0.2, 1, 0.5, 0.9] }, duration: 0.6, ease: 'none' }, 1.05)
      .fromTo(q('.glow'), { filter: 'drop-shadow(0 0 0px rgba(243,213,161,0)) drop-shadow(0 0 0px rgba(243,213,161,0))' }, { filter: 'drop-shadow(0 0 3px rgba(243,213,161,0.95)) drop-shadow(0 0 16px rgba(243,213,161,0.6))', duration: 1, ease: 'power1.inOut' }, 0.6)
      .to(q('.motes'), { opacity: 1, duration: 1.6, ease: 'power1.inOut' }, 0.6)
      // 2. La marca
      .fromTo(q('.letters b'), { opacity: 0, filter: 'blur(6px)', y: 8 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, stagger: 0.07 }, 1.35)
      .to(q('.word small'), { opacity: 1, duration: 0.8 }, 1.7)
      // 3. La base se vuelve una tira LED de lado a lado
      .addLabel('strip', 2.45)
      .set(q('.strip'), { opacity: 1 }, 'strip')
      .to(q('.base'), { opacity: 0, duration: 0.2 }, 'strip')
      .to(q('.strip'), { scaleX: 1, duration: 1.05, ease: 'expo.inOut' }, 'strip')
      .to(q('.flare'), { opacity: 1, duration: 0.9, ease: 'power2.out' }, 'strip+=0.3')
      .to(q('.word'), { opacity: 0, y: 10, duration: 0.45, ease: 'power2.in' }, 'strip+=0.1')
      // 4. La luz ilumina la escena y el logo vuela a la barra
      .addLabel('reveal', 'strip+=0.95')
      .call(() => this.motion.introDone.set(true), [], 'reveal+=0.15')
      .to(light, { h: maxH, duration: 1.5, ease: 'power2.inOut', onUpdate: setVeil }, 'reveal')
      .to(q('.strip'), { opacity: 0, duration: 0.9, ease: 'power1.in' }, 'reveal+=0.5')
      .to(q('.flare'), { opacity: 0, duration: 0.9 }, 'reveal+=0.4')
      .to(q('.motes'), { opacity: 0, duration: 1 }, 'reveal+=0.6')
      .to(q('.skip'), { opacity: 0, duration: 0.3 }, 'reveal');

    if (navMark) {
      const target = navMark.getBoundingClientRect();
      const dx = target.left + target.width / 2 - (rect.left + rect.width / 2);
      const dy = target.top + target.height / 2 - (rect.top + rect.height / 2);
      const scale = target.height / rect.height;
      gsap.set(navMark, { opacity: 0 });
      tl.to(markWrap, { x: dx, y: dy, scale, duration: 1.25, ease: 'expo.inOut' }, 'reveal+=0.1')
        .set(navMark, { opacity: 1 }, 'reveal+=1.35')
        .to(markWrap, { opacity: 0, duration: 0.25 }, 'reveal+=1.32');
    } else {
      tl.to(markWrap, { opacity: 0, scale: 0.6, duration: 0.8 }, 'reveal');
    }
  }

  private startMotes(canvas: HTMLCanvasElement, lineY: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random() * innerWidth,
      y: lineY + (Math.random() - 0.5) * innerHeight * 0.7,
      r: 0.4 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.05 - Math.random() * 0.18,
      p: Math.random() * Math.PI * 2,
    }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < lineY - innerHeight * 0.4) m.y = lineY + innerHeight * 0.35;
        const near = Math.max(0, 1 - Math.abs(m.y - lineY) / (innerHeight * 0.35));
        const flicker = 0.6 + 0.4 * Math.sin(t / 600 + m.p);
        ctx.fillStyle = `rgba(243, 213, 161, ${(0.08 + near * 0.55) * flicker})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  protected skip() {
    this.timeline?.kill();
    const nav = document.querySelector<HTMLElement>('.nav .brand .mark');
    if (nav) nav.style.opacity = '1';
    this.finish();
  }

  private finish() {
    cancelAnimationFrame(this.raf);
    this.motion.introDone.set(true);
    this.motion.resume();
    this.visible.set(false);
  }
}
