import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Video que solo se descarga cuando está por entrar en pantalla y se pausa al salir.
 * Uso: <video playInView="media/v-reformer.mp4" poster="media/v-reformer-poster.jpg" muted loop playsinline></video>
 * Con [hoverOnly]="true" solo se reproduce mientras el cursor está encima del contenedor indicado.
 */
@Directive({ selector: 'video[playInView]' })
export class PlayInView {
  readonly playInView = input.required<string>();
  /** Selector del contenedor que activa la reproducción al pasar el cursor (opcional). */
  readonly hoverRoot = input<string>('');

  constructor() {
    const video = inject<ElementRef<HTMLVideoElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      video.muted = true;
      video.playsInline = true;
      let visible = false;
      let hovered = !this.hoverRoot();
      const load = () => {
        if (!video.getAttribute('src')) {
          video.src = this.playInView();
          video.load();
        }
      };
      const sync = () => {
        if (visible && hovered) {
          load();
          video.play().catch(() => {});
        } else video.pause();
      };
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
          if (visible) load();
          sync();
        },
        { rootMargin: '200px 0px' },
      );
      io.observe(video);
      const root = this.hoverRoot() ? video.closest<HTMLElement>(this.hoverRoot()) : null;
      const enter = () => {
        hovered = true;
        sync();
      };
      const leave = () => {
        hovered = false;
        sync();
      };
      // En pantallas táctiles no hay cursor: se reproduce al verse.
      const touch = !matchMedia('(hover: hover)').matches;
      if (root && !touch) {
        root.addEventListener('pointerenter', enter);
        root.addEventListener('pointerleave', leave);
      } else hovered = true;
      destroyRef.onDestroy(() => {
        io.disconnect();
        root?.removeEventListener('pointerenter', enter);
        root?.removeEventListener('pointerleave', leave);
      });
    });
  }
}
