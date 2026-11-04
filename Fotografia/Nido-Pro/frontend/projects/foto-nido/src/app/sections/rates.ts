import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Album } from '../core/booking';
import { EXTRAS, RATES } from '../core/content';
import { Reveal } from '../shared/reveal';
import { Running } from '../shared/running';

/** Tarifas como una lista de precios impresa: filas que se abren para ver qué incluye cada una. */
@Component({
  selector: 'app-rates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Running],
  template: `
    <section class="section rates" id="tarifas" running="Tarifas">
      <div class="page narrow">
        <p class="folio" data-reveal><span><b>Tarifas</b> · precios en pesos, IVA incluido</span><span>p. 48</span></p>
        <h2 data-reveal [revealDelay]="60">Lo que cuesta <em>guardar esto</em>.</h2>
        <p class="lead" data-reveal [revealDelay]="100">Todas incluyen estudio climatizado, vestuario y galería en línea. La fecha se aparta con $1,000.</p>

        <ul class="list">
          @for (r of rates; track r.name; let i = $index) {
            <li [class.open]="open() === i" [class.featured]="r.featured" data-reveal [revealDelay]="140 + i * 70">
              <button type="button" class="row" (click)="open.set(open() === i ? -1 : i)" [attr.aria-expanded]="open() === i" [attr.aria-controls]="'tarifa-' + i">
                <span class="name">{{ r.name }}</span>
                <span class="line">{{ r.line }}</span>
                <span class="dots" aria-hidden="true"></span>
                <span class="price">{{ '$' + r.price.toLocaleString('es-MX') }}</span>
                <span class="pm" aria-hidden="true"></span>
              </button>
              <div class="more" [id]="'tarifa-' + i" role="region">
                <div>
                  <ul class="details">
                    @for (d of r.details; track d) {
                      <li>{{ d }}</li>
                    }
                  </ul>
                  <button type="button" class="thread" (click)="album.book(undefined, 'el paquete ' + r.name)">Apartar {{ r.name }} <span class="arrow">→</span></button>
                </div>
              </div>
            </li>
          }
        </ul>

        <h3 class="extras-title" data-reveal>Aparte</h3>
        <ul class="extras" data-reveal [revealDelay]="60">
          @for (x of extras; track x.name) {
            <li><span>{{ x.name }}</span><span class="dots" aria-hidden="true"></span><span>{{ x.price }}</span></li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .narrow { max-width: 1040px; }
    h2 { margin-top: clamp(40px, 6vw, 80px); font-size: clamp(2.8rem, 6vw, 5.4rem); }
    h2 em { color: var(--hilo); }
    .lead { margin-top: 18px; max-width: 48ch; color: var(--ink-2); font-size: 1.08rem; }
    .list { list-style: none; margin: 50px 0 0; padding: 0; border-top: 1px solid var(--ink); }
    .list > li { border-bottom: 1px solid var(--line-2); }
    .row { display: grid; grid-template-columns: minmax(150px, 0.8fr) 1.4fr auto auto 30px; align-items: baseline; gap: 18px; width: 100%; padding: 26px 0; text-align: left; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .row:active { scale: 0.99; }
    .name { font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1; }
    .featured .name { font-style: italic; }
    .featured .name::after { content: ''; display: block; height: 2px; margin-top: 6px; width: 60%; background: repeating-linear-gradient(90deg, var(--hilo) 0 7px, transparent 7px 11px); }
    .line { color: var(--ink-2); }
    .dots { min-width: 40px; border-bottom: 1px dotted var(--line-2); translate: 0 -4px; }
    .price { font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); font-variant-numeric: lining-nums tabular-nums; }
    .pm { position: relative; width: 16px; height: 16px; justify-self: end; align-self: center; }
    .pm::before, .pm::after { content: ''; position: absolute; left: 0; right: 0; top: 7.5px; height: 1px; background: var(--ink); transition: rotate 300ms var(--ease-out); }
    .pm::after { rotate: 90deg; }
    .open .pm::after { rotate: 0deg; }
    @media (hover: hover) { .row:hover .name { color: var(--hilo); } }
    .more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 450ms var(--ease-out); }
    .more > div { overflow: hidden; }
    .open .more { grid-template-rows: 1fr; }
    .details { list-style: none; margin: 0; padding: 0 0 6px; display: flex; flex-wrap: wrap; gap: 10px 26px; color: var(--ink-2); }
    .details li::before { content: '— '; color: var(--hilo); }
    .more .thread { margin: 14px 0 26px; }
    .extras-title { margin-top: 60px; font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    .extras { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 10px; }
    .extras li { display: flex; align-items: baseline; gap: 12px; }
    .extras .dots { flex: 1; }
    @media (max-width: 760px) {
      .row { grid-template-columns: 1fr auto 20px; grid-template-areas: 'name price pm' 'line line line'; gap: 8px 12px; }
      .name { grid-area: name; }
      .price { grid-area: price; }
      .pm { grid-area: pm; }
      .line { grid-area: line; }
      .row .dots { display: none; }
    }
  `,
})
export class Rates {
  protected readonly album = inject(Album);
  protected readonly rates = RATES;
  protected readonly extras = EXTRAS;
  protected readonly open = signal(1);
}
