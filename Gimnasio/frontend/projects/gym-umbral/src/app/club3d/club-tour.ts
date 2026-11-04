import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { Motion, hasFinePointer, useGsap } from '../core/motion';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ZONES } from './rooms';

// Todas las escenas en orden, con su zona y si abren una zona nueva.
const VIEWS = ZONES.flatMap((z, zi) => z.views.map((v, k) => ({ ...v, zone: zi, first: k === 0 })));
const FIRST = ZONES.map((_, zi) => VIEWS.findIndex((v) => v.zone === zi));
// Cada escena ocupa una unidad de la línea de tiempo: entra en sus primeros 0.4 y luego se queda.
const IN = 0.4;
const HOLD = 0.6;
const DURATION = VIEWS.length - 1 + HOLD;

/**
 * Recorrido del club en escenas: la sección se fija y el scroll avanza foto por foto. La foto ocupa
 * la mitad derecha y se funde con el fondo; el texto de la zona y de la escena queda a la izquierda.
 * - Al entrar a una zona, la foto nueva se abre en forma de arco (el umbral de la marca).
 * - Dentro de la misma zona, entra de derecha a izquierda con una franja de luz cálida en el borde.
 * - Mientras se queda, la foto se acerca y se desplaza despacio, y sigue un poco al cursor.
 */
