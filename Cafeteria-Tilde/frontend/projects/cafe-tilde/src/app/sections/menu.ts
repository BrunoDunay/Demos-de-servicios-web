import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MENU } from '../core/content';
import { Order } from '../core/order';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** El menú escrito en gis sobre el pizarrón del café. Todo a la vista, sin pestañas. */
@Component({
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section board-wrap" id="menu">
      <div class="container">
        <div class="board" data-reveal>
          <header class="board-head">
            <h2>El pizarrón</h2>
            <p>Lo de todos los días. Toca <span class="plus-inline">+</span> y se va a tu bolsa.</p>
          </header>
          <div class="cols">
            @for (c of menu; track c.id; let ci = $index) {
              <div class="col">
                <h3>{{ c.label }}</h3>
                <ul>
                  @for (it of c.items; track it.name) {
                    <li>
                      <div class="row">
                        <span class="name">{{ it.name }}</span>
                        <span class="dots" aria-hidden="true"></span>
                        <span class="price">{{ it.price }}</span>
                        <button type="button" class="add" [class.has]="order.qty(it.name) > 0" (click)="order.add(it.name, it.price)" [attr.aria-label]="'Agregar ' + it.name">
                          @if (order.qty(it.name); as q) { <b>{{ q }}</b> } @else { <app-icon name="plus" [size]="14" [stroke]="2.4" /> }
                        </button>
                      </div>
                      @if (it.desc || it.tag) {
                        <p class="desc">
                          {{ it.desc }}
                          @if (it.tag) { <span class="star">{{ it.tag }}</span> }
                        </p>
                      }
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
          <p class="foot">Leche de avena o almendra sin costo. ¿Sin gluten? Pregunta en la barra, casi siempre hay algo.</p>
          <svg class="doodle cup-doodle" viewBox="0 0 80 70" aria-hidden="true"><path d="M12 30h44v12a18 18 0 0 1-18 18h-8a18 18 0 0 1-18-18z" /><path d="M56 34h6a7 7 0 0 1 0 14h-7" /><path d="M26 8c-4 6 4 9 0 16M40 8c-4 6 4 9 0 16" /></svg>
          <svg class="doodle arrow-doodle" viewBox="0 0 120 60" aria-hidden="true"><path d="M6 40c30-30 70-34 104-10" /><path d="M96 18l14 12-16 6" /></svg>
        </div>
      </div>
    </section>
  `,
  styles: `
    .board {
      position: relative; padding: clamp(28px, 5vw, 64px); border-radius: 18px; color: var(--crema);
      background:
        radial-gradient(ellipse at 20% 10%, oklch(38% 0.035 160 / 70%), transparent 60%),
        radial-gradient(ellipse at 90% 90%, oklch(24% 0.03 160 / 80%), transparent 60%),
        var(--pizarron);
      box-shadow: 0 0 0 14px oklch(42% 0.06 55), 0 0 0 16px var(--cafe), 0 30px 50px -30px var(--cafe);
    }
    /* Polvo de gis */
    .board::before {
      content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0.18; mix-blend-mode: screen;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .board-head { position: relative; display: flex; justify-content: space-between; align-items: end; gap: 20px; flex-wrap: wrap; padding-bottom: 26px; margin-bottom: 30px; border-bottom: 2px dashed color-mix(in oklch, var(--crema) 30%, transparent); }
    h2 { font-size: clamp(2.8rem, 6vw, 5rem); color: var(--leche); text-shadow: 0 0 1px var(--crema); }
    .board-head p { max-width: 30ch; font-size: 1.05rem; opacity: 0.9; }
    .plus-inline { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid currentColor; font-weight: 800; line-height: 1; }
    .cols { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 34px 40px; }
    h3 { font-size: 1.7rem; color: var(--mantequilla); margin-bottom: 14px; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
    .row { display: flex; align-items: center; gap: 8px; }
    .name { font-weight: 700; font-size: 1.02rem; }
    .dots { flex: 1; min-width: 12px; height: 1px; border-bottom: 2px dotted color-mix(in oklch, var(--crema) 35%, transparent); translate: 0 4px; }
    .price { font-family: var(--font-display); font-size: 1.15rem; }
    .add { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; color: var(--crema); box-shadow: inset 0 0 0 1.5px color-mix(in oklch, var(--crema) 60%, transparent); font-size: 0.85rem; transition: background-color 200ms ease, color 200ms ease, transform 160ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .add:hover { background: var(--crema); color: var(--pizarron); } }
    .add:active { transform: scale(0.88); }
    .add.has { background: var(--mantequilla); color: var(--cafe); box-shadow: none; }
    .desc { margin-top: 2px; font-size: 0.88rem; font-style: italic; opacity: 0.72; }
    .star { display: inline-block; margin-left: 6px; padding: 1px 8px; border-radius: 999px; background: var(--jitomate); color: var(--leche); font-style: normal; font-weight: 800; font-size: 0.72rem; opacity: 1; }
    .foot { position: relative; margin-top: 36px; font-style: italic; opacity: 0.8; }
    .doodle { position: absolute; fill: none; stroke: var(--crema); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; opacity: 0.55; }
    .cup-doodle { right: 40px; bottom: 26px; width: 74px; }
    .arrow-doodle { right: 130px; bottom: 40px; width: 90px; }
    @media (max-width: 1080px) { .cols { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 620px) { .cols { grid-template-columns: 1fr; } .doodle { display: none; } }
  `,
})
export class Menu {
  protected readonly menu = MENU;
  protected readonly order = inject(Order);
}
