import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Motion } from './core/motion';
import { Footer } from './sections/footer';
import { Navbar } from './sections/navbar';
import { Intro } from './shared/intro';
import { Cursor } from './shared/pointer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navbar, Footer, Intro, Cursor],
  template: `
    <app-intro />
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-navbar />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
    <app-cursor />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; background: var(--ember); color: var(--bg); font-weight: 700; transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {
  constructor() {
    const motion = inject(Motion);
    afterNextRender(() => motion.start());
  }
}
