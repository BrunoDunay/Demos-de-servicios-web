import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLANS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-plans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section plans" id="planes">
      <div class="container">
        <div class="head">
          <span class="tag" data-reveal>Membresías</span>
          <h2 class="title-xl" data-reveal [revealDelay]="80">Elige tu <span class="ember">carga</span></h2>
        </div>
        <div class="grid">
          @for (p of plans; track p.name; let i = $index) {
            <div class="cell" data-reveal [revealDelay]="i * 110">
              <article class="card" [class.is-featured]="p.featured">
                @if (p.featured) {
                  <span class="flag">Más elegido</span>
                }
                <header>
                  <h3>{{ p.name }}</h3>
                  <p>{{ p.note }}</p>
                </header>
                <div class="price"><small>$</small>{{ p.price.toLocaleString('es-MX') }}<span>{{ p.period }}</span></div>
                <ul>
                  @for (f of p.features; track f) {
                    <li><app-icon name="check" [size]="16" [stroke]="2.5" />{{ f }}</li>
                  }
                </ul>
                <a class="btn" [class.btn-ghost]="!p.featured" href="#contacto">Lo quiero <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></a>
              </article>
            </div>
          }
        </div>
        <div class="dropin" data-reveal>
          <div><b>Clase suelta</b><span>$180 · sin compromiso</span></div>
          <div class="free"><app-icon name="flame" [size]="22" /> Tu primera clase es <b>gratis</b></div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { margin-bottom: 52px; }
    .title-xl { margin-top: 18px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .card {
      position: relative; height: 100%; display: flex; flex-direction: column; padding: 34px 30px; background: var(--bg-2); border: 1px solid var(--line);
      transition: transform 500ms var(--ease-expo), border-color 300ms ease;
    }
    .card::before { content: ''; position: absolute; left: 0; top: 0; height: 3px; width: 100%; background: var(--ember); transform: scaleX(0); transform-origin: left; transition: transform 600ms var(--ease-expo); }
    .card:hover { transform: translateY(-8px); border-color: var(--line-2); }
    .card:hover::before, .card.is-featured::before { transform: scaleX(1); }
    .card.is-featured { background: var(--bg-3); border-color: rgb(255 91 20 / 40%); }
    .flag { position: absolute; top: 0; right: 0; padding: 8px 14px; background: var(--ember); color: var(--bg); font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
    h3 { font-size: 2.6rem; }
    header p { margin-top: 6px; font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; }
    .price { display: flex; align-items: baseline; margin-top: 28px; font-family: var(--font-display); font-size: 5.2rem; line-height: 1; }
    .is-featured .price { color: var(--ember); }
    .price small { font-size: 2rem; align-self: flex-start; margin-top: 10px; }
    .price span { margin-left: 10px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted); }
    ul { list-style: none; margin: 26px 0 30px; padding: 22px 0 0; border-top: 1px solid var(--line); display: grid; gap: 12px; flex: 1; }
    li { display: flex; gap: 10px; align-items: center; color: var(--ink-2); }
    li app-icon { color: var(--ember); }
    .card .btn { width: 100%; }
    .dropin { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-top: 18px; padding: 22px 30px; border: 1px dashed var(--line-2); }
    .dropin b { font-family: var(--font-display); font-weight: 400; font-size: 1.8rem; text-transform: uppercase; margin-right: 14px; }
    .dropin span { font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted); }
    .free { display: flex; align-items: center; gap: 10px; font-size: 1.05rem; color: var(--ink-2); }
    .free app-icon { color: var(--ember); }
    .free b { margin: 0; font-size: 1.8rem; color: var(--ember); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; max-width: 480px; } }
  `,
})
export class Plans {
  protected readonly plans = PLANS;
}
