import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { LEAF, scribble, spiral, torn } from '../core/doodles';
import { Practice } from '../core/practice';
import { Motion, hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Arrow } from '../shared/arrow';

const KNOT = scribble(120, 110, 95, 80, 36, 21);
const CALM = spiral(120, 110, 82, 3.6, 140);

/**
 * Portada en collage. A la izquierda "HABLAR AYUDA." en letras condensadas y "empezar también" a mano con
 * una flecha dibujada. A la derecha, la foto de perfil en papel rasgado con cinta, hojas de acuarela y una
 * nota pegada. Sobre la cabeza se dibuja una maraña que, al bajar, se desenreda en espiral.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Arrow],
  template: `
    <section class="hero" #root>
      <div class="page grid">
        <div class="copy">
          <p class="kicker">Psicoterapia · Aguascalientes y en línea</p>
          <h1 class="title"><span class="l1">Hablar</span><span class="l2">ayuda.</span></h1>
          <p class="note hand">
            empezar también
            <svg class="arrow" viewBox="0 0 90 70" aria-hidden="true"><path pathLength="1" d="M6 8 C 30 4, 64 14, 70 50 M58 40 L 70 52 L 80 38" /></svg>
          </p>
          <p class="lead">Terapia para adultos, parejas y adolescentes con Lucía Arenas. Un espacio tranquilo, sin juicios, para entender lo que te pasa y salir con herramientas, no solo con desahogo.</p>
          <div class="actions">
            <button type="button" class="btn t-learn" (click)="practice.book()">Agenda tu primera sesión <app-arrow /></button>
            <button type="button" class="btn ghost" (click)="practice.go('respira')">Respira un minuto</button>
          </div>
        </div>

        <div class="collage" #collage>
          <div class="paper back" data-depth="0.4" [style.clip-path]="tornBack"></div>
          <figure class="photo" data-depth="0.8">
            <span class="tape t1"></span><span class="tape t2"></span>
            <div class="torn" [style.clip-path]="tornPhoto">
              <img src="media/perfil.webp" srcset="media/perfil-sm.webp 820w, media/perfil.webp 1800w" sizes="(max-width: 900px) 90vw, 44vw" alt="Mujer de perfil con los ojos cerrados, en calma" width="1800" height="1200" fetchpriority="high" />
            </div>
            <svg class="knot" viewBox="0 0 240 220" aria-hidden="true"><path [attr.d]="knot" /></svg>
          </figure>
          <svg class="leaves" viewBox="-10 -40 200 120" data-depth="1.3" aria-hidden="true">
            <path [attr.d]="leaf" transform="translate(10 40) rotate(-30)" />
            <path [attr.d]="leaf" transform="translate(40 50) rotate(-60) scale(1.2)" />
            <path [attr.d]="leaf" transform="translate(70 46) rotate(-10) scale(0.9)" />
            <path class="stem" d="M0 70 C 40 52, 80 40, 140 10" />
          </svg>
          <div class="sticky" data-depth="1.6">
            <span class="tape t3"></span>
            <p class="hand">primera sesión<br /><b>$600</b></p>
            <small>sin compromiso de seguir</small>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; padding: 128px 0 clamp(70px, 9vw, 120px); overflow: hidden; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 4vw, 60px); align-items: center; }
    .copy { position: relative; display: grid; justify-items: start; gap: 18px; }
    .title { display: grid; font-size: clamp(5rem, 14.5vw, 12rem); text-transform: uppercase; line-height: 0.82; letter-spacing: -0.03em; font-stretch: 75%; font-weight: 800; }
    .l1 { color: var(--ink); }
    .l2 { color: var(--peach); }
    .note { position: relative; margin: -6px 0 26px 34%; font-size: clamp(1.8rem, 3.2vw, 2.6rem); color: var(--sage-deep); rotate: -4deg; }
    .arrow { position: absolute; left: -58px; top: 18px; width: 54px; overflow: visible; fill: none; stroke: var(--sage-deep); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transform: scaleX(-1); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; }
    .collage { position: relative; aspect-ratio: 1 / 1.05; }
    .paper.back { position: absolute; inset: 6% 2% 10% 12%; background: var(--dusty-soft); rotate: -5deg; }
    .photo { position: absolute; inset: 0 8% 14% 0; margin: 0; rotate: 2deg; filter: drop-shadow(0 18px 24px oklch(27% 0.055 255 / 0.22)); }
    .torn { position: absolute; inset: 0; overflow: hidden; background: var(--dusty); }
    /* Foto en blanco y negro entonada en azul, como el collage de referencia */
    .torn img { width: 100%; height: 100%; object-fit: cover; object-position: 70% 100%; scale: 1.45; transform-origin: 66% 92%; filter: grayscale(1) contrast(1.08) brightness(1.06); mix-blend-mode: multiply; }
    .t1 { top: -10px; left: 12%; rotate: -8deg; }
    .t2 { top: -6px; right: 10%; rotate: 6deg; }
    .knot { position: absolute; left: 24%; top: -1%; width: 40%; overflow: visible; }
    .knot path { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; }
    .leaves { position: absolute; left: -6%; bottom: 2%; width: 42%; overflow: visible; transform-origin: 0 100%; animation: sway 6s var(--ease-calm) infinite alternate; }
    .leaves path { fill: var(--dusty); opacity: 0.55; mix-blend-mode: multiply; }
    .leaves path:nth-child(2) { fill: var(--navy); opacity: 0.45; }
    .leaves .stem { fill: none; stroke: var(--navy); stroke-width: 1.6; opacity: 0.6; }
    @keyframes sway { to { rotate: 4deg; } }
    .sticky { position: absolute; right: 0; bottom: 0; display: grid; gap: 2px; padding: 22px 22px 18px; width: 200px; background: var(--peach-soft); rotate: -3deg; box-shadow: var(--shadow-paper); }
    .sticky .hand { font-size: 1.6rem; color: var(--ink); }
    .sticky b { font-family: var(--font-display); font-stretch: 75%; font-size: 2.6rem; font-weight: 800; color: var(--peach-deep); }
    .sticky small { font-size: 0.78rem; color: var(--ink-2); }
    .t3 { top: -12px; left: 50%; translate: -50% 0; rotate: -4deg; width: 70px; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding-top: 104px; }
      .collage { max-width: 520px; width: 100%; justify-self: center; }
      .note { margin-left: 22%; }
    }
    /* Microinteracciones: la flecha se vuelve a dibujar, las cintas se despegan un poco y la nota levanta la esquina */
    .arrow path { stroke-dasharray: 1; }
    .t1, .t2 { transition: rotate 500ms var(--ease-bounce), scale 500ms var(--ease-bounce); }
    .sticky { transition: rotate 500ms var(--ease-bounce), translate 500ms var(--ease-bounce), box-shadow 400ms ease; }
    .sticky::after { content: ''; position: absolute; right: 0; bottom: 0; width: 0; height: 0; background: linear-gradient(135deg, var(--peach) 50%, transparent 50%); box-shadow: -2px -2px 4px oklch(27% 0.055 255 / 0.12); transition: width 400ms var(--ease-bounce), height 400ms var(--ease-bounce); }
    @media (hover: hover) and (pointer: fine) {
      .note:hover .arrow path { animation: redraw 900ms var(--ease-smooth-out); }
      .photo:hover .t1 { rotate: -14deg; scale: 1.08; }
      .photo:hover .t2 { rotate: 12deg; scale: 1.08; }
      .sticky:hover { rotate: 2deg; translate: 0 -6px; box-shadow: var(--shadow-lift); }
      .sticky:hover::after { width: 26px; height: 26px; }
    }
    @keyframes redraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  `,
})
export class Hero {
  protected readonly practice = inject(Practice);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly collage = viewChild.required<ElementRef<HTMLElement>>('collage');
  protected readonly knot = KNOT;
  protected readonly leaf = LEAF;
  protected readonly tornPhoto = torn(3, 2.2);
  protected readonly tornBack = torn(9, 3);
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.wire(destroyRef));
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
    const { gsap } = useGsap();
    const knot = root.querySelector<SVGPathElement>('.knot path')!;
    const arrow = root.querySelector<SVGPathElement>('.arrow path')!;
    const len = knot.getTotalLength();
    const alen = arrow.getTotalLength();
    gsap.set(knot, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(arrow, { strokeDasharray: alen, strokeDashoffset: alen });
    gsap.timeline()
      .from(root.querySelectorAll('.l1, .l2'), { yPercent: 100, opacity: 0, rotate: 3, duration: 1.1, ease: 'expo.out', stagger: 0.1 })
      .from(root.querySelectorAll('.kicker, .lead, .actions'), { y: 16, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.3)
      .from(root.querySelector('.note'), { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power2.out' }, 0.6)
      .to(arrow, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 1.2)
      .from(root.querySelector('.paper.back'), { scale: 0.8, opacity: 0, rotate: -14, duration: 1.1, ease: 'expo.out' }, 0.1)
      .from(root.querySelector('.photo'), { y: 60, opacity: 0, rotate: 8, duration: 1.2, ease: 'expo.out' }, 0.2)
      .from(root.querySelectorAll('.tape'), { scaleX: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.1 }, 0.9)
      .from(root.querySelector('.sticky'), { y: 40, rotate: 12, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, 1)
      .from(root.querySelector('.leaves'), { scale: 0.6, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.8)
      .to(knot, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.9)
      .call(() => knot.style.removeProperty('stroke-dasharray'));
  }

  /** Al bajar, la maraña se desenreda en espiral; las piezas del collage se mueven con el cursor. */
  private wire(destroyRef: DestroyRef) {
    if (prefersReducedMotion()) return;
    const { gsap } = useGsap();
    const root = this.root().nativeElement;
    const knot = root.querySelector<SVGPathElement>('.knot path')!;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom 35%', scrub: 0.8 } });
    tl.to(knot, { morphSVG: CALM, ease: 'none' }, 0).to(root.querySelector('.knot'), { rotate: 180, ease: 'none' }, 0);

    const pieces = Array.from(this.collage().nativeElement.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      d: Number(el.dataset['depth']),
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      pieces.forEach((p) => {
        p.x(nx * 22 * p.d);
        p.y(ny * 18 * p.d);
      });
    };
    if (hasFinePointer()) addEventListener('pointermove', move, { passive: true });
    destroyRef.onDestroy(() => {
      removeEventListener('pointermove', move);
      tl.scrollTrigger?.kill();
      tl.kill();
    });
  }
}
