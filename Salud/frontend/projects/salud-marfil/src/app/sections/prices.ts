import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PLAN, TREATMENTS } from '../core/content';
import { Clinic, money } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Arrow } from '../shared/arrow';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';

/**
 * Precios "desde" con un interruptor que rebota dos veces (transitions.dev "Toggle") para verlos a 12 meses;
 * los dígitos de cada precio entran desenfocados uno por uno ("Number pop-in"). Plan Familia en tarjeta de vidrio.
 */
@Component({
  selector: 'app-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Tilt, Arrow],
  template: `
    <section class="section wrap" id="precios">
      <div class="page">
        <header class="head">
          <div>
            <p class="pill" data-reveal>Precios</p>
            <h2 class="h2" data-reveal [revealDelay]="80">Precios a la vista, <b>antes de sentarte</b>.</h2>
          </div>
          <button type="button" class="toggle" role="switch" [attr.aria-checked]="monthly()" [class.is-init]="touched()" [attr.data-on]="monthly()" (click)="flip()" data-reveal [revealDelay]="140">
            <span class="track"><span class="thumb"></span></span>
            Ver a 12 meses sin intereses
          </button>
        </header>
        <div class="grid">
          <ul class="list" data-reveal>
            @for (t of treatments; track t.id) {
              <li>
                <span class="name">{{ t.name }}<small>{{ t.sessions }}</small></span>
                @let p = priceOf(t.from);
                <span class="price" [attr.aria-label]="p.label">
                  <small>{{ p.monthly ? 'al mes · 12 MSI' : 'desde' }}</small>
                  <span class="digits">@for (c of p.chars; track $index + c + monthly()) {<i class="t-pop" [style.animation-delay.ms]="$index * 35">{{ c }}</i>}</span>
                </span>
              </li>
            }
          </ul>
          <div tilt="7">
            <aside class="plan t-tilt-card" data-reveal [revealDelay]="120">
              <p class="pill dark">Para toda la familia</p>
              <h3>{{ plan.name }}</h3>
              <p class="amount">{{ money(plan.price) }}<span>{{ plan.per }}</span></p>
              <ul>
                @for (i of plan.items; track i) {
                  <li><span class="check"><app-icon name="check" [size]="14" [stroke]="3" /></span> {{ i }}</li>
                }
              </ul>
              <button type="button" class="btn on-dark t-learn" (click)="clinic.book('Revisión y limpieza')">Quiero el plan <app-arrow /></button>
              <p class="fine">Precios en pesos, IVA incluido. Factura disponible.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--white); }
    .head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 20px; }
    .head > div { display: grid; gap: 18px; }
    .h2 b { color: var(--royal); }
    .toggle { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; font-size: 0.95rem; font-weight: 650; }
    .track { position: relative; width: 50px; height: 30px; border-radius: 999px; background: var(--ice-3); transition: background-color 250ms ease; }
    .thumb { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: var(--white); box-shadow: var(--shadow-s); translate: 0 0; }
    .toggle[data-on='true'] .track { background: var(--royal); }
    .toggle[data-on='true'] .thumb { translate: 20px 0; }
    /* transitions.dev "Toggle": la bolita se pasa un poco y regresa (doble rebote) */
    .toggle.is-init[data-on='true'] .thumb { animation: t-toggle-on 350ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
    .toggle.is-init[data-on='false'] .thumb { animation: t-toggle-off 350ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
    @keyframes t-toggle-on { 0% { translate: 0 0; } 55% { translate: 23px 0; } 80% { translate: 19px 0; } 100% { translate: 20px 0; } }
    @keyframes t-toggle-off { 0% { translate: 20px 0; } 55% { translate: -3px 0; } 80% { translate: 1px 0; } 100% { translate: 0 0; } }
    .grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: clamp(24px, 4vw, 60px); margin-top: 44px; align-items: start; }
    .list { list-style: none; margin: 0; padding: 0; }
    .list li { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 16px; padding: 18px 14px; border-radius: 16px; transition: background-color 250ms ease, translate 400ms var(--ease-smooth-out); }
    .list li + li { border-top: 1px solid var(--line); }
    @media (hover: hover) and (pointer: fine) { .list li:hover { background: var(--ice); translate: 6px 0; } }
    .name { display: grid; font-weight: 650; }
    .name small { font-size: 0.82rem; font-weight: 500; color: var(--muted); }
    /* "desde" arriba y la cifra abajo, todo pegado a la derecha: los precios quedan en una sola columna */
    .price { display: grid; justify-items: end; line-height: 1.1; min-width: 7.5ch; font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; color: var(--navy); }
    .price i { font-style: normal; }
    .digits { display: inline-flex; overflow: hidden; }
    .price small { font-family: var(--font-body); font-size: 0.76rem; font-weight: 600; color: var(--muted); }
    .plan { display: grid; gap: 16px; padding: clamp(26px, 3vw, 36px); border-radius: var(--radius-l); background: linear-gradient(150deg, var(--royal), var(--navy) 80%); color: var(--white); box-shadow: var(--shadow-blue); overflow: hidden; }
    .plan h3 { font-size: 2rem; font-weight: 600; }
    .amount { font-family: var(--font-display); font-size: 3.6rem; font-weight: 600; line-height: 1; letter-spacing: -0.04em; }
    .amount span { display: block; margin-top: 8px; font-family: var(--font-body); font-size: 0.86rem; font-weight: 500; letter-spacing: 0; color: oklch(85% 0.04 250); }
    .plan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
    .plan li { display: flex; gap: 10px; align-items: center; font-size: 0.96rem; }
    .check { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--sky); color: var(--navy); flex: none; }
    .plan .btn { justify-self: start; }
    .fine { font-size: 0.78rem; color: oklch(80% 0.04 250); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 520px) { .list li { grid-template-columns: 1fr; gap: 4px; } .price { justify-items: start; } }
  `,
})
export class Prices {
  protected readonly clinic = inject(Clinic);
  protected readonly treatments = TREATMENTS;
  protected readonly plan = PLAN;
  protected readonly monthly = signal(false);
  protected readonly touched = signal(false);
  protected readonly money = money;

  protected flip() {
    this.touched.set(true);
    this.monthly.set(!this.monthly());
  }

  /** Precio a mostrar: a 12 meses solo para tratamientos de $3,000 o más. */
  protected priceOf(n: number) {
    const monthly = this.monthly() && n >= 3000;
    const value = monthly ? Math.ceil(n / 12 / 10) * 10 : n;
    const text = money(value);
    return { monthly, chars: text.split(''), label: monthly ? `${text} al mes` : `desde ${text}` };
  }
}
