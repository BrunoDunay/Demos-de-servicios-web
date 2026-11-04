import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { Clinic } from '../core/clinic';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Arrow, Magnetic } from '../shared/magnetic';
import { Reveal } from '../shared/reveal';

/** Guía de color dental (de más oscuro a más claro). */
const SHADES = ['A3.5', 'A3', 'A2', 'B2', 'A1', 'B1', 'BL'];
const MAX_TINT = 0.62;

/**
 * "Ajusta el brillo de tu sonrisa" (referencia de Bruno): un control de vidrio con un sol chico y uno
 * grande. Al arrastrarlo, los dientes de la foto se aclaran (máscara de dientes de scripts/media-salud.mjs)
 * y la fila de dientes de la guía de color marca el tono. La primera vez que se ve, el control se mueve solo.
 */
@Component({
  selector: 'app-whitening',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Arrow, Magnetic],
  template: `
    <section class="section" id="simulador">
      <div class="page">
        <header class="head">
          <p class="pill" data-reveal>Simulador de blanqueamiento</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Ajusta el <b>brillo</b> de tu sonrisa.</h2>
          <p class="lead" data-reveal [revealDelay]="160">Desliza y mira hasta dónde puede aclarar. En una cita de 90 minutos se suben de 2 a 3 tonos.</p>
        </header>

        <div class="guide" data-reveal [revealDelay]="200" aria-hidden="true">
          @for (s of shades; track s; let i = $index) {
            <span class="shade" [class.on]="index() === i" [style.--t]="tintOf(i)">
              <svg viewBox="0 0 32 32"><path d="M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z" /></svg>
              <small>{{ s }}</small>
            </span>
          }
        </div>

        <figure class="stage" data-reveal="photo">
          <div class="zoom">
            <img src="media/sonrisa.webp" srcset="media/sonrisa-sm.webp 820w, media/sonrisa.webp 1800w" sizes="(max-width: 900px) 100vw, 80vw" alt="Sonrisa de cerca para simular el blanqueamiento" width="1800" height="1800" loading="lazy" />
            <div class="tint" aria-hidden="true" [style.opacity]="tint()"></div>
          </div>
          <div class="readout">
            <span>Tono</span>
            <b>@for (c of label(); track $index + c) {<i class="t-pop">{{ c }}</i>}</b>
          </div>
          <div class="slider" #slider>
            <svg class="sun s" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></svg>
            <div class="track">
              <span class="fill" [style.width.%]="value() * 100"></span>
              <button type="button" class="knob" role="slider" aria-label="Brillo de la sonrisa" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="round(value() * 100)" [attr.aria-valuetext]="label()" [style.left.%]="value() * 100" (keydown)="key($event)"></button>
            </div>
            <svg class="sun l" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
          </div>
        </figure>

        <div class="foot">
          <p class="fine">Simulación ilustrativa. El resultado real depende de tu tono natural y se confirma en la valoración.</p>
          <button type="button" class="btn t-learn" magnetic (click)="clinic.book('Blanqueamiento')">Agendar blanqueamiento <app-arrow /></button>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; justify-items: center; gap: 16px; text-align: center; }
    .head .lead { text-align: center; }
    .h2 b { color: var(--royal); }
    .guide { display: flex; justify-content: center; gap: clamp(6px, 2vw, 18px); margin: 40px 0 26px; }
    .shade { display: grid; justify-items: center; gap: 6px; transition: translate 400ms var(--ease-bounce), opacity 300ms ease; opacity: 0.55; }
    .shade svg { width: clamp(30px, 5vw, 46px); height: auto; overflow: visible; }
    .shade path { fill: color-mix(in srgb, var(--stain) calc(var(--t) * 140%), #fbfcff); stroke: oklch(80% 0.04 80 / 0.6); stroke-width: 0.8; filter: drop-shadow(0 6px 8px oklch(25% 0.08 264 / 0.15)); }
    .shade small { font-size: 0.74rem; font-weight: 700; color: var(--muted); }
    .shade.on { opacity: 1; translate: 0 -10px; }
    .shade.on small { color: var(--royal); }
    .stage { position: relative; margin: 0; aspect-ratio: 16 / 8; min-height: 360px; border-radius: var(--radius-xl); overflow: hidden; background: var(--ice-3); }
    .zoom { position: absolute; width: 130%; aspect-ratio: 1; left: -15%; top: 50%; translate: 0 -48%; }
    .zoom img { width: 100%; height: 100%; object-fit: cover; }
    .tint { position: absolute; inset: 0; background: var(--stain); mix-blend-mode: multiply; -webkit-mask: url(/media/sonrisa-mascara.png) 0 0 / 100% 100%; mask: url(/media/sonrisa-mascara.png) 0 0 / 100% 100%; }
    .readout { position: absolute; top: 20px; left: 20px; display: grid; padding: 12px 18px; border-radius: 18px; background: var(--glass); backdrop-filter: blur(14px); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.7); }
    .readout span { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
    .readout b { display: flex; font-family: var(--font-display); font-size: 2rem; font-weight: 600; line-height: 1; color: var(--royal); overflow: hidden; }
    .readout i { font-style: normal; }
    /* El control flotante de la referencia: píldora de vidrio con sol chico y sol grande */
    .slider { position: absolute; left: 50%; bottom: 24px; translate: -50% 0; display: flex; align-items: center; gap: 16px; width: min(560px, calc(100% - 32px)); padding: 16px 22px; border-radius: 999px; background: oklch(99% 0.005 245 / 0.72); backdrop-filter: blur(18px) saturate(1.5); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.8), var(--shadow-m); touch-action: none; cursor: pointer; }
    .sun { flex: none; fill: none; stroke: var(--navy); stroke-width: 1.8; stroke-linecap: round; }
    .sun.s { width: 18px; opacity: 0.6; }
    .sun.l { width: 26px; color: var(--royal); stroke: var(--royal); }
    .track { position: relative; flex: 1; height: 4px; border-radius: 4px; background: var(--ice-3); }
    .fill { position: absolute; inset: 0 auto 0 0; border-radius: 4px; background: linear-gradient(90deg, var(--sky), var(--royal)); }
    .knob { position: absolute; top: 50%; width: 30px; height: 30px; translate: -50% -50%; border-radius: 50%; background: var(--white); box-shadow: 0 0 0 6px oklch(50% 0.2 263 / 0.15), var(--shadow-m); transition: scale 250ms var(--ease-bounce), box-shadow 250ms ease; }
    .slider.dragging .knob, .knob:focus-visible { scale: 1.15; box-shadow: 0 0 0 10px oklch(50% 0.2 263 / 0.18), var(--shadow-m); }
    @media (hover: hover) and (pointer: fine) { .slider:hover .knob { scale: 1.1; } }
    .foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 22px; }
    .fine { font-size: 0.82rem; color: var(--muted); max-width: 52ch; }
    @media (max-width: 700px) {
      .stage { aspect-ratio: 4 / 5; }
      .zoom { width: 210%; left: -57%; }
    }
  `,
})
export class Whitening {
  protected readonly clinic = inject(Clinic);
  protected readonly shades = SHADES;
  protected readonly value = signal(0.18);
  protected readonly index = computed(() => Math.round(this.value() * (SHADES.length - 1)));
  protected readonly tint = computed(() => MAX_TINT * (1 - this.value()));
  protected readonly label = computed(() => SHADES[this.index()].split(''));
  protected readonly round = Math.round;
  private readonly slider = viewChild.required<ElementRef<HTMLElement>>('slider');

