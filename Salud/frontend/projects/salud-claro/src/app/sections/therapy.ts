import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FIRST_SESSION, MYTHS, SERVICES } from '../core/content';
import { CHAIRS, torn } from '../core/doodles';
import { Practice, money } from '../core/practice';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Arrow } from '../shared/magnetic';
import { Reveal } from '../shared/reveal';

/** Raya a mano para tachar un mito. */
const STRIKE = 'M4 30 C 40 18, 80 40, 120 22 S 190 30, 236 16 M10 46 C 60 34, 120 56, 230 36';

/**
 * Terapia: cuatro tarjetas de collage (foto entonada en azul, orilla rasgada y cinta; al pasar el cursor se
 * enderezan y suben). "La primera sesión" escrita a mano con los sillones de la referencia, que se dibujan
 * al bajar. Mitos en notas adhesivas: al tocarlas, el mito se tacha a mano y aparece la realidad.
 */
@Component({
  selector: 'app-therapy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Arrow],
  template: `
    <section class="section" id="terapia">
      <div class="page">
        <header class="head">
          <p class="kicker" data-reveal>Terapia</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Cuatro formas de <span class="sage">acompañarte.</span></h2>
        </header>
        <div class="services">
          @for (s of services; track s.id; let i = $index) {
            <button type="button" class="card t-learn" [style.--r]="rot[i]" (click)="practice.book(reasonFor(s.id))" data-reveal [revealDelay]="i * 90">
              <span class="tape"></span>
              <span class="pic" [style.clip-path]="tears[i]"><img [src]="'media/' + s.photo + '-sm.webp'" [alt]="s.title" width="820" height="547" loading="lazy" /></span>
              <span class="body">
                <span class="title">{{ s.title }}</span>
                <span class="text">{{ s.text }}</span>
                <span class="foot"><b>{{ money(s.price) }}</b> por sesión <span class="go">Agendar <app-arrow /></span></span>
              </span>
            </button>
          }
        </div>

        <div class="first" #first>
          <div class="drawing" data-reveal>
            <h3 class="hand">La primera<br />sesión</h3>
            <svg class="chairs" viewBox="0 0 360 220" aria-hidden="true">
              @for (d of chairs; track $index) {
                <path [attr.d]="d" />
              }
            </svg>
            <p class="caption hand">es un puente entre tu mundo interno y la terapeuta.</p>
          </div>
          <ol class="steps">
            @for (f of firstSession; track f.t; let i = $index) {
              <li data-reveal [revealDelay]="i * 100"><span class="n">{{ i + 1 }}</span><div><b>{{ f.t }}</b><p>{{ f.d }}</p></div></li>
            }
          </ol>
        </div>

        <div class="myths">
          <h3 class="myths-title" data-reveal>Lo que se dice <span class="hand">(toca una nota)</span></h3>
          <div class="notes">
            @for (m of myths; track m.myth; let i = $index) {
              <button type="button" class="note" [class.on]="flipped().has(i)" [style.--r]="rot[(i + 1) % 4]" [style.--c]="noteColors[i]" (click)="flip(i)" [attr.aria-pressed]="flipped().has(i)" data-reveal [revealDelay]="i * 80">
                <small>Mito</small>
                <span class="myth">{{ m.myth }}<svg viewBox="0 0 240 60" preserveAspectRatio="none" aria-hidden="true"><path [attr.d]="strike" pathLength="1" /></svg></span>
                <span class="truth hand">{{ m.truth }}</span>
                <span class="tap hand" aria-hidden="true">{{ flipped().has(i) ? '' : 'tócame ↺' }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 18px; }
    .services { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 54px; }
    .card { position: relative; display: grid; grid-template-rows: auto 1fr; padding: 12px 12px 18px; text-align: left; background: var(--card); box-shadow: var(--shadow-paper); rotate: var(--r); transition: rotate 500ms var(--ease-bounce), translate 500ms var(--ease-bounce), box-shadow 400ms ease, scale 160ms var(--ease-out); }
    .card .tape { top: -12px; left: 50%; translate: -50% 0; rotate: -4deg; transition: rotate 500ms var(--ease-bounce); }
    .card:active { scale: 0.98; }
    @media (hover: hover) and (pointer: fine) {
      .card:hover { rotate: 0deg; translate: 0 -8px; box-shadow: var(--shadow-lift); }
      .card:hover .tape { rotate: 3deg; }
      .card:hover .pic img { scale: 1.06; filter: grayscale(0.2) contrast(1.05); }
    }
    .pic { display: block; aspect-ratio: 4 / 3.2; overflow: hidden; background: var(--dusty); }
    .pic img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.08); mix-blend-mode: multiply; transition: scale 900ms var(--ease-smooth-out), filter 600ms ease; }
    .body { display: grid; gap: 8px; padding: 14px 6px 0; }
    .title { font-family: var(--font-display); font-stretch: 75%; font-size: 1.9rem; font-weight: 800; line-height: 0.95; text-transform: uppercase; }
    .text { font-size: 0.94rem; color: var(--ink-2); }
    .foot { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; margin-top: 6px; font-size: 0.86rem; color: var(--muted); }
    .foot b { font-family: var(--font-display); font-stretch: 75%; font-size: 1.6rem; color: var(--peach-deep); }
    .go { display: inline-flex; align-items: center; gap: 4px; margin-left: auto; font-weight: 700; color: var(--ink); }
    .first { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(30px, 6vw, 90px); align-items: center; margin-top: var(--section); }
    .drawing { position: relative; padding: clamp(24px, 4vw, 48px); background: var(--card); box-shadow: var(--shadow-paper); rotate: -1deg; }
    .drawing h3 { font-size: clamp(3.4rem, 7vw, 5.2rem); color: var(--ink); }
    .chairs { width: 100%; margin-top: 10px; overflow: visible; }
    .chairs path { fill: none; stroke: var(--ink); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .caption { margin-top: 6px; text-align: right; font-size: 1.6rem; color: var(--dusty); }
    .steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 26px; }
    .steps li { display: flex; gap: 18px; }
    .n { flex: none; display: grid; place-items: center; width: 54px; height: 54px; font-family: var(--font-hand); font-size: 2rem; font-weight: 700; color: var(--peach-deep); border: 2px solid var(--peach); border-radius: 50% 46% 52% 48%; rotate: -6deg; }
    .steps b { font-family: var(--font-display); font-stretch: 75%; font-size: 1.7rem; font-weight: 800; text-transform: uppercase; }
    .steps p { color: var(--ink-2); }
    .myths { margin-top: var(--section); display: grid; gap: 22px; }
    .myths-title { font-size: clamp(2.2rem, 4vw, 3.4rem); text-transform: uppercase; }
    .myths-title .hand { font-size: 0.6em; text-transform: none; color: var(--sage-deep); }
    .notes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
    .note { position: relative; display: grid; align-content: start; gap: 10px; min-height: 230px; padding: 22px; text-align: left; background: var(--c); box-shadow: var(--shadow-paper); rotate: var(--r); transition: rotate 450ms var(--ease-bounce), translate 450ms var(--ease-bounce), scale 160ms var(--ease-out); }
    .note:active { scale: 0.97; }
    @media (hover: hover) and (pointer: fine) { .note:hover { rotate: 0deg; translate: 0 -6px; } }
    .note small { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-2); }
    .myth { position: relative; font-family: var(--font-display); font-stretch: 75%; font-size: 1.7rem; font-weight: 700; line-height: 1.05; }
    .myth svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .myth path { fill: none; stroke: var(--peach-deep); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 500ms var(--ease-smooth-out); }
    .note.on .myth path { stroke-dashoffset: 0; }
    .note.on .myth { opacity: 0.55; }
    .truth { font-size: 1.45rem; line-height: 1.15; color: var(--ink); opacity: 0; translate: 0 10px; filter: blur(3px); transition: opacity 500ms var(--ease-smooth-out) 250ms, translate 500ms var(--ease-smooth-out) 250ms, filter 500ms ease 250ms; }
    .note.on .truth { opacity: 1; translate: none; filter: none; }
    .tap { position: absolute; right: 18px; bottom: 14px; font-size: 1.3rem; color: var(--ink-2); opacity: 0.7; }
    @media (max-width: 1020px) { .services, .notes { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 900px) { .first { grid-template-columns: 1fr; } }
    @media (max-width: 560px) { .services, .notes { grid-template-columns: 1fr; } }
  `,
})
export class Therapy {
  protected readonly practice = inject(Practice);
  protected readonly services = SERVICES;
  protected readonly firstSession = FIRST_SESSION;
  protected readonly myths = MYTHS;
  protected readonly chairs = CHAIRS;
  protected readonly strike = STRIKE;
  protected readonly rot = ['-2deg', '1.6deg', '-1.2deg', '2.2deg'];
  protected readonly tears = [11, 12, 13, 14].map((s) => torn(s, 1.4));
  protected readonly noteColors = ['var(--peach-soft)', 'var(--sage-soft)', 'var(--dusty-soft)', 'var(--paper-2)'];
  protected readonly flipped = signal(new Set<number>());
  protected readonly money = money;
  private readonly firstEl = viewChild.required<ElementRef<HTMLElement>>('first');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      // Los sillones se dibujan al bajar (cada trazo con su largo real)
      const { gsap } = useGsap();
      const paths = Array.from(this.firstEl().nativeElement.querySelectorAll<SVGPathElement>('.chairs path'));
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tween = gsap.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: 0.25, scrollTrigger: { trigger: this.firstEl().nativeElement, start: 'top 75%', end: 'center 45%', scrub: 0.6 } });
      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });
  }

  protected flip(i: number) {
    const s = new Set(this.flipped());
    if (s.has(i)) s.delete(i);
    else s.add(i);
    this.flipped.set(s);
  }

  protected reasonFor(id: string) {
    return { individual: 'Terapia individual', pareja: 'Terapia de pareja', adolescentes: 'Adolescentes', linea: 'Terapia individual' }[id] ?? 'Terapia individual';
  }
}
