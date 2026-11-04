import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Inclinación 3D con brillo (transitions.dev, "Card hover tilt"). Uso:
 *   <div tilt><article class="t-tilt-card">…</article></div>
 * El contenedor no se mueve (es la zona que detecta el cursor); la tarjeta interna se inclina hacia el
 * puntero y un brillo la sigue. En celular se inclina al mantener el dedo presionado y arrastrar.
 */
@Directive({ selector: '[tilt]', host: { class: 't-tilt' } })
export class Tilt {
  /** Inclinación máxima en grados en las orillas. */
  readonly tilt = input<number | string>(12);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const card = host.querySelector<HTMLElement>('.t-tilt-card') ?? host;
      if (!card.querySelector('.t-tilt-glare')) {
        const glare = document.createElement('span');
        glare.className = 't-tilt-glare';
        card.appendChild(glare);
      }
      const max = Number(this.tilt()) || 12;
      const reset = () => {
        host.classList.remove('is-hover');
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-rx', '0deg');
        card.style.setProperty('--tilt-ry', '0deg');
      };
      const track = (e: PointerEvent) => {
        if (document.documentElement.classList.contains('reduce-motion')) return;
        if (e.pointerType !== 'mouse' && e.buttons === 0) return;
        const r = host.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        host.classList.add('is-hover');
        card.classList.add('is-tilting');
        card.style.setProperty('--tilt-ry', ((px - 0.5) * max).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-rx', ((0.5 - py) * max).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--tilt-gy', (py * 100).toFixed(1) + '%');
      };
      const leave = (e: PointerEvent) => e.pointerType === 'mouse' && reset();
      host.addEventListener('pointermove', track);
      host.addEventListener('pointerup', reset);
      host.addEventListener('pointercancel', reset);
      host.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        host.removeEventListener('pointermove', track);
        host.removeEventListener('pointerup', reset);
        host.removeEventListener('pointercancel', reset);
        host.removeEventListener('pointerleave', leave);
      });
    });
  }
}
