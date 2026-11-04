import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { TESTIMONIALS } from '../core/content';
import { Icon } from '../shared/icon';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

/**
 * Reseñas como un mazo de tarjetas con el retrato de cada socio. La de arriba se arrastra y, si
 * se lanza lo suficiente, sale volando y pasa al fondo del mazo. También avanza sola y con flechas.
 */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SplitLines, Reveal],
  template: `
    <section class="section testimonials" aria-roledescription="carrusel" aria-label="Lo que dicen los socios">
      <div class="container layout">
        <div class="side">
          <span class="label" data-reveal>Socios</span>
          <h2 class="h2" splitLines>Lo que se queda<br /><em class="gold">después de entrenar.</em></h2>
          <p class="lead" data-reveal>Arrastra la tarjeta para conocer a los socios.</p>
          <div class="controls" data-reveal>
            <button type="button" (click)="advance(-1)" aria-label="Anterior"><app-icon name="arrow-left" [size]="20" /></button>
            <span class="count"><b>0{{ index() + 1 }}</b> / 0{{ items.length }}</span>
            <button type="button" (click)="advance(1)" aria-label="Siguiente"><app-icon name="arrow-right" [size]="20" /></button>
          </div>
        </div>
        <div class="deck" data-reveal="fade">
          @for (t of items; track t.name; let i = $index) {
            <figure class="card" [attr.data-pos]="pos(i)" [attr.aria-hidden]="pos(i) !== '0'" (pointerdown)="pos(i) === '0' && grab($event)" data-cursor="Arrastra">
              <div class="portrait"><img class="warm" [src]="'media/' + t.img + '-sm.webp'" [alt]="'Retrato de ' + t.name" loading="lazy" draggable="false" /></div>
              <blockquote>“{{ t.quote }}”</blockquote>
              <figcaption><b>{{ t.name }}</b><span>{{ t.meta }}</span></figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .testimonials { background: radial-gradient(ellipse at 70% 30%, rgb(216 185 138 / 9%), transparent 60%), var(--bg); overflow: hidden; }
    .layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(40px, 6vw, 110px); align-items: center; }
    .h2 { margin-top: 20px; }
    .lead { margin-top: 22px; }
    .controls { display: flex; align-items: center; gap: 22px; margin-top: 36px; }
    .controls button { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--line-2); transition: background-color 400ms ease, color 400ms ease, transform 200ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .controls button:hover { background: var(--gold); color: var(--bg); } }
    .controls button:active { transform: scale(0.94); }
    .count { font-size: 0.72rem; letter-spacing: 0.2em; color: var(--muted); }
    .count b { font-family: var(--font-display); font-weight: 400; font-size: 2rem; letter-spacing: 0; color: var(--ink); margin-right: 4px; }
    .deck { position: relative; height: clamp(520px, 70svh, 640px); max-width: 480px; width: 100%; margin-left: auto; margin-right: clamp(0px, 4vw, 60px); touch-action: pan-y; }
    .card {
      position: absolute; inset: 0; margin: 0; display: flex; flex-direction: column; padding: 22px 22px 28px; background: #17140f; box-shadow: inset 0 0 0 1px var(--line-2), 0 40px 70px -40px rgb(0 0 0 / 90%);
      transition: transform 800ms var(--ease-out), opacity 600ms ease, filter 600ms ease; user-select: none; will-change: transform;
    }
    .card[data-pos='0'] { z-index: 4; cursor: grab; }
    .card[data-pos='1'] { z-index: 3; transform: translate(26px, 18px) rotate(3.5deg) scale(0.96); filter: brightness(0.7); }
    .card[data-pos='2'] { z-index: 2; transform: translate(-22px, 34px) rotate(-3deg) scale(0.92); filter: brightness(0.5); }
    .card[data-pos='hidden'] { z-index: 1; opacity: 0; transform: translateY(50px) scale(0.88); pointer-events: none; }
    .card.is-dragging { transition: none; cursor: grabbing; }
    .portrait { position: relative; flex: 1; min-height: 0; overflow: hidden; border-radius: 200px 200px 0 0; background: var(--bg-3); }
    .portrait img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    blockquote { margin: 22px 0 0; font-family: var(--font-display); font-style: italic; font-size: clamp(1.3rem, 1.8vw, 1.6rem); line-height: 1.2; }
    figcaption { display: flex; justify-content: space-between; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; }
    figcaption b { color: var(--gold); font-weight: 600; }
    figcaption span { color: var(--muted); }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .deck { margin: 20px auto 0; height: 560px; }
    }
  `,
})
export class Testimonials {
  protected readonly items = TESTIMONIALS;
  protected readonly index = signal(0);
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private timer?: ReturnType<typeof setInterval>;
  private busy = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.restart());
    destroyRef.onDestroy(() => clearInterval(this.timer));
  }

  protected pos(i: number): string {
    const n = this.items.length;
    const p = (i - this.index() + n) % n;
    return p < 3 ? String(p) : 'hidden';
  }

  private restart() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.fly(1), 7000);
  }

  protected advance(dir: number) {
    if (dir > 0) this.fly(1);
    else {
      const n = this.items.length;
      this.index.set((this.index() - 1 + n) % n);
      this.restart();
    }
  }

  /** La tarjeta de arriba sale volando hacia un lado y el mazo avanza. */
  private fly(dir: number, from = 0) {
    if (this.busy) return;
    const card = this.top();
    if (!card) return;
    this.busy = true;
    card.classList.remove('is-dragging');
    card.style.transition = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease';
    card.style.transform = `translate(${dir * (innerWidth * 0.6) + from}px, -40px) rotate(${dir * 24}deg)`;
    card.style.opacity = '0';
    setTimeout(() => {
      this.index.set((this.index() + 1) % this.items.length);
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '';
      requestAnimationFrame(() => (card.style.transition = ''));
      this.busy = false;
    }, 520);
    this.restart();
  }

  private top(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>('.card[data-pos="0"]');
  }

  protected grab(e: PointerEvent) {
    const card = e.currentTarget as HTMLElement;
    if (this.busy) return;
    card.setPointerCapture(e.pointerId);
    card.classList.add('is-dragging');
    clearInterval(this.timer);
    const x0 = e.clientX;
    const y0 = e.clientY;
    let dx = 0;
    let last = x0;
    let vx = 0;
    const move = (ev: PointerEvent) => {
      dx = ev.clientX - x0;
      vx = ev.clientX - last;
      last = ev.clientX;
      const dy = (ev.clientY - y0) * 0.2;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`;
    };
    const up = () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
      if (Math.abs(dx) > 110 || Math.abs(vx) > 14) this.fly(Math.sign(dx || vx), dx);
      else {
        card.classList.remove('is-dragging');
        card.style.transform = '';
        this.restart();
      }
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', up);
  }
}
