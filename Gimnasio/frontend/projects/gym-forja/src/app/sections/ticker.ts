import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { prefersReducedMotion, useGsap } from '../core/motion';

/** Dos franjas cruzadas tipo cinta de obra. Se aceleran con la velocidad del scroll. */
@Component({
  selector: 'app-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" aria-label="Sin ego, sin excusas, con todo">
      <div class="band band-back" aria-hidden="true">
        <div class="track">
          @for (c of [0, 1]; track c) {
            <div class="set">
              @for (w of back; track w) {
                <span>{{ w }}</span><i>✕</i>
              }
            </div>
          }
        </div>
      </div>
      <div class="band band-front" aria-hidden="true">
        <div class="track">
          @for (c of [0, 1]; track c) {
            <div class="set">
              @for (w of front; track w) {
                <span>{{ w }}</span><i>✕</i>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .wrap { position: relative; height: clamp(150px, 18vw, 220px); overflow: hidden; display: grid; place-items: center; }
    .band { position: absolute; left: -5%; right: -5%; overflow: hidden; }
    .band-front { background: var(--ember); color: var(--bg); transform: rotate(-3deg); padding: 14px 0; z-index: 2; box-shadow: 0 20px 40px -20px rgb(0 0 0 / 80%); }
    .band-back { background: var(--bg-3); transform: rotate(2.5deg); padding: 12px 0; }
    .track { display: flex; width: max-content; }
    .set { display: flex; align-items: center; gap: 28px; padding-right: 28px; }
    span { font-family: var(--font-display); font-size: clamp(2rem, 4.2vw, 3.6rem); line-height: 1; text-transform: uppercase; white-space: nowrap; }
    .band-back span { color: transparent; -webkit-text-stroke: 1px var(--muted); }
    i { font-style: normal; font-size: 1.4rem; }
    .band-back i { color: var(--ember); }
  `,
})
export class Ticker {
  protected readonly front = ['Sin ego', 'Sin excusas', 'Con todo', 'Comunidad', 'Técnica primero'];
  protected readonly back = ['Gente real', 'Disciplina real', 'Uno de los nuestros', 'Hierro y sudor'];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const { gsap, ScrollTrigger } = useGsap();
      const [back, front] = Array.from(host.querySelectorAll<HTMLElement>('.track'));
      const loops = [
        gsap.to(front, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 }),
        gsap.fromTo(back, { xPercent: -50 }, { xPercent: 0, duration: 40, ease: 'none', repeat: -1 }),
      ];
      if (prefersReducedMotion()) {
        loops.forEach((l) => l.pause());
        return;
      }
      const st = ScrollTrigger.create({
        trigger: host,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 6);
          loops.forEach((l) => {
            l.timeScale(boost);
            gsap.to(l, { timeScale: 1, duration: 0.9, ease: 'power2.out', overwrite: true });
          });
        },
      });
      destroyRef.onDestroy(() => {
        st.kill();
        loops.forEach((l) => l.kill());
      });
    });
  }
}
