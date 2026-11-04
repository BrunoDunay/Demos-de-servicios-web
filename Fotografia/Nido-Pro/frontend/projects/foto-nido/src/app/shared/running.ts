import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { Album } from '../core/booking';
import { useGsap } from '../core/motion';

/** Cuando la sección cruza la mitad de la pantalla, su título pasa al cabezal del encabezado. */
@Directive({ selector: '[running]' })
export class Running {
  readonly running = input.required<string>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const album = inject(Album);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const { ScrollTrigger } = useGsap();
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && album.running.set(this.running()),
      });
      destroyRef.onDestroy(() => st.kill());
    });
  }
}

/** La foto se mueve un poco más lento que la página (parallax suave dentro de su marco). */
@Directive({ selector: '[drift]' })
export class Drift {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (document.documentElement.classList.contains('reduce-motion')) return;
      const { gsap } = useGsap();
      const img = el.querySelector('img');
      if (!img) return;
      const tween = gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });
  }
}
