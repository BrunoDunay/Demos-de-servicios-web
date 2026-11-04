import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, output } from '@angular/core';

/**
 * Cerrar un panel arrastrándolo (como una hoja de iOS).
 * - El panel sigue al dedo 1:1; hacia el lado contrario se resiste (rubber band).
 * - Al soltar, proyecta la inercia: un movimiento rápido cierra aunque sea corto.
 * - Si no alcanza, regresa a su lugar desde donde quedó, sin saltos.
 * - Solo se activa al moverse ~10px en el eje correcto, así no estorba al scroll ni a los clics.
 * Uso: <aside swipeDismiss="x" (dismiss)="close()">   ("x" = hacia la derecha, "y" = hacia abajo)
 */
@Directive({ selector: '[swipeDismiss]' })
export class SwipeDismiss {
  readonly axis = input<'x' | 'y'>('x', { alias: 'swipeDismiss' });
  /** En "y", solo se arrastra desde esta zona (por ejemplo la cabecera) para no pelear con el scroll. */
  readonly handle = input<string | null>(null, { alias: 'swipeHandle' });
  /** Solo se activa si se cumple esta media query (por ejemplo, cuando el panel es hoja inferior en celular). */
  readonly media = input<string | null>(null, { alias: 'swipeMedia' });
  readonly dismiss = output<void>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // En celular: el navegador sigue manejando el scroll vertical y nos deja el gesto horizontal.
      // En "y" la zona de arrastre (swipeHandle) debe tener touch-action: none en su CSS.
      if (this.axis() === 'x') el.style.touchAction = 'pan-y';
      let id: number | null = null;
      let start = 0;
      let cross = 0;
      let locked: boolean | null = null;
      let offset = 0;
      let history: { p: number; t: number }[] = [];

      const pos = (e: PointerEvent) => (this.axis() === 'x' ? e.clientX : e.clientY);
      const other = (e: PointerEvent) => (this.axis() === 'x' ? e.clientY : e.clientX);
      const size = () => (this.axis() === 'x' ? el.offsetWidth : el.offsetHeight);
      const translate = (v: number) => (this.axis() === 'x' ? `translate3d(${v}px,0,0)` : `translate3d(0,${v}px,0)`);
      // Resistencia progresiva al jalar hacia donde no se cierra
      const rubber = (d: number) => {
        const dim = size();
        return (d * dim * 0.55) / (dim + 0.55 * Math.abs(d));
      };
      const reduce = () => document.documentElement.classList.contains('reduce-motion');

      const down = (e: PointerEvent) => {
        if (id !== null || e.button !== 0) return;
        const m = this.media();
        if (m && !matchMedia(m).matches) return;
        const h = this.handle();
        if (h && !(e.target as Element).closest(h)) return;
        if ((e.target as Element).closest('input, textarea, select, [contenteditable]')) return;
        id = e.pointerId;
        start = pos(e);
        cross = other(e);
        locked = null;
        offset = 0;
        history = [{ p: start, t: e.timeStamp }];
      };

      const move = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        const d = pos(e) - start;
        if (locked === null) {
          const dc = Math.abs(other(e) - cross);
          if (Math.abs(d) < 10 && dc < 10) return;
          // Solo es nuestro si el gesto va en el eje del panel
          locked = Math.abs(d) > dc;
          if (!locked) return void (id = null);
          el.setPointerCapture(e.pointerId);
          el.style.transition = 'none';
          el.classList.add('is-dragging');
        }
        if (!locked) return;
        e.preventDefault();
        offset = d > 0 ? d : rubber(d);
        el.style.transform = translate(offset);
        history.push({ p: pos(e), t: e.timeStamp });
        if (history.length > 6) history.shift();
      };

      const up = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        id = null;
        if (!locked) return;
        el.classList.remove('is-dragging');
        // Velocidad de los últimos movimientos (px/s)
        const a = history[0];
        const b = history[history.length - 1];
        const v = b.t > a.t ? ((b.p - a.p) / (b.t - a.t)) * 1000 : 0;
        // Proyección de Apple: a dónde llegaría con esa inercia
        const projected = offset + ((v / 1000) * 0.998) / (1 - 0.998);
        const close = projected > size() * 0.5;
        const remaining = close ? size() - offset : Math.abs(offset);
        const ms = reduce() ? 0 : Math.round(Math.min(380, Math.max(160, Math.abs(v) > 50 ? (remaining / Math.abs(v)) * 1000 * 1.6 : 320)));
        el.style.transition = `transform ${ms}ms cubic-bezier(0.32, 0.72, 0, 1)`;
        if (close) {
          el.style.transform = translate(size());
          setTimeout(() => {
            this.dismiss.emit();
            // Ya cerrado por la clase del componente: se limpia sin animar
            requestAnimationFrame(() => {
              el.style.transition = 'none';
              el.style.transform = '';
              requestAnimationFrame(() => (el.style.transition = ''));
            });
          }, ms);
        } else {
          el.style.transform = '';
          setTimeout(() => (el.style.transition = ''), ms);
        }
        // Evita que el gesto termine en un clic accidental
        if (Math.abs(offset) > 4) {
          const stop = (ev: Event) => (ev.stopPropagation(), ev.preventDefault());
          el.addEventListener('click', stop, { capture: true, once: true });
          setTimeout(() => el.removeEventListener('click', stop, { capture: true }), 0);
        }
      };

      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      });
    });
  }
}
