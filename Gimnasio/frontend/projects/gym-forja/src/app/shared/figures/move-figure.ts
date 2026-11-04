import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input } from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../../core/motion';
import { FigureDef, figureBounds, figureFrame, figureStatics } from './figure-rig';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Figura animada de un movimiento (sistema de Fitness by Evidence): cada cuadro recalcula el
 * esqueleto, así manos y pies no se despegan de la barra o del piso.
 * - Con mouse: hace una repetición al entrar en pantalla y se repite mientras el cursor está encima
 *   del contenedor `.frame`; al salir termina la repetición en curso y se detiene.
 * - En pantallas táctiles: se repite mientras está a la vista.
 */
@Component({
  selector: 'app-move-figure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="box()" role="img" [attr.aria-label]="label()">
      <path class="prop" [attr.d]="fixed().line" />
      <path class="pad" [attr.d]="fixed().pad" />
      <path class="rail" [attr.d]="fixed().rails" />
      <path class="far" data-part="far" [attr.d]="rest().far" />
      <path class="g-thin" data-part="thin" [attr.d]="rest().gear.thin" />
      <path class="g-mid" data-part="mid" [attr.d]="rest().gear.mid" />
      <path class="g-dash" data-part="dash" [attr.d]="rest().gear.dash" />
      <path class="body" data-part="body" [attr.d]="rest().body" />
      <circle class="head" data-part="head" r="3.8" [attr.cx]="rest().head[0]" [attr.cy]="rest().head[1]" />
      <path class="g-thick" data-part="thick" [attr.d]="rest().gear.thick" />
      <path class="g-ring" data-part="ring" [attr.d]="rest().gear.ring" />
      <path class="g-solid" data-part="solid" [attr.d]="rest().gear.solid" />
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: 100%; overflow: visible; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .body, .far { stroke: var(--ink); stroke-width: 3.2; }
    .far { opacity: 0.32; }
    .head { fill: var(--ink); }
    .prop { stroke: var(--ink); stroke-width: 1.4; opacity: 0.28; }
    .pad { stroke: var(--ink); stroke-width: 4; opacity: 0.22; }
    .rail { stroke: var(--ember); stroke-width: 1.5; opacity: 0.6; }
    .g-thin { stroke: var(--ember); stroke-width: 1.4; }
    .g-mid { stroke: var(--ember); stroke-width: 2.2; }
    .g-thick { stroke: var(--ember); stroke-width: 3.8; }
    .g-ring { stroke: var(--ember); stroke-width: 2; fill: var(--bg); }
    .g-solid { fill: var(--ember); }
    .g-dash { stroke: var(--ember); stroke-width: 1.8; stroke-dasharray: 2 2.4; }
  `,
})
export class MoveFigure {
  readonly def = input.required<FigureDef>();
  readonly label = input('');
  /** Duración de una repetición o de un ciclo. */
  readonly ms = input(1500);

  protected readonly fixed = computed(() => figureStatics(this.def()));
  protected readonly box = computed(() => figureBounds(this.def()));
  protected readonly rest = computed(() => figureFrame(this.def(), 0));

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private parts: Record<string, Element> | null = null;
  private frameId = 0;
  private looping = false;
  private running = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const trigger = this.host.closest<HTMLElement>('.frame') ?? this.host;
      const cleanups: (() => void)[] = [];

      if (hasFinePointer()) {
        const enter = () => this.start(true);
        const leave = () => (this.looping = false);
        trigger.addEventListener('pointerenter', enter);
        trigger.addEventListener('pointerleave', leave);
        trigger.addEventListener('focusin', enter);
        trigger.addEventListener('focusout', leave);
        const once = new IntersectionObserver((entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          once.disconnect();
          setTimeout(() => this.start(false), 150 + Math.random() * 450);
        }, { threshold: 0.6 });
        once.observe(this.host);
        cleanups.push(() => once.disconnect());
      } else {
        const view = new IntersectionObserver((entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          if (visible) this.start(true);
          else this.looping = false;
        }, { threshold: 0.4 });
        view.observe(this.host);
        cleanups.push(() => view.disconnect());
      }
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frameId);
        cleanups.forEach((c) => c());
      });
    });
  }

  /** Arranca (o sigue) la animación. `loop`: se repite hasta que `looping` pase a false. */
  private start(loop: boolean) {
    this.looping = loop;
    if (this.running) return;
    this.running = true;
    const def = this.def();
    const ms = this.ms();
    let begin = performance.now();
    const tick = (now: number) => {
      let phase = (now - begin) / ms;
      if (phase >= 1) {
        if (!this.looping) {
          this.paint(def, 0);
          this.running = false;
          return;
        }
        begin += ms * Math.floor(phase);
        phase %= 1;
      }
      this.paint(def, this.progress(def, phase));
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  /** Avance dentro de una repetición: sube, sostiene (si el movimiento tiene pausa) y regresa. */
  private progress(def: FigureDef, phase: number) {
    if (def.cycle) return phase;
    const hold = def.hold ?? 0;
    const half = (1 - hold) / 2;
    if (phase < half) return easeInOut(phase / half);
    if (phase < half + hold) return 1;
    return easeInOut((1 - phase) / half);
  }

  private paint(def: FigureDef, t: number) {
    this.parts ??= Object.fromEntries(Array.from(this.host.querySelectorAll('[data-part]'), (node) => [node.getAttribute('data-part')!, node]));
    const frame = figureFrame(def, t);
    const set = (part: string, d: string) => this.parts![part]?.setAttribute('d', d);
    set('body', frame.body);
    set('far', frame.far);
    for (const [part, d] of Object.entries(frame.gear)) set(part, d);
    this.parts['head']?.setAttribute('cx', String(frame.head[0]));
    this.parts['head']?.setAttribute('cy', String(frame.head[1]));
  }
}
