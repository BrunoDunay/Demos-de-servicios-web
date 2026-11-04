import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DISCIPLINES } from '../core/content';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { PlayInView } from '../shared/in-view-video';

/**
 * Encabezado de Disciplinas: tres puertas en arco, una por disciplina, con su video adentro.
 * Entran desde abajo como si se abrieran; la que está bajo el cursor se ensancha, se enciende y
 * muestra sus datos, y al hacer clic baja a la sección de esa disciplina.
 */
@Component({
  selector: 'app-disciplines-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PlayInView],
  template: `
    <header class="hero">
      <div class="glow" aria-hidden="true"></div>
      <div class="container top">
        <nav class="crumbs" aria-label="Migas de pan"><a routerLink="/">Inicio</a><span>/</span><span>Disciplinas</span></nav>
        <div class="head">
          <div>
            <span class="label kicker">Disciplinas</span>
            <h1 class="title">Muévete con <em class="gold">intención.</em></h1>
          </div>
          <p class="lead sub">Siete formas de entrenar, una misma filosofía: grupos pequeños, técnica cuidada y un espacio que te hace bajar las revoluciones.</p>
        </div>
      </div>

      <div class="container doors" (pointerleave)="open.set(-1)">
        @for (d of items; track d.id; let i = $index) {
          <button
            type="button"
            class="door"
            [class.is-open]="open() === i"
            [class.is-dim]="open() !== -1 && open() !== i"
            (pointerenter)="open.set(i)"
            (focus)="open.set(i)"
            (blur)="open.set(-1)"
            (click)="go(d.id)"
            [attr.aria-label]="'Ir a ' + d.name"
            data-cursor="Entrar"
          >
            <span class="outline" aria-hidden="true"></span>
            <span class="frame">
              <span class="media">
                @if (d.vert) {
                  <video [playInView]="'media/' + d.vert + '.mp4'" [attr.poster]="'media/' + d.vert + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
                } @else {
                  <img class="warm" [src]="'media/' + d.img + '-sm.webp'" alt="" />
                  <span class="stage" aria-hidden="true"><i></i><i></i><i></i></span>
                }
              </span>
              <span class="shade"></span>
              <span class="num">0{{ i + 1 }}</span>
              <span class="meta">
                <b class="name">{{ d.name }}</b>
                <em class="tag">{{ d.tagline }}</em>
                <span class="specs">
                  @for (s of d.specs; track s[0]) {
                    <span><small>{{ s[0] }}</small>{{ s[1] }}</span>
                  }
                </span>
              </span>
            </span>
          </button>
        }
      </div>
    </header>
  `,
  styles: `
    .hero { position: relative; height: max(100svh, 760px); padding: 124px 0 56px; display: flex; flex-direction: column; gap: clamp(28px, 4.5vh, 52px); overflow: hidden; }
    .glow { position: absolute; left: 50%; bottom: -30%; width: 120vw; height: 90%; translate: -50% 0; background: radial-gradient(ellipse at 50% 60%, rgb(243 213 161 / 13%), transparent 62%); pointer-events: none; }
    .top { position: relative; }
    .crumbs { display: flex; gap: 10px; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 22px; }
    .crumbs a { transition: color 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .crumbs a:hover { color: var(--gold); } }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; flex-wrap: wrap; }
    .title { margin-top: 16px; font-size: clamp(3rem, 6.2vw, 6.6rem); line-height: 0.92; }
    .sub { max-width: 380px; }

    .doors { position: relative; flex: 1; min-height: 340px; display: flex; gap: clamp(12px, 1.6vw, 22px); }
    .door { position: relative; flex: 1; min-width: 0; padding: 0; text-align: left; color: inherit; transition: flex 1s var(--ease-out), opacity 700ms ease, scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .door:active { scale: 0.985; }
    .door.is-open { flex: 3.2; }
    .door.is-dim { opacity: 0.55; }
    .outline { position: absolute; inset: -9px -9px 0; border: 1px solid rgb(216 185 138 / 0%); border-bottom: 0; border-radius: 1000px 1000px 0 0; transition: border-color 700ms ease, inset 900ms var(--ease-out); pointer-events: none; }
    .door.is-open .outline { border-color: rgb(216 185 138 / 55%); inset: -14px -14px 0; }
    .frame { position: absolute; inset: 0; overflow: hidden; border-radius: 1000px 1000px 0 0; background: var(--bg-3); isolation: isolate; }
    .media { position: absolute; inset: 0; }
    .media img, .media video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); filter: brightness(0.72) saturate(0.85); transition: transform 1.6s var(--ease-out), filter 900ms ease; }
    .door.is-open .media img, .door.is-open .media video { transform: scale(1); filter: brightness(1) saturate(1.05); }
    .stage { position: absolute; inset: 0; mix-blend-mode: screen; pointer-events: none; }
    .stage i { position: absolute; left: 50%; top: -10%; width: 70%; height: 120%; translate: -50% 0; transform-origin: 50% 0; background: linear-gradient(180deg, rgb(243 196 140 / 34%), transparent 70%); clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%); filter: blur(8px); animation: sweep 6s ease-in-out infinite; }
    .stage i:nth-child(2) { background: linear-gradient(180deg, rgb(201 123 90 / 34%), transparent 70%); animation-duration: 8s; animation-delay: -3s; }
    .stage i:nth-child(3) { background: linear-gradient(180deg, rgb(255 232 196 / 22%), transparent 60%); animation-duration: 5s; animation-delay: -1.5s; }
    @keyframes sweep { 0%, 100% { rotate: -24deg; opacity: 0.4; } 50% { rotate: 24deg; opacity: 1; } }
    .shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgb(13 12 10 / 92%) 4%, rgb(13 12 10 / 20%) 50%, transparent 70%); }
    .num { position: absolute; top: 18%; left: 50%; translate: -50% 0; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.26em; color: var(--gold); }
    .meta { position: absolute; left: clamp(18px, 2.2vw, 32px); right: clamp(18px, 2.2vw, 32px); bottom: clamp(20px, 3vh, 32px); display: flex; flex-direction: column; gap: 8px; }
    .name { font-family: var(--font-display); font-weight: 400; font-size: clamp(1.5rem, 2.2vw, 2.4rem); line-height: 1; transition: color 500ms ease, font-size 600ms var(--ease-out); }
    .door.is-open .name { font-size: clamp(2.2rem, 3.4vw, 3.4rem); }
    .door.is-open .name { color: var(--glow); }
    .tag { font-family: var(--font-display); font-size: 1.2rem; color: var(--gold); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .specs { display: flex; gap: 26px; margin-top: 8px; padding-top: 14px; border-top: 1px solid var(--line-2); font-family: var(--font-display); font-size: 1.3rem; }
    .specs small { display: block; font-family: var(--font-body); font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
    .tag, .specs { opacity: 0; transform: translateY(14px); transition: opacity 500ms ease, transform 800ms var(--ease-out); }
    .door.is-open .tag, .door.is-open .specs { opacity: 1; transform: none; transition-delay: 220ms; }
    .door:focus-visible { outline: none; }
    .door:focus-visible .outline { border-color: var(--gold); }

    @media (hover: none), (max-width: 800px) {
      .tag, .specs { opacity: 1; transform: none; }
      .media img, .media video { filter: none; }
    }
    @media (max-width: 800px) {
      .hero { height: auto; padding-top: 130px; }
      .doors { display: grid; grid-auto-flow: column; grid-auto-columns: 76%; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--gutter); scrollbar-width: none; height: 66svh; margin-inline: 0; padding-top: 14px; }
      .doors::-webkit-scrollbar { display: none; }
      .door { scroll-snap-align: start; }
      .door.is-dim { opacity: 1; }
      .specs { gap: 14px; font-size: 1rem; white-space: nowrap; }
      .meta { left: 16px; right: 16px; }
    }
  `,
})
export class DisciplinesHero {
  protected readonly items = DISCIPLINES;
  protected readonly open = signal(-1);
  private readonly motion = inject(Motion);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap, SplitText } = useGsap();
      const q = gsap.utils.selector(host);
      let split: { chars: Element[]; revert(): void } | undefined;
      const ctx = gsap.context(() => {
        // Las puertas suben y se "abren" de abajo hacia arriba, una tras otra.
        gsap.fromTo(q('.frame'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', stagger: 0.14, delay: 0.25, clearProps: 'clipPath' });
        // La entrada usa "y" (px) y el parallax "yPercent": GSAP los guarda por separado y no chocan.
        gsap.from(q('.door'), { y: 110, duration: 1.8, ease: 'expo.out', stagger: 0.14, delay: 0.25 });
        gsap.from(q('.media'), { scale: 1.35, duration: 2.4, ease: 'expo.out', stagger: 0.14, delay: 0.3 });
        gsap.from(q('.meta'), { opacity: 0, y: 24, duration: 1, ease: 'power3.out', stagger: 0.14, delay: 1.1 });
        gsap.from(q('.crumbs, .kicker, .sub'), { opacity: 0, y: 20, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        // Al salir, cada puerta se desplaza a su propio ritmo.
        const doors = q('.door');
        [-6, -14, -4].forEach((y, i) => doors[i] && gsap.to(doors[i], { yPercent: y, ease: 'none', scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true } }));
        gsap.to(q('.top'), { yPercent: -40, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true } });
      }, host);
      document.fonts.ready.then(() => {
        split = SplitText.create(q('.title')[0], { type: 'chars,words', mask: 'words' });
        gsap.from(split.chars, { yPercent: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.25 });
      });
      destroyRef.onDestroy(() => {
        ctx.revert();
        split?.revert();
      });
    });
  }

  protected go(id: string) {
    const el = document.getElementById(id);
    if (el) this.motion.scrollTo(el);
  }
}
