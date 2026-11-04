import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';

/**
 * Intro de "revelado": en la luz roja del cuarto oscuro aparece la copia de la portada como
 * negativo y se revela poco a poco (de negativo borroso a positivo nítido). Al terminar, el
 * cuarto se aclara y queda exactamente la misma copia que muestra la portada debajo.
 * Viene en el HTML prerenderizado; si el JS no carga, una animación CSS la retira a los 5 s.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="intro" #root aria-hidden="true">
        <div class="print">
          <img src="media/nb-manta.webp" alt="" width="1400" height="2097" />
        </div>
        <p class="status"><span class="word">Revelando</span> <span class="time">00:00</span></p>
        <p class="mark">Nido · Inés Calvo, fotógrafa</p>
        <button type="button" class="skip" (click)="skip()" tabindex="-1">Saltar</button>
      </div>
    }
  `,
  styles: `
    .intro { position: fixed; inset: 0; z-index: 200; background: oklch(20% 0.05 28); color: oklch(72% 0.12 32); animation: fallback-out 600ms ease 5s forwards; }
    .intro.is-running { animation: none; }
    @keyframes fallback-out { to { opacity: 0; visibility: hidden; } }
    /* Misma caja que la primera página del álbum en la portada */
    .print { position: absolute; left: 50%; top: 50%; width: var(--print-w); height: var(--print-h); translate: -50% -50%; overflow: hidden; }
    .print img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; filter: invert(1) grayscale(1) contrast(0.8) blur(8px); opacity: 0.2; }
    .status { position: absolute; left: 0; right: 0; bottom: clamp(30px, 6vh, 60px); text-align: center; font-family: var(--font-display); font-style: italic; font-size: 1.4rem; }
    .time { margin-left: 12px; font-family: var(--font-body); font-style: normal; font-size: 0.8rem; letter-spacing: 0.16em; font-variant-numeric: tabular-nums; }
    .mark { position: absolute; left: var(--gutter); top: 30px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }
    .skip { position: absolute; right: var(--gutter); top: 24px; padding: 6px 0; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: inherit; opacity: 0.8; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .skip:active { scale: 0.95; }
  `,
})
export class Intro {
  private readonly motion = inject(Motion);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  protected readonly visible = signal(true);
  private timeline?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.play());
  }

  private play() {
    const root = this.root()?.nativeElement;
    if (!root) return this.finish();
    const { gsap } = useGsap();
    root.classList.add('is-running');
    this.motion.stop();
    if (prefersReducedMotion()) {
      gsap.to(root, { autoAlpha: 0, duration: 0.4, delay: 0.2, onComplete: () => this.finish() });
      return;
    }
    const q = gsap.utils.selector(root);
    const img = q('.print img');
    const time = root.querySelector<HTMLElement>('.time')!;
    const clock = { s: 0 };
    const tl = gsap.timeline({ onComplete: () => this.finish() });
    this.timeline = tl;
    tl.to(img, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0)
      // El reloj del revelador avanza más rápido que el tiempo real
      .to(clock, { s: 45, duration: 2.1, ease: 'none', onUpdate: () => (time.textContent = `00:${String(Math.round(clock.s)).padStart(2, '0')}`) }, 0)
      // Negativo → positivo
      .to(img, { filter: 'invert(0) grayscale(0.6) contrast(1) blur(2px)', duration: 1.3, ease: 'power2.inOut' }, 0.3)
      .to(img, { filter: 'invert(0) grayscale(0) contrast(1) blur(0px)', duration: 0.8, ease: 'power2.out' }, 1.5)
      .call(() => (root.querySelector('.word')!.textContent = 'Fijado'), [], 2.1)
      // Se prende la luz: el cuarto pasa a papel y la copia queda igual que en la portada
      .addLabel('light', 2.35)
      .to(q('.status, .mark, .skip'), { opacity: 0, duration: 0.3 }, 'light')
      .call(() => this.motion.introDone.set(true), [], 'light+=0.15')
      .to(root, { backgroundColor: 'rgba(246,241,234,0)', duration: 0.7, ease: 'power2.out' }, 'light+=0.1');
  }

  protected skip() {
    this.timeline?.kill();
    this.finish();
  }

  private finish() {
    this.motion.introDone.set(true);
    this.motion.resume();
    this.visible.set(false);
  }
}
