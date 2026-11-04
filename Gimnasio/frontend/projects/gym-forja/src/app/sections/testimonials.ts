import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { TESTIMONIALS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section testimonials" aria-roledescription="carrusel" aria-label="Testimonios de atletas">
      <div class="container layout">
        <div class="side">
          <span class="tag" data-reveal>Atletas</span>
          <span class="mark" aria-hidden="true">“</span>
          <div class="bars" role="tablist" aria-label="Elegir testimonio">
            @for (t of items; track t.name; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="i === index()" [attr.aria-label]="'Testimonio ' + (i + 1)" (click)="go(i)">
                <span [class.is-active]="i === index()" [class.is-done]="i < index()"></span>
              </button>
            }
          </div>
        </div>
        @for (t of [current()]; track t.name) {
          <figure class="quote" aria-live="polite">
            <blockquote>{{ t.quote }}</blockquote>
            <figcaption><b>{{ t.name }}</b><span>{{ t.meta }}</span></figcaption>
          </figure>
        }
        <div class="nav">
          <button type="button" (click)="go(index() - 1)" aria-label="Anterior"><app-icon name="arrow-left" [size]="22" /></button>
          <button type="button" (click)="go(index() + 1)" aria-label="Siguiente"><app-icon name="arrow-right" [size]="22" /></button>
        </div>
      </div>
    </section>
  `,
  styles: `
    .testimonials { background: var(--bg-2); border-top: 1px solid var(--line); }
    .layout { display: grid; grid-template-columns: 0.5fr 1.5fr auto; gap: clamp(24px, 4vw, 64px); align-items: start; }
    .mark { display: block; font-family: var(--font-display); font-size: 12rem; line-height: 0.7; color: var(--ember); margin-top: 24px; }
    .bars { display: flex; gap: 6px; margin-top: 16px; }
    .bars button { padding: 10px 0; width: 44px; }
    .bars span { position: relative; display: block; height: 3px; background: var(--line-2); overflow: hidden; }
    .bars span::after { content: ''; position: absolute; inset: 0; background: var(--ember); transform: scaleX(0); transform-origin: left; }
    .bars span.is-done::after { transform: scaleX(1); }
    .bars span.is-active::after { animation: bar 7s linear forwards; }
    @keyframes bar { to { transform: scaleX(1); } }
    .quote { margin: 0; animation: q-in 800ms var(--ease-expo) both; }
    @keyframes q-in { from { opacity: 0; transform: translateY(24px); clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
    blockquote { margin: 0; font-family: var(--font-display); font-size: clamp(2rem, 3.8vw, 3.6rem); line-height: 1.04; text-transform: uppercase; }
    figcaption { display: flex; gap: 14px; align-items: baseline; margin-top: 28px; }
    figcaption b { font-size: 1.1rem; }
    figcaption span { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ember); }
    .nav { display: flex; flex-direction: column; gap: 10px; }
    .nav button { display: grid; place-items: center; width: 56px; height: 56px; border: 1.5px solid var(--line-2); transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease, transform 200ms var(--ease-out); }
    .nav button:hover { background: var(--ember); border-color: var(--ember); color: var(--bg); }
    .nav button:active { transform: scale(0.92); }
    @media (max-width: 860px) {
      .layout { grid-template-columns: 1fr; }
      .mark { font-size: 7rem; }
      .nav { flex-direction: row; }
    }
  `,
})
export class Testimonials {
  protected readonly items = TESTIMONIALS;
  protected readonly index = signal(0);
  protected readonly current = computed(() => this.items[this.index()]);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let id = setInterval(() => this.next(), 7000);
      const restart = () => {
        clearInterval(id);
        id = setInterval(() => this.next(), 7000);
      };
      this.restart = restart;
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  private restart = () => {};

  private next() {
    this.index.update((i) => (i + 1) % this.items.length);
  }

  protected go(i: number) {
    const n = this.items.length;
    this.index.set(((i % n) + n) % n);
    this.restart();
  }
}
