import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { PROOF, STEPS } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Tilt } from '../shared/tilt';

const STEP_ICONS = ['search', 'file', 'tooth', 'calendar'];
const PROOF_ICONS = ['flame', 'shield', 'heart'];

/**
 * Tu primera visita como flechas de pasos (referencia "5 steps", en escala de azules): entran una tras otra
 * al bajar; al pasar el cursor o tocar una, se abre y muestra su detalle.
 * Debajo, "Lo que no se ve": tarjetas de vidrio azul noche con inclinación 3D y brillo (transitions.dev).
 */
@Component({
  selector: 'app-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Icon, Tilt],
  template: `
    <section class="section" id="primera-visita">
      <div class="page">
        <header class="head">
          <p class="pill" data-reveal>Tu primera visita</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Sin sorpresas, <b>ni en la boca ni en la cuenta</b>.</h2>
        </header>
        <ol class="steps" #steps>
          @for (s of steps_; track s.n; let i = $index) {
            <li [class.open]="open() === i" [style.--i]="i" (pointerenter)="open.set(i)" (click)="open.set(i)">
              <div class="chev">
                <span class="n">{{ s.n }}</span>
                <span class="ico"><app-icon [name]="icons[i]" [size]="22" /></span>
              </div>
              <div class="info">
                <h3>{{ s.title }}</h3>
                <p class="time">{{ s.time }}</p>
                <p class="text">{{ s.text }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section proof">
      <div class="page">
        <header class="head">
          <p class="pill dark" data-reveal>Lo que no se ve</p>
          <h2 class="h2" data-reveal [revealDelay]="80">Limpio de verdad, <b>no solo blanco</b>.</h2>
        </header>
        <div class="cards">
          @for (p of proof; track p.label; let i = $index) {
            <div tilt data-reveal [revealDelay]="i * 110">
              <article class="glass t-tilt-card">
                <p class="tag">Protocolo</p>
                <p class="value">{{ p.value }}<small>{{ p.suffix }}</small></p>
                <p class="label">{{ p.label }}</p>
                <span class="orb"><app-icon [name]="proofIcons[i]" [size]="40" [stroke]="1.5" /></span>
              </article>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: grid; gap: 18px; max-width: 820px; }
    .h2 b { color: var(--royal); }
    .steps { list-style: none; margin: 50px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
    li { --c: color-mix(in oklch, var(--royal), var(--sky) calc(var(--i) * 24%)); display: grid; gap: 22px; cursor: pointer; }
    /* Flecha tipo chevron: un lado entra en la anterior y el otro apunta a la siguiente */
    .chev { position: relative; display: flex; align-items: center; justify-content: space-between; height: 120px; margin-right: -26px; padding: 0 56px 0 52px; color: var(--white); background: var(--c); clip-path: polygon(0 0, calc(100% - 34px) 0, 100% 50%, calc(100% - 34px) 100%, 0 100%, 34px 50%); transition: filter 300ms ease, translate 500ms var(--ease-bounce); }
    li:first-child .chev { clip-path: polygon(0 0, calc(100% - 34px) 0, 100% 50%, calc(100% - 34px) 100%, 0 100%); padding-left: 28px; border-radius: 24px 0 0 24px; }
    .n { font-family: var(--font-display); font-size: 2.8rem; font-weight: 200; line-height: 1; }
    .ico { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; background: oklch(100% 0 0 / 0.18); transition: scale 400ms var(--ease-bounce), background-color 300ms ease; }
    li.open .chev { translate: 0 -8px; filter: brightness(1.08) drop-shadow(0 16px 20px oklch(50% 0.2 263 / 0.35)); }
    li.open .ico { scale: 1.15; background: var(--white); color: var(--c); }
    .info { padding-right: 26px; }
    h3 { font-size: 1.6rem; font-weight: 600; }
    .time { margin-top: 2px; font-size: 0.86rem; font-weight: 650; color: var(--royal); }
    .text { margin-top: 8px; color: var(--ink-2); font-size: 0.96rem; opacity: 0.45; transition: opacity 400ms ease; }
    li.open .text { opacity: 1; }
    .proof { background: linear-gradient(170deg, var(--royal), var(--navy) 70%); color: var(--white); }
    .proof .h2 b { color: var(--sky); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 50px; }
    /* Tarjetas de vidrio de la referencia "Featured": vidrio azul, etiqueta, número grande y un objeto brillante */
    .glass { position: relative; display: grid; align-content: start; gap: 10px; min-height: 300px; padding: 28px; border-radius: var(--radius-l); background: linear-gradient(145deg, oklch(55% 0.17 262 / 0.55), oklch(30% 0.1 264 / 0.55)); backdrop-filter: blur(20px); box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.35), inset 0 0 0 1px oklch(100% 0 0 / 0.14), 0 30px 60px -24px oklch(0% 0 0 / 0.6); overflow: hidden; }
    .tag { width: fit-content; padding: 5px 11px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.3); }
    .value { margin-top: 18px; font-family: var(--font-display); font-size: clamp(3.4rem, 6vw, 4.6rem); font-weight: 600; line-height: 1; letter-spacing: -0.04em; }
    .value small { font-size: 0.45em; font-weight: 400; margin-left: 4px; }
    .label { max-width: 24ch; color: oklch(88% 0.03 250); }
    .orb { position: absolute; right: 22px; top: 22px; display: grid; place-items: center; width: 84px; height: 84px; border-radius: 50%; color: var(--white); background: radial-gradient(circle at 35% 30%, oklch(90% 0.06 240), var(--royal-2) 45%, var(--navy) 100%); box-shadow: inset -6px -8px 18px oklch(20% 0.08 264 / 0.6), inset 4px 6px 12px oklch(100% 0 0 / 0.35), 0 18px 30px -10px oklch(0% 0 0 / 0.55); transform: translateZ(40px); }
    @media (max-width: 960px) {
      .steps { grid-template-columns: 1fr; gap: 14px; }
      li { grid-template-columns: 110px 1fr; align-items: center; gap: 16px; }
      .chev, li:first-child .chev { height: 96px; margin: 0; padding: 0 0 18px; flex-direction: column; justify-content: center; gap: 6px; border-radius: 18px 18px 0 0; clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%); }
      .n { font-size: 2rem; }
      .ico { width: 34px; height: 34px; }
      .text { opacity: 1; }
      .cards { grid-template-columns: 1fr; }
    }
  `,
})
export class Visit {
  protected readonly steps_ = STEPS;
  protected readonly proof = PROOF;
  protected readonly icons = STEP_ICONS;
  protected readonly proofIcons = PROOF_ICONS;
  protected readonly open = signal(0);
  private readonly stepsEl = viewChild.required<ElementRef<HTMLElement>>('steps');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const el = this.stepsEl().nativeElement;
      const tween = gsap.from(el.querySelectorAll('.chev'), {
        xPercent: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });
  }
}
