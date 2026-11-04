import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayInView } from '../shared/in-view-video';
import { CountUp, Reveal } from '../shared/reveal';

/** Cifras sobre una franja de video: cuentan al entrar y un brillo dorado las recorre. */
@Component({
  selector: 'app-numbers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, Reveal, PlayInView],
  template: `
    <section class="numbers">
      <video class="bg" playInView="media/pesas.mp4" poster="media/pesas-poster.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>
      <div class="veil"></div>
      <div class="container grid">
        @for (n of items; track n.label; let i = $index) {
          <div class="item" data-reveal [revealDelay]="i * 120">
            <strong [style.animation-delay]="i * 0.6 + 's'"><span [countUp]="n.value">{{ n.value }}</span>@if (n.suffix) {<em>{{ n.suffix }}</em>}</strong>
            <span class="lbl">{{ n.label }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .numbers { position: relative; padding: clamp(90px, 12vw, 170px) 0; overflow: hidden; isolation: isolate; }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; filter: sepia(0.55) saturate(1.3) brightness(0.95) contrast(1.05); }
    .veil { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, var(--bg) 0%, rgb(13 12 10 / 58%) 28%, rgb(13 12 10 / 58%) 72%, var(--bg) 100%); }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); }
    .item { display: flex; flex-direction: column; gap: 12px; padding: 0 28px; border-left: 1px solid var(--line-2); }
    .item:first-child { border-left: 0; padding-left: 0; }
    strong {
      font-family: var(--font-display); font-weight: 400; font-size: clamp(3.8rem, 7vw, 6.8rem); line-height: 1; font-variant-numeric: tabular-nums;
      background: linear-gradient(100deg, var(--ink) 40%, #fff3dc 48%, var(--gold) 52%, var(--ink) 60%) 0 0 / 300% 100%;
      -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: shine 6s ease-in-out infinite;
    }
    strong em { font-size: 0.6em; margin-left: 4px; }
    @keyframes shine { 0%, 55% { background-position: 100% 0; } 100% { background-position: 0% 0; } }
    .lbl { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-2); }
    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr 1fr; row-gap: 44px; }
      .item:nth-child(3) { border-left: 0; padding-left: 0; }
    }
  `,
})
export class Numbers {
  protected readonly items = [
    { value: 12, suffix: '', label: 'Personas por clase' },
    { value: 3, suffix: '', label: 'Estudios privados' },
    { value: 46, suffix: '', label: 'Clases por semana' },
    { value: 98, suffix: '%', label: 'Socios que renuevan' },
  ];
}
