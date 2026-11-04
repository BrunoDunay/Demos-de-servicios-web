import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { HEAD, spiral } from '../core/doodles';
import { useGsap } from '../core/motion';
import { Reveal } from '../shared/reveal';

const PATTERNS = [
  { id: 'calma', label: 'Calma', note: 'para bajar la ansiedad', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 4 }, { t: 'Exhala', s: 6 }] },
  { id: 'cuadrada', label: 'Cuadrada', note: 'para enfocarte', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 4 }, { t: 'Exhala', s: 4 }, { t: 'Sostén', s: 4 }] },
  { id: 'dormir', label: '4-7-8', note: 'para dormir', steps: [{ t: 'Inhala', s: 4 }, { t: 'Sostén', s: 7 }, { t: 'Exhala', s: 8 }] },
];

const SPIRAL = spiral(124, 104, 58, 4, 160);

/**
 * Respiración guiada (referencia: cuadro de la cabeza con espiral). Una cabeza de perfil en papel; dentro,
 * una espiral que se dibuja al inhalar y se recoge al exhalar, con la cuenta escrita a mano.
 * Aquí el movimiento es el contenido: se anima aunque esté activado "Reducir movimiento".
 */
@Component({
  selector: 'app-breathe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="section wrap" id="respira">
      <div class="page grid">
        <div class="copy">
          <p class="kicker" data-reveal>Un minuto para ti</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Si llegaste con el pecho apretado, <span class="peach">empieza aquí.</span></h2>
          <p class="lead" data-reveal [revealDelay]="160">Sigue la espiral. Exhalar más largo de lo que inhalas le avisa a tu cuerpo que está a salvo.</p>
          <div class="patterns" role="radiogroup" aria-label="Tipo de respiración" data-reveal [revealDelay]="220">
            @for (p of patterns; track p.id) {
              <button type="button" role="radio" [attr.aria-checked]="pattern().id === p.id" (click)="choose(p.id)">
                <b>{{ p.label }}</b><span class="hand">{{ p.note }}</span>
              </button>
            }
          </div>
        </div>

        <div class="frame" data-reveal [revealDelay]="120">
          <svg class="art" viewBox="0 0 240 230" aria-hidden="true">
            <path class="head" [attr.d]="head" />
            <path class="spiral" #sp [attr.d]="spiralPath" />
          </svg>
          <div class="read" aria-live="polite">
            @if (running()) {
              <p class="phase hand">{{ phase() }}</p>
              <p class="count">{{ count() }}</p>
            } @else if (done()) {
              <p class="phase hand">bien hecho.</p>
              <p class="small">¿cómo te sientes ahora?</p>
            } @else {
              <p class="phase hand">listo cuando tú</p>
              <p class="small">{{ cycles() }} respiraciones · 1 minuto</p>
            }
          </div>
          <div class="controls">
            <button type="button" class="btn peach" (click)="running() ? stop() : start()">{{ running() ? 'Detener' : done() ? 'Otra vez' : 'Comenzar' }}</button>
            @if (running()) {
              <p class="progress">{{ round() }} de {{ cycles() }}</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--navy); color: var(--paper); }
    .wrap .h2 { font-size: clamp(2.8rem, 5.6vw, 4.8rem); }
    .wrap .kicker { color: var(--peach); }
    .wrap .lead { color: oklch(86% 0.02 250); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(36px, 6vw, 90px); align-items: center; }
    .copy { display: grid; gap: 18px; justify-items: start; }
    .patterns { display: grid; gap: 10px; width: 100%; max-width: 420px; margin-top: 8px; }
    .patterns button { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 14px 18px; text-align: left; background: oklch(36% 0.07 255); box-shadow: inset 0 0 0 1.5px oklch(48% 0.06 255); clip-path: polygon(0 2%, 100% 0, 99% 100%, 1% 97%); transition: background-color 300ms ease, translate 400ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .patterns span { font-size: 1.3rem; color: oklch(82% 0.03 250); }
    .patterns [aria-checked='true'] { background: var(--peach); color: var(--ink); translate: 6px 0; }
    .patterns [aria-checked='true'] span { color: var(--ink-2); }
    .patterns button:active { scale: 0.98; }
    @media (hover: hover) and (pointer: fine) { .patterns button:not([aria-checked='true']):hover { translate: 4px 0; } }
    /* El cuadro de la referencia: papel crema con marco */
    .frame { position: relative; display: grid; justify-items: center; padding: 30px 30px 150px; background: var(--paper); box-shadow: 0 0 0 10px var(--card), 0 0 0 12px var(--line-2), 0 40px 60px -20px oklch(0% 0 0 / 0.5); color: var(--ink); }
    .art { width: min(100%, 340px); overflow: visible; }
    .head { fill: var(--peach-soft); }
    .spiral { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; }
    .read { position: absolute; left: 0; right: 0; bottom: 78px; display: grid; justify-items: center; text-align: center; }
    .phase { font-size: 2rem; color: var(--peach-deep); }
    .count { font-family: var(--font-display); font-stretch: 75%; font-size: 2.4rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
    .small { font-size: 0.86rem; color: var(--muted); }
    .controls { position: absolute; bottom: 18px; left: 50%; translate: -50% 0; display: flex; align-items: center; gap: 12px; }
    .controls .btn { min-width: 150px; }
    .progress { font-size: 0.84rem; color: var(--muted); font-variant-numeric: tabular-nums; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Breathe {
  protected readonly patterns = PATTERNS;
  protected readonly head = HEAD;
  protected readonly spiralPath = SPIRAL;
  protected readonly pattern = signal(PATTERNS[0]);
  protected readonly running = signal(false);
  protected readonly done = signal(false);
  protected readonly phase = signal('');
  protected readonly count = signal(0);
  protected readonly round = signal(1);
  protected readonly cycles = computed(() => Math.max(3, Math.round(60 / this.pattern().steps.reduce((a, s) => a + s.s, 0))));
  private readonly sp = viewChild.required<ElementRef<SVGPathElement>>('sp');
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
    const path = this.sp().nativeElement;
    const len = path.getTotalLength();
    // La espiral se dibuja desde afuera: al inhalar se completa, al exhalar se recoge hasta un tercio
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len * 0.66 });
    this.done.set(false);
    this.running.set(true);
    this.round.set(1);
    const tl = gsap.timeline({ repeat: this.cycles() - 1, onRepeat: () => this.round.update((r) => r + 1), onComplete: () => this.finish() });
    for (const st of this.pattern().steps) {
      tl.call(() => this.beat(st.t, st.s));
      if (st.t === 'Inhala') tl.to(path, { strokeDashoffset: 0, duration: st.s, ease: 'sine.inOut' });
      else if (st.t === 'Exhala') tl.to(path, { strokeDashoffset: len * 0.66, duration: st.s, ease: 'sine.inOut' });
      else tl.to({}, { duration: st.s });
    }
    this.tl = tl;
  }

  private beat(text: string, seconds: number) {
    clearInterval(this.ticker);
    this.phase.set(text.toLowerCase());
    this.count.set(seconds);
    this.ticker = setInterval(() => this.count.update((c) => Math.max(1, c - 1)), 1000);
  }

  private finish() {
    clearInterval(this.ticker);
    this.running.set(false);
    this.done.set(true);
    useGsap().gsap.to(this.sp().nativeElement, { strokeDashoffset: 0, duration: 1.2, ease: 'sine.out' });
  }

  protected stop() {
    this.tl?.kill();
    clearInterval(this.ticker);
    this.running.set(false);
    if (this.tl) useGsap().gsap.to(this.sp().nativeElement, { strokeDashoffset: 0, duration: 0.8, ease: 'sine.out' });
    this.tl = undefined;
  }
}
