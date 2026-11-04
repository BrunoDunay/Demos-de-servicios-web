import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

const PATTERNS = [
  { id: 'calma', label: 'Calma', note: 'Para bajar la ansiedad', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 4 }, { t: 'Exhala', s: 6 }] },
  { id: 'cuadrada', label: 'Cuadrada', note: 'Para enfocarte', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 4 }, { t: 'Exhala', s: 4 }, { t: 'Sostén', s: 4 }] },
  { id: 'dormir', label: '4-7-8', note: 'Para dormir', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 7 }, { t: 'Exhala', s: 8 }] },
];

/**
 * Respiración guiada de un minuto. El círculo crece al inhalar, se queda quieto al sostener y se encoge
 * al exhalar; el número cuenta los segundos. Es el ejercicio que Valeria enseña en la primera sesión.
 * Aquí el movimiento es el contenido, así que se anima aunque esté activado "Reducir movimiento" (más lento y sin brillo).
 */
@Component({
  selector: 'app-breathe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section wrap" id="respira">
      <div class="page grid">
        <div class="copy">
          <p class="eyebrow" data-reveal>Un minuto para ti</p>
          <h2 class="h2" data-reveal [revealDelay]="100">Si llegaste con el pecho apretado, <em>empieza aquí</em>.</h2>
          <p class="lead" data-reveal [revealDelay]="200">Sigue el círculo. Exhalar más largo de lo que inhalas le avisa a tu cuerpo que está a salvo.</p>
          <div class="patterns" role="radiogroup" aria-label="Tipo de respiración" data-reveal [revealDelay]="260">
            @for (p of patterns; track p.id) {
              <button type="button" role="radio" [attr.aria-checked]="pattern().id === p.id" (click)="choose(p.id)">
                <b>{{ p.label }}</b><span>{{ p.note }}</span>
              </button>
            }
          </div>
        </div>

        <div class="lung" data-reveal [revealDelay]="120">
          <div class="halo" #halo aria-hidden="true"></div>
          <div class="orb" #orb aria-hidden="true"></div>
          <div class="read" aria-live="polite">
            @if (running()) {
              <p class="phase">{{ phase() }}</p>
              <p class="count">{{ count() }}</p>
            } @else if (done()) {
              <p class="phase">Bien hecho.</p>
              <p class="small">¿Cómo te sientes ahora?</p>
            } @else {
              <p class="phase">Listo cuando tú.</p>
              <p class="small">{{ cycles() }} respiraciones · 1 minuto</p>
            }
          </div>
          <div class="controls">
            <button type="button" class="btn" (click)="running() ? stop() : start()">
              @if (running()) { Detener } @else { <app-icon name="wind" [size]="18" /> {{ done() ? 'Otra vez' : 'Comenzar' }} }
            </button>
            @if (running()) {
              <p class="progress">{{ round() }} de {{ cycles() }}</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--deep); color: var(--mist); }
    .wrap .eyebrow { color: var(--amber); }
    .wrap .h2 em { color: var(--amber); }
    .wrap .lead { color: oklch(84% 0.02 150); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(36px, 6vw, 100px); align-items: center; }
    .copy { display: grid; gap: 18px; justify-items: start; }
    .patterns { display: grid; gap: 8px; width: 100%; max-width: 420px; margin-top: 10px; }
    .patterns button { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 18px; border-radius: var(--radius-s); text-align: left; box-shadow: inset 0 0 0 1.5px oklch(40% 0.03 165); transition: background-color 300ms ease, box-shadow 300ms ease, scale 160ms var(--ease-out); }
    .patterns button:active { scale: 0.98; }
    .patterns span { font-size: 0.88rem; color: oklch(78% 0.02 150); }
    .patterns [aria-checked='true'] { background: oklch(32% 0.03 165); box-shadow: inset 0 0 0 1.5px var(--amber); }
    @media (hover: hover) and (pointer: fine) { .patterns button:not([aria-checked='true']):hover { box-shadow: inset 0 0 0 1.5px oklch(60% 0.03 160); } }
    .lung { position: relative; display: grid; place-items: center; aspect-ratio: 1; width: min(100%, 480px); justify-self: center; }
    .orb, .halo { position: absolute; left: 50%; top: 50%; width: 70%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; scale: 0.62; }
    .orb { background: radial-gradient(circle at 38% 34%, oklch(90% 0.08 80), var(--amber) 42%, var(--amber-deep) 100%); box-shadow: 0 0 80px oklch(77% 0.12 72 / 0.35); }
    .halo { width: 92%; border: 1.5px dashed oklch(55% 0.04 160); background: radial-gradient(circle, oklch(77% 0.12 72 / 0.08), transparent 70%); scale: 1; }
    .read { position: relative; display: grid; justify-items: center; gap: 2px; text-align: center; color: var(--deep); pointer-events: none; }
    .phase { font-family: var(--font-display); font-style: italic; font-size: clamp(1.25rem, 2.2vw, 1.6rem); line-height: 1.1; max-width: 7em; }
    .count { font-size: 2.6rem; font-weight: 300; font-variant-numeric: tabular-nums; line-height: 1; }
    .small { font-size: 0.8rem; font-weight: 500; max-width: 16ch; }
    .controls { position: absolute; bottom: -8px; left: 50%; translate: -50% 0; display: grid; justify-items: center; gap: 8px; }
    .controls .btn { background: var(--mist); color: var(--deep); min-width: 150px; }
    @media (hover: hover) and (pointer: fine) { .controls .btn:hover { background: var(--amber); } }
    .progress { font-size: 0.82rem; color: oklch(78% 0.02 150); font-variant-numeric: tabular-nums; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .lung { margin-bottom: 30px; } }
  `,
})
export class Breathe {
  protected readonly patterns = PATTERNS;
  protected readonly pattern = signal(PATTERNS[0]);
  protected readonly running = signal(false);
  protected readonly done = signal(false);
  protected readonly phase = signal('');
  protected readonly count = signal(0);
  protected readonly round = signal(1);
  protected readonly cycles = computed(() => Math.max(3, Math.round(60 / this.pattern().steps.reduce((a, s) => a + s.s, 0))));
  private readonly orb = viewChild.required<ElementRef<HTMLElement>>('orb');
  private readonly halo = viewChild.required<ElementRef<HTMLElement>>('halo');
  private tl?: gsap.core.Timeline;
  private ticker?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  protected choose(id: string) {
    this.stop();
    this.pattern.set(PATTERNS.find((p) => p.id === id)!);
    this.done.set(false);
  }

  protected start() {
    const { gsap } = useGsap();
    const orb = this.orb().nativeElement;
    const halo = this.halo().nativeElement;
    this.done.set(false);
    this.running.set(true);
    this.round.set(1);
    const steps = this.pattern().steps;
    const tl = gsap.timeline({ repeat: this.cycles() - 1, onRepeat: () => this.round.update((r) => r + 1), onComplete: () => this.finish() });
    for (const st of steps) {
      tl.call(() => this.beat(st.t, st.s));
      if (st.t === 'Inhala') tl.to(orb, { scale: 1, duration: st.s, ease: 'sine.inOut' }).to(halo, { rotate: '+=40', duration: st.s, ease: 'none' }, '<');
      else if (st.t === 'Exhala') tl.to(orb, { scale: 0.62, duration: st.s, ease: 'sine.inOut' }).to(halo, { rotate: '+=40', duration: st.s, ease: 'none' }, '<');
      else tl.to(orb, { scale: '+=0', duration: st.s, ease: 'none' });
    }
    this.tl = tl;
  }

  /** Cuenta regresiva de la fase actual. */
  private beat(text: string, seconds: number) {
    clearInterval(this.ticker);
    this.phase.set(text);
    this.count.set(seconds);
    this.ticker = setInterval(() => this.count.update((c) => Math.max(1, c - 1)), 1000);
  }

  private finish() {
    clearInterval(this.ticker);
    this.running.set(false);
    this.done.set(true);
  }

  protected stop() {
    this.tl?.kill();
    clearInterval(this.ticker);
    this.running.set(false);
    if (this.tl) useGsap().gsap.to(this.orb().nativeElement, { scale: 0.62, duration: 0.8, ease: 'sine.out' });
    this.tl = undefined;
  }
}
