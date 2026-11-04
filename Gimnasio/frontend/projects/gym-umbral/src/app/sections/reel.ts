import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { prefersReducedMotion, useGsap } from '../core/motion';

/** Tira de fotos continua (como un carrete) que se acelera con la velocidad del scroll. */
@Component({
  selector: 'app-reel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="reel" aria-label="Momentos en Umbral">
      <div class="track">
        @for (c of [0, 1]; track c) {
          <div class="set" [attr.aria-hidden]="c === 1">
            @for (img of images; track img; let i = $index) {
              <figure [class.tall]="i % 3 === 1"><img class="warm" [src]="'media/' + img + '-sm.webp'" alt="" loading="lazy" /></figure>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .reel { padding: 20px 0 var(--section); overflow: hidden; }
    .track { display: flex; width: max-content; }
    .set { display: flex; align-items: center; gap: 18px; padding-right: 18px; }
    figure { margin: 0; width: clamp(200px, 20vw, 300px); aspect-ratio: 4 / 5; overflow: hidden; }
    figure.tall { aspect-ratio: 3 / 4.6; }
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease-out), filter 600ms ease; }
    @media (hover: hover) and (pointer: fine) { figure:hover img { transform: scale(1.08); filter: none; } }
  `,
})
export class Reel {
  protected readonly images = ['ride-led', 'toallas', 'reformer-clase', 'gym-sala', 'spa', 'ride-sombra', 'niebla', 'mancuernas', 'gym-ventanal', 'velas'];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap, ScrollTrigger } = useGsap();
      const loop = gsap.to(host.querySelector('.track'), { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
      const st = ScrollTrigger.create({
        trigger: host,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          loop.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 200, 8));
          gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true });
        },
      });
      host.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: 0.15, duration: 0.8, overwrite: true }));
      host.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true }));
      destroyRef.onDestroy(() => {
        st.kill();
        loop.kill();
      });
    });
  }
}
