import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SERVICES } from '../core/content';
import { Search } from '../core/search';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section services" id="servicios">
      <div class="container">
        <div class="head">
          <span class="eyebrow" data-reveal>Servicios</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Compres, vendas o rentes, <em>vamos contigo</em>.</h2>
        </div>
        <div class="grid">
          @for (s of services; track s.title; let i = $index) {
            <article class="card" data-reveal [revealDelay]="i * 90">
              <span class="ico"><app-icon [name]="s.icon" [size]="26" [stroke]="1.8" /></span>
              <span class="num">0{{ i + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
              <button type="button" class="link" (click)="search.ask(s.cta)">{{ s.cta }} <app-icon name="arrow-right" [size]="16" /></button>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .services { background: var(--bg-2); }
    .head { max-width: 680px; margin-bottom: 40px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .card { position: relative; display: flex; flex-direction: column; padding: 26px 24px 24px; border-radius: var(--radius); background: var(--paper); overflow: hidden; isolation: isolate; transition: color 400ms ease, transform 450ms var(--ease-out); }
    .card::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--pine); clip-path: circle(0% at 100% 0%); transition: clip-path 650ms var(--ease-in-out); }
    @media (hover: hover) {
      .card:hover { color: #fff; transform: translateY(-6px); }
      .card:hover::before { clip-path: circle(150% at 100% 0%); }
      .card:hover p { color: rgb(255 255 255 / 78%); }
      .card:hover .ico { background: var(--brass); color: var(--ink); transform: rotate(-8deg); }
      .card:hover .link { color: var(--brass-2); }
      .card:hover .num { color: rgb(255 255 255 / 30%); }
    }
    .ico { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 16px; background: var(--pine-soft); color: var(--pine); transition: background-color 400ms ease, color 400ms ease, transform 500ms var(--ease-back); }
    .num { position: absolute; right: 22px; top: 22px; font-family: var(--font-display); font-size: 1.6rem; color: var(--line); transition: color 400ms ease; }
    h3 { margin-top: 22px; font-size: 1.8rem; }
    p { margin-top: 8px; color: var(--muted); font-size: 0.95rem; flex: 1; transition: color 400ms ease; }
    .link { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; width: fit-content; font-weight: 700; font-size: 0.9rem; color: var(--pine); transition: color 300ms ease, scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .link:active { scale: 0.97; }
    .link app-icon { transition: transform 350ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .link:hover app-icon { transform: translateX(4px); } }
    @media (max-width: 1000px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 540px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Services {
  protected readonly services = SERVICES;
  protected readonly search = inject(Search);
}
