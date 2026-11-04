import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { Clinic } from '../core/clinic';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Guía de color dental (de más oscuro a más claro). "tint" es cuánto se tiñe la foto de amarillo. */
const SHADES = [
  { id: 'A3.5', tint: 0.62 },
  { id: 'A3', tint: 0.5 },
  { id: 'A2', tint: 0.38 },
  { id: 'B2', tint: 0.28 },
  { id: 'A1', tint: 0.18 },
  { id: 'B1', tint: 0.08 },
  { id: 'BL', tint: 0 },
];

/**
 * Simulador de blanqueamiento: eliges tu tono de hoy en la guía de color y arrastras la línea para
 * comparar con el resultado (2 a 3 tonos más claro). Los dientes se tiñen con una máscara sacada
 * de la foto (scripts/media-salud.mjs), así que la piel y los labios no cambian.
 */
@Component({
  selector: 'app-whitening',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section wrap" id="simulador">
      <div class="page grid">
        <div class="copy">
          <p class="eyebrow" data-reveal>Simulador de blanqueamiento</p>
          <h2 class="h2" data-reveal [revealDelay]="80">¿Hasta dónde puede <em>aclarar</em> tu sonrisa?</h2>
          <p class="lead" data-reveal [revealDelay]="160">Elige el tono que más se parece al tuyo en nuestra guía de color. En una cita de blanqueamiento se suben de 2 a 3 tonos.</p>

          <div class="guide" role="radiogroup" aria-label="Tu tono de hoy" data-reveal [revealDelay]="200">
            @for (s of shades; track s.id; let i = $index) {
              <button type="button" role="radio" [attr.aria-checked]="current() === i" [disabled]="i > shades.length - 3" (click)="current.set(i)" [style.--t]="s.tint">
                <span class="chip"></span>{{ s.id }}
              </button>
            }
          </div>
          <p class="result" data-reveal [revealDelay]="240">
            Hoy <b>{{ shades[current()].id }}</b> <app-icon name="arrow-right" [size]="16" /> después <b>{{ shades[after()].id }}</b>
            <span>{{ after() - current() }} tonos más claro</span>
          </p>
          <button type="button" class="btn" data-reveal [revealDelay]="280" (click)="clinic.book('Blanqueamiento')">Agendar blanqueamiento <app-icon name="arrow-right" [size]="18" /></button>
          <p class="fine">Simulación con fines ilustrativos. El resultado real depende de tu tono natural y se confirma en la valoración.</p>
        </div>

        <figure class="stage" #stage data-reveal="photo" [style.--x.%]="split()" [style.--before]="shades[current()].tint" [style.--after]="shades[after()].tint">
          <div class="zoom">
            <img src="media/sonrisa.webp" srcset="media/sonrisa-sm.webp 820w, media/sonrisa.webp 1800w" sizes="(max-width: 900px) 100vw, 50vw" alt="Sonrisa de cerca para comparar el tono de los dientes" width="1800" height="1800" loading="lazy" />
            <div class="tint before" aria-hidden="true"></div>
            <div class="tint after" aria-hidden="true"></div>
          </div>
          <span class="tag l">Hoy · {{ shades[current()].id }}</span>
          <span class="tag r">Después · {{ shades[after()].id }}</span>
          <div class="handle" role="slider" tabindex="0" aria-label="Comparar antes y después" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="round(split())" (keydown)="key($event)">
            <span class="knob"><app-icon name="chevron-l" [size]="16" /><app-icon name="chevron" [size]="16" /></span>
          </div>
        </figure>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--ivory-2); }
    .grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(28px, 5vw, 80px); align-items: center; }
    .copy { display: grid; justify-items: start; gap: 18px; }
    .guide { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .guide button { display: grid; justify-items: center; gap: 6px; width: 54px; padding: 8px 0 10px; border-radius: 14px; font-size: 0.78rem; font-weight: 650; color: var(--ink-2); transition: background-color 220ms ease, scale 160ms var(--ease-out), opacity 200ms ease; }
    .guide button:active:not(:disabled) { scale: 0.93; }
    .guide button:disabled { opacity: 0.35; cursor: not-allowed; }
    /* Cada pastilla es como las de la guía VITA: un diente de color */
    .chip { width: 26px; height: 38px; border-radius: 9px 9px 13px 13px; background: color-mix(in oklch, var(--stain) calc(var(--t) * 100%), var(--white)); box-shadow: inset 0 -6px 10px oklch(70% 0.05 80 / 0.25), 0 1px 3px oklch(24% 0.035 258 / 0.15); }
    .guide button[aria-checked='true'] { background: var(--white); box-shadow: var(--shadow-s), inset 0 0 0 2px var(--ink); color: var(--ink); }
    @media (hover: hover) and (pointer: fine) { .guide button:not(:disabled):not([aria-checked='true']):hover { background: var(--white); } }
    .result { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 1.1rem; }
    .result b { font-family: var(--font-display); font-size: 1.6rem; font-weight: 500; }
    .result span { flex-basis: 100%; font-size: 0.88rem; color: var(--mint-deep); font-weight: 600; }
    .fine { font-size: 0.8rem; color: var(--muted); max-width: 46ch; }
    .stage { position: relative; margin: 0; aspect-ratio: 4 / 3; border-radius: var(--radius-l); overflow: hidden; background: var(--ivory-3); touch-action: pan-y; user-select: none; --x: 50%; }
    /* Acercamiento a la boca: la foto es cuadrada y la boca está en (52%, 45%) */
    .zoom { position: absolute; width: 175%; aspect-ratio: 1; left: -41%; top: -56%; }
    .zoom img { width: 100%; height: 100%; object-fit: cover; }
    .tint { position: absolute; inset: 0; background: var(--stain); mix-blend-mode: multiply; -webkit-mask: url(/media/sonrisa-mascara.png) 0 0 / 100% 100%; mask: url(/media/sonrisa-mascara.png) 0 0 / 100% 100%; transition: opacity 500ms var(--ease-out); }
    .before { opacity: var(--before); clip-path: inset(0 calc(100% - var(--zx)) 0 0); }
    .after { opacity: var(--after); clip-path: inset(0 0 0 var(--zx)); }
    /* La línea está en % del escenario; dentro del acercamiento hay que convertirla */
    .zoom { --zx: calc((var(--x) + 41%) / 1.75); }
    .tag { position: absolute; top: 14px; padding: 6px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 650; background: oklch(99% 0 0 / 0.82); backdrop-filter: blur(8px); }
    .tag.l { left: 14px; }
    .tag.r { right: 14px; }
    .handle { position: absolute; top: 0; bottom: 0; left: var(--x); width: 44px; translate: -50% 0; cursor: ew-resize; display: grid; place-items: center; outline: none; }
    .handle::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; translate: -50% 0; background: var(--white); box-shadow: 0 0 10px oklch(0% 0 0 / 0.25); }
    .knob { position: relative; display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 50%; background: var(--white); color: var(--ink); box-shadow: var(--shadow-m); transition: scale 200ms var(--ease-out); }
    .knob .icon { margin: 0 -3px; }
    .handle:active .knob, .stage.dragging .knob { scale: 0.92; }
    .handle:focus-visible .knob { box-shadow: 0 0 0 3px var(--mint), var(--shadow-m); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .stage { order: -1; } }
  `,
})
export class Whitening {
  protected readonly clinic = inject(Clinic);
  protected readonly shades = SHADES;
  protected readonly current = signal(1);
  protected readonly after = computed(() => Math.min(SHADES.length - 1, this.current() + 3));
  protected readonly split = signal(50);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  protected readonly round = Math.round;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.stage().nativeElement;
      let dragging = false;
      const set = (clientX: number) => {
        const r = el.getBoundingClientRect();
        this.split.set(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
      };
      const down = (e: PointerEvent) => {
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
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      });

      // La primera vez que se ve, la línea se mueve sola para enseñar que se arrastra
      if (prefersReducedMotion()) return;
      const { gsap, ScrollTrigger } = useGsap();
      const v = { x: 50 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        once: true,
        onEnter: () => gsap.to(v, { keyframes: [{ x: 28 }, { x: 70 }, { x: 50 }], duration: 2.2, ease: 'sine.inOut', onUpdate: () => !dragging && this.split.set(v.x) }),
      });
    });
  }

  protected key(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') this.split.set(Math.max(4, this.split() - step));
    else if (e.key === 'ArrowRight') this.split.set(Math.min(96, this.split() + step));
    else return;
    e.preventDefault();
  }
}
