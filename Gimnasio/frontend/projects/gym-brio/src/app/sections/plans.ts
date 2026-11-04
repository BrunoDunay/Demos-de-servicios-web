import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Booking } from '../core/booking';
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
          <span class="eyebrow" data-reveal>Planes</span>
          <h2 class="section-title" data-reveal [revealDelay]="80">Precios claros. <span class="soft">Sin inscripción.</span></h2>
          <p class="section-lead" data-reveal [revealDelay]="160">Paga solo lo que usas. Si te cambias de casa o de horario, cancelas sin penalización.</p>
        </div>
        <div class="grid">
          @for (p of plans; track p.name; let i = $index) {
            <div class="cell" [class.cell-featured]="p.featured" data-reveal [revealDelay]="i * 110">
            <article class="card" [class.is-featured]="p.featured">
              @if (p.featured) {
                <span class="badge"><app-icon name="sparkle" [size]="14" /> El favorito</span>
              }
              <h3>{{ p.name }}</h3>
              <p class="note">{{ p.note }}</p>
              <div class="price">
                <span class="cur">$</span><span class="amount">{{ p.price.toLocaleString('es-MX') }}</span>
                <span class="per">{{ p.period }}</span>
              </div>
              <ul>
                @for (f of p.features; track f) {
                  <li><span class="tick"><app-icon name="check" [size]="14" [stroke]="3" /></span>{{ f }}</li>
                }
              </ul>
              <button type="button" class="btn" [class.btn-lime]="p.featured" [class.btn-ghost]="!p.featured" (click)="choose(p.name)">
                Quiero el plan {{ p.name.toLowerCase() }}
                <span class="btn-icon"><app-icon name="arrow-right" [size]="16" /></span>
              </button>
            </article>
            </div>
          }
        </div>
        <p class="foot" data-reveal>Estudiantes y mayores de 60 años: <b>15% de descuento</b> presentando credencial.</p>
      </div>
    </section>
  `,
  styles: `
    .head { text-align: center; display: flex; flex-direction: column; align-items: center; }
    .soft { color: var(--brand); }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 56px; align-items: center; }
    .card {
      position: relative; display: flex; flex-direction: column; padding: 32px 28px; border-radius: var(--radius-lg); background: var(--surface); box-shadow: inset 0 0 0 1px var(--line);
      transition: transform 450ms var(--ease-out), box-shadow 450ms var(--ease-out);
    }
    .card.is-featured {
      color: #fff; padding-block: 44px; box-shadow: var(--shadow-lg); border: 2px solid transparent;
      background: linear-gradient(var(--ink), var(--ink)) padding-box, conic-gradient(from var(--angle), var(--brand), var(--lime), var(--brand)) border-box;
      animation: rotate 6s linear infinite;
    }
    @property --angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
    @keyframes rotate { to { --angle: 360deg; } }
    .badge { position: absolute; top: -14px; left: 28px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: var(--lime); color: var(--ink); font-size: 0.8rem; font-weight: 750; }
    h3 { font-size: 1.6rem; }
    .note { margin-top: 6px; color: var(--muted); font-size: 0.92rem; }
    .is-featured .note { color: rgb(255 255 255 / 65%); }
    .price { display: flex; align-items: baseline; gap: 2px; margin-top: 24px; }
    .cur { font-size: 1.4rem; font-weight: 700; align-self: flex-start; margin-top: 8px; }
    .amount { font-family: var(--font-display); font-size: 4rem; font-weight: 800; letter-spacing: -0.05em; line-height: 1; }
    .is-featured .amount { color: var(--lime); }
    .per { margin-left: 8px; color: var(--muted); font-size: 0.92rem; }
    .is-featured .per { color: rgb(255 255 255 / 65%); }
    ul { list-style: none; margin: 26px 0 30px; padding: 22px 0 0; display: grid; gap: 12px; border-top: 1px dashed var(--line); flex: 1; }
    .is-featured ul { border-color: rgb(255 255 255 / 18%); }
    li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.97rem; }
    .tick { flex: none; display: grid; place-items: center; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%; background: var(--brand-soft); color: var(--brand); }
    .is-featured .tick { background: rgb(217 255 74 / 18%); color: var(--lime); }
    .card .btn { width: 100%; }
    .is-featured .btn-ghost { --btn-fg: #fff; }
    .foot { margin-top: 32px; text-align: center; color: var(--muted); }
    .foot b { color: var(--ink); }
    @media (hover: hover) {
      .card:hover { transform: translateY(-8px); box-shadow: inset 0 0 0 1px var(--line), var(--shadow); }
      .card.is-featured:hover { box-shadow: var(--shadow-lg); }
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; }
      .cell-featured { order: -1; }
    }
  `,
})
export class Plans {
  private readonly booking = inject(Booking);
  protected readonly plans = PLANS;

  protected choose(name: string) {
    this.booking.choose(`Plan ${name}`);
  }
}
