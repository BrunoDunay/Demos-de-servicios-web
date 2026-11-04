import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { INGREDIENTS, INVENTED, Ingredient, RECIPES, Recipe } from '../core/content';
import { Order, money } from '../core/order';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

interface Layer {
  id: string;
  from: number;
  to: number;
}

/**
 * "Arma tu taza": el visitante elige qué le pone al espresso, la taza se llena por capas
 * y le decimos cómo se llama esa bebida (o si es un invento de la casa).
 * Las capas se dibujan con clip-path para animar solo propiedades baratas.
 */
@Component({
  selector: 'app-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section builder" id="taza">
      <div class="container grid">
        <div class="cup-wrap" data-reveal="pop" aria-hidden="true">
          @if (!has('hielo')) {
            <svg class="steam" viewBox="0 0 120 70"><path d="M30 66c-10-12 10-18 0-32s8-20 0-32" /><path d="M60 66c-10-12 10-18 0-32s8-20 0-32" /><path d="M90 66c-10-12 10-18 0-32s8-20 0-32" /></svg>
          }
          <div class="cup">
            <div class="liquid">
              @for (l of layers; track l) {
                <span class="layer" [class]="'layer ' + l" [style.clip-path]="clip(l)"></span>
              }
              <span class="crema-line" [style.top.%]="100 - top()"></span>
              @for (c of [0, 1, 2]; track c) {
                <span class="ice" [class.on]="has('hielo')" [style.--c]="c" [style.top.%]="100 - top() + 4 + c * 7"></span>
              }
            </div>
            <svg class="glass" viewBox="0 0 220 240" preserveAspectRatio="none">
              <path class="rim" d="M12 8h176l-18 222H30z" />
              <path class="handle" d="M184 60c34 0 34 90 -6 92" />
              <path class="shine" d="M40 30l14 170" />
            </svg>
          </div>
          <div class="saucer"></div>
        </div>

        <div class="panel">
          <span class="tag" data-reveal>Arma tu taza</span>
          <h2 class="title" data-reveal [revealDelay]="60">Tú dices qué lleva. Nosotros le ponemos nombre.</h2>
          <p class="lead" data-reveal [revealDelay]="120">Todo empieza con un espresso doble. Agrégale lo que quieras y mira qué sale.</p>

          <div class="chips" role="group" aria-label="Ingredientes" data-reveal [revealDelay]="160">
            <span class="chip base">Espresso doble</span>
            @for (i of ingredients; track i.id) {
              <button type="button" class="chip" [class.on]="has(i.id)" [attr.aria-pressed]="has(i.id)" (click)="toggle(i.id)">
                <span class="mark" aria-hidden="true"><app-icon [name]="has(i.id) ? 'check' : 'plus'" [size]="15" [stroke]="2.6" /></span>{{ i.label }}
              </button>
            }
          </div>

          <div class="result" data-reveal [revealDelay]="200" aria-live="polite">
            @for (r of [recipe()]; track r.name) {
              <div class="name-wrap">
                <p class="eyebrow">{{ r === invented ? 'Eso no está en el menú…' : 'Eso es un' }}</p>
                <h3 class="name">{{ r.name }}</h3>
                <p class="note">{{ r.note }}</p>
              </div>
            }
            <div class="buy">
              <span class="price">{{ money(recipe().price) }}</span>
              <button type="button" class="btn" (click)="add()">A la bolsa <app-icon name="bag" [size]="17" /></button>
              <button type="button" class="reset" (click)="picked.set([])" [disabled]="!picked().length">Empezar de nuevo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .builder { background: var(--mantequilla); }
    .grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px, 6vw, 96px); align-items: center; }

    .cup-wrap { position: relative; max-width: 360px; width: 100%; margin-inline: auto; padding-top: 70px; }
    .steam { position: absolute; left: 22%; top: 0; width: 46%; }
    .steam path { fill: none; stroke: var(--cafe); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 90; opacity: 0; animation: wisp 3.2s ease-in-out infinite; }
    .steam path:nth-child(2) { animation-delay: 1s; }
    .steam path:nth-child(3) { animation-delay: 2s; }
    @keyframes wisp { 0% { stroke-dashoffset: 90; opacity: 0; translate: 0 8px; } 40% { opacity: 0.5; } 100% { stroke-dashoffset: -90; opacity: 0; translate: 0 -8px; } }

    .cup { position: relative; aspect-ratio: 220 / 240; }
    .liquid { position: absolute; left: 6.6%; right: 15.5%; top: 6%; bottom: 4.5%; clip-path: polygon(0 0, 100% 0, 91% 100%, 9% 100%); background: color-mix(in oklch, var(--leche) 70%, transparent); overflow: hidden; }
    .layer { position: absolute; inset: 0; transition: clip-path 600ms var(--ease-out); }
    .chocolate { background: oklch(29% 0.06 35); }
    .espresso { background: oklch(33% 0.06 50); }
    .agua { background: oklch(48% 0.09 58); }
    .leche { background: oklch(78% 0.06 70); }
    .espuma { background: oklch(96% 0.02 85); background-image: radial-gradient(circle at 30% 40%, oklch(99% 0.01 85) 0 6px, transparent 7px), radial-gradient(circle at 70% 60%, oklch(99% 0.01 85) 0 4px, transparent 5px); }
    .crema-line { position: absolute; left: 0; right: 0; top: 0; height: 4px; margin-top: -2px; background: color-mix(in oklch, var(--mantequilla-hondo) 60%, transparent); transition: top 600ms var(--ease-out); }
    .ice { position: absolute; left: calc(18% + var(--c) * 24%); width: 22%; aspect-ratio: 1; border-radius: 6px; background: oklch(98% 0.01 220 / 55%); box-shadow: inset 0 0 0 2px oklch(100% 0 0 / 60%); opacity: 0; scale: 0.9; rotate: calc(var(--c) * 14deg - 10deg); transition: opacity 300ms ease, scale 400ms var(--ease-out), top 600ms var(--ease-out); }
    .ice.on { opacity: 1; scale: 1; }
    .glass { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; fill: none; stroke: var(--cafe); stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
    .shine { stroke: var(--leche); stroke-width: 5; opacity: 0.55; }
    .saucer { height: 18px; margin: 6px -6% 0 -10%; border-radius: 50%; background: var(--cafe); }

    .tag { color: var(--cafe-2); }
    .title { margin-top: 14px; font-size: clamp(2.3rem, 4.8vw, 4rem); max-width: 14ch; }
    .lead { margin-top: 16px; max-width: 42ch; font-size: 1.1rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .chip { display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 16px 0 10px; border-radius: 999px; background: var(--leche); font-weight: 700; box-shadow: inset 0 0 0 2px var(--cafe); transition: background-color 200ms ease, color 200ms ease, transform 160ms var(--ease-out); }
    .chip:active { transform: scale(0.96); }
    .chip.on { background: var(--cafe); color: var(--crema); }
    .chip.base { padding-left: 16px; background: transparent; box-shadow: inset 0 0 0 2px color-mix(in oklch, var(--cafe) 35%, transparent); color: var(--cafe-2); }
    .mark { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--mantequilla); color: var(--cafe); }
    .chip.on .mark { background: var(--jitomate); color: var(--leche); }

    .result { margin-top: 30px; padding: 24px 26px; border-radius: 22px; background: var(--leche); box-shadow: 0 6px 0 var(--mantequilla-hondo); }
    .name-wrap { animation: swap 450ms var(--ease-out); }
    @keyframes swap { from { opacity: 0; filter: blur(4px); translate: 0 6px; } }
    .eyebrow { font-size: 0.85rem; font-weight: 800; color: var(--cafe-soft); }
    .name { margin-top: 4px; font-size: clamp(2.2rem, 4vw, 3.2rem); color: var(--jitomate-hondo); }
    .note { margin-top: 6px; color: var(--cafe-2); }
    .buy { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 20px; padding-top: 18px; border-top: 2px dashed var(--line); }
    .price { font-family: var(--font-display); font-size: 2rem; margin-right: auto; }
    .reset { font-weight: 700; font-size: 0.9rem; text-decoration: underline; text-underline-offset: 4px; color: var(--cafe-soft); transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .reset:active { scale: 0.96; }
    .reset:disabled { opacity: 0.4; cursor: default; }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .cup-wrap { max-width: 210px; padding-top: 50px; }
    }
  `,
})
export class Builder {
  private readonly order = inject(Order);
  protected readonly money = money;
  protected readonly ingredients = INGREDIENTS;
  protected readonly invented = INVENTED;
  protected readonly layers = ['chocolate', 'espresso', 'agua', 'leche', 'espuma'];
  protected readonly picked = signal<Ingredient[]>(['leche']);

  protected readonly recipe = computed<Recipe>(() => {
    const key = [...this.picked()].sort().join('+');
    return RECIPES[key] ?? INVENTED;
  });

  /** Altura (en % de la taza) de cada capa según lo elegido, apiladas de abajo hacia arriba. */
  private readonly stack = computed<Layer[]>(() => {
    const p = this.picked();
    const both = p.includes('agua') && p.includes('leche');
    const sizes: Record<string, number> = {
      chocolate: p.includes('chocolate') ? 12 : 0,
      espresso: 20,
      agua: p.includes('agua') ? (both ? 24 : 44) : 0,
      leche: p.includes('leche') ? (both ? 24 : p.includes('espuma') ? 32 : 46) : 0,
      espuma: p.includes('espuma') ? 16 : 0,
    };
    let base = 0;
    return this.layers.map((id) => {
      const from = base;
      base += sizes[id];
      return { id, from, to: base };
    });
  });
  protected readonly top = computed(() => this.stack().at(-1)!.to);

  protected has(i: Ingredient) {
    return this.picked().includes(i);
  }

  protected toggle(i: Ingredient) {
    this.picked.update((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  protected clip(id: string) {
    const l = this.stack().find((x) => x.id === id)!;
    // inset(arriba 0 abajo 0): la capa ocupa de "from" a "to" medido desde abajo.
    return `inset(${100 - l.to}% 0 ${l.from}% 0)`;
  }

  protected add() {
    const r = this.recipe();
    this.order.add(r.name, r.price);
  }
}
