import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from '../core/booking';
import { INDEX } from '../core/content';
import { Motion } from '../core/motion';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

/**
 * Encabezado como el cabezal de página de un libro: logo, el capítulo que estás viendo y el
 * botón "Índice", que abre la tabla de contenido a pantalla completa con vista previa de foto.
 */
@Component({
  selector: 'app-masthead',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    <header class="head" [class.solid]="solid()">
      <a href="/" class="brand" (click)="home($event)" aria-label="Nido, ir al inicio"><app-logo /></a>
      <p class="running" aria-live="polite">
        @for (r of [album.running()]; track r) {
          <span>{{ r || 'Fotografía de recién nacidos y familia' }}</span>
        }
      </p>
      <nav class="actions" aria-label="Principal">
        <button type="button" class="thread" (click)="album.go('reserva')">Reservar</button>
        <button type="button" class="index-btn" (click)="album.indexOpen.set(true)" [attr.aria-expanded]="album.indexOpen()" aria-controls="indice">
          <span class="lines" aria-hidden="true"><i></i><i></i><i></i></span> Índice
        </button>
      </nav>
    </header>

    <div class="index" id="indice" role="dialog" aria-modal="true" aria-label="Índice" [class.open]="album.indexOpen()" [attr.inert]="album.indexOpen() ? null : ''" #panel tabindex="-1">
      <div class="index-top">
        <app-logo />
        <button type="button" class="close" (click)="album.indexOpen.set(false)"><app-icon name="close" [size]="20" [stroke]="1.5" /> Cerrar</button>
      </div>
      <div class="index-body">
        <ol class="toc" (pointerleave)="preview.set(-1)">
          @for (e of entries; track e.id; let i = $index) {
            <li [style.--i]="i">
              <button type="button" (click)="album.go(e.id)" (pointerenter)="preview.set(i)" (focus)="preview.set(i)">
                <span class="num">{{ e.num }}</span>
                <span class="t">{{ e.title }}</span>
                <span class="dots" aria-hidden="true"></span>
                <span class="pg">{{ e.page }}</span>
              </button>
            </li>
          }
        </ol>
        <div class="peek" aria-hidden="true">
          @for (e of entries; track e.id; let i = $index) {
            <img [src]="'media/' + e.img + '-sm.webp'" alt="" width="720" height="900" loading="lazy" [class.on]="preview() === i" />
          }
          <p class="peek-empty" [class.on]="preview() === -1">Pasa el cursor por un capítulo.</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .head { position: fixed; inset: 0 0 auto; z-index: 60; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; height: 76px; padding: 0 var(--gutter); transition: background-color 400ms ease, box-shadow 400ms ease; }
    .head.solid { background: color-mix(in oklch, var(--paper) 92%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 0 var(--line); }
    .brand { justify-self: start; }
    .running { overflow: hidden; height: 1.3em; font-family: var(--font-display); font-style: italic; font-size: 1.1rem; color: var(--ink-2); text-align: center; }
    .running span { display: block; animation: turn 500ms var(--ease-out); }
    @keyframes turn { from { opacity: 0; translate: 0 70%; } }
    .actions { justify-self: end; display: flex; align-items: center; gap: 26px; }
    .index-btn { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 18px; border: 1px solid var(--line-2); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; transition: background-color 250ms ease, color 250ms ease, transform 160ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .index-btn:hover { background: var(--ink); color: var(--paper); } }
    .index-btn:active { transform: scale(0.97); }
    .lines { display: grid; gap: 3px; width: 14px; }
    .lines i { height: 1px; background: currentColor; }
    .lines i:nth-child(2) { width: 70%; }

    .index { position: fixed; inset: 0; z-index: 110; display: flex; flex-direction: column; padding: 0 var(--gutter) 40px; background: var(--paper); visibility: hidden; clip-path: inset(0 0 100% 0); transition: clip-path 380ms var(--ease-in-out), visibility 0s 380ms; outline: none; overflow-y: auto; }
    .index.open { visibility: visible; clip-path: inset(0 0 0 0); transition: clip-path 600ms var(--ease-in-out); }
    .index-top { display: flex; justify-content: space-between; align-items: center; height: 76px; flex: none; }
    .close { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; padding: 10px 0; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .close:active { scale: 0.92; }
    .index-body { flex: 1; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(30px, 6vw, 100px); align-items: center; padding-top: 20px; }
    .toc { list-style: none; margin: 0; padding: 0; counter-reset: none; }
    .toc li { opacity: 0; translate: 0 16px; transition: opacity 400ms ease, translate 500ms var(--ease-out); }
    .open .toc li { opacity: 1; translate: none; transition-delay: calc(200ms + var(--i) * 35ms); }
    .toc button { display: flex; align-items: baseline; gap: 14px; width: 100%; padding: 6px 0; text-align: left; }
    .num { width: 38px; flex: none; font-family: var(--font-display); font-size: 1rem; color: var(--hilo); }
    .t { font-family: var(--font-display); font-weight: 340; font-size: clamp(1.6rem, 3.6vw, 2.9rem); line-height: 1.1; transition: translate 300ms var(--ease-out), color 200ms ease; }
    .dots { flex: 1; min-width: 20px; border-bottom: 1px dotted var(--line-2); translate: 0 -6px; }
    .pg { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; color: var(--muted); font-variant-numeric: tabular-nums; }
    @media (hover: hover) {
      .toc button:hover .t { translate: 10px 0; font-style: italic; }
      .toc button:hover .pg { color: var(--hilo); }
    }
    .peek { position: relative; aspect-ratio: 4 / 5; max-height: 70svh; background: var(--paper-2); }
    .peek img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; scale: 1.04; transition: opacity 350ms ease, scale 600ms var(--ease-out); }
    .peek img.on { opacity: 1; scale: 1; }
    .peek-empty { position: absolute; inset: 0; display: grid; place-items: center; padding: 30px; text-align: center; font-family: var(--font-display); font-style: italic; font-size: 1.3rem; color: var(--muted); opacity: 0; transition: opacity 300ms ease; }
    .peek-empty.on { opacity: 1; }

    @media (max-width: 900px) {
      .head { grid-template-columns: auto 1fr; }
      .running, .actions .thread { display: none; }
      .index-body { grid-template-columns: 1fr; align-items: start; }
      .peek { display: none; }
    }
  `,
})
export class Masthead {
  protected readonly album = inject(Album);
  private readonly motion = inject(Motion);
  private readonly router = inject(Router);
  protected readonly entries = INDEX;
  protected readonly solid = signal(false);
  protected readonly preview = signal(-1);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Al abrir el índice se detiene el scroll de fondo y el foco pasa al panel.
    effect(() => {
      const open = this.album.indexOpen();
      if (typeof document === 'undefined') return;
      if (open) {
        this.motion.stop();
        requestAnimationFrame(() => this.panel().nativeElement.focus());
      } else if (this.motion.introDone()) {
        this.motion.resume();
      }
    });
    afterNextRender(() => {
      const onScroll = () => this.solid.set(window.scrollY > 40);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.album.indexOpen.set(false);
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
      });
    });
  }

  /** En el inicio sube con suavidad; en las páginas legales navega al inicio. */
  protected home(e: Event) {
    e.preventDefault();
    if (this.router.url.split(/[?#]/)[0] === '/') this.motion.scrollTo(0);
    else this.router.navigateByUrl('/');
  }
}
