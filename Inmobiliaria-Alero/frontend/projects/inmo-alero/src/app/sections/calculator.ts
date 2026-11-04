import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Search } from '../core/search';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

const RATE = 10.5; // Tasa anual de referencia (demo)

@Component({
  selector: 'app-calculator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section calc" id="calculadora">
      <div class="container grid">
        <div class="intro">
          <span class="eyebrow" data-reveal>Calculadora</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">¿Cuánto pagarías <em>al mes</em>?</h2>
          <p class="section-lead" data-reveal [revealDelay]="140">Mueve los valores y ve una mensualidad aproximada. Con tus datos reales te hacemos la precalificación sin costo.</p>
          <ul class="notes" data-reveal [revealDelay]="200">
            <li><app-icon name="check" [size]="16" /> Infonavit, Fovissste y bancos</li>
            <li><app-icon name="check" [size]="16" /> Cofinavit y crédito conyugal</li>
            <li><app-icon name="check" [size]="16" /> Te decimos qué papeles juntar</li>
          </ul>
        </div>

        <div class="panel" data-reveal="scale" [revealDelay]="120">
          <div class="controls">
            <label class="range">
              <span class="row"><span>Precio de la casa</span><b>{{ fmt(price()) }}</b></span>
              <input type="range" min="1000000" max="8000000" step="50000" [value]="price()" (input)="price.set(+val($event))" [style.--p]="pct(price(), 1000000, 8000000)" aria-label="Precio de la casa" />
            </label>
            <label class="range">
              <span class="row"><span>Enganche</span><b>{{ down() }}% · {{ fmt(downAmount()) }}</b></span>
              <input type="range" min="10" max="50" step="5" [value]="down()" (input)="down.set(+val($event))" [style.--p]="pct(down(), 10, 50)" aria-label="Porcentaje de enganche" />
            </label>
            <fieldset>
              <legend>Plazo</legend>
              <div class="years">
                @for (y of years; track y) {
                  <button type="button" [class.on]="term() === y" [attr.aria-pressed]="term() === y" (click)="term.set(y)">{{ y }} años</button>
                }
              </div>
            </fieldset>
          </div>

          <div class="result">
            <span class="label">Mensualidad aproximada</span>
            <strong>{{ fmt(shown()) }}</strong>
            <div class="bar" aria-hidden="true">
              <span class="b-down" [style.width.%]="down()"></span>
              <span class="b-loan"></span>
            </div>
            <dl>
              <div><dt><i class="dot d1"></i>Enganche</dt><dd>{{ fmt(downAmount()) }}</dd></div>
              <div><dt><i class="dot d2"></i>Crédito</dt><dd>{{ fmt(loan()) }}</dd></div>
              <div><dt>Ingreso mensual sugerido</dt><dd>{{ fmt(income()) }}</dd></div>
            </dl>
            <button type="button" class="btn btn-brass" (click)="search.ask('Asesoría de crédito')">Quiero mi precalificación <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></button>
            <small>Estimación con tasa anual fija de {{ rate }}%. No incluye seguros ni gastos notariales.</small>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px, 6vw, 80px); align-items: center; }
    .notes { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 10px; font-weight: 600; }
    .notes li { display: flex; align-items: center; gap: 10px; }
    .notes app-icon { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--pine-soft); color: var(--pine); }

    .panel { display: grid; grid-template-columns: 1fr 1fr; border-radius: var(--radius-lg); background: var(--paper); box-shadow: var(--shadow); overflow: hidden; }
    .controls { display: flex; flex-direction: column; gap: 28px; padding: 30px; }
    .range { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; justify-content: space-between; gap: 10px; font-size: 0.9rem; color: var(--muted); font-weight: 600; }
    .row b { color: var(--ink); font-variant-numeric: tabular-nums; }
    input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; background: linear-gradient(90deg, var(--pine) var(--p), var(--line) var(--p)); cursor: pointer; }
    input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 6px solid var(--brass); box-shadow: 0 4px 10px rgb(0 0 0 / 18%); transition: transform 200ms var(--ease-back); }
    input[type='range']::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 6px solid var(--brass); box-shadow: 0 4px 10px rgb(0 0 0 / 18%); }
    input[type='range']:active::-webkit-slider-thumb { transform: scale(1.2); }
    input[type='range']:focus-visible { outline-offset: 8px; }
    fieldset { border: 0; padding: 0; margin: 0; }
    legend { padding: 0; font-size: 0.9rem; color: var(--muted); font-weight: 600; }
    .years { display: flex; gap: 6px; margin-top: 12px; }
    .years button { flex: 1; min-height: 44px; border-radius: 10px; box-shadow: inset 0 0 0 1.5px var(--line); font-weight: 650; font-size: 0.9rem; transition: background-color 250ms ease, color 250ms ease, box-shadow 250ms ease; }
    .years button.on { background: var(--pine); color: #fff; box-shadow: none; }

    .result { display: flex; flex-direction: column; padding: 30px; background: var(--pine); color: #fff; }
    .label { font-size: 0.85rem; color: rgb(255 255 255 / 70%); font-weight: 600; }
    .result strong { margin-top: 6px; font-family: var(--font-display); font-weight: 400; font-size: clamp(2.6rem, 4.4vw, 3.4rem); line-height: 1; color: var(--brass-2); font-variant-numeric: tabular-nums; }
    .bar { display: flex; height: 10px; margin-top: 22px; border-radius: 999px; overflow: hidden; background: rgb(255 255 255 / 14%); }
    .b-down { background: var(--brass); transition: width 600ms var(--ease-out); }
    .b-loan { flex: 1; background: rgb(255 255 255 / 30%); }
    dl { margin: 18px 0 0; display: grid; gap: 8px; }
    dl div { display: flex; justify-content: space-between; gap: 10px; font-size: 0.9rem; }
    dt { display: flex; align-items: center; gap: 8px; color: rgb(255 255 255 / 70%); }
    dd { margin: 0; font-weight: 650; font-variant-numeric: tabular-nums; }
    .dot { width: 9px; height: 9px; border-radius: 3px; }
    .d1 { background: var(--brass); }
    .d2 { background: rgb(255 255 255 / 45%); }
    .result .btn { margin-top: 24px; }
    small { margin-top: 12px; font-size: 0.75rem; color: rgb(255 255 255 / 55%); }
    @media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .panel { grid-template-columns: 1fr; } .controls, .result { padding: 24px; } }
  `,
})
export class Calculator {
  protected readonly search = inject(Search);
  protected readonly rate = RATE;
  protected readonly years = [10, 15, 20];
  protected readonly price = signal(3000000);
  protected readonly down = signal(20);
  protected readonly term = signal(20);
  protected readonly downAmount = computed(() => (this.price() * this.down()) / 100);
  protected readonly loan = computed(() => this.price() - this.downAmount());
  protected readonly monthly = computed(() => {
    const r = RATE / 100 / 12;
    const n = this.term() * 12;
    return (this.loan() * r) / (1 - Math.pow(1 + r, -n));
  });
  protected readonly income = computed(() => this.monthly() / 0.33);
  /** Cifra que se muestra: se anima hacia la mensualidad real. */
  protected readonly shown = signal(0);

  constructor() {
    let frame = 0;
    effect(() => {
      const target = this.monthly();
      if (typeof requestAnimationFrame === 'undefined') return this.shown.set(target);
      cancelAnimationFrame(frame);
      const from = untracked(this.shown);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 500);
        this.shown.set(from + (target - from) * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
  }

  protected fmt(n: number) {
    return `$${Math.round(n).toLocaleString('es-MX')}`;
  }

  protected pct(v: number, min: number, max: number) {
    return `${((v - min) / (max - min)) * 100}%`;
  }

  protected val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
}
