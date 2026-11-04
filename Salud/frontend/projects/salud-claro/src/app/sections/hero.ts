import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { Practice } from '../core/practice';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';

/**
 * Portada: el bosque entre niebla. Tres capas de niebla se mueven solas, despacio; al bajar se apartan
 * hacia los lados y la foto se aclara (pasa de desenfocada a nítida). Es la idea del sitio: hablar aclara.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="hero" #root>
      <div class="scene" aria-hidden="true">
        <img class="forest" src="media/bosque.webp" srcset="media/bosque-sm.webp 820w, media/bosque.webp 1800w" sizes="100vw" alt="" width="1800" height="1200" fetchpriority="high" />
        <div class="fog f1"></div>
        <div class="fog f2"></div>
        <div class="fog f3"></div>
      </div>
      <div class="page copy">
        <p class="kicker">Psicoterapia en Aguascalientes y en línea · Valeria Ríos</p>
        <h1 class="title">Hablar ayuda. <em>Empezar también.</em></h1>
        <p class="lead">Terapia para adultos, parejas y adolescentes. Un espacio tranquilo, sin juicios, para entender lo que te pasa y salir con herramientas, no solo con desahogo.</p>
        <div class="actions">
          <button type="button" class="btn" (click)="practice.book()">Agenda tu primera sesión <app-icon name="arrow-right" [size]="18" /></button>
          <button type="button" class="btn ghost" (click)="practice.go('respira')"><app-icon name="wind" [size]="18" /> Respira un minuto</button>
        </div>
      </div>
      <p class="scroll-hint" aria-hidden="true">Baja despacio <app-icon name="arrow-down" [size]="16" /></p>
    </section>
  `,
  styles: `
    .hero { position: relative; min-height: max(100svh, 640px); display: grid; align-items: end; padding: 140px 0 clamp(70px, 10vh, 120px); overflow: hidden; isolation: isolate; }
    .scene { position: absolute; inset: 0; z-index: -1; }
    .forest { position: absolute; inset: -4%; width: 108%; height: 108%; object-fit: cover; filter: blur(6px) saturate(0.75) brightness(1.08); }
    /* Velo para que el texto se lea sobre la foto */
    .scene::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, var(--mist) 2%, oklch(96.4% 0.012 140 / 0.72) 38%, oklch(96.4% 0.012 140 / 0.1) 75%); }
    .fog { position: absolute; width: 140%; height: 70%; left: -20%; border-radius: 50%; background: radial-gradient(closest-side, oklch(97% 0.01 140 / 0.9), transparent); filter: blur(30px); will-change: transform; }
    .f1 { top: 10%; animation: drift 26s var(--ease-calm) infinite alternate; }
    .f2 { top: 34%; opacity: 0.8; animation: drift 34s var(--ease-calm) -8s infinite alternate-reverse; }
    .f3 { top: 52%; opacity: 0.9; animation: drift 30s var(--ease-calm) -14s infinite alternate; }
    @keyframes drift { from { translate: -8% 0; } to { translate: 8% 2%; } }
    .copy { display: grid; justify-items: start; gap: 22px; }
    .kicker { font-size: 0.9rem; font-weight: 560; color: var(--forest-2); }
    .title { font-size: clamp(3.2rem, 9.4vw, 7.6rem); line-height: 0.95; max-width: 11ch; }
    .title em { display: block; color: var(--moss); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .scroll-hint { position: absolute; right: var(--gutter); bottom: 34px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--muted); }
    .scroll-hint .icon { animation: bob 2.6s var(--ease-calm) infinite; }
    @keyframes bob { 50% { translate: 0 5px; } }
    @media (max-width: 700px) { .scroll-hint { display: none; } }
  `,
})
export class Hero {
  protected readonly practice = inject(Practice);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.clearOnScroll(destroyRef));
    effect(() => {
      if (this.motion.introDone() && !this.played) {
        this.played = true;
        queueMicrotask(() => this.enter());
      }
    });
  }

  private enter() {
    if (prefersReducedMotion()) return;
    const root = this.root().nativeElement;
    const { gsap, SplitText } = useGsap();
    const split = SplitText.create(root.querySelector('.title')!, { type: 'words' });
    gsap.timeline()
      .from(split.words, { opacity: 0, filter: 'blur(12px)', y: 14, duration: 1.4, ease: 'sine.out', stagger: 0.09 })
      .from(root.querySelectorAll('.kicker, .lead, .actions'), { opacity: 0, filter: 'blur(8px)', y: 10, duration: 1.2, ease: 'sine.out', stagger: 0.12 }, 0.4);
  }

  /** Al bajar, la niebla se aparta y la foto se enfoca. */
  private clearOnScroll(destroyRef: DestroyRef) {
    if (prefersReducedMotion()) return;
    const root = this.root().nativeElement;
    const { gsap } = useGsap();
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom 30%', scrub: 0.8 } });
    tl.to(root.querySelector('.forest'), { filter: 'blur(0px) saturate(1) brightness(1)', yPercent: 6, ease: 'none' }, 0)
      .to(root.querySelector('.f1'), { xPercent: -45, opacity: 0, ease: 'none' }, 0)
      .to(root.querySelector('.f2'), { xPercent: 45, opacity: 0, ease: 'none' }, 0)
      .to(root.querySelector('.f3'), { xPercent: -30, opacity: 0, ease: 'none' }, 0)
      .to(root.querySelector('.copy'), { yPercent: -12, ease: 'none' }, 0);
    destroyRef.onDestroy(() => {
      tl.scrollTrigger?.kill();
      tl.kill();
    });
  }
}
