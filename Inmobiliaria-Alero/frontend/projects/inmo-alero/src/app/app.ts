import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './sections/footer';
import { Navbar } from './sections/navbar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-navbar />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; border-radius: 12px; background: var(--ink); color: #fff; transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {}
