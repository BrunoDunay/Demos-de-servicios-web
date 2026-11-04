import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Carrusel que se arrastra con el mouse, con inercia (en celular ya lo hace el scroll nativo).
 * - Mientras se arrastra, el contenido sigue al cursor 1:1.
 * - Al soltar, proyecta la inercia (fórmula de Apple) y deja que el scroll-snap elija la tarjeta.
 * - Un arrastre no se cuenta como clic en las tarjetas.
 * Uso: <ul dragScroll> en un contenedor con overflow-x: auto.
 */
@Directive({ selector: '[dragScroll]', host: { class: 'drag-scroll' } })
export class DragScroll {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let id: number | null = null;
      let startX = 0;
      let startLeft = 0;
      let moved = false;
      let history: { x: number; t: number }[] = [];
      let snap = '';

      const down = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        if (el.scrollWidth <= el.clientWidth) return;
        id = e.pointerId;
        startX = e.clientX;
        startLeft = el.scrollLeft;
        moved = false;
        history = [{ x: e.clientX, t: e.timeStamp }];
      };

      const move = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        const dx = e.clientX - startX;
        if (!moved) {
          if (Math.abs(dx) < 6) return;
          moved = true;
          el.setPointerCapture(e.pointerId);
          // Sin snap mientras se arrastra, para que siga al cursor sin tirones
          snap = el.style.scrollSnapType;
          el.style.scrollSnapType = 'none';
          el.style.scrollBehavior = 'auto';
          el.classList.add('is-dragging');
        }
        el.scrollLeft = startLeft - dx;
        history.push({ x: e.clientX, t: e.timeStamp });
        if (history.length > 6) history.shift();
      };

      const up = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        id = null;
        if (!moved) return;
        el.classList.remove('is-dragging');
        const a = history[0];
        const b = history[history.length - 1];
        const v = b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
        const projected = ((v / 1000) * 0.998) / (1 - 0.998);
        const reduce = document.documentElement.classList.contains('reduce-motion');
        el.style.scrollSnapType = snap;
        el.style.scrollBehavior = '';
        el.scrollTo({ left: el.scrollLeft - projected, behavior: reduce ? 'auto' : 'smooth' });
        // El arrastre no debe abrir la tarjeta sobre la que se soltó
        const stop = (ev: Event) => (ev.stopPropagation(), ev.preventDefault());
        el.addEventListener('click', stop, { capture: true, once: true });
        setTimeout(() => el.removeEventListener('click', stop, { capture: true }), 0);
      };

      // Las imágenes y enlaces no deben "arrastrarse" como archivo
      const noNativeDrag = (e: DragEvent) => e.preventDefault();

      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('dragstart', noNativeDrag);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.removeEventListener('dragstart', noNativeDrag);
      });
    });
  }
}
