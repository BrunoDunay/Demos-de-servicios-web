import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Motion, hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-home-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RouterLink],
  template: `
    <section class="hero" #root>
      <div class="frame">
        <video class="bg" autoplay muted loop playsinline preload="auto" poster="media/hero-poster.jpg" aria-hidden="true">
          <source src="media/hero.mp4" type="video/mp4" />
        </video>
        <div class="dim"></div>
        <div class="light"></div>
        <div class="grain"></div>
      </div>

      <div class="container content">
        <h1 class="title">
          <span class="l1">Cruza el</span>
          <em class="l2 gold">umbral.</em>
        </h1>
        <div class="bottom">
          <p class="tagline a-in">Boutique fitness club · Aguascalientes</p>
          <a routerLink="/contacto" class="btn btn-solid a-in" data-cursor="Entra">Primera sesión de cortesía <span class="arrow"><app-icon name="arrow-right" [size]="14" /></span></a>
        </div>
      </div>

      <div class="scroll a-in" aria-hidden="true"><span>Desliza</span><i></i></div>
    </section>
  `,
  styles: `
    .hero { position: relative; height: 100svh; min-height: 640px; display: flex; align-items: flex-end; padding-bottom: clamp(60px, 9vh, 110px); }
    .frame { position: absolute; inset: 0; overflow: hidden; will-change: clip-path; }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); }
    .dim {
      position: absolute; inset: 0; background: rgb(13 12 10 / 58%);
      -webkit-mask-image: radial-gradient(circle 300px at var(--x, 70%) var(--y, 40%), transparent 0%, #000 100%);
      mask-image: radial-gradient(circle 300px at var(--x, 70%) var(--y, 40%), transparent 0%, #000 100%);
    }
    .light { position: absolute; inset: 0; background: radial-gradient(circle 360px at var(--x, 70%) var(--y, 40%), rgb(243 213 161 / 16%), transparent 70%); mix-blend-mode: screen; }
    .frame::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgb(13 12 10 / 60%) 0%, transparent 30%, transparent 55%, rgb(13 12 10 / 92%) 100%); }
    .grain { position: absolute; inset: 0; opacity: 0.08; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
    .content { position: relative; z-index: 2; }
    .title { margin-top: 24px; font-size: clamp(4.4rem, 13.2vw, 14rem); line-height: 0.84; letter-spacing: -0.03em; }
    .l1 { display: block; }
    .l2 { display: block; padding-left: 0.9em; }
    .bottom { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 40px; padding-top: 22px; border-top: 1px solid var(--line); }
    .tagline { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-2); }


    .scroll { position: absolute; z-index: 3; left: 0; right: 0; margin-inline: auto; width: fit-content; bottom: 26px; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.32em; text-transform: uppercase; color: var(--muted); }
    .scroll i { width: 1px; height: 46px; background: linear-gradient(var(--gold), transparent); animation: breathe 2.4s ease-in-out infinite; transform-origin: top; }
    @keyframes breathe { 0%, 100% { transform: scaleY(0.4); opacity: 0.5; } 50% { transform: scaleY(1); opacity: 1; } }
    @media (max-width: 600px) { .l2 { padding-left: 0.4em; } .scroll { display: none; } }
  `,
})
export class HomeHero {
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private ready = false;
  private played = false;
  private chars: Element[] = [];

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const frame = root.querySelector<HTMLElement>('.frame')!;
      const { gsap, ScrollTrigger, SplitText } = useGsap();

      // Luz que sigue al cursor (en touch se mueve sola en un recorrido suave)
      const setLight = (x: number, y: number) => {
        frame.style.setProperty('--x', `${x}px`);
        frame.style.setProperty('--y', `${y}px`);
      };
      let raf = 0;
      if (hasFinePointer()) {
        const pos = { x: innerWidth * 0.7, y: innerHeight * 0.4 };
        const xTo = gsap.quickTo(pos, 'x', { duration: 0.8, ease: 'power3', onUpdate: () => setLight(pos.x, pos.y) });
        const yTo = gsap.quickTo(pos, 'y', { duration: 0.8, ease: 'power3', onUpdate: () => setLight(pos.x, pos.y) });
        const move = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        root.addEventListener('pointermove', move);
        destroyRef.onDestroy(() => root.removeEventListener('pointermove', move));
      } else if (!prefersReducedMotion()) {
        const loop = (t: number) => {
          setLight(innerWidth * (0.5 + 0.3 * Math.sin(t / 2600)), innerHeight * (0.42 + 0.14 * Math.cos(t / 1900)));
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }
      destroyRef.onDestroy(() => cancelAnimationFrame(raf));

      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.set(q('.a-in'), { opacity: 0, y: 26 });
      const split = SplitText.create(q('.title')[0], { type: 'chars', mask: 'chars' });
      this.chars = split.chars;
      gsap.set(this.chars, { yPercent: 115 });

      const ctx = gsap.context(() => {
        // Al hacer scroll, la portada se recoge en una tarjeta y el contenido sube.
        gsap.fromTo(frame, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(6% 4% 6% 4% round 28px)', ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(q('.content'), { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: root, start: '30% top', end: 'bottom top', scrub: true } });
      }, root);
      destroyRef.onDestroy(() => {
        ctx.revert();
        split.revert();
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
      .fromTo(q('.bg'), { scale: 1.25 }, { scale: 1.06, duration: 2.6 }, 0)
      .to(this.chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.35)
      .to(q('.a-in'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out' }, 0.9);
  }
}
