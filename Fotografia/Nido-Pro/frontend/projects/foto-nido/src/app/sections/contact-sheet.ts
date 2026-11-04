import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { FRAMES, ROLLS } from '../core/content';
import { Motion, hasFinePointer } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Running } from '../shared/running';
import { SwipeDismiss } from '../shared/swipe-dismiss';

/**
 * Portafolio como hoja de contactos: tiras de película con número de cuadro. Las que Inés
 * eligió llevan un círculo de lápiz rojo; al pasar el cursor se dibuja en las demás.
 * Al tocar una se abre con una lupa que amplía la zona bajo el cursor.
 */
@Component({
  selector: 'app-contact-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Running, SwipeDismiss],
  template: `
    <section class="section sheet" id="contactos" running="Hoja de contactos">
      <div class="page">
        <p class="folio" data-reveal><span><b>Hoja de contactos</b> · tres rollos</span><span>p. 36</span></p>
        <div class="head">
          <h2 data-reveal [revealDelay]="60">Antes de elegir, <em>todo se ve así.</em></h2>
          <p class="lead" data-reveal [revealDelay]="120">Las marcadas en rojo son las que escogí yo. Toca cualquier cuadro para verlo con la lupa.</p>
        </div>
        <div class="rolls" role="group" aria-label="Rollos" data-reveal [revealDelay]="160">
          <button type="button" [class.on]="roll() === ''" [attr.aria-pressed]="roll() === ''" (click)="roll.set('')">Todos</button>
          @for (r of rolls; track r) {
            <button type="button" [class.on]="roll() === r" [attr.aria-pressed]="roll() === r" (click)="roll.set(r)">{{ r }}</button>
          }
        </div>
        <ol class="film" data-reveal [revealDelay]="200">
          @for (f of shown(); track f.img; let i = $index) {
            <li class="cell" [class.pick]="f.pick" [style.--i]="i">
              <button type="button" class="frame" (click)="open(f.img)" data-cursor="Lupa" [attr.aria-label]="'Ver con lupa: ' + f.alt">
                <img [src]="'media/' + f.img + '-sm.webp'" [alt]="f.alt" width="720" height="480" loading="lazy" />
                <svg class="pencil" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M50 4C20 4 4 18 5 36s20 30 48 29 44-12 43-31S76 3 44 6" /></svg>
              </button>
              <span class="num" aria-hidden="true">{{ number(f.img) }}<i>▸</i>{{ number(f.img) }}A</span>
            </li>
          }
        </ol>
        <p class="edge" aria-hidden="true">NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400 · NIDO 400</p>
      </div>

      @if (current(); as f) {
        <div class="loupe" [class.closing]="closing()" swipeDismiss="y" swipeMedia="(pointer: coarse)" (dismiss)="close(true)" role="dialog" aria-modal="true" [attr.aria-label]="f.alt" (pointerdown)="swipeStart($event)" (pointerup)="swipeEnd($event)">
          <div class="loupe-top">
            <span class="ln">Cuadro {{ number(f.img) }} · {{ f.roll }}</span>
            <button type="button" class="x" (click)="close()"><app-icon name="close" [size]="20" [stroke]="1.5" /> Cerrar</button>
          </div>
          <div class="stage" #stage (pointermove)="lens($event)" (pointerleave)="lensOn.set(false)">
            @for (k of [f.img]; track k) {
              <img #big [src]="'media/' + f.img + '.webp'" [alt]="f.alt" [attr.width]="f.w" [attr.height]="f.h" />
            }
            @if (fine) {
              <span class="lens" [class.on]="lensOn()" [style.background-image]="'url(media/' + f.img + '.webp)'" [style.left.px]="lensPos().x" [style.top.px]="lensPos().y" [style.background-size]="lensPos().size" [style.background-position]="lensPos().bg"></span>
            }
          </div>
          <div class="loupe-bottom">
            <button type="button" (click)="step(-1)" aria-label="Cuadro anterior"><app-icon name="chevron-l" [size]="22" [stroke]="1.4" /></button>
            <p class="caption">{{ f.alt }}</p>
            <button type="button" (click)="step(1)" aria-label="Cuadro siguiente"><app-icon name="chevron" [size]="22" [stroke]="1.4" /></button>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .sheet { background: var(--film); color: oklch(88% 0.012 75); }
    .folio { color: oklch(62% 0.02 60); border-color: oklch(100% 0 0 / 12%); }
    .folio b { color: oklch(92% 0.01 75); }
    .head { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; align-items: end; margin: clamp(40px, 6vw, 80px) 0 34px; }
    h2 { font-size: clamp(2.6rem, 5.6vw, 5.2rem); color: oklch(95% 0.01 75); }
    h2 em { color: var(--film-text); }
    .lead { max-width: 36ch; color: oklch(78% 0.015 70); }
    .rolls { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 26px; }
    .rolls button { min-height: 40px; padding: 0 16px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: oklch(70% 0.02 60); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 14%); transition: background-color 200ms ease, color 200ms ease; }
    .rolls button.on { background: oklch(92% 0.01 75); color: var(--film); box-shadow: none; }
    @media (hover: hover) and (pointer: fine) { .rolls button:not(.on):hover { color: oklch(95% 0.01 75); } }

    /* Tira de película: perforaciones arriba y abajo de cada cuadro */
    .film { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; }
    .cell { position: relative; padding: 22px 8px 30px; background: oklch(12% 0.01 40); animation: cell-in 500ms var(--ease-out) both; animation-delay: calc(var(--i) * 25ms); }
    @keyframes cell-in { from { opacity: 0; } }
    .cell::before, .cell::after { content: ''; position: absolute; left: 0; right: 0; height: 9px; background: repeating-linear-gradient(90deg, transparent 0 7px, oklch(30% 0.01 50) 7px 17px, transparent 17px 24px); }
    .cell::before { top: 6px; }
    .cell::after { bottom: 6px; }
    .frame { position: relative; display: block; width: 100%; aspect-ratio: 3 / 2; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .frame:active { scale: 0.985; }
    .frame img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.9); transition: filter 300ms ease; }
    .pencil { position: absolute; inset: -12% -8%; width: 116%; height: 124%; overflow: visible; pointer-events: none; }
    .pencil path { fill: none; stroke: var(--hilo); stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 500ms var(--ease-out), opacity 120ms ease; }
    .cell.pick .pencil path { stroke-dashoffset: 0; opacity: 1; }
    @media (hover: hover) {
      .frame:hover .pencil path { stroke-dashoffset: 0; opacity: 1; }
      .film:has(.frame:hover) .frame:not(:hover) img { filter: saturate(0.5) brightness(0.7); }
    }
    .num { position: absolute; left: 10px; bottom: 12px; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; color: var(--film-text); }
    .num i { font-style: normal; margin: 0 6px; }
    .edge { margin-top: 14px; overflow: hidden; white-space: nowrap; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.3em; color: color-mix(in oklch, var(--film-text) 60%, transparent); }

    .loupe { position: fixed; inset: 0; z-index: 150; display: grid; grid-template-rows: auto 1fr auto; padding: 18px var(--gutter) 22px; background: oklch(12% 0.01 40 / 97%); animation: fade 300ms ease; touch-action: pan-y; }
    @media (pointer: coarse) { .loupe { touch-action: none; } }
    .loupe.closing { animation: fade-out 200ms ease forwards; pointer-events: none; }
    @keyframes fade-out { to { opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
    .loupe-top, .loupe-bottom { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .ln { font-size: 0.74rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--film-text); }
    .x { display: inline-flex; align-items: center; gap: 8px; padding: 10px 0; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: oklch(90% 0.01 75); transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .x:active { scale: 0.92; }
    .stage { position: relative; display: grid; place-items: center; min-height: 0; padding: 18px 0; overflow: hidden; }
    .stage img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; animation: develop 600ms var(--ease-out); }
    @keyframes develop { from { opacity: 0; filter: blur(6px); } }
    .lens { position: absolute; width: 180px; height: 180px; margin: -90px 0 0 -90px; border-radius: 50%; background-repeat: no-repeat; box-shadow: 0 0 0 2px var(--hilo), 0 20px 40px -10px oklch(0% 0 0 / 60%); pointer-events: none; opacity: 0; scale: 0.9; transition: opacity 200ms ease, scale 250ms var(--ease-out); }
    .lens.on { opacity: 1; scale: 1; }
    .loupe-bottom button { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; color: oklch(90% 0.01 75); box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 20%); transition: background-color 200ms ease, transform 160ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .loupe-bottom button:hover { background: oklch(100% 0 0 / 10%); } }
    .loupe-bottom button:active { transform: scale(0.95); }
    .loupe-bottom .caption { color: oklch(80% 0.015 70); text-align: center; }

    @media (max-width: 1000px) { .film { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 640px) { .film { grid-template-columns: repeat(2, 1fr); } .head { grid-template-columns: 1fr; } }
  `,
})
export class ContactSheet {
  private readonly motion = inject(Motion);
  protected readonly rolls = ROLLS;
  protected readonly roll = signal('');
  protected readonly shown = computed(() => (this.roll() ? FRAMES.filter((f) => f.roll === this.roll()) : FRAMES));
  protected readonly openImg = signal<string | null>(null);
  protected readonly current = computed(() => FRAMES.find((f) => f.img === this.openImg()) ?? null);
  protected readonly lensOn = signal(false);
  protected readonly lensPos = signal({ x: 0, y: 0, size: '0px', bg: '0 0' });
  protected readonly fine = typeof matchMedia !== 'undefined' && hasFinePointer();
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly big = viewChild<ElementRef<HTMLImageElement>>('big');
  private startX = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onKey = (e: KeyboardEvent) => {
        if (!this.openImg()) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowRight') this.step(1);
        if (e.key === 'ArrowLeft') this.step(-1);
      };
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => window.removeEventListener('keydown', onKey));
    });
  }

  protected number(img: string) {
    return String(FRAMES.findIndex((f) => f.img === img) + 1).padStart(2, '0');
  }

  protected open(img: string) {
    this.openImg.set(img);
    this.motion.stop();
    document.body.classList.add('no-scroll');
  }

  protected readonly closing = signal(false);

  /** Cierra con un desvanecido corto. "now" = ya salió arrastrándola hacia abajo. */
  protected close(now = false) {
    if (!this.openImg() || (this.closing() && !now)) return;
    const done = () => {
      this.closing.set(false);
      this.openImg.set(null);
      this.lensOn.set(false);
      this.motion.resume();
      document.body.classList.remove('no-scroll');
    };
    if (now || document.documentElement.classList.contains('reduce-motion')) return done();
    this.closing.set(true);
    setTimeout(done, 200);
  }

  protected step(dir: number) {
    const list = this.shown();
    const i = list.findIndex((f) => f.img === this.openImg());
    this.openImg.set(list[(i + dir + list.length) % list.length].img);
  }

  /** La lupa amplía 2.4 veces la zona de la foto que está bajo el cursor. */
  protected lens(e: PointerEvent) {
    const img = this.big()?.nativeElement;
    const stage = this.stage()?.nativeElement;
    if (!img || !stage || e.pointerType !== 'mouse') return;
    const r = img.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    this.lensOn.set(inside);
    if (!inside) return;
    const zoom = 2.4;
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    const bw = r.width * zoom;
    const bh = r.height * zoom;
    this.lensPos.set({
      x: e.clientX - s.left,
      y: e.clientY - s.top,
      size: `${bw}px ${bh}px`,
      bg: `${-(fx * bw - 90)}px ${-(fy * bh - 90)}px`,
    });
  }

  protected swipeStart(e: PointerEvent) {
    this.startX = e.clientX;
  }

  protected swipeEnd(e: PointerEvent) {
    const dx = e.clientX - this.startX;
    if (Math.abs(dx) > 60 && e.pointerType !== 'mouse') this.step(dx < 0 ? 1 : -1);
  }
}
