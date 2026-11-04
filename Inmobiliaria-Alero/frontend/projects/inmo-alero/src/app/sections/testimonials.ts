import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { TESTIMONIALS } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section testimonials" id="opiniones">
      <div class="container grid">
        <div class="photo" data-reveal="left">
          <img src="media/llaves-sm.webp" srcset="media/llaves-sm.webp 720w, media/llaves.webp 1200w" sizes="(max-width: 900px) 92vw, 45vw"
            alt="Asesora entregando las llaves de su nueva casa a una familia" width="1200" height="800" loading="lazy" />
          <div class="stamp"><b>4.9</b><span>★★★★★<br />en Google</span></div>
        </div>
        <div class="quotes">
          <span class="eyebrow" data-reveal>Opiniones</span>
          <div class="slides" data-reveal [revealDelay]="100" aria-live="polite">
            @for (t of items; track t.name; let i = $index) {
              <figure class="slide" [class.on]="active() === i" [attr.aria-hidden]="active() !== i">
                <blockquote>“{{ t.text }}”</blockquote>
                <figcaption><b>{{ t.name }}</b><span>{{ t.place }}</span></figcaption>
              </figure>
            }
          </div>
          <div class="controls" data-reveal [revealDelay]="160">
            <button type="button" (click)="go(-1)" aria-label="Opinión anterior"><app-icon name="chevron-l" [size]="20" /></button>
            <div class="bars">
              @for (t of items; track t.name; let i = $index) {
                <button type="button" class="bar" [class.on]="active() === i" (click)="pick(i)" [attr.aria-label]="'Ver opinión de ' + t.name"><span></span></button>
              }
            </div>
            <button type="button" (click)="go(1)" aria-label="Opinión siguiente"><app-icon name="chevron" [size]="20" /></button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 80px); align-items: center; }
    .photo { position: relative; }
    .photo img { width: 100%; aspect-ratio: 5 / 4; object-fit: cover; border-radius: var(--radius-lg); }
    .stamp { position: absolute; right: -16px; bottom: -16px; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 18px; background: var(--pine); color: #fff; box-shadow: var(--shadow-lg); }
    .stamp b { font-family: var(--font-display); font-weight: 400; font-size: 2.4rem; line-height: 1; color: var(--brass-2); }
    .stamp span { font-size: 0.78rem; line-height: 1.3; color: rgb(255 255 255 / 80%); }
    .slides { display: grid; margin-top: 20px; }
    .slide { grid-area: 1 / 1; margin: 0; opacity: 0; transform: translateY(14px); pointer-events: none; transition: opacity 500ms ease, transform 600ms var(--ease-out); }
    .slide.on { opacity: 1; transform: none; pointer-events: auto; }
    blockquote { margin: 0; font-family: var(--font-display); font-size: clamp(1.6rem, 2.8vw, 2.3rem); line-height: 1.2; }
    figcaption { display: flex; flex-direction: column; margin-top: 22px; }
    figcaption span { color: var(--muted); font-size: 0.92rem; }
    .controls { display: flex; align-items: center; gap: 14px; margin-top: 34px; }
    .controls > button { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; box-shadow: inset 0 0 0 1.5px var(--line); transition: background-color 250ms ease, color 250ms ease, box-shadow 250ms ease; }
    @media (hover: hover) and (pointer: fine) { .controls > button:hover { background: var(--pine); color: #fff; box-shadow: none; } }
    .bars { display: flex; gap: 6px; flex: 1; max-width: 220px; }
    .bar { flex: 1; height: 24px; display: flex; align-items: center; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .bar:active { scale: 0.94; }
    .bar span { position: relative; display: block; width: 100%; height: 3px; border-radius: 3px; background: var(--line); overflow: hidden; }
    .bar span::after { content: ''; position: absolute; inset: 0; background: var(--brass); transform: scaleX(0); transform-origin: left; }
    .bar.on span::after { animation: progress 7s linear forwards; }
    @keyframes progress { to { transform: scaleX(1); } }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .stamp { right: 10px; } }
  `,
})
export class Testimonials {
  protected readonly items = TESTIMONIALS;
  protected readonly active = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.restart());
    destroyRef.onDestroy(() => clearInterval(this.timer));
  }

  protected go(dir: number) {
    this.pick((this.active() + dir + this.items.length) % this.items.length);
  }

  protected pick(i: number) {
    this.active.set(i);
    this.restart();
  }

  // Avanza solo cada 7 s (lo mismo que tarda en llenarse la barra).
  private restart() {
    clearInterval(this.timer);
    if (document.documentElement.classList.contains('reduce-motion')) return;
    this.timer = setInterval(() => this.active.update((a) => (a + 1) % this.items.length), 7000);
  }
}
