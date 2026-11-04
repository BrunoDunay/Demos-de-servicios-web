import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Order, money, whatsappLink } from '../core/order';
import { Icon } from '../shared/icon';
import { SwipeDismiss } from '../shared/swipe-dismiss';

/**
 * La bolsa: panel lateral con el pedido para llevar. Primero se arma (cantidades, nombre,
 * hora); al enviar se ve como una bolsa de papel con tu nombre y el botón para abrir WhatsApp.
 * También incluye el botón flotante que aparece cuando ya hay algo en la bolsa.
 */
@Component({
  selector: 'app-bag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SwipeDismiss],
  template: `
    @if (order.count() > 0 && !order.open()) {
      <button type="button" class="fab" [class.bump]="bumping()" (click)="order.open.set(true)">
        <app-icon name="bag" [size]="20" />
        <span>Tu bolsa · {{ money(order.total()) }}</span>
        <b>{{ order.count() }}</b>
      </button>
    }
    <p class="toast" [class.on]="toast()" aria-live="polite">{{ toast() ? 'Agregado: ' + order.last() : '' }}</p>

    <div class="scrim" [class.on]="order.open()" (click)="close()" aria-hidden="true"></div>
    <aside class="panel" swipeDismiss="x" (dismiss)="close()" [class.on]="order.open()" role="dialog" aria-modal="true" aria-labelledby="bag-title" tabindex="-1" #panel [attr.aria-hidden]="!order.open()" [attr.inert]="order.open() ? null : ''">
      <header>
        <h2 id="bag-title">{{ sent() ? 'Listo para mandar' : 'Tu bolsa' }}</h2>
        <button type="button" class="x" (click)="close()" aria-label="Cerrar la bolsa"><app-icon name="close" [size]="20" /></button>
      </header>

      @if (!sent()) {
        @if (order.lines().length) {
          <ul class="lines">
            @for (l of order.lines(); track l.name) {
              <li>
                <span class="ln">{{ l.name }}</span>
                <div class="qty" role="group" [attr.aria-label]="'Cantidad de ' + l.name">
                  <button type="button" (click)="order.change(l.name, -1)" [attr.aria-label]="'Quitar un ' + l.name"><app-icon name="minus" [size]="14" /></button>
                  <b>{{ l.qty }}</b>
                  <button type="button" (click)="order.add(l.name, l.price)" [attr.aria-label]="'Agregar otro ' + l.name"><app-icon name="plus" [size]="14" /></button>
                </div>
                <span class="lp">{{ money(l.qty * l.price) }}</span>
              </li>
            }
          </ul>
          <p class="total"><span>Total</span><b>{{ money(order.total()) }}</b></p>

          <form (submit)="submit($event)" novalidate>
            <label class="field">
              <span>¿A nombre de quién?</span>
              <input name="nombre" autocomplete="given-name" placeholder="Lo escribimos en el vaso" [value]="name()" (input)="name.set(val($event))" [attr.aria-invalid]="tried() && !nameOk()" />
              @if (tried() && !nameOk()) { <em>Escribe tu nombre para el vaso.</em> }
            </label>
            <fieldset class="field">
              <legend>¿Cuándo pasas?</legend>
              <div class="times">
                @for (t of times; track t) {
                  <button type="button" [class.on]="time() === t" [attr.aria-pressed]="time() === t" (click)="time.set(t)">{{ t }}</button>
                }
              </div>
            </fieldset>
            <label class="field">
              <span>Algo más <small>(opcional)</small></span>
              <input name="notas" placeholder="Leche de avena, extra caliente…" [value]="notes()" (input)="notes.set(val($event))" />
            </label>
            <button class="btn btn-jitomate send" type="submit">Mandar pedido <app-icon name="arrow-right" [size]="18" /></button>
            <p class="pay">Pagas al recoger, en efectivo o con tarjeta.</p>
          </form>
        } @else {
          <div class="empty">
            <svg viewBox="0 0 120 130" aria-hidden="true"><path d="M20 38h80l-6 86H26z" /><path d="M42 38V28a18 18 0 0 1 36 0v10" /><path class="fold" d="M20 38l8 10h64l8-10" /></svg>
            <p>Tu bolsa está vacía.</p>
            <p class="hint">Arma una taza o elige algo del pizarrón.</p>
            <a class="btn btn-mantequilla" href="#taza" (click)="close()">Arma tu taza</a>
          </div>
        }
      } @else {
        <div class="paper">
          <svg class="bag-art" viewBox="0 0 260 300" aria-hidden="true">
            <path class="kraft" d="M30 70h200l-12 222H42z" />
            <path class="kraft-top" d="M30 70l16-26h168l16 26" />
            <path class="seam" d="M30 70h200" />
          </svg>
          <div class="note">
            <p class="for">Para: {{ name().trim() }}</p>
            <ul>
              @for (l of order.lines(); track l.name) {
                <li>{{ l.qty }} × {{ l.name }}</li>
              }
            </ul>
            <p class="when">Pasa {{ time().toLowerCase() }} · {{ money(order.total()) }}</p>
          </div>
        </div>
        <p class="ready">Tu mensaje ya está escrito. Ábrelo en WhatsApp y mándalo; te confirmamos en unos minutos.</p>
        <a class="btn btn-jitomate send" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp <app-icon name="arrow-up-right" [size]="18" /></a>
        <button type="button" class="back" (click)="sent.set(false)">Cambiar algo</button>
      }
    </aside>
  `,
  styles: `
    .fab {
      position: fixed; right: 18px; bottom: 18px; z-index: 45; display: inline-flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 10px 0 18px;
      border-radius: 16px; background: var(--cafe); color: var(--crema); font-weight: 800; box-shadow: 0 5px 0 oklch(18% 0.04 45), 0 18px 30px -12px color-mix(in oklch, var(--cafe) 60%, transparent);
      animation: fab-in 300ms var(--ease-out); transition: transform 160ms var(--ease-out);
    }
    .fab:active { transform: translateY(3px); }
    .fab b { display: grid; place-items: center; min-width: 32px; height: 32px; padding: 0 6px; border-radius: 10px; background: var(--mantequilla); color: var(--cafe); }
    .fab.bump { animation: bump 420ms var(--ease-out); }
    @keyframes fab-in { from { opacity: 0; translate: 0 16px; } }
    @keyframes bump { 35% { transform: translateY(-6px) rotate(-3deg); } }
    .toast { position: fixed; right: 18px; bottom: 86px; z-index: 45; margin: 0; padding: 8px 14px; border-radius: 10px; background: var(--leche); color: var(--cafe); font-weight: 700; font-size: 0.9rem; box-shadow: 0 10px 24px -12px var(--cafe); opacity: 0; translate: 0 6px; pointer-events: none; transition: opacity 200ms ease, translate 200ms var(--ease-out); }
    .toast.on { opacity: 1; translate: none; }

    .scrim { position: fixed; inset: 0; z-index: 60; background: color-mix(in oklch, var(--cafe) 45%, transparent); opacity: 0; pointer-events: none; transition: opacity 220ms ease; }
    .scrim.on { opacity: 1; pointer-events: auto; transition-duration: 320ms; }
    .panel {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 61; width: min(440px, 100%); padding: 22px 24px 28px; overflow-y: auto; background: var(--crema);
      transform: translateX(100%); transition: transform 280ms var(--ease-drawer); outline: none; display: flex; flex-direction: column;
    }
    .panel.on { transform: none; transition-duration: 420ms; }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 2px dashed var(--line); }
    h2 { font-size: 2.2rem; }
    .x { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--crema-2); transition: transform 160ms var(--ease-out); }
    .x:active { transform: scale(0.94); }
    .lines { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 10px; }
    .lines li { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; }
    .ln { font-weight: 700; }
    .qty { display: flex; align-items: center; gap: 2px; padding: 2px; border-radius: 10px; background: var(--leche); box-shadow: inset 0 0 0 1.5px var(--line); }
    .qty button { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; transition: background-color 200ms ease, transform 140ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .qty button:hover { background: var(--crema-2); } }
    .qty button:active { transform: scale(0.9); }
    .qty b { min-width: 20px; text-align: center; }
    .lp { min-width: 54px; text-align: right; font-variant-numeric: tabular-nums; }
    .total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 16px; padding-top: 14px; border-top: 2px dashed var(--line); font-weight: 700; }
    .total b { font-family: var(--font-display); font-weight: 400; font-size: 1.8rem; color: var(--jitomate-hondo); }
    form { margin-top: 18px; }
    .field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 16px; padding: 0; border: 0; }
    .field > span, legend { font-weight: 800; font-size: 0.92rem; padding: 0; }
    small { font-weight: 500; opacity: 0.7; }
    input { min-height: 50px; padding: 0 14px; border-radius: 12px; border: 2px solid var(--line); background: var(--leche); font-size: 1rem; transition: border-color 200ms ease; }
    input:focus { outline: none; border-color: var(--jitomate); }
    input[aria-invalid='true'] { border-color: var(--jitomate-hondo); }
    em { font-style: normal; font-weight: 700; font-size: 0.85rem; color: var(--jitomate-hondo); }
    .times { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .times button { min-height: 42px; padding: 0 14px; border-radius: 999px; font-weight: 700; font-size: 0.92rem; box-shadow: inset 0 0 0 2px var(--line); transition: background-color 200ms ease, color 200ms ease, transform 140ms var(--ease-out); }
    .times button:active { transform: scale(0.96); }
    .times button.on { background: var(--cafe); color: var(--crema); box-shadow: none; }
    .send { width: 100%; margin-top: 6px; }
    .pay { margin-top: 10px; text-align: center; font-size: 0.85rem; opacity: 0.75; }
    .empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; margin: auto 0; padding: 40px 0; }
    .empty svg { width: 110px; margin-bottom: 10px; fill: var(--crema-2); stroke: var(--cafe); stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
    .empty .fold { fill: none; }
    .empty p { font-family: var(--font-display); font-size: 1.6rem; }
    .empty .hint { font-family: var(--font-body); font-size: 1rem; opacity: 0.8; margin-bottom: 14px; }

    .paper { position: relative; margin: 22px auto 0; width: min(300px, 100%); aspect-ratio: 260 / 300; animation: drop 500ms var(--ease-out); }
    @keyframes drop { from { opacity: 0; translate: 0 -14px; rotate: -3deg; } }
    .bag-art { position: absolute; inset: 0; width: 100%; height: 100%; }
    .kraft { fill: oklch(70% 0.075 65); }
    .kraft-top { fill: oklch(62% 0.07 60); }
    .seam { stroke: oklch(55% 0.06 55); stroke-width: 2; }
    .note { position: absolute; left: 20%; right: 20%; top: 34%; color: var(--cafe); }
    .for { font-family: var(--font-display); font-size: 1.5rem; rotate: -3deg; }
    .note ul { list-style: none; margin: 10px 0 0; padding: 0; font-size: 0.88rem; font-weight: 700; display: grid; gap: 2px; }
    .when { margin-top: 10px; font-size: 0.82rem; font-weight: 800; }
    .ready { margin: 20px 0 14px; text-align: center; }
    .back:active { opacity: 0.6; }
    .back { margin-top: 12px; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; align-self: center; }
  `,
})
export class Bag {
  protected readonly order = inject(Order);
  protected readonly money = money;
  protected readonly times = ['En 15 min', 'En 30 min', 'En 1 hora', 'Más tarde'];
  protected readonly name = signal('');
  protected readonly time = signal('En 30 min');
  protected readonly notes = signal('');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly toast = signal(false);
  protected readonly bumping = signal(false);
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private lastFocus: HTMLElement | null = null;

