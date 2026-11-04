import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLANS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/**
 * Tarjetas de membresía. Con mouse se inclinan en 3D siguiendo el cursor, con un reflejo de luz
 * y un borde dorado que se enciende donde está el puntero. Con [annual]="true" muestran el precio
 * mensual con 15% de descuento anual.
 */
@Component({
  selector: 'app-plan-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Reveal],
  template: `
    <div class="grid">
      @for (p of plans; track p.id; let i = $index) {
        <div class="cell" data-reveal [revealDelay]="i * 120">
          <article class="card" [class.is-featured]="p.featured" [class.is-hinted]="hint() === p.id" (pointermove)="tilt($event)" (pointerleave)="reset($event)">
            <span class="edge" aria-hidden="true"></span>
            <span class="glare" aria-hidden="true"></span>
            @if (p.featured) {
              <span class="flag">La más elegida</span>
            }
            <h3>{{ p.name }}</h3>
            <p class="note"><em>{{ p.note }}</em></p>
            <div class="price">
              <small>$</small>
              @for (v of [price(p.monthly)]; track v) {
                <span class="amount">{{ v.toLocaleString('es-MX') }}</span>
              }
              <span class="per">MXN / mes</span>
            </div>
            <p class="save">{{ annual() ? 'Pago anual · ahorras ' + money(p.monthly * 12 * 0.15) + ' al año' : 'Pago mes a mes · sin plazo forzoso' }}</p>
            <p class="classes">{{ p.classes }}</p>
            @if (p.includes) {
              <div class="inherit" (pointerenter)="hint.set(p.includes)" (pointerleave)="hint.set(null)">
                <span class="layers" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="inherit-text"><small>Incluye completo</small><b>Todo lo de {{ nameOf(p.includes) }}</b></span>
              </div>
              <p class="plus"><span>y además</span></p>
            }
            <ul>
              @for (f of p.features; track f) {
                <li><app-icon name="check" [size]="15" />{{ f }}</li>
              }
            </ul>
            <a routerLink="/contacto" [queryParams]="{ interes: 'Membresía ' + p.name }" class="btn" [class.btn-solid]="p.featured" [class.btn-quiet]="!p.featured" data-cursor="Elegir">
              Elegir {{ p.name }} <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span>
            </a>
          </article>
        </div>
      }
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: stretch; }
    .cell { display: flex; }
    .card {
      --rx: 0deg; --ry: 0deg; --mx: 50%; --my: 0%;
      position: relative; flex: 1; display: flex; flex-direction: column; padding: 40px 34px 34px; background: var(--bg-2); box-shadow: inset 0 0 0 1px var(--line);
      transform: perspective(1300px) rotateX(var(--rx)) rotateY(var(--ry)); transform-style: preserve-3d; transition: transform 700ms var(--ease-out), box-shadow 600ms ease;
    }
    .card.is-featured { background: linear-gradient(180deg, #221e18, var(--bg-2)); box-shadow: inset 0 0 0 1px rgb(216 185 138 / 45%), 0 0 80px -30px rgb(243 213 161 / 30%); }
    @media (hover: hover) and (pointer: fine) { .card:hover { box-shadow: inset 0 0 0 1px var(--line-2), 0 50px 70px -40px rgb(0 0 0 / 80%); } }
    @media (hover: hover) and (pointer: fine) { .card.is-featured:hover { box-shadow: inset 0 0 0 1px rgb(216 185 138 / 60%), 0 0 110px -20px rgb(243 213 161 / 38%); } }
    .edge {
      position: absolute; inset: 0; padding: 1px; pointer-events: none; opacity: 0; transition: opacity 500ms ease;
      background: radial-gradient(260px circle at var(--mx) var(--my), rgb(243 213 161 / 90%), transparent 60%);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
      mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    }
    .glare { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 500ms ease; background: radial-gradient(500px circle at var(--mx) var(--my), rgb(243 213 161 / 9%), transparent 55%); }
    @media (hover: hover) and (pointer: fine) { .card:hover .edge, .card:hover .glare { opacity: 1; } }
    .flag { position: absolute; top: 18px; right: 18px; padding: 6px 12px; border-radius: 999px; background: var(--gold); color: var(--bg); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; transform: translateZ(30px); }
    h3 { font-size: 2.6rem; transform: translateZ(24px); }
    .note { margin-top: 6px; color: var(--gold); font-size: 1.15rem; }
    .price { display: flex; align-items: baseline; gap: 6px; margin-top: 30px; overflow: hidden; transform: translateZ(36px); }
    .price small { font-size: 1.2rem; align-self: flex-start; margin-top: 10px; color: var(--muted); }
    .amount { display: inline-block; font-family: var(--font-display); font-size: clamp(3.6rem, 5vw, 4.8rem); line-height: 1; animation: roll 700ms var(--ease-out); }
    @keyframes roll { from { transform: translateY(70%); opacity: 0; filter: blur(4px); } }
    .per { font-size: 0.7rem; letter-spacing: 0.14em; color: var(--muted); }
    .save { margin-top: 8px; font-size: 0.8rem; color: var(--muted); }
    .classes { margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--line); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink); }
    ul { list-style: none; margin: 16px 0 32px; padding: 0; display: grid; align-content: start; gap: 11px; flex: 1; }
    li { display: flex; gap: 12px; align-items: flex-start; color: var(--ink-2); font-weight: 300; font-size: 0.95rem; }
    li app-icon { color: var(--gold); margin-top: 4px; flex: none; }
    .card .btn { width: 100%; transform: translateZ(28px); }
    /* Herencia: bloque que deja claro que el plan trae todo el anterior. */
    .inherit { position: relative; display: flex; align-items: center; gap: 14px; margin-top: 18px; padding: 14px 16px; background: linear-gradient(90deg, rgb(216 185 138 / 14%), rgb(216 185 138 / 4%)); box-shadow: inset 0 0 0 1px rgb(216 185 138 / 30%); transform: translateZ(20px); cursor: default; transition: box-shadow 400ms ease, background-color 400ms ease; }
    @media (hover: hover) and (pointer: fine) { .inherit:hover { box-shadow: inset 0 0 0 1px var(--gold); } }
    .layers { position: relative; width: 26px; height: 22px; flex: none; }
    .layers i { position: absolute; left: 0; right: 0; height: 9px; border: 1px solid var(--gold); background: var(--bg-2); transition: transform 500ms var(--ease-out); }
    .layers i:nth-child(1) { top: 0; opacity: 0.45; }
    .layers i:nth-child(2) { top: 6px; opacity: 0.7; }
    .layers i:nth-child(3) { top: 12px; background: var(--gold); }
    @media (hover: hover) and (pointer: fine) { .inherit:hover .layers i:nth-child(1) { transform: translateY(-3px); } }
    @media (hover: hover) and (pointer: fine) { .inherit:hover .layers i:nth-child(3) { transform: translateY(2px); } }
    .inherit-text { display: flex; flex-direction: column; line-height: 1.2; }
    .inherit-text small { font-size: 0.56rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); }
    .inherit-text b { font-family: var(--font-display); font-weight: 400; font-size: 1.35rem; color: var(--ink); }
    .plus { display: flex; align-items: center; gap: 12px; margin-top: 16px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--muted); }
    .plus::before, .plus::after { content: ''; flex: 1; height: 1px; background: var(--line); }
    .inherit + .plus + ul { margin-top: 14px; }
    /* El plan incluido se ilumina mientras el cursor está sobre "Todo lo de...". */
    .card.is-hinted { box-shadow: inset 0 0 0 1px var(--gold), 0 0 90px -20px rgb(243 213 161 / 40%); }
    .card.is-hinted .edge { opacity: 1; --mx: 50%; --my: 50%; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; max-width: 520px; margin-inline: auto; } }
  `,
})
export class PlanCards {
  readonly annual = input(false);
  protected readonly plans = PLANS;
  protected readonly hint = signal<string | null>(null);

  protected nameOf(id: string) {
    return PLANS.find((p) => p.id === id)?.name ?? '';
  }

  protected price(monthly: number) {
    return this.annual() ? Math.round((monthly * 0.85) / 10) * 10 : monthly;
  }

  protected money(n: number) {
    return '$' + Math.round(n).toLocaleString('es-MX');
  }

  protected tilt(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  }

  protected reset(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
}
