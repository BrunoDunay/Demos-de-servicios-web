import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { Motion, hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Magnetic } from '../shared/pointer';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Magnetic],
  template: `
    <section class="hero" id="inicio" #root>
      <div class="grid-bg" aria-hidden="true"></div>
      <div class="container layout">
        <div class="copy">
          <span class="tag a-fade">Box funcional · Aguascalientes · Desde 2019</span>
          <h1 class="headline">
            <span class="row"><span class="line">Uno</span></span>
            <span class="row"><span class="line">de los</span></span>
            <span class="row"><span class="line nuestros" >nuestros<b>.</b></span></span>
          </h1>
          <p class="lead a-fade">
            Entrenamiento funcional en grupos de máximo 14 personas, con coach en cada clase. Llegas sin saber; te vas siendo parte.
          </p>
          <div class="actions a-fade">
            <span magnetic><a class="btn" href="#contacto" data-cursor="GRATIS">Clase de prueba gratis <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></a></span>
            <a class="btn btn-ghost" href="#horarios">Ver horarios</a>
          </div>
        </div>

        <div class="media">
          <div class="frame">
            <video autoplay muted loop playsinline preload="auto" poster="media/hero-poster.jpg" aria-label="Atleta preparando la barra con magnesia">
              <source src="media/hero.mp4" type="video/mp4" />
            </video>
            <div class="shade"></div>
            <span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>
            <div class="hud hud-top"><span class="rec"></span> En vivo · WOD #214 <b>{{ clock() }}</b></div>
            <div class="hud hud-bottom">
              <b>AMRAP 14'</b>
              <span>10 wall balls · 10 box jumps · 10 kb swings</span>
            </div>
          </div>
          <div class="stamp" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs><path id="stamp-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <text><textPath href="#stamp-ring" textLength="285" lengthAdjust="spacing">SIN EGO · SIN EXCUSAS · CON TODO ·</textPath></text>
            </svg>
            <span>07</span>
          </div>
        </div>
      </div>
      <a class="cue" href="#manifiesto" aria-label="Bajar a la siguiente sección"><span>Scroll</span><i></i></a>
    </section>
  `,
  styles: `
    .hero { position: relative; min-height: 100svh; padding: 130px 0 90px; display: flex; align-items: center; overflow: hidden; }
    .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 88px 88px; mask-image: radial-gradient(ellipse at 30% 40%, #000 20%, transparent 75%); opacity: 0.5; }
    .layout { position: relative; display: grid; grid-template-columns: 1.35fr 0.85fr; gap: clamp(32px, 5vw, 80px); align-items: center; }
    .headline { margin: 22px 0 0; font-size: clamp(4.2rem, 10.4vw, 10.6rem); line-height: 0.86; }
    .row { display: block; overflow: hidden; padding-bottom: 0.02em; }
    .line { display: inline-block; will-change: transform; }
    .nuestros {
      color: transparent; -webkit-text-stroke: 2px var(--ink);
      background: linear-gradient(90deg, var(--ember) 50%, transparent 50%); background-size: 200% 100%; background-position: 100% 0; -webkit-background-clip: text; background-clip: text;
      transition: background-position 700ms var(--ease-expo), -webkit-text-stroke-color 400ms ease;
    }
    .nuestros b { font-weight: 400; color: var(--ember); -webkit-text-stroke: 0; }
    .nuestros:hover { background-position: 0 0; -webkit-text-stroke-color: var(--ember); }
    .lead { margin-top: 26px; }
    .actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
    .actions > span { display: inline-flex; }

    .media { position: relative; perspective: 1000px; }
    .frame { position: relative; aspect-ratio: 9 / 13.5; max-height: 74svh; margin-left: auto; overflow: hidden; background: var(--bg-3); transform-style: preserve-3d; clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px)); }
    video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgb(11 11 12 / 55%), transparent 30%, transparent 60%, rgb(11 11 12 / 85%)); }
    .corner { position: absolute; width: 26px; height: 26px; border: 2px solid var(--ember); }
    .c1 { top: 16px; left: 16px; border-right: 0; border-bottom: 0; }
    .c2 { top: 16px; right: 16px; border-left: 0; border-bottom: 0; }
    .c3 { bottom: 16px; left: 16px; border-right: 0; border-top: 0; }
    .c4 { bottom: 16px; right: 16px; border-left: 0; border-top: 0; }
    .hud { position: absolute; left: 28px; right: 28px; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; }
    .hud-top { top: 30px; display: flex; align-items: center; gap: 8px; color: var(--ink-2); }
    .hud-top b { margin-left: auto; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
    .rec { width: 8px; height: 8px; border-radius: 50%; background: var(--ember); animation: blink 1.2s steps(2, start) infinite; }
    @keyframes blink { to { visibility: hidden; } }
    .hud-bottom { bottom: 30px; display: flex; flex-direction: column; gap: 4px; color: var(--ink-2); }
    .hud-bottom b { font-family: var(--font-display); font-weight: 400; font-size: 2rem; letter-spacing: 0.02em; color: var(--ember); }
    .stamp { position: absolute; left: -44px; bottom: 12%; width: 116px; height: 116px; display: grid; place-items: center; border-radius: 50%; background: var(--ember); color: var(--bg); }
    .stamp svg { position: absolute; inset: 0; animation: spin 18s linear infinite; }
    .stamp text { font-family: var(--font-mono); font-size: 10px; font-weight: 600; fill: var(--bg); }
    .stamp span { font-family: var(--font-display); font-size: 2.2rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .cue { position: absolute; left: var(--gutter); bottom: 28px; display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--muted); }
    .cue i { position: relative; width: 60px; height: 1px; background: var(--line-2); overflow: hidden; }
    .cue i::after { content: ''; position: absolute; inset: 0; background: var(--ember); animation: cue 2s var(--ease-in-out) infinite; }
    @keyframes cue { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
      .media { max-width: 440px; width: 100%; margin: 12px auto 0; }
      .frame { aspect-ratio: 4 / 5; }
      .stamp { left: auto; right: -12px; bottom: auto; top: -30px; width: 96px; height: 96px; }
      .cue { display: none; }
    }
  `,
})
export class Hero {
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  protected readonly clock = signal('00:00');
  private ready = false;
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const { gsap, ScrollTrigger } = useGsap();
      // Reloj del "WOD en vivo"
      let secs = 0;
      const timer = setInterval(() => {
        secs++;
        this.clock.set(`${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`);
      }, 1000);
      destroyRef.onDestroy(() => clearInterval(timer));

      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.set(q('.line'), { yPercent: 110 });
      gsap.set(q('.a-fade'), { opacity: 0, y: 24 });
      gsap.set(q('.frame'), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(q('.stamp'), { scale: 0, rotation: -90 });

      const ctx = gsap.context(() => {
        // Parallax al hacer scroll
        gsap.to(q('.headline'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(q('.media'), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });

        // Reacción al cursor: líneas con distinta profundidad y video inclinado en 3D
        if (hasFinePointer()) {
          const lines = q('.line').map((el, i) => gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }));
          const rotY = gsap.quickTo(q('.frame'), 'rotationY', { duration: 0.9, ease: 'power3' });
          const rotX = gsap.quickTo(q('.frame'), 'rotationX', { duration: 0.9, ease: 'power3' });
          const move = (e: PointerEvent) => {
            const mx = e.clientX / innerWidth - 0.5;
            const my = e.clientY / innerHeight - 0.5;
            lines.forEach((to, i) => to(mx * (i + 1) * -14));
            rotY(mx * 10);
            rotX(my * -8);
          };
          root.addEventListener('pointermove', move);
        }
      }, root);
      destroyRef.onDestroy(() => {
        ctx.revert();
        ScrollTrigger.refresh();
      });
      this.ready = true;
      if (this.motion.introDone()) this.play();
    });

    effect(() => {
      if (this.motion.introDone() && this.ready) this.play();
    });
  }

  private play() {
    if (this.played) return;
    this.played = true;
    const { gsap } = useGsap();
    const q = gsap.utils.selector(this.root().nativeElement);
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .to(q('.line'), { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.1)
      .to(q('.frame'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0)
      .to(q('.a-fade'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.45)
      .to(q('.stamp'), { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.6)' }, 0.8);
  }
}