  protected readonly message = computed(() => {
    const lines = this.order.lines().map((l) => `• ${l.qty} × ${l.name}`);
    const notes = this.notes().trim() ? `\nNotas: ${this.notes().trim()}` : '';
    return `¡Hola, Tilde! Soy ${this.name().trim()} y quiero pedir para llevar:\n${lines.join('\n')}\nTotal: ${money(this.order.total())}\nPaso ${this.time().toLowerCase()}.${notes}`;
  });
  protected readonly link = computed(() => whatsappLink(this.message()));

  constructor() {
    const destroyRef = inject(DestroyRef);
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    let bumpTimer: ReturnType<typeof setTimeout> | undefined;
    // Aviso breve y salto de la bolsa cada vez que se agrega algo.
    effect(() => {
      if (!this.order.bump()) return;
      this.toast.set(true);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => this.toast.set(false), 1600);
      this.bumping.set(false);
      requestAnimationFrame(() => this.bumping.set(true));
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(() => this.bumping.set(false), 450);
    });
    // Al abrir: bloquea el scroll de fondo y lleva el foco al panel; al cerrar lo regresa.
    effect(() => {
      const open = this.order.open();
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('no-scroll', open);
      if (open) {
        this.lastFocus = document.activeElement as HTMLElement;
        requestAnimationFrame(() => this.panel().nativeElement.focus());
      } else {
        this.lastFocus?.focus?.();
        this.lastFocus = null;
      }
    });
    afterNextRender(() => {
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.order.open() && this.close();
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => window.removeEventListener('keydown', onKey));
    });
  }

  protected close() {
    this.order.open.set(false);
  }

  protected val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.order.lines().length) this.sent.set(true);
  }
}
