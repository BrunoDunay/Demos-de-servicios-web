import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AGENTS } from '../core/content';
import { Search } from '../core/search';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-agents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section agents" id="asesoras">
      <div class="container grid">
        <div class="intro">
          <span class="eyebrow" data-reveal>Asesoras</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Personas, <em>no un call center</em>.</h2>
          <p class="section-lead" data-reveal [revealDelay]="140">Te atiende siempre la misma asesora, de la primera visita a la firma. Conocemos cada colonia porque vivimos aquí.</p>
          <a class="btn" href="#contacto" data-reveal [revealDelay]="200">Hablar con una asesora <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a>
        </div>
        @for (a of agents; track a.name; let i = $index) {
          <article class="card" data-reveal [revealDelay]="120 + i * 120">
            <div class="photo">
              <img [src]="'media/' + a.img + '-sm.webp'" [alt]="a.name + ', asesora de ' + a.role.toLowerCase()" width="720" height="900" loading="lazy" />
              <span class="years"><b>{{ a.years }}</b> años de experiencia</span>
            </div>
            <div class="body">
              <h3>{{ a.name }}</h3>
              <span class="role">{{ a.role }}</span>
              <blockquote>“{{ a.quote }}”</blockquote>
              <button type="button" class="talk" (click)="search.ask(i === 0 ? 'Quiero comprar' : 'Quiero rentar')"><app-icon name="chat" [size]="17" /> Escribirle</button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .agents { background: var(--bg-2); }
    .grid { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 22px; align-items: center; }
    .intro .btn { margin-top: 28px; }
    .card { border-radius: var(--radius); background: var(--paper); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 450ms var(--ease-out), box-shadow 450ms ease; }
    @media (hover: hover) and (pointer: fine) { .card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); } }
    .photo { position: relative; aspect-ratio: 4 / 4.4; overflow: hidden; background: var(--line); }
    .photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; transition: transform 900ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .card:hover .photo img { transform: scale(1.05); } }
    .years { position: absolute; left: 12px; bottom: 12px; padding: 6px 12px; border-radius: 10px; background: rgb(255 255 255 / 92%); font-size: 0.8rem; font-weight: 600; }
    .years b { color: var(--pine); }
    .body { padding: 18px 20px 20px; }
    h3 { font-size: 1.6rem; }
    .role { font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brass); }
    blockquote { margin: 12px 0 0; color: var(--ink-2); font-size: 0.95rem; }
    .talk { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; min-height: 42px; padding: 0 16px; border-radius: 10px; background: var(--pine-soft); color: var(--pine); font-weight: 700; font-size: 0.88rem; transition: background-color 250ms ease, color 250ms ease, scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .talk:active { scale: 0.96; }
    @media (hover: hover) and (pointer: fine) { .talk:hover { background: var(--pine); color: #fff; } }
    @media (max-width: 1000px) { .grid { grid-template-columns: 1fr 1fr; } .intro { grid-column: 1 / -1; } }
    @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Agents {
  protected readonly agents = AGENTS;
  protected readonly search = inject(Search);
}
