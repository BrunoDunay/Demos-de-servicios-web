import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LETTERS } from '../core/content';
import { Reveal } from '../shared/reveal';
import { Running } from '../shared/running';

/** Lo que escriben las familias, una carta a la vez, con su foto como estampa. */
@Component({
  selector: 'app-letters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Running],
  template: `
    <section class="section letters" id="cartas" running="Cartas">
      <div class="page">
        <p class="folio" data-reveal><span><b>Cartas</b> · lo que escriben después</span><span>p. 52</span></p>
        <div class="layout" data-reveal [revealDelay]="80">
          @for (l of [letters[i()]]; track l.name) {
            <figure class="stamp">
              <img [src]="'media/' + l.img + '-sm.webp'" [alt]="'Foto de la sesión de ' + l.name" width="720" height="900" />
            </figure>
            <blockquote class="letter">
              <p>{{ l.text }}</p>
              <footer><span class="who">{{ l.name }}</span><span class="what">{{ l.session }}</span></footer>
            </blockquote>
          }
        </div>
        <div class="nav">
          <button type="button" class="thread" (click)="go(-1)"><span class="arrow">←</span> Anterior</button>
          <span class="count" aria-live="polite">Carta {{ i() + 1 }} de {{ letters.length }}</span>
          <button type="button" class="thread" (click)="go(1)">Siguiente <span class="arrow">→</span></button>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 0.4fr 1.6fr; gap: clamp(30px, 6vw, 100px); align-items: center; margin-top: clamp(50px, 7vw, 100px); min-height: 360px; }
    .stamp { margin: 0; padding: 10px; background: var(--paper); box-shadow: 0 0 0 1px var(--line), 0 20px 30px -24px var(--ink); rotate: -3deg; animation: card 600ms var(--ease-out); }
    .stamp img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }
    .letter { margin: 0; animation: card 700ms var(--ease-out); }
    @keyframes card { from { opacity: 0; filter: blur(4px); translate: 0 10px; } }
    .letter p { font-family: var(--font-display); font-style: italic; font-weight: 340; font-size: clamp(1.8rem, 3.4vw, 3.1rem); line-height: 1.15; }
    .letter footer { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 28px; }
    .who { font-weight: 600; }
    .what { color: var(--muted); }
    .what::before { content: '— '; color: var(--hilo); }
    .nav { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 50px; padding-top: 18px; border-top: 1px solid var(--line); }
    .count { font-family: var(--font-display); font-style: italic; font-size: 1.1rem; color: var(--ink-2); }
    @media (max-width: 760px) {
      .layout { grid-template-columns: 1fr; }
      .stamp { width: 46%; }
      .count { display: none; }
    }
  `,
})
export class Letters {
  protected readonly letters = LETTERS;
  protected readonly i = signal(0);

  protected go(dir: number) {
    this.i.update((v) => (v + dir + LETTERS.length) % LETTERS.length);
  }
}
