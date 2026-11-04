import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { CLINIC, DAY_NAMES, FAQ, HOURS } from '../core/content';
import { fmtHour } from '../core/clinic';
import { hasFinePointer } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/**
 * Visítanos: la foto del consultorio dentro de un espejo con forma de diente (referencia de Bruno), con un
 * reflejo que se mueve con el cursor. Horario con el día de hoy marcado y preguntas frecuentes con el
 * acordeón de transitions.dev (crece con grid-rows y el contenido se desenfoca al cerrar).
 */
@Component({
  selector: 'app-location',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="visitanos">
      <svg width="0" height="0" aria-hidden="true" style="position: absolute">
        <clipPath id="tooth-clip" clipPathUnits="objectBoundingBox">
          <path transform="translate(-0.2143 -0.239) scale(0.04464 0.04348)" d="M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z" />
        </clipPath>
      </svg>
      <div class="page grid">
        <div class="where">
          <p class="pill" data-reveal>Visítanos</p>
          <h2 class="h2" data-reveal [revealDelay]="80">A dos cuadras de <b>Universidad</b>.</h2>
          <div class="mirror-wrap" data-reveal [revealDelay]="140">
            <div class="frame"></div>
            <figure class="mirror" #mirror>
              <img src="media/consultorio.webp" srcset="media/consultorio-sm.webp 820w, media/consultorio.webp 1800w" sizes="(max-width: 900px) 80vw, 40vw" alt="Consultorio de Marfil reflejado en un espejo con forma de diente" width="1800" height="1200" loading="lazy" />
              <span class="sheen" aria-hidden="true"></span>
            </figure>
          </div>
          <p class="address"><app-icon name="pin" [size]="18" /> <span>{{ address }}<br />{{ city }} · Estacionamiento para pacientes</span></p>
        </div>

        <div class="side">
          <div class="hours" data-reveal>
            <h3>Horario</h3>
            <ul>
              @for (d of week; track d.i) {
                <li [class.today]="today() === d.i">
                  <span>{{ d.name }}@if (today() === d.i) { <small>hoy</small> }</span>
                  <span>{{ d.text }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="faq" data-reveal [revealDelay]="100">
            <h3>Preguntas frecuentes</h3>
            @for (f of faq; track f.q; let i = $index) {
              <div class="acc" [attr.data-open]="open() === i">
                <button type="button" class="acc-head" (click)="open.set(open() === i ? -1 : i)" [attr.aria-expanded]="open() === i">
                  {{ f.q }}
                  <span class="plus" aria-hidden="true"></span>
                </button>
                <div class="acc-panel"><div class="acc-inner"><p>{{ f.a }}</p></div></div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 80px); }
    .where { display: grid; align-content: start; gap: 18px; }
    .h2 b { color: var(--royal); }
    .mirror-wrap { position: relative; width: min(100%, 440px); aspect-ratio: 22.4 / 23; margin: 20px auto 0; }
    /* Marco plateado detrás del espejo: el mismo diente un poco más grande */
    .frame { position: absolute; inset: -12px; clip-path: url(#tooth-clip); background: linear-gradient(135deg, var(--white), var(--ice-3) 40%, var(--white) 60%, var(--sky)); filter: drop-shadow(0 30px 40px oklch(25% 0.08 264 / 0.3)); }
    .mirror { position: absolute; inset: 0; margin: 0; clip-path: url(#tooth-clip); --sx: 30%; --sy: 20%; }
    .mirror img { width: 100%; height: 100%; object-fit: cover; scale: 1.08; transition: scale 1200ms var(--ease-smooth-out), translate 900ms var(--ease-smooth-out); }
    .sheen { position: absolute; inset: 0; background: radial-gradient(60% 40% at var(--sx) var(--sy), oklch(100% 0 0 / 0.55), transparent 70%), linear-gradient(120deg, transparent 30%, oklch(100% 0 0 / 0.25) 45%, transparent 55%); mix-blend-mode: screen; pointer-events: none; }
    .address { display: flex; gap: 10px; align-items: flex-start; font-weight: 600; line-height: 1.45; }
    .address .icon { color: var(--royal); margin-top: 2px; }
    .address span { font-size: 0.95rem; }
    .side { display: grid; gap: 44px; align-content: start; }
    h3 { font-size: 1.8rem; font-weight: 600; margin-bottom: 14px; }
    .hours ul { list-style: none; margin: 0; padding: 6px; border-radius: var(--radius-m); background: var(--white); box-shadow: var(--shadow-s); }
    .hours li { display: flex; justify-content: space-between; padding: 11px 14px; border-radius: 12px; font-variant-numeric: tabular-nums; }
    .hours li.today { background: var(--royal); color: var(--white); font-weight: 650; box-shadow: var(--shadow-blue); }
    .hours small { margin-left: 8px; padding: 2px 8px; border-radius: 999px; background: var(--white); color: var(--royal); font-size: 0.72rem; font-weight: 700; }
    .acc { border-bottom: 1px solid var(--line); }
    .acc-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; padding: 18px 0; font-weight: 650; text-align: left; transition: color 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .acc-head:hover { color: var(--royal); } }
    .plus { position: relative; flex: none; width: 30px; height: 30px; border-radius: 50%; background: var(--ice-2); transition: background-color 250ms ease, rotate var(--duration-fast) var(--ease-smooth-out); }
    .plus::before, .plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 2px; border-radius: 2px; background: currentColor; translate: -50% -50%; transition: rotate var(--duration-fast) var(--ease-smooth-out); }
    .plus::after { rotate: 90deg; }
    .acc[data-open='true'] .plus { background: var(--royal); color: var(--white); rotate: 180deg; }
    .acc[data-open='true'] .plus::after { rotate: 0deg; }
    .acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-panel { grid-template-rows: 1fr; }
    .acc-inner { overflow: hidden; opacity: 0; filter: blur(var(--blur-small)); transition: opacity var(--duration-fast) var(--ease-smooth-out), filter var(--duration-fast) var(--ease-smooth-out); }
    .acc[data-open='true'] .acc-inner { opacity: 1; filter: none; }
    .acc-inner p { padding: 0 0 18px; color: var(--ink-2); }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class Location {
  protected readonly faq = FAQ;
  protected readonly address = CLINIC.address;
  protected readonly city = CLINIC.city;
  protected readonly today = signal(-1);
  protected readonly open = signal(0);
  private readonly mirror = viewChild.required<ElementRef<HTMLElement>>('mirror');
  protected readonly week = [1, 2, 3, 4, 5, 6, 0].map((i) => ({ i, name: DAY_NAMES[i], text: HOURS[i] ? `${fmtHour(HOURS[i]![0])} – ${fmtHour(HOURS[i]![1])}` : 'Cerrado' }));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.today.set(new Date().getDay());
      if (!hasFinePointer()) return;
      // El reflejo del espejo sigue al cursor y la foto se mueve un poco al revés (como un espejo real)
      const el = this.mirror().nativeElement;
      const img = el.querySelector<HTMLElement>('img')!;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--sx', `${x * 100}%`);
        el.style.setProperty('--sy', `${y * 100}%`);
        img.style.translate = `${(0.5 - x) * 18}px ${(0.5 - y) * 14}px`;
      };
      const leave = () => (img.style.translate = '0 0');
      el.parentElement!.addEventListener('pointermove', move);
      el.parentElement!.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.parentElement?.removeEventListener('pointermove', move);
        el.parentElement?.removeEventListener('pointerleave', leave);
      });
    });
  }
}
