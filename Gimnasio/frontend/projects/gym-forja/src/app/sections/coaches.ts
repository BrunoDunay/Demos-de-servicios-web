import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { COACHES } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Carrusel de coaches: se arrastra con el mouse, con scroll horizontal nativo en celular. */
@Component({
  selector: 'app-coaches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section coaches" id="coaches">
      <div class="container head">
        <div>
          <span class="tag" data-reveal>El equipo</span>
          <h2 class="title-xl" data-reveal [revealDelay]="80">Coaches</h2>
        </div>
        <div class="arrows" data-reveal [revealDelay]="160">
          <button type="button" (click)="nudge(-1)" aria-label="Coach anterior"><app-icon name="arrow-left" [size]="22" /></button>
          <button type="button" (click)="nudge(1)" aria-label="Siguiente coach"><app-icon name="arrow-right" [size]="22" /></button>
        </div>
      </div>
      <div class="track" #track data-cursor="ARRASTRA">
        @for (c of coaches; track c.name; let i = $index) {
          <article class="card" data-reveal [revealDelay]="i * 90">
            <div class="photo">
              <img class="photo-bw" [src]="'media/' + c.img + '-sm.webp'" [alt]="'Coach ' + c.name + ', ' + c.role" width="720" height="1080" loading="lazy" draggable="false" />
              <div class="tint"></div>
              <span class="years"><b>{{ c.years }}</b> años<br />en el hierro</span>
            </div>
            <div class="info">
              <small>“{{ c.nick }}”</small>
              <h3>{{ c.name }}</h3>
              <p>{{ c.role }}</p>
              <ul>
                @for (cert of c.certs; track cert) {
                  <li>{{ cert }}</li>
                }
              </ul>
            </div>
          </article>
        }
        <article class="card join">
          <span class="tag">Únete al equipo</span>
          <h3>¿Eres coach?</h3>
          <p>Buscamos gente que ame enseñar tanto como entrenar.</p>
          <a class="btn btn-ghost" href="#contacto">Escríbenos <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></a>
        </article>
      </div>
    </section>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 44px; }
    .title-xl { margin-top: 18px; }
    .arrows { display: flex; gap: 10px; }
    .arrows button { display: grid; place-items: center; width: 58px; height: 58px; border: 1.5px solid var(--line-2); transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease, transform 200ms var(--ease-out); }
    .arrows button:hover { background: var(--ember); color: var(--bg); border-color: var(--ember); }
    .arrows button:active { transform: scale(0.92); }
    .track { --pad: max(var(--gutter), calc((100vw - var(--container)) / 2)); display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--pad); scrollbar-width: none; padding: 0 var(--pad) 10px; cursor: grab; user-select: none; }
    .track::-webkit-scrollbar { display: none; }
    .track.is-dragging { cursor: grabbing; scroll-snap-type: none; }
    .card { flex: 0 0 clamp(270px, 28vw, 380px); scroll-snap-align: start; }
    .photo { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--bg-3); clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%); }
    .photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; transition: transform 900ms var(--ease-expo); pointer-events: none; }
    .tint { position: absolute; inset: 0; background: var(--ember); mix-blend-mode: multiply; opacity: 0; transition: opacity 500ms ease; }
    .years { position: absolute; left: 16px; bottom: 16px; font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.3; color: var(--ink); }
    .years b { display: block; font-family: var(--font-display); font-weight: 400; font-size: 3rem; letter-spacing: 0; line-height: 0.9; }
    .card:hover .photo img { transform: scale(1.06); }
    .card:hover .tint { opacity: 0.85; }
    .info { padding-top: 18px; }
    .info small { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; color: var(--ember); text-transform: uppercase; }
    .info h3 { margin-top: 6px; font-size: 3rem; }
    .info p { color: var(--ink-2); }
    .info ul { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 0; padding: 0; }
    .info li { padding: 5px 10px; border: 1px solid var(--line-2); font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2); }
    .join { display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 36px; border: 1.5px dashed var(--line-2); aspect-ratio: 3 / 4; align-self: flex-start; }
    .join h3 { font-size: 3rem; }
    .join p { color: var(--muted); }
    .join .btn { align-self: flex-start; }
    @media (max-width: 700px) { .arrows { display: none; } .card { flex-basis: 78vw; } }
  `,
})
export class Coaches {
  protected readonly coaches = COACHES;
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.track().nativeElement;
      let down = false;
      let startX = 0;
      let startScroll = 0;
      let moved = false;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        down = true;
        moved = false;
        startX = e.clientX;
        startScroll = el.scrollLeft;
      };
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) {
          moved = true;
          el.classList.add('is-dragging');
        }
        el.scrollLeft = startScroll - dx;
      };
      const onUp = () => {
        down = false;
        el.classList.remove('is-dragging');
      };
      const onClick = (e: MouseEvent) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      el.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      el.addEventListener('click', onClick, true);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      });
    });
  }

  protected nudge(dir: number) {
    const el = this.track().nativeElement;
    const card = el.querySelector<HTMLElement>('.card');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: 'smooth' });
  }
}
