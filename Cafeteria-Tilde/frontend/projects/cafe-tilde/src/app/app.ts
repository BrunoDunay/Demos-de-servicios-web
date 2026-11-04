import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Awning } from './sections/awning';
import { Bag } from './sections/bag';
import { Footer } from './sections/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Awning, Bag, Footer],
  template: `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-awning />
    <main id="contenido"><router-outlet /></main>
    <app-footer />
    <app-bag />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -60px; z-index: 100; padding: 12px 18px; border-radius: 12px; background: var(--cafe); color: var(--crema); font-weight: 700; transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {}
