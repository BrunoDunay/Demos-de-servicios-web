import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { Deal, Kind, Property } from '../core/content';
import { Search, price } from '../core/search';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { SwipeDismiss } from '../shared/swipe-dismiss';

@Component({
  selector: 'app-listings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, SwipeDismiss],
  template: `
    <section class="section listings" id="propiedades">
      <div class="container">
        <div class="head">
          <div>
            <span class="eyebrow" data-reveal>Propiedades</span>
            <h2 class="section-title" data-reveal [revealDelay]="80">Casas que <em>ya visitamos</em> por ti.</h2>
          </div>
          <p class="section-lead" data-reveal [revealDelay]="140">Cada propiedad la recorrimos, la fotografiamos y revisamos sus papeles antes de publicarla.</p>
        </div>

        <div class="filters" data-reveal [revealDelay]="180">
          <div class="group" role="group" aria-label="Operación">
            @for (d of deals; track d.value) {
              <button type="button" class="f" [class.on]="search.deal() === d.value" [attr.aria-pressed]="search.deal() === d.value" (click)="search.deal.set(d.value); search.budget.set(0)">{{ d.label }}</button>
            }
          </div>
          <div class="group" role="group" aria-label="Tipo de propiedad">
            @for (k of kinds; track k.value) {
              <button type="button" class="f" [class.on]="search.kind() === k.value" [attr.aria-pressed]="search.kind() === k.value" (click)="search.kind.set(k.value)">{{ k.label }}</button>
            }
          </div>
          <p class="count" aria-live="polite">
            <b>{{ search.results().length }}</b> {{ search.results().length === 1 ? 'propiedad' : 'propiedades' }}
            @if (search.zone() !== 'todas') { <span class="z">en zona {{ search.zone() }} <button type="button" (click)="search.zone.set('todas')" aria-label="Quitar filtro de zona"><app-icon name="close" [size]="14" /></button></span> }
          </p>
        </div>

        @if (search.results().length) {
          <div class="grid">
            @for (p of search.results(); track p.id; let i = $index) {
              <article class="card" [style.--i]="i">
                <button type="button" class="media" (click)="search.open.set(p)" [attr.aria-label]="'Ver fotos y detalles de ' + p.title">
                  <img class="a" [src]="'media/' + p.imgs[0] + '-sm.webp'" [alt]="p.title" width="720" height="480" loading="lazy" />
                  <img class="b" [src]="'media/' + p.imgs[1] + '-sm.webp'" alt="" width="720" height="480" loading="lazy" />
                  <span class="deal-tag" [class.rent]="p.deal === 'renta'">{{ p.deal === 'venta' ? 'En venta' : 'En renta' }}</span>
                  @if (p.tag) { <span class="tag">{{ p.tag }}</span> }
                  <span class="photos"><app-icon name="area" [size]="14" /> {{ p.imgs.length }} fotos</span>
                </button>
                <button type="button" class="fav" [class.on]="search.favorites().includes(p.id)" (click)="search.toggleFavorite(p.id)"
                  [attr.aria-pressed]="search.favorites().includes(p.id)" [attr.aria-label]="'Guardar ' + p.title + ' en favoritos'">
                  <app-icon name="heart-o" [size]="18" [filled]="search.favorites().includes(p.id)" />
                </button>
                <div class="body">
                  <p class="price">{{ price(p) }}</p>
                  <h3>{{ p.title }}</h3>
                  <p class="where"><app-icon name="pin" [size]="15" /> {{ p.area }} · Zona {{ p.zone }}</p>
                  <ul class="specs">
                    <li><app-icon name="bed" [size]="17" /> {{ p.beds }} rec.</li>
                    <li><app-icon name="bath" [size]="17" /> {{ p.baths }} baños</li>
                    <li><app-icon name="area" [size]="17" /> {{ p.m2 }} m²</li>
                    <li><app-icon name="car" [size]="17" /> {{ p.parking }}</li>
                  </ul>
                  <button type="button" class="more" (click)="search.open.set(p)">Ver detalles <app-icon name="arrow-right" [size]="16" /></button>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="empty">
            <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M6 26 32 6l26 20" /><path d="M14 22v20h36V22" /><path d="M28 42V32h8v10" /></svg>
            <h3>No encontramos propiedades con esos filtros</h3>
            <p>Prueba con otra zona o presupuesto. También podemos buscar por ti fuera de nuestro catálogo.</p>
            <div class="empty-actions">
              <button type="button" class="btn btn-ghost" (click)="search.reset()">Quitar filtros</button>
              <button type="button" class="btn" (click)="search.ask('Quiero comprar')">Que me busquen una <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></button>
            </div>
          </div>
        }
      </div>

      @if (search.open(); as p) {
        <div class="overlay" [class.closing]="closing()" (click)="close()" role="presentation"></div>
        <div class="modal" [class.closing]="closing()" swipeDismiss="y" swipeHandle=".grabber" swipeMedia="(max-width: 820px)" (dismiss)="close(true)" role="dialog" aria-modal="true" [attr.aria-label]="p.title" #modal tabindex="-1">
          <span class="grabber" aria-hidden="true"></span>
          <button type="button" class="x" (click)="close()" aria-label="Cerrar"><app-icon name="close" [size]="20" /></button>
          <div class="gallery">
            <div class="main" (pointerdown)="swipeStart($event)" (pointerup)="swipeEnd($event, p)">
              @for (img of p.imgs; track img; let i = $index) {
                <img [src]="'media/' + img + '.webp'" [alt]="p.title + ', foto ' + (i + 1)" width="1200" height="800" [class.on]="shot() === i" [attr.loading]="i === 0 ? 'eager' : 'lazy'" />
              }
              <button type="button" class="nav-btn prev" (click)="step(-1, p)" aria-label="Foto anterior"><app-icon name="chevron-l" [size]="20" /></button>
              <button type="button" class="nav-btn next" (click)="step(1, p)" aria-label="Foto siguiente"><app-icon name="chevron" [size]="20" /></button>
              <span class="counter">{{ shot() + 1 }} / {{ p.imgs.length }}</span>
            </div>
            <div class="thumbs">
              @for (img of p.imgs; track img; let i = $index) {
                <button type="button" [class.on]="shot() === i" (click)="shot.set(i)" [attr.aria-label]="'Ver foto ' + (i + 1)">
                  <img [src]="'media/' + img + '-sm.webp'" alt="" width="160" height="107" />
                </button>
              }
            </div>
          </div>
          <div class="detail">
            <span class="ref">{{ p.id }} · {{ p.deal === 'venta' ? 'En venta' : 'En renta' }}</span>
            <h3>{{ p.title }}</h3>
            <p class="where"><app-icon name="pin" [size]="16" /> {{ p.area }} · Zona {{ p.zone }}</p>
            <p class="price big">{{ price(p) }}</p>
            <ul class="specs boxed">
              <li><app-icon name="bed" [size]="20" /><b>{{ p.beds }}</b> recámaras</li>
              <li><app-icon name="bath" [size]="20" /><b>{{ p.baths }}</b> baños</li>
              <li><app-icon name="area" [size]="20" /><b>{{ p.m2 }} m²</b> construidos</li>
              <li><app-icon name="car" [size]="20" /><b>{{ p.parking }}</b> autos</li>
            </ul>
            <p class="text">{{ p.text }}</p>
            <ul class="feats">
              @for (f of p.features; track f) {
                <li><app-icon name="check" [size]="16" /> {{ f }}</li>
              }
            </ul>
            <div class="modal-actions">
              <button type="button" class="btn btn-brass" (click)="search.schedule(p)">Agendar visita <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></button>
              <button type="button" class="btn btn-ghost" (click)="search.toggleFavorite(p.id)">
                <app-icon name="heart-o" [size]="18" [filled]="search.favorites().includes(p.id)" /> {{ search.favorites().includes(p.id) ? 'Guardada' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; margin-bottom: 32px; }
    .filters { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding-bottom: 22px; margin-bottom: 28px; border-bottom: 1px solid var(--line); }
    .group { display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: var(--paper); box-shadow: var(--shadow-sm); }
    .f { white-space: nowrap; min-height: 40px; padding: 0 16px; border-radius: 9px; font-weight: 600; font-size: 0.9rem; color: var(--muted); transition: background-color 250ms ease, color 250ms ease, transform 140ms var(--ease-out); }
    .f.on { background: var(--pine); color: #fff; }
    @media (hover: hover) and (pointer: fine) { .f:not(.on):hover { color: var(--pine); background: var(--pine-soft); } }
    .f:active { transform: scale(0.97); }
    .count { margin-left: auto; display: flex; align-items: center; gap: 8px; color: var(--muted); }
    .count b { color: var(--ink); font-size: 1.1rem; }
    .z { display: inline-flex; align-items: center; gap: 4px; padding: 4px 6px 4px 10px; border-radius: 999px; background: var(--pine-soft); color: var(--pine); font-weight: 600; font-size: 0.85rem; }
    .z button { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; }
    @media (hover: hover) and (pointer: fine) { .z button:hover { background: rgb(30 58 47 / 12%); } }
    .z button:active { transform: scale(0.88); }

    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
    .card { position: relative; display: flex; flex-direction: column; border-radius: var(--radius); background: var(--paper); box-shadow: var(--shadow-sm); overflow: hidden; animation: card-in 600ms var(--ease-out) both; animation-delay: calc(var(--i) * 60ms); transition: transform 450ms var(--ease-out), box-shadow 450ms var(--ease-out); }
    @keyframes card-in { from { opacity: 0; transform: translateY(18px); } }
    @media (hover: hover) { .card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); } }
    .media { position: relative; display: block; aspect-ratio: 3 / 2; overflow: hidden; background: var(--bg-2); cursor: zoom-in; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .media:active { scale: 0.985; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 600ms ease, transform 1000ms var(--ease-out); }
    .media .b { opacity: 0; transform: scale(1.06); }
    @media (hover: hover) {
      .card:hover .media .a { opacity: 0; transform: scale(1.04); }
      .card:hover .media .b { opacity: 1; transform: none; }
    }
    .deal-tag, .tag, .photos { position: absolute; padding: 5px 10px; border-radius: 8px; font-size: 0.74rem; font-weight: 700; }
    .deal-tag { left: 12px; top: 12px; background: var(--pine); color: #fff; letter-spacing: 0.04em; text-transform: uppercase; }
    .deal-tag.rent { background: var(--brass); color: var(--ink); }
    .tag { left: 12px; bottom: 12px; background: rgb(255 255 255 / 92%); color: var(--ink); }
    .photos { right: 12px; bottom: 12px; display: flex; align-items: center; gap: 5px; background: rgb(21 25 26 / 60%); color: #fff; backdrop-filter: blur(6px); }
    .fav { position: absolute; right: 12px; top: 12px; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: rgb(255 255 255 / 92%); color: var(--ink); transition: transform 350ms var(--ease-back), color 250ms ease; }
    @media (hover: hover) and (pointer: fine) { .fav:hover { transform: scale(1.1); } }
    .fav:active { transform: scale(0.92); transition-duration: 120ms; }
    .fav.on { color: #d0473a; animation: like 500ms var(--ease-back); }
    @keyframes like { 40% { transform: scale(1.3); } }
    .body { display: flex; flex-direction: column; flex: 1; padding: 18px 20px 20px; }
    .price { font-family: var(--font-display); font-size: 1.7rem; line-height: 1.1; color: var(--pine); }
    .body h3 { margin-top: 6px; font-family: var(--font-body); font-weight: 700; font-size: 1.05rem; letter-spacing: 0; line-height: 1.3; }
    .where { display: flex; align-items: center; gap: 6px; margin-top: 6px; color: var(--muted); font-size: 0.88rem; }
    .specs { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 14px 0 0; padding: 14px 0 0; border-top: 1px solid var(--line); font-size: 0.88rem; font-weight: 600; color: var(--ink-2); }
    .specs li { display: flex; align-items: center; gap: 6px; }
    .specs app-icon { color: var(--pine-2); }
    .more { display: inline-flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 16px; width: fit-content; font-weight: 700; font-size: 0.9rem; color: var(--pine); }
    .more app-icon { transition: transform 350ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .more:hover app-icon { transform: translateX(4px); } }
    .more:active { opacity: 0.7; }

    .empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 56px 20px; border-radius: var(--radius); border: 1.5px dashed var(--line); }
    .empty svg { width: 70px; fill: none; stroke: var(--brass); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .empty h3 { font-size: 1.8rem; }
    .empty p { color: var(--muted); max-width: 440px; }
    .empty-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 10px; }

    .overlay { position: fixed; inset: 0; z-index: 80; background: rgb(13 20 17 / 62%); backdrop-filter: blur(4px); animation: fade 300ms ease; }
    @keyframes fade { from { opacity: 0; } }
    .modal {
      position: fixed; z-index: 81; left: 50%; top: 50%; width: min(1080px, calc(100% - 32px)); max-height: calc(100svh - 48px); overflow: auto;
      display: grid; grid-template-columns: 1.25fr 1fr; border-radius: var(--radius-lg); background: var(--paper); box-shadow: 0 40px 100px -30px rgb(0 0 0 / 50%);
      transform: translate(-50%, -50%); animation: modal-in 500ms var(--ease-out); outline: none;
    }
    @keyframes modal-in { from { opacity: 0; transform: translate(-50%, -46%) scale(0.97); } }
    .modal.closing { animation: modal-out 200ms var(--ease-out) forwards; pointer-events: none; }
    @keyframes modal-out { to { opacity: 0; transform: translate(-50%, -48.5%) scale(0.98); } }
    .overlay.closing { animation: fade-out 220ms ease forwards; }
    @keyframes fade-out { to { opacity: 0; } }
    .grabber { display: none; }
    .main { touch-action: pan-y; }
    .main img { -webkit-user-drag: none; user-select: none; }
    .x { position: absolute; right: 14px; top: 14px; z-index: 3; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--paper); box-shadow: var(--shadow-sm); transition: transform 350ms var(--ease-back); }
    @media (hover: hover) and (pointer: fine) { .x:hover { transform: rotate(90deg); } }
    .x:active { transform: scale(0.92); transition-duration: 120ms; }
    .gallery { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
    .main { position: relative; aspect-ratio: 3 / 2.1; border-radius: 18px; overflow: hidden; background: var(--bg-2); }
    .main img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 500ms ease, transform 900ms var(--ease-out); }
    .main img.on { opacity: 1; transform: none; }
    .nav-btn { position: absolute; top: 50%; display: grid; place-items: center; width: 42px; height: 42px; margin-top: -21px; border-radius: 50%; background: rgb(255 255 255 / 90%); transition: transform 300ms var(--ease-back); }
    @media (hover: hover) and (pointer: fine) { .nav-btn:hover { transform: scale(1.1); } }
    .nav-btn:active { transform: scale(0.92); transition-duration: 120ms; }
    .prev { left: 12px; }
    .next { right: 12px; }
    .counter { position: absolute; left: 12px; bottom: 12px; padding: 4px 10px; border-radius: 8px; background: rgb(21 25 26 / 60%); color: #fff; font-size: 0.8rem; font-weight: 600; }
    .thumbs { display: flex; gap: 8px; }
    .thumbs button { flex: 1; aspect-ratio: 3 / 2; border-radius: 10px; overflow: hidden; opacity: 0.55; box-shadow: inset 0 0 0 0 var(--brass); transition: opacity 250ms ease, box-shadow 250ms ease; }
    .thumbs button.on { opacity: 1; }
    @media (hover: hover) and (pointer: fine) { .thumbs button:hover { opacity: 1; } }
    .thumbs button:active { transform: scale(0.96); }
    .thumbs button.on { box-shadow: 0 0 0 2.5px var(--brass); }
    .thumbs img { width: 100%; height: 100%; object-fit: cover; }
    .detail { padding: 34px 30px 30px 18px; display: flex; flex-direction: column; }
    .ref { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--brass); }
    .detail h3 { margin-top: 8px; font-size: 2rem; padding-right: 30px; }
    .big { margin-top: 14px; font-size: 2.1rem; }
    .boxed { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 0; padding-top: 0; }
    .boxed li { padding: 10px 12px; border-radius: 12px; background: var(--bg); font-weight: 500; }
    .boxed b { font-weight: 750; }
    .text { margin-top: 16px; color: var(--ink-2); }
    .feats { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 6px; font-size: 0.92rem; }
    .feats li { display: flex; align-items: center; gap: 8px; }
    .feats app-icon { color: var(--ok); }
    .modal-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }

    @media (max-width: 1000px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 820px) {
      .modal { grid-template-columns: 1fr; top: auto; bottom: 0; left: 0; width: 100%; max-height: 92svh; border-radius: 24px 24px 0 0; transform: none; animation: sheet-in 500ms var(--ease-out); }
      @keyframes sheet-in { from { transform: translateY(40%); opacity: 0; } }
      .modal.closing { animation: sheet-out 240ms var(--ease-out) forwards; }
      @keyframes sheet-out { to { transform: translateY(100%); } }
      /* Barra para arrastrar la hoja hacia abajo y cerrarla */
      .grabber { display: block; position: absolute; z-index: 2; top: 0; left: 72px; right: 72px; height: 26px; touch-action: none; cursor: grab; }
      .grabber::before { content: ''; position: absolute; left: 50%; top: 9px; width: 44px; height: 5px; margin-left: -22px; border-radius: 3px; background: rgb(21 25 26 / 20%); }
      .detail { padding: 6px 20px 28px; }
      .count { margin-left: 0; width: 100%; }
      .group { width: 100%; }
      .f { flex: 1; padding: 0 10px; }
    }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Listings {
  protected readonly search = inject(Search);
  protected readonly price = price;
  protected readonly shot = signal(0);
  private readonly modal = viewChild<ElementRef<HTMLElement>>('modal');
  protected readonly deals: { value: Deal | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'venta', label: 'En venta' },
    { value: 'renta', label: 'En renta' },
  ];
  protected readonly kinds: { value: Kind | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Cualquier tipo' },
    { value: 'casa', label: 'Casas' },
    { value: 'departamento', label: 'Departamentos' },
  ];
  private lastFocus: HTMLElement | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Al abrir la ficha: foto 1, se bloquea el scroll de fondo y el foco pasa a la ventana.
    effect(() => {
      const open = this.search.open();
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('no-scroll', !!open);
      if (open) {
        this.shot.set(0);
        this.lastFocus = document.activeElement as HTMLElement;
        requestAnimationFrame(() => this.modal()?.nativeElement.focus());
      } else {
        this.lastFocus?.focus?.();
      }
    });
    afterNextRender(() => {
      const onKey = (e: KeyboardEvent) => {
        const p = this.search.open();
        if (!p) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowRight') this.step(1, p);
        if (e.key === 'ArrowLeft') this.step(-1, p);
      };
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => window.removeEventListener('keydown', onKey));
    });
  }

  protected step(dir: number, p: Property) {
    this.shot.update((s) => (s + dir + p.imgs.length) % p.imgs.length);
  }

  protected readonly closing = signal(false);
  private sx = 0;
  private sy = 0;

  /** Cierra con una salida corta. "now" = ya salió arrastrándola (no se vuelve a animar). */
  protected close(now = false) {
    if (!this.search.open()) return;
    const reduce = document.documentElement.classList.contains('reduce-motion');
    if (now || reduce) {
      this.closing.set(false);
      this.search.open.set(null);
      return;
    }
    if (this.closing()) return;
    this.closing.set(true);
    setTimeout(() => {
      this.closing.set(false);
      this.search.open.set(null);
    }, 220);
  }

  /** Deslizar la foto principal a los lados cambia de foto (como en el celular). */
  protected swipeStart(e: PointerEvent) {
    this.sx = e.clientX;
    this.sy = e.clientY;
  }

  protected swipeEnd(e: PointerEvent, p: Property) {
    const dx = e.clientX - this.sx;
    const dy = e.clientY - this.sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) this.step(dx < 0 ? 1 : -1, p);
  }
}
