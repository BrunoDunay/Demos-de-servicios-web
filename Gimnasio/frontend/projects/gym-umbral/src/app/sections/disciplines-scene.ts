import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DISCIPLINES } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { PlayInView } from '../shared/in-view-video';

/**
 * Escena fija (sticky) con cambio de escenario: al hacer scroll el fondo pasa de Reformer a Ride
 * y a Fuerza con barridos, y el texto cambia con él (referencia: carrusel con cambio de escena).
 */
@Component({
  selector: 'app-disciplines-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PlayInView],
  template: `
    <section class="scene" id="disciplinas-home" [style.--n]="items.length">
      <div class="sticky">
        <div class="bgs">
          @for (d of items; track d.id; let i = $index) {
            <div class="bg" [class.is-first]="i === 0">
              @if (d.bg) {
                <video [playInView]="'media/' + d.bg + '.mp4'" [attr.poster]="'media/' + d.bg + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
              } @else {
                <img class="warm drift" [src]="'media/' + (d.wide ?? d.img) + '.webp'" [attr.srcset]="'media/' + (d.wide ?? d.img) + '-sm.webp 720w, media/' + (d.wide ?? d.img) + '.webp 1400w'" sizes="100vw" [alt]="d.name" loading="lazy" />
                @if (d.id === 'ride') {
                  <span class="beams" aria-hidden="true"><i></i><i></i><i></i></span>
                }
              }
            </div>
          }
        </div>
        <div class="shade"></div>
        <div class="container ui">
          <span class="label">Siete formas de entrenar, un mismo club</span>
          <div class="titles">
            @for (d of items; track d.id; let i = $index) {
              <article class="t" [class.is-first]="i === 0">
                <span class="num">0{{ i + 1 }} <i>/ 0{{ items.length }}</i></span>
                <h2 class="name">{{ d.name }}</h2>
                <p class="tag"><em>{{ d.tagline }}</em></p>
                <p class="txt">{{ d.text }}</p>
                <dl>
                  @for (s of d.specs; track s[0]) {
                    <div><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
                  }
                </dl>
                <a routerLink="/disciplinas" [fragment]="d.id" class="link-line" data-cursor="VER">Conocer {{ d.name }}</a>
              </article>
            }
          </div>
          <ol class="progress" aria-hidden="true">
            @for (d of items; track d.id; let i = $index) {
              <li><span>{{ d.name }}</span><b><i class="fill" [class.is-first]="i === 0"></i></b></li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: `
    .scene { position: relative; height: calc(var(--n, 3) * 100vh); }
    .sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; }
    .bgs, .bg { position: absolute; inset: 0; }
    .bg { clip-path: inset(100% 0 0 0); }
    .bg.is-first { clip-path: inset(0 0 0 0); }
    .bg img, .bg video { width: 100%; height: 100%; object-fit: cover; }
    .drift { animation: drift 16s ease-in-out infinite alternate; }
    @keyframes drift { from { transform: scale(1.04) translateX(-1.5%); } to { transform: scale(1.14) translateX(1.5%); } }
    /* Ride sin video: haces de luz que cruzan la sala como en una clase a oscuras. */
    .beams { position: absolute; inset: 0; mix-blend-mode: screen; overflow: hidden; }
    .beams i { position: absolute; top: -20%; width: 18vw; height: 140%; background: linear-gradient(90deg, transparent, rgb(243 196 140 / 22%), transparent); filter: blur(10px); transform: rotate(18deg); animation: beam 7s ease-in-out infinite; }
    .beams i:nth-child(2) { animation-delay: -2.3s; animation-duration: 9s; }
    .beams i:nth-child(3) { animation-delay: -4.6s; animation-duration: 8s; }
    @keyframes beam { 0% { left: -30%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
    .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(13 12 10 / 88%) 0%, rgb(13 12 10 / 55%) 45%, rgb(13 12 10 / 15%) 100%), linear-gradient(0deg, rgb(13 12 10 / 70%), transparent 40%); }
    .ui { position: relative; height: 100%; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto 1fr; padding-top: 130px; padding-bottom: 70px; }
    .label { grid-column: 1 / -1; }
    .titles { position: relative; align-self: center; display: grid; }
    /* Los tres bloques comparten la misma celda: todos quedan centrados igual, sin transform de CSS que GSAP pueda pisar. */
    .t { grid-area: 1 / 1; align-self: center; max-width: 560px; opacity: 0; visibility: hidden; }
    .t.is-first { opacity: 1; visibility: visible; }
    .num { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.24em; color: var(--gold); }
    .num i { font-style: normal; color: var(--muted); }
    .name { margin-top: 16px; font-size: clamp(4.4rem, 10vw, 9.6rem); line-height: 0.88; }
    .tag { margin-top: 10px; font-size: clamp(1.4rem, 2.2vw, 2rem); color: var(--gold); }
    .txt { margin-top: 18px; color: var(--ink-2); font-weight: 300; max-width: 460px; }
    dl { display: flex; gap: clamp(18px, 3vw, 34px); margin: 26px 0 30px; }
    dd { white-space: nowrap; }
    dt { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    dd { margin: 4px 0 0; font-family: var(--font-display); font-size: 1.6rem; }
    .progress { list-style: none; margin: 0; padding: 0; align-self: end; display: flex; flex-direction: column; gap: 18px; min-width: 200px; }
    .progress li { display: grid; gap: 8px; }
    .progress span { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-2); }
    .progress b { position: relative; display: block; height: 1px; background: var(--line-2); overflow: hidden; }
    .fill { position: absolute; inset: 0; background: var(--gold); transform: scaleX(0); transform-origin: left; }

    @media (max-width: 900px) {
      .scene { height: auto; }
      .sticky { position: relative; height: auto; overflow: visible; }
      .bgs, .shade, .progress { display: none; }
      .ui { display: block; padding-block: 0; height: auto; }
      .label { display: inline-flex; margin: 90px 0 30px; }
      .titles { display: grid; gap: 18px; }
      .t { grid-area: auto; position: relative; top: auto; translate: none; opacity: 1; visibility: visible; padding: 34px 24px; min-height: 80svh; display: flex; flex-direction: column; justify-content: flex-end; isolation: isolate; overflow: hidden; }
      .t::before { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgb(13 12 10 / 92%) 35%, rgb(13 12 10 / 20%)), var(--bgimg) center / cover; }
    }
  `,
})
export class DisciplinesScene {
  protected readonly items = DISCIPLINES;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // En celular cada tarjeta usa su foto de fondo.
      host.querySelectorAll<HTMLElement>('.t').forEach((t, i) => t.style.setProperty('--bgimg', `url(media/${this.items[i].img}-sm.webp)`));
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const q = gsap.utils.selector(host);
        const bgs = q('.bg');
        const titles = q('.t');
        const fills = q('.fill');
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: host, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
        tl.fromTo(fills[0], { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
        tl.fromTo(q('.bg')[0].firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
        for (let i = 1; i < this.items.length; i++) {
          const at = i;
          tl.to(titles[i - 1], { autoAlpha: 0, yPercent: -14, duration: 0.3, ease: 'power2.in' }, at - 0.05)
            .fromTo(bgs[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.inOut' }, at - 0.1)
            .fromTo(q('.bg')[i], { scale: 1.18 }, { scale: 1, duration: 1.1 }, at - 0.1)
            .fromTo(titles[i], { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: 'power2.out' }, at + 0.2)
            .fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, at);
        }
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }
}
