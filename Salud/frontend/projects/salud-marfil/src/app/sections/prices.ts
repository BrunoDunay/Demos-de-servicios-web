import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PLAN, TREATMENTS } from '../core/content';
import { Clinic, money } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Precios "desde" con interruptor para verlos a 12 meses, y el plan familiar. */
@Component({
  selector: 'app-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section wrap" id="precios">
      <div class="page">
        <header class="head">
          <p class="eyebrow" data-reveal>Precios</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Precios a la vista, <em>antes de sentarte</em>.</h2>
          <div class="switch" data-reveal [revealDelay]="140">
            <button type="button" role="switch" [attr.aria-checked]="monthly()" (click)="monthly.set(!monthly())">
              <span class="track"><span class="thumb"></span></span>
              Ver a 12 meses sin intereses
            </button>
          </div>
        </header>
        <div class="grid">
          <ul class="list" data-reveal>
            @for (t of treatments; track t.id) {
              <li>
                <span class="name">{{ t.name }}<small>{{ t.sessions }}</small></span>
                <span class="dots" aria-hidden="true"></span>
                <span class="price">
                  @if (monthly() && t.from >= 3000) {
                    {{ money(perMonth(t.from)) }}<small>/mes</small>
                  } @else {
                    <small>desde</small> {{ money(t.from) }}
                  }
                </span>
              </li>
            }
          </ul>
          <aside class="plan" data-reveal [revealDelay]="120">
            <p class="badge">Para toda la familia</p>
            <h3>{{ plan.name }}</h3>
            <p class="amount">{{ money(plan.price) }} <span>{{ plan.per }}</span></p>
            <ul>
              @for (i of plan.items; track i) {
                <li><app-icon name="check" [size]="18" /> {{ i }}</li>
              }
            </ul>
            <button type="button" class="btn mint" (click)="clinic.book('Revisión y limpieza')">Quiero el plan <app-icon name="arrow-right" [size]="18" /></button>
            <p class="fine">Precios en pesos mexicanos, IVA incluido. Factura disponible.</p>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .wrap { background: var(--ivory-2); }
    .head { display: grid; gap: 16px; justify-items: start; }
    .switch button { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; font-size: 0.95rem; font-weight: 600; }
    .track { position: relative; width: 44px; height: 26px; border-radius: 999px; background: var(--line-2); transition: background-color 250ms ease; }
    .thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: var(--white); box-shadow: var(--shadow-s); transition: translate 300ms var(--ease-spring); }
    [aria-checked='true'] .track { background: var(--mint); }
    [aria-checked='true'] .thumb { translate: 18px 0; }
    .switch button:active .thumb { scale: 1.1 0.9; }
    .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(24px, 4vw, 60px); margin-top: 44px; align-items: start; }
    .list { list-style: none; margin: 0; padding: 0; }
    .list li { display: flex; align-items: baseline; gap: 12px; padding: 18px 0; border-bottom: 1px solid var(--line); }
    .name { display: grid; font-weight: 600; }
    .name small { font-size: 0.82rem; font-weight: 500; color: var(--muted); }
    .dots { flex: 1; min-width: 20px; border-bottom: 1.5px dotted var(--line-2); translate: 0 -4px; }
    .price { font-family: var(--font-display); font-size: 1.45rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .price small { font-family: var(--font-body); font-size: 0.78rem; color: var(--muted); }
    .plan { position: sticky; top: 100px; display: grid; gap: 14px; padding: clamp(24px, 3vw, 34px); border-radius: var(--radius-l); background: var(--night); color: var(--ivory); }
    .badge { width: fit-content; padding: 6px 12px; border-radius: 999px; font-size: 0.76rem; font-weight: 650; background: oklch(63% 0.1 172 / 0.18); color: var(--mint); }
    h3 { font-size: 2rem; }
    .amount { font-family: var(--font-display); font-size: 3rem; line-height: 1; }
    .amount span { display: block; margin-top: 6px; font-family: var(--font-body); font-size: 0.88rem; color: oklch(75% 0.02 258); }
    .plan ul { list-style: none; margin: 6px 0 8px; padding: 0; display: grid; gap: 10px; }
    .plan li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.96rem; }
    .plan li .icon { color: var(--mint); margin-top: 3px; }
    .fine { font-size: 0.78rem; color: oklch(70% 0.02 258); }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .plan { position: static; }
      .list li { flex-wrap: wrap; }
      .dots { display: none; }
      .price { margin-left: auto; }
    }
  `,
})
export class Prices {
  protected readonly clinic = inject(Clinic);
  protected readonly treatments = TREATMENTS;
  protected readonly plan = PLAN;
  protected readonly monthly = signal(false);
  protected readonly money = money;

  protected perMonth(n: number) {
    return Math.ceil(n / 12 / 10) * 10;
  }
}
