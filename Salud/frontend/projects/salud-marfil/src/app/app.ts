import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Motion } from './core/motion';
import { Footer } from './sections/footer';
import { Header } from './sections/header';
import { Intro } from './shared/intro';
import { ToothBurst } from './shared/tooth-burst';
import { ToothStageView } from './shared/tooth-stage';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Dientitos que caen al hacer clic en cualquier parte (shared/tooth-burst.ts)
  hostDirectives: [ToothBurst],
  imports: [RouterOutlet, Header, Footer, Intro, ToothStageView],
  template: `
    <app-intro />
    <app-tooth-stage />
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-header />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; border-radius: 999px; background: var(--navy); color: var(--white); transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {
  constructor() {
    const motion = inject(Motion);
    afterNextRender(() => {
      motion.start();
      // La transición entre páginas abre un círculo desde donde se hizo clic (styles.css, ::view-transition)
      document.addEventListener('pointerdown', (e) => {
        document.documentElement.style.setProperty('--vt-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--vt-y', `${e.clientY}px`);
      }, { passive: true });
    });
  }
}
