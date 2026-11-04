import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TOPICS, Topic } from '../core/content';
import { Practice } from '../core/practice';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** "¿Qué te trae por aquí?": eliges lo que sientes y la tarjeta explica, sin tecnicismos, cómo se trabaja. */
@Component({
  selector: 'app-topics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="temas">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Para empezar</p>
          <h2 class="h2" data-reveal [revealDelay]="100">¿Qué te trae <em>por aquí</em>?</h2>
          <p class="lead" data-reveal [revealDelay]="200">Elige lo que más se parezca a lo que sientes. No tiene que ser exacto.</p>
        </header>
        <div class="grid">
          <div class="chips" role="radiogroup" aria-label="Lo que sientes" data-reveal>
            @for (t of topics; track t.id) {
              <button type="button" role="radio" [attr.aria-checked]="active().id === t.id" (click)="active.set(t)">{{ t.label }}</button>
            }
          </div>
          @let t = active();
          <article class="card" aria-live="polite" data-reveal [revealDelay]="120">
            @for (k of [t.id]; track k) {
              <div class="swap">
                <p class="label">Lo que suele sentirse</p>
                <p class="feels">“{{ t.feels }}”</p>
                <p class="label">Cómo lo trabajamos</p>
                <p class="work">{{ t.work }}</p>
                <dl>
                  <div><dt>Modalidad</dt><dd>{{ t.mode }}</dd></div>
                  <div><dt>Duración aproximada</dt><dd>{{ t.length }}</dd></div>
                </dl>
                <button type="button" class="btn" (click)="practice.book(reason(t))">Quiero empezar <app-icon name="arrow-right" [size]="18" /></button>
              </div>
            }
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 16px; max-width: 720px; }
    .grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: clamp(24px, 4vw, 64px); margin-top: 48px; align-items: start; }
    .chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .chips button { padding: 13px 20px; border-radius: 999px; font-size: 1rem; font-weight: 500; background: var(--paper); box-shadow: var(--shadow-s); transition: background-color 300ms ease, color 300ms ease, scale 160ms var(--ease-out); }
    .chips button:active { scale: 0.95; }
    .chips button[aria-checked='true'] { background: var(--forest); color: var(--mist); }
    @media (hover: hover) and (pointer: fine) { .chips button:not([aria-checked='true']):hover { background: var(--amber-soft); } }
    .card { position: relative; padding: clamp(24px, 3.4vw, 44px); border-radius: var(--radius-l); background: var(--paper); box-shadow: var(--shadow-m); }
    .swap { display: grid; gap: 10px; justify-items: start; animation: swap 700ms var(--ease-calm); }
    @keyframes swap { from { opacity: 0; filter: blur(6px); translate: 0 8px; } }
    .label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; color: var(--moss); }
    .feels { margin-bottom: 18px; font-family: var(--font-display); font-style: italic; font-size: clamp(1.4rem, 2.6vw, 1.9rem); line-height: 1.3; }
    .work { margin-bottom: 8px; color: var(--forest-2); }
    dl { display: grid; width: 100%; margin: 8px 0 18px; }
    dl div { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-top: 1px solid var(--line); }
    dt { color: var(--muted); font-size: 0.92rem; }
    dd { margin: 0; font-weight: 560; text-align: right; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Topics {
  protected readonly practice = inject(Practice);
  protected readonly topics = TOPICS;
  protected readonly active = signal<Topic>(TOPICS[0]);

  protected reason(t: Topic) {
    if (t.id === 'pareja') return 'Terapia de pareja';
    if (t.id === 'adolescentes') return 'Adolescentes';
    return 'Terapia individual';
  }
}
