import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TOPICS, Topic } from '../core/content';
import { scribble } from '../core/doodles';
import { Practice } from '../core/practice';
import { Arrow } from '../shared/arrow';
import { Reveal } from '../shared/reveal';

/**
 * "¿Qué te trae por aquí?": etiquetas de papel con cinta (cada una un poco chueca); al elegir una, la hoja
 * de cuaderno de la derecha cambia: título a mano, un garabato propio que se dibuja y el texto que sube
 * desenfocado (transitions.dev "Texts reveal").
 */
@Component({
  selector: 'app-topics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Arrow],
  template: `
    <section class="section" id="temas">
      <div class="page">
        <header class="head">
          <p class="kicker" data-reveal>Para empezar</p>
          <h2 class="h2" data-reveal [revealDelay]="80">¿Qué te trae <span class="peach">por aquí?</span></h2>
          <p class="lead" data-reveal [revealDelay]="160">Elige lo que más se parezca a lo que sientes. <span class="mark">No tiene que ser exacto.</span></p>
        </header>
        <div class="grid">
          <div class="tags" role="radiogroup" aria-label="Lo que sientes">
            @for (t of topics; track t.id; let i = $index) {
              <button type="button" role="radio" [attr.aria-checked]="active().id === t.id" (click)="active.set(t)" [style.--r]="tilt(i)" data-reveal [revealDelay]="i * 50">
                <span class="hole" aria-hidden="true"></span>{{ t.label }}
              </button>
            }
          </div>
          <article class="sheet" aria-live="polite" data-reveal [revealDelay]="120">
            <span class="tape tl"></span>
            @let t = active();
            @for (k of [t.id]; track k) {
              <div class="t-reveal">
                <div class="top" style="--i: 0">
                  <h3 class="hand">{{ t.label.toLowerCase() }}</h3>
                  <svg class="doodle" viewBox="0 0 120 80" aria-hidden="true"><path [attr.d]="doodle()" pathLength="1" /></svg>
                </div>
                <p class="label" style="--i: 1">Lo que suele sentirse</p>
                <p class="feels" style="--i: 2">“{{ t.feels }}”</p>
                <p class="label" style="--i: 3">Cómo lo trabajamos</p>
                <p class="work" style="--i: 4">{{ t.work }}</p>
                <dl style="--i: 5">
                  <div><dt>Modalidad</dt><dd>{{ t.mode }}</dd></div>
                  <div><dt>Duración aproximada</dt><dd>{{ t.length }}</dd></div>
                </dl>
              </div>
            }
            <button type="button" class="btn t-learn" (click)="practice.book(reason(t))">Quiero empezar <app-arrow /></button>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 18px; max-width: 820px; }
    .grid { display: grid; grid-template-columns: 0.9fr 1.2fr; gap: clamp(24px, 4vw, 64px); margin-top: 50px; align-items: start; }
    .tags { display: flex; flex-wrap: wrap; gap: 14px 12px; }
    /* Etiqueta de papel con hoyito, un poco chueca; la elegida se endereza y se pinta durazno */
    .tags button { position: relative; display: inline-flex; align-items: center; gap: 10px; padding: 14px 20px 14px 16px; font-size: 1.02rem; font-weight: 600; background: var(--card); box-shadow: var(--shadow-paper); rotate: var(--r); clip-path: polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%); transition: rotate 450ms var(--ease-bounce), background-color 300ms ease, translate 450ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .hole { width: 8px; height: 8px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--line-2); background: var(--paper); }
    .tags button[aria-checked='true'] { background: var(--peach); rotate: 0deg; translate: 0 -4px; }
    .tags button:active { scale: 0.95; }
    @media (hover: hover) and (pointer: fine) { .tags button:not([aria-checked='true']):hover { rotate: 0deg; translate: 0 -3px; background: var(--peach-soft); } }
    /* Hoja de cuaderno: renglones y margen */
    .sheet { position: relative; display: grid; gap: 18px; padding: clamp(28px, 3.4vw, 44px) clamp(24px, 3.4vw, 44px) clamp(28px, 3.4vw, 40px) clamp(48px, 5vw, 72px); background: repeating-linear-gradient(transparent 0 31px, oklch(64% 0.065 245 / 0.25) 31px 32px), var(--card); box-shadow: var(--shadow-lift); rotate: 0.6deg; }
    .sheet::before { content: ''; position: absolute; top: 0; bottom: 0; left: clamp(32px, 3.6vw, 52px); width: 1.5px; background: oklch(62% 0.12 25 / 0.5); }
    .tl { top: -12px; left: 40%; rotate: -3deg; }
    .t-reveal { display: grid; gap: 10px; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h3 { font-size: clamp(2.6rem, 4.5vw, 3.6rem); color: var(--peach-deep); font-weight: 700; }
    .doodle { width: 110px; flex: none; overflow: visible; }
    .doodle path { fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.4s var(--ease-smooth-out) 200ms forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    .label { font-size: 0.76rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sage-deep); }
    .feels { font-family: var(--font-hand); font-size: clamp(1.5rem, 2.4vw, 1.9rem); font-weight: 500; line-height: 1.25; margin-bottom: 8px; }
    .work { color: var(--ink-2); }
    dl { display: grid; margin: 8px 0 0; }
    dl div { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1.5px dashed var(--line-2); }
    dt { color: var(--muted); font-size: 0.92rem; }
    dd { margin: 0; font-weight: 650; text-align: right; }
    .sheet > .btn { justify-self: start; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    /* Microinteracciones: la etiqueta se columpia desde su agujero (con transición y no con animation, porque la
       animación de entrada del revelado vive en la misma propiedad y al reemplazarla la etiqueta se ocultaba)
       y el dibujo de la hoja se vuelve a trazar */
    .tags button { transform-origin: 10px 50%; }
    @media (hover: hover) and (pointer: fine) {
      .tags button:not([aria-checked='true']):hover { transition: rotate 750ms cubic-bezier(0.3, 2.6, 0.45, 1), background-color 300ms ease, translate 450ms var(--ease-bounce); }
      .tags button:hover .hole { background: var(--peach-deep); }
      .sheet:hover .doodle path { animation: redraw 1.1s var(--ease-smooth-out) forwards; }
    }
    .hole { transition: background-color 250ms ease; }
    @keyframes redraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  `,
})
export class Topics {
  protected readonly practice = inject(Practice);
  protected readonly topics = TOPICS;
  protected readonly active = signal<Topic>(TOPICS[0]);
  /** Cada tema tiene su propio garabato (más enredado en ansiedad, más suelto en lo demás). */
  protected readonly doodle = computed(() => {
    const i = TOPICS.indexOf(this.active());
    return scribble(60, 40, 55, 34, i === 0 ? 30 : 10 + i * 2, 100 + i * 13);
  });

  protected tilt(i: number) {
    return `${[-2.5, 1.8, -1.2, 2.4, -2, 1.4, -1.6, 2][i % 8]}deg`;
  }

  protected reason(t: Topic) {
    if (t.id === 'pareja') return 'Terapia de pareja';
    if (t.id === 'adolescentes') return 'Adolescentes';
    return 'Terapia individual';
  }
}