@Component({
  selector: 'app-club-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="tour" #root aria-label="Recorrido por el club">
      <div class="pin">
        <div class="stage" #stage>
          <div class="stage-in" #stageIn>
            @for (v of views; track v.id; let i = $index) {
              <figure class="scene">
                <img
                  [attr.src]="near()[i] ? 'media/club3/' + v.id + '.webp' : null"
                  [attr.srcset]="near()[i] ? 'media/club3/' + v.id + '-sm.webp 1000w, media/club3/' + v.id + '.webp 2400w' : null"
                  sizes="(max-width: 900px) 100vw, 64vw"
                  [style.object-position]="(v.focus?.[0] ?? 50) + '% ' + (v.focus?.[1] ?? 50) + '%'"
                  [alt]="v.title"
                  decoding="async"
                />
                <span class="shade"></span>
              </figure>
            }
          </div>
          <span class="flare" #flare aria-hidden="true"></span>
          <div class="fade"></div>
        </div>

        <div class="ui container">
          <h1 class="visually-hidden">El club Umbral: recorrido por los espacios</h1>
          <header class="top">
            <span class="label">Recorre el club<span class="long"> · desliza para avanzar</span></span>
          </header>

          <div class="copy">
            @for (z of [zones[active()]]; track z.id) {
              <div class="zone-in">
                <span class="kicker">0{{ active() + 1 }} · {{ z.kicker }}</span>
                <h2 class="name">{{ z.name }}</h2>
                <p class="text">{{ z.text }}</p>
              </div>
            }
            @for (v of [views[view()]]; track v.id) {
              <div class="scene-in">
                <div class="scene-head">
                  <span class="num">{{ pad(view() + 1) }}<i>/ {{ views.length }}</i></span>
                  <span class="rule"></span>
                </div>
                <h3 class="title"><span>{{ v.title }}</span></h3>
                <p class="note">{{ v.note }}</p>
                <ul>
                  @for (t of v.tags; track t; let k = $index) {
                    <li [style.animation-delay]="320 + k * 90 + 'ms'">{{ t }}</li>
                  }
                </ul>
              </div>
            }
          </div>

          <nav class="stops" aria-label="Zonas del club">
            @for (z of zones; track z.id; let i = $index) {
              <button type="button" [class.on]="active() === i" (click)="go(i)" [attr.aria-current]="active() === i">
                <i></i><span>{{ z.kicker }}</span>
              </button>
            }
          </nav>
          <div class="bar"><i [style.transform]="'scaleX(' + progress() + ')'"></i></div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .tour { position: relative; height: 100svh; }
    .pin { position: relative; height: 100svh; overflow: hidden; background: var(--bg); }
    .stage { position: absolute; top: 0; right: 0; bottom: 0; width: 64vw; overflow: hidden; }
    .stage-in { position: absolute; inset: -14px; }
    .scene { position: absolute; inset: 0; margin: 0; overflow: hidden; background: var(--bg); }
    .scene img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: sepia(0.12) saturate(0.95); will-change: transform; }
    .shade { position: absolute; inset: 0; background: #0b0a08; opacity: 0; pointer-events: none; }
    /* Franja de luz que acompaña el borde en las transiciones dentro de una zona. */
    .flare { position: absolute; top: 0; bottom: 0; left: 100%; width: 22vw; margin-left: -11vw; opacity: 0; pointer-events: none; mix-blend-mode: screen; background: linear-gradient(90deg, transparent, rgb(255 196 128 / 22%) 42%, rgb(255 226 180 / 55%) 50%, rgb(255 196 128 / 22%) 58%, transparent); filter: blur(6px); }
    /* La foto se funde con el fondo hacia el texto, arriba y abajo. */
    .fade { position: absolute; inset: 0; pointer-events: none; background:
      linear-gradient(90deg, var(--bg) 0%, rgb(11 10 8 / 82%) 14%, rgb(11 10 8 / 30%) 34%, transparent 52%),
      linear-gradient(180deg, rgb(11 10 8 / 70%) 0%, transparent 20%, transparent 74%, var(--bg) 100%),
      radial-gradient(ellipse at 70% 50%, transparent 55%, rgb(11 10 8 / 45%) 100%); }

    .ui { position: absolute; inset: 0; z-index: 2; pointer-events: none; display: grid; grid-template-columns: minmax(0, 520px) 1fr auto; grid-template-rows: auto 1fr auto; padding-top: 110px; padding-bottom: 36px; }
    .top { grid-column: 1 / -1; }
    .copy { align-self: center; display: grid; gap: 44px; }
    .zone-in { animation: rise 900ms var(--ease-out) both; }
    .kicker { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: var(--gold); }
    .name { margin-top: 14px; font-size: clamp(3rem, 5.6vw, 5.6rem); line-height: 0.95; }
    .text { margin-top: 18px; max-width: 430px; color: var(--ink-2); font-weight: 300; }
    .scene-head { display: flex; align-items: center; gap: 16px; animation: fade 700ms ease both; }
    .num { font-family: var(--font-display); font-size: 1.5rem; color: var(--gold); }
    .num i { margin-left: 6px; font-style: normal; font-family: var(--font-body); font-size: 0.72rem; letter-spacing: 0.16em; color: var(--muted); }
    .rule { height: 1px; width: 120px; background: linear-gradient(90deg, var(--gold), transparent); transform-origin: left; animation: grow 900ms var(--ease-out) both; }
    .title { margin-top: 12px; font-size: clamp(1.7rem, 2.4vw, 2.3rem); line-height: 1.1; overflow: hidden; }
    .title span { display: inline-block; animation: up 800ms var(--ease-out) 80ms both; }
    .note { margin-top: 10px; max-width: 400px; color: var(--ink-2); font-weight: 300; animation: rise 800ms var(--ease-out) 180ms both; }
    ul { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
    li { padding: 7px 13px; border-radius: 999px; font-size: 0.74rem; color: var(--ink-2); background: rgb(13 12 10 / 55%); box-shadow: inset 0 0 0 1px var(--line-2); backdrop-filter: blur(8px); animation: rise 700ms var(--ease-out) both; }
    @keyframes rise { from { opacity: 0; transform: translateY(22px); filter: blur(6px); } }
    @keyframes up { from { transform: translateY(110%); } }
    @keyframes fade { from { opacity: 0; } }
    @keyframes grow { from { transform: scaleX(0); } }

    .stops { grid-column: 3; align-self: center; display: flex; flex-direction: column; gap: 6px; pointer-events: auto; }
    .stops button { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 8px 0; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgb(239 233 223 / 62%); text-shadow: 0 1px 8px rgb(0 0 0 / 70%); transition: color 400ms ease; }
    .stops i { order: 2; width: 18px; height: 1px; background: currentColor; transition: width 600ms var(--ease-out), background-color 400ms ease; }
    .stops button.on { color: var(--ink); }
    @media (hover: hover) and (pointer: fine) { .stops button:hover { color: var(--ink); } }
    .stops button.on i { width: 42px; background: var(--gold); }
    .bar { grid-column: 1 / -1; height: 1px; margin-top: 28px; background: var(--line-2); overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--gold); transform-origin: left; }

    @media (max-width: 900px) {
      .label .long { display: none; }
      .stage { left: 0; width: auto; bottom: auto; height: 58svh; }
      .fade { background: linear-gradient(180deg, rgb(11 10 8 / 70%) 0%, transparent 24%, transparent 55%, var(--bg) 100%); }
      .ui { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto auto; padding-top: 96px; }
      .copy { align-self: end; gap: 18px; }
      .zone-in .text, ul { display: none; }
      .name { font-size: 2.4rem; }
      .title { font-size: 1.4rem; }
      .note { font-size: 0.92rem; }
      .stops { grid-column: 1; flex-direction: row; flex-wrap: wrap; gap: 4px 16px; margin-top: 18px; }
      .stops button { padding: 6px 0; }
      .stops i { order: 0; }
    }
  `,
})
export class ClubTour {
  private readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly stageIn = viewChild.required<ElementRef<HTMLElement>>('stageIn');
  private readonly flare = viewChild.required<ElementRef<HTMLElement>>('flare');
  protected readonly zones = ZONES;
  protected readonly views = VIEWS;
  protected readonly view = signal(0);
  protected readonly active = computed(() => VIEWS[this.view()].zone);
  protected readonly progress = signal(0);
  // Solo se descargan las fotos cercanas a la escena actual.
  private readonly loaded = signal(new Set([0, 1, 2]));
  protected readonly near = computed(() => VIEWS.map((_, i) => this.loaded().has(i)));
  private trigger?: ScrollTrigger;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const stage = this.stage().nativeElement;
      const flare = this.flare().nativeElement;
      const scenes = Array.from(stage.querySelectorAll<HTMLElement>('.scene'));
      const { gsap, ScrollTrigger } = useGsap();

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        tl.set({}, {}, DURATION);
        scenes.forEach((fig, i) => {
          const img = fig.querySelector('img')!;
          const prev = scenes[i - 1];
          const at = i - IN;
          // Acercamiento lento mientras la escena está a la vista (alterna la dirección).
          const dir = i % 2 ? -1 : 1;
          tl.fromTo(img, { scale: 1.16, xPercent: -2.5 * dir }, { scale: 1.02, xPercent: 2.5 * dir, duration: i === 0 ? 1 : 1 + IN }, Math.max(0, at));
          if (!prev) return;
          if (VIEWS[i].first) {
            // Zona nueva: se abre en arco desde abajo.
            tl.fromTo(fig, { clipPath: 'inset(100% 30% 0% 30% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: IN, ease: 'power2.inOut' }, at);
          } else {
            // Misma zona: barrida de derecha a izquierda con la franja de luz en el borde.
            tl.fromTo(fig, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: IN, ease: 'power2.inOut' }, at);
            tl.fromTo(flare, { left: '100%' }, { left: '0%', duration: IN, ease: 'power2.inOut', immediateRender: false }, at);
            tl.fromTo(flare, { opacity: 0 }, { opacity: 1, duration: IN / 2, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, at);
          }
          // La escena anterior se oscurece y se hunde un poco.
          tl.to(prev.querySelector('.shade'), { opacity: 0.75, duration: IN }, at);
          tl.to(prev, { scale: 1.06, duration: IN }, at);
        });

        this.trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${innerHeight * 0.9 * VIEWS.length}`,
          pin: true,
          anticipatePin: 1,
          animation: tl,
          scrub: 0.9,
          onUpdate: (self) => {
            this.progress.set(self.progress);
            const t = self.progress * DURATION;
            const v = Math.min(VIEWS.length - 1, Math.max(0, Math.floor(t + IN / 2)));
            if (v !== this.view()) this.view.set(v);
            // Descarga la escena actual, la anterior y las dos siguientes.
            const want = [v - 1, v, v + 1, v + 2].filter((k) => k >= 0 && k < VIEWS.length && !this.loaded().has(k));
            if (want.length) this.loaded.update((s) => new Set([...s, ...want]));
          },
        });
      }, root);

      // La foto sigue un poco al cursor.
      let move: ((e: PointerEvent) => void) | undefined;
      if (hasFinePointer()) {
        const qx = gsap.quickTo(this.stageIn().nativeElement, 'x', { duration: 1.2, ease: 'power3.out' });
        const qy = gsap.quickTo(this.stageIn().nativeElement, 'y', { duration: 1.2, ease: 'power3.out' });
        move = (e) => {
          qx((e.clientX / innerWidth - 0.5) * -22);
          qy((e.clientY / innerHeight - 0.5) * -16);
        };
        root.addEventListener('pointermove', move, { passive: true });
      }

      destroyRef.onDestroy(() => {
        if (move) root.removeEventListener('pointermove', move);
        ctx.revert();
      });
    });
  }

  protected pad(n: number) {
    return n < 10 ? '0' + n : String(n);
  }

  protected go(i: number) {
    const st = this.trigger;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (FIRST[i] / DURATION);
    this.motion.scrollTo(y + 1, false, 0);
  }
}
