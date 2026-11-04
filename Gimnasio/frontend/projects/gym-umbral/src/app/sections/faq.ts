import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FAQ } from '../core/content';
import { Reveal } from '../shared/reveal';

/** Preguntas frecuentes en acordeón (una abierta a la vez). */
@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <div class="faq">
      @for (f of items(); track f.q; let i = $index) {
        <div class="item" [class.is-open]="open() === i" data-reveal [revealDelay]="i * 60">
          <h3>
            <button type="button" [attr.aria-expanded]="open() === i" [attr.aria-controls]="'faq-' + i" (click)="open.set(open() === i ? -1 : i)">
              <span class="n">0{{ i + 1 }}</span>
              <span class="q">{{ f.q }}</span>
              <span class="icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="a" [id]="'faq-' + i" role="region">
            <div><p>{{ f.a }}</p></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .faq { border-top: 1px solid var(--line); }
    .item { border-bottom: 1px solid var(--line); }
    h3 { font: inherit; margin: 0; }
    button { width: 100%; display: grid; grid-template-columns: 50px 1fr 30px; align-items: center; gap: 12px; padding: 26px 0; text-align: left; }
    .n { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.2em; color: var(--gold); }
    .q { font-family: var(--font-display); font-size: clamp(1.4rem, 2.4vw, 2rem); line-height: 1.15; transition: color 300ms ease, transform 600ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { button:hover .q { color: var(--gold); transform: translateX(6px); } }
    .icon { position: relative; width: 22px; height: 22px; justify-self: end; }
    .icon::before, .icon::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--ink); transition: transform 600ms var(--ease-out), background-color 300ms ease; }
    .icon::after { transform: rotate(90deg); }
    .is-open .icon::after { transform: rotate(0deg); }
    .is-open .icon::before { background: var(--gold); }
    .a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 700ms var(--ease-out); }
    .is-open .a { grid-template-rows: 1fr; }
    .a > div { overflow: hidden; }
    .a p { padding: 0 40px 28px 62px; color: var(--ink-2); font-weight: 300; max-width: 820px; opacity: 0; transform: translateY(-8px); transition: opacity 500ms ease, transform 700ms var(--ease-out); }
    .is-open .a p { opacity: 1; transform: none; transition-delay: 120ms; }
    @media (max-width: 600px) { button { grid-template-columns: 34px 1fr 24px; } .a p { padding-left: 46px; padding-right: 0; } }
  `,
})
export class Faq {
  readonly limit = input(0);
  protected readonly open = signal(0);
  protected readonly items = computed(() => (this.limit() ? FAQ.slice(0, this.limit()) : FAQ));
}
