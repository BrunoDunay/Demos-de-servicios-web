import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { CLINIC } from '../core/content';
import { Clinic, openStatus } from '../core/clinic';
import { Motion, hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';

/**
 * Portada: la foto está en penumbra y la "lámpara" del consultorio la ilumina donde está el cursor.
 * En celular (sin cursor) la luz se pasea sola despacio. El título entra palabra por palabra
 * cuando termina la intro.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="hero" #root>
      <div class="page grid">
        <div class="copy">
          @if (status(); as s) {
            <p class="status-pill" [class.open]="s.open"><i></i>{{ s.text }}</p>
          } @else {
            <p class="status-pill"><i></i>Lunes a sábado</p>
          }
          <h1 class="title">Una sonrisa que no tienes que <em>esconder</em>.</h1>
          <p class="lead">Odontología general y estética en Aguascalientes. Te explicamos todo en la pantalla, te damos el plan con precios por escrito y nada cambia en la caja.</p>
          <div class="actions">
            <button type="button" class="btn" (click)="clinic.book()">Agendar valoración <app-icon name="arrow-right" [size]="18" /></button>
            <button type="button" class="btn ghost" (click)="clinic.go('tratamientos')">Ver tratamientos</button>
          </div>
          <dl class="facts">
            <div><dt>Valoración</dt><dd>$350 <span>con radiografía</span></dd></div>
            <div><dt>Google</dt><dd>{{ rating }} <span>★ · {{ reviews }} reseñas</span></dd></div>
            <div><dt>Urgencias</dt><dd>El mismo día</dd></div>
          </dl>
        </div>
        <figure class="photo" #photo>
          <img class="dim" src="media/hero-paciente.webp" srcset="media/hero-paciente-sm.webp 820w, media/hero-paciente.webp 1800w" sizes="(max-width: 900px) 100vw, 50vw" alt="Paciente sonriendo en el sillón dental de Marfil" width="1800" height="1200" fetchpriority="high" />
          <img class="lit" src="media/hero-paciente.webp" srcset="media/hero-paciente-sm.webp 820w, media/hero-paciente.webp 1800w" sizes="(max-width: 900px) 100vw, 50vw" alt="" aria-hidden="true" width="1800" height="1200" />
          <figcaption><app-icon name="sparkle" [size]="16" /> {{ hint }}</figcaption>
        </figure>
      </div>
    </section>
  `,
  styles: `
    .hero { padding: 128px 0 clamp(60px, 8vw, 110px); }
    .grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(28px, 5vw, 72px); align-items: center; }
    .copy { display: grid; justify-items: start; gap: 22px; }
    .title { font-size: clamp(2.9rem, 7vw, 5.6rem); line-height: 0.98; }
    .title em { color: var(--mint-deep); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .facts { display: grid; grid-template-columns: repeat(3, auto); gap: 8px 32px; margin: 18px 0 0; padding-top: 22px; border-top: 1px solid var(--line); }
    .facts dt { font-size: 0.74rem; font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
    .facts dd { margin: 4px 0 0; font-family: var(--font-display); font-size: 1.5rem; line-height: 1.1; }
    .facts dd span { display: block; font-family: var(--font-body); font-size: 0.8rem; color: var(--muted); }
    .photo { position: relative; margin: 0; aspect-ratio: 4 / 4.6; border-radius: var(--radius-l); overflow: hidden; background: var(--night); --lx: 55%; --ly: 40%; }
    .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 35% 50%; }
    .dim { filter: brightness(0.42) saturate(0.6) contrast(1.05); }
    .lit { -webkit-mask-image: radial-gradient(circle at var(--lx) var(--ly), #000 0, #000 18%, transparent 38%); mask-image: radial-gradient(circle at var(--lx) var(--ly), #000 0, #000 18%, transparent 38%); }
    .js .lit { opacity: 0; transition: opacity 800ms ease; }
    .photo.on .lit { opacity: 1; }
    .reduce-motion .lit { -webkit-mask-image: none; mask-image: none; opacity: 1; }
    figcaption { position: absolute; left: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; color: var(--ivory); background: oklch(19% 0.04 258 / 0.55); backdrop-filter: blur(10px); }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding-top: 104px; }
      .photo { aspect-ratio: 4 / 3.6; order: -1; }
      .facts { grid-template-columns: repeat(3, 1fr); gap: 8px 14px; }
      .facts dd { font-size: 1.2rem; }
    }
  `,
})
export class Hero {
  protected readonly clinic = inject(Clinic);
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly photo = viewChild.required<ElementRef<HTMLElement>>('photo');
  protected readonly rating = CLINIC.rating;
  protected readonly reviews = CLINIC.reviews;
  protected readonly status = signal<{ open: boolean; text: string } | null>(null);
  protected hint = 'Mueve el cursor: es la luz de la lámpara';
  private played = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.status.set(openStatus());
      if (!hasFinePointer()) this.hint = 'La luz de la lámpara, siempre encendida';
      this.lamp(destroyRef);
    });
    effect(() => {
      if (this.motion.introDone() && !this.played) {
        this.played = true;
        queueMicrotask(() => this.enter());
      }
    });
  }

  private enter() {
    const root = this.root().nativeElement;
    this.photo().nativeElement.classList.add('on');
    if (prefersReducedMotion()) return;
    const { gsap, SplitText } = useGsap();
    const split = SplitText.create(root.querySelector('.title')!, { type: 'words', mask: 'words' });
    const tl = gsap.timeline();
    tl.from(split.words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.05 })
      .from(root.querySelectorAll('.status-pill, .lead, .actions, .facts'), { y: 18, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 }, 0.25)
      .from(this.photo().nativeElement, { clipPath: 'inset(12% 10% 12% 10% round 60px)', duration: 1.3, ease: 'expo.out' }, 0);
  }

  /** La luz sigue al cursor con un poco de retraso; en celular se pasea sola. */
  private lamp(destroyRef: DestroyRef) {
    const el = this.photo().nativeElement;
    if (prefersReducedMotion()) return;
    const { gsap } = useGsap();
    const pos = { x: 55, y: 40 };
    const apply = () => {
      el.style.setProperty('--lx', `${pos.x}%`);
      el.style.setProperty('--ly', `${pos.y}%`);
    };
    if (hasFinePointer()) {
      const toX = gsap.quickTo(pos, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
      const toY = gsap.quickTo(pos, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        toX(((e.clientX - r.left) / r.width) * 100);
        toY(((e.clientY - r.top) / r.height) * 100);
      };
      el.addEventListener('pointermove', move);
      destroyRef.onDestroy(() => el.removeEventListener('pointermove', move));
    } else {
      const tween = gsap.to(pos, { keyframes: [{ x: 40, y: 35 }, { x: 62, y: 48 }, { x: 50, y: 30 }, { x: 55, y: 40 }], duration: 9, ease: 'sine.inOut', repeat: -1, onUpdate: apply });
      destroyRef.onDestroy(() => tween.kill());
    }
  }
}
