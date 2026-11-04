import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Motion } from './core/motion';
import { Seo } from './core/seo';
import { Footer } from './sections/footer';
import { Navbar } from './sections/navbar';
import { Curtain } from './shared/curtain';
import { Intro } from './shared/intro';
import { Cursor } from './shared/pointer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navbar, Footer, Intro, Cursor, Curtain],
  template: `
    <app-intro />
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-navbar />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
    <app-curtain />
    <app-cursor />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; border-radius: 999px; background: var(--gold); color: var(--bg); font-weight: 600; transition: top 300ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {
  constructor() {
    const motion = inject(Motion);
    inject(Seo).init(inject(Router), inject(ActivatedRoute));
    afterNextRender(() => motion.start());
  }
}
