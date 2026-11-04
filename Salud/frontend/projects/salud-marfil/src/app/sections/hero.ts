import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { CLINIC } from '../core/content';
import { Clinic, openStatus } from '../core/clinic';
import { Motion, hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Arrow, Magnetic } from '../shared/magnetic';
import { ToothSlot } from '../shared/tooth-stage';

const AVATARS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4'];

/**
 * Portada. Izquierda: título en fino con la palabra clave en negritas, botones magnéticos y una fila de
 * pacientes que se levantan al pasar el cursor (transitions.dev "Avatar group hover").
 * Derecha: panel azul hielo con arcos concéntricos, la foto dentro de un arco, tarjetas de vidrio que se
 * mueven con el cursor y el lugar donde aterriza el diente 3D. Al fondo, "sonrisa" gigante recortada.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Magnetic, Arrow, ToothSlot],
  template: `
    <section class="hero" #root>
      <p class="giant word" aria-hidden="true">sonrisa</p>
      <div class="page grid">
        <div class="copy">
          <p class="pill">
            @if (status(); as s) {
              <i [class.open]="s.open"></i>{{ s.text }}
            } @else {
              Clínica dental · Aguascalientes
            }
          </p>
          <h1 class="title">Tu sonrisa, <b>tu mejor</b> carta de presentación.</h1>
          <p class="lead">Odontología general y estética con tecnología digital. Te explicamos todo en la pantalla y el plan con precios va por escrito.</p>
          <div class="actions">
            <button type="button" class="btn t-learn" magnetic (click)="clinic.book()">Agenda tu valoración <app-arrow /></button>
            <button type="button" class="btn ghost t-learn" magnetic (click)="clinic.go('tratamientos')">Ver tratamientos <app-arrow /></button>
          </div>
          <div class="proof">
            <div class="avatars" (pointerleave)="lift(-1)">
              @for (a of avatars; track a; let i = $index) {
                <img class="t-avatar" [style.--shift.px]="shift(i)" [style.--scale-active]="hovered() === i ? 1.08 : 1" [src]="'media/' + a + '.webp'" alt="" width="96" height="96" (pointerenter)="lift(i)" />
              }
              <span class="more">+4.8k</span>
            </div>
            <p><b>{{ rating }} ★</b> en Google<br /><span>{{ reviews }} reseñas de pacientes</span></p>
          </div>
        </div>

        <div class="visual" #visual>
          <div class="panel">
            <svg class="arcs" viewBox="0 0 400 400" aria-hidden="true" preserveAspectRatio="none">
              <path d="M40 400V170a160 160 0 0 1 320 0v230" />
              <path d="M70 400V175a130 130 0 0 1 260 0v225" />
              <path d="M100 400V180a100 100 0 0 1 200 0v220" />
            </svg>
            <figure class="arch">
              <img src="media/hero-sonrisa.webp" srcset="media/hero-sonrisa-sm.webp 820w, media/hero-sonrisa.webp 1800w" sizes="(max-width: 900px) 80vw, 36vw" alt="Paciente sonriendo después de su blanqueamiento" width="1800" height="2700" fetchpriority="high" />
            </figure>
          </div>
          <div class="slot" toothSlot="hero"></div>
          <div class="chip c1" data-depth="1.2"><span class="ico">★</span><b>{{ rating }}</b><small>Google · {{ reviews }} reseñas</small></div>
          <div class="chip c2" data-depth="0.7"><span class="ico">$</span><b>Valoración $350</b><small>con radiografía panorámica</small></div>
          <div class="chip c3" data-depth="1.6"><span class="ico">✓</span><b>Urgencias hoy</b><small>lunes a sábado</small></div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; padding: 130px 0 clamp(60px, 8vw, 100px); overflow: hidden; }
    .word { left: 50%; bottom: -0.12em; translate: -50% 0; font-size: clamp(8rem, 26vw, 25rem); color: transparent; -webkit-text-stroke: 1.5px var(--ice-3); }
    .grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 4vw, 64px); align-items: center; }
    .copy { display: grid; justify-items: start; gap: 22px; }
    .pill i { width: 8px; height: 8px; border-radius: 50%; background: var(--closed); }
    .pill i.open { background: var(--ok); }
    .title { font-size: clamp(2.9rem, 6.4vw, 5.4rem); }
    .title b { color: var(--royal); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
    .proof { display: flex; align-items: center; gap: 16px; margin-top: 14px; padding-top: 22px; border-top: 1px solid var(--line); }
    .proof p { font-size: 0.92rem; line-height: 1.35; }
    .proof p span { color: var(--muted); font-size: 0.84rem; }
    .avatars { display: flex; align-items: center; padding: 6px 0; }
    /* transitions.dev "Avatar group hover": el que tocas sube más y los vecinos menos */
    .t-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 3px solid var(--ice); margin-left: -12px; transform: translateY(var(--shift, 0px)) scale(var(--scale-active, 1)); transition: transform 320ms var(--ease-smooth-out); }
    .t-avatar:first-child { margin-left: 0; }
    .avatars:not(:hover) .t-avatar { transition-timing-function: var(--ease-bounce-strong); }
    .more { display: grid; place-items: center; width: 44px; height: 44px; margin-left: -12px; border-radius: 50%; border: 3px solid var(--ice); background: var(--royal); color: var(--white); font-size: 0.72rem; font-weight: 700; }
    .visual { position: relative; aspect-ratio: 1 / 1.08; }
    .panel { position: absolute; inset: 0 6% 0 0; border-radius: var(--radius-xl); background: linear-gradient(160deg, var(--ice-2), var(--ice-3)); overflow: hidden; }
    .arcs { position: absolute; inset: 0; width: 100%; height: 100%; fill: none; stroke: var(--white); stroke-width: 1.4; opacity: 0.9; }
    .arcs path { stroke-dasharray: 1400; stroke-dashoffset: 1400; animation: draw 2.4s var(--ease-smooth-out) forwards; }
    .arcs path:nth-child(2) { animation-delay: 0.15s; }
    .arcs path:nth-child(3) { animation-delay: 0.3s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    .arch { position: absolute; left: 25%; right: 25%; bottom: 0; top: 18%; margin: 0; border-radius: 999px 999px 0 0; overflow: hidden; }
    .arch img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; transition: scale 1200ms var(--ease-smooth-out); }
    @media (hover: hover) and (pointer: fine) { .visual:hover .arch img { scale: 1.04; } }
    .slot { position: absolute; left: -6%; bottom: 4%; width: 36%; aspect-ratio: 1 / 1.25; }
    .chip { position: absolute; display: grid; grid-template-columns: auto 1fr; column-gap: 10px; align-items: center; padding: 12px 16px 12px 12px; border-radius: 18px; background: var(--glass); backdrop-filter: blur(16px) saturate(1.5); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.7), var(--shadow-m); font-size: 0.92rem; line-height: 1.2; will-change: transform; }
    .chip .ico { grid-row: span 2; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: var(--royal); color: var(--white); font-weight: 700; }
    .chip small { color: var(--muted); font-size: 0.76rem; }
    .c1 { top: 12%; right: 0; }
    .c2 { top: 44%; right: -2%; }
    .c3 { bottom: 8%; right: 14%; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding-top: 110px; }
      .visual { max-width: 520px; width: 100%; justify-self: center; }
      .c2 { display: none; }
      .slot { left: -2%; width: 38%; }
    }
  `,
})
export class Hero {
  protected readonly clinic = inject(Clinic);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly visual = viewChild.required<ElementRef<HTMLElement>>('visual');
  protected readonly rating = CLINIC.rating;
  protected readonly reviews = CLINIC.reviews;
  protected readonly avatars = AVATARS;
  protected readonly status = signal<{ open: boolean; text: string } | null>(null);
  protected readonly hovered = signal(-1);
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.status.set(openStatus());
      this.parallax(destroyRef);
    });
    effect(() => {
      if (this.motion.introDone() && !this.played) {
        this.played = true;
        queueMicrotask(() => this.enter());
      }
    });
  }

  protected lift(i: number) {
    this.hovered.set(i);
  }

  /** Levanta el avatar tocado y, menos, a sus vecinos (caída de 0.45 por posición). */
  protected shift(i: number) {
    const h = this.hovered();
    if (h < 0) return 0;
    return -6 * Math.pow(0.45, Math.abs(i - h));
  }

  private enter() {
    if (prefersReducedMotion()) return;
    const root = this.root().nativeElement;
    const { gsap, SplitText } = useGsap();
    const split = SplitText.create(root.querySelector('.title')!, { type: 'words', mask: 'words' });
    gsap.timeline()
      .from(split.words, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.15)
      .from(root.querySelectorAll('.pill, .lead, .actions, .proof'), { y: 20, opacity: 0, filter: 'blur(4px)', duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.35)
      .from(root.querySelector('.panel'), { clipPath: 'inset(30% 30% 0% 30% round 200px)', duration: 1.4, ease: 'expo.out' }, 0)
      .from(root.querySelector('.arch img'), { scale: 1.25, duration: 1.6, ease: 'expo.out' }, 0)
      .from(root.querySelectorAll('.chip'), { y: 30, opacity: 0, scale: 0.9, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.12 }, 0.6)
      .from(root.querySelector('.word'), { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.2);
  }

  /** Las tarjetas de vidrio se mueven con el cursor a distinta profundidad; con scroll, la palabra de fondo se desliza. */
  private parallax(destroyRef: DestroyRef) {
    if (prefersReducedMotion()) return;
    const { gsap } = useGsap();
    const root = this.root().nativeElement;
    const chips = Array.from(root.querySelectorAll<HTMLElement>('.chip')).map((el) => ({
      d: Number(el.dataset['depth']),
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      chips.forEach((c) => {
        c.x(nx * 26 * c.d);
        c.y(ny * 22 * c.d);
      });
    };
    if (hasFinePointer()) addEventListener('pointermove', move, { passive: true });
    const tween = gsap.to(root.querySelector('.word'), { xPercent: -12, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    destroyRef.onDestroy(() => {
      removeEventListener('pointermove', move);
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  }
}
