import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Motion } from './core/motion';
import { Footer } from './sections/footer';
import { Header } from './sections/header';
import { Intro } from './shared/intro';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, Intro],
  template: `
    <app-intro />
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-header />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; border-radius: 999px; background: var(--forest); color: var(--mist); transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {
  constructor() {
    const motion = inject(Motion);
    afterNextRender(() => motion.start());
  }
}