  protected tintOf(i: number) {
    return MAX_TINT * (1 - i / (SHADES.length - 1));
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.slider().nativeElement;
      const track = el.querySelector<HTMLElement>('.track')!;
      let dragging = false;
      let demo: gsap.core.Tween | undefined;
      const set = (x: number) => {
        const r = track.getBoundingClientRect();
        this.value.set(Math.min(1, Math.max(0, (x - r.left) / r.width)));
      };
      const down = (e: PointerEvent) => {
        demo?.kill();
        dragging = true;
        el.classList.add('dragging');
        el.setPointerCapture(e.pointerId);
        set(e.clientX);
      };
      const move = (e: PointerEvent) => dragging && set(e.clientX);
      const up = () => {
        dragging = false;
        el.classList.remove('dragging');
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);

      // Demostración: la primera vez que se ve, el control va de amarillo a blanco y regresa a la mitad
      let trigger: ScrollTrigger | undefined;
      if (!prefersReducedMotion()) {
        const { gsap, ScrollTrigger } = useGsap();
        const v = { x: this.value() };
        trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            demo = gsap.to(v, { keyframes: [{ x: 1, duration: 1.6, ease: 'power2.inOut' }, { x: 0.55, duration: 0.9, ease: 'power2.out' }], onUpdate: () => !dragging && this.value.set(v.x) });
          },
        });
      }
      destroyRef.onDestroy(() => {
        demo?.kill();
        trigger?.kill();
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      });
    });
  }

  protected key(e: KeyboardEvent) {
    const step = 1 / (SHADES.length - 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') this.value.set(Math.max(0, this.value() - step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') this.value.set(Math.min(1, this.value() + step));
    else return;
    e.preventDefault();
  }
}
