import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Grupo de opciones con un fondo dorado que se desliza hasta la opción elegida (la que tiene la
 * clase `on`). Se acomoda solo al cambiar la selección o el tamaño del grupo.
 */
@Directive({ selector: '[chipGroup]' })
export class ChipGroup {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ind = document.createElement('span');
      ind.className = 'chip-ind';
      ind.setAttribute('aria-hidden', 'true');
      el.prepend(ind);
      let last: HTMLElement | null = null;
      const place = (instant = false) => {
        const on = el.querySelector<HTMLElement>('button.on');
        ind.classList.toggle('is-on', !!on);
        if (!on) return;
        if (instant || !last) ind.style.transition = 'none';
        ind.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
        ind.style.width = `${on.offsetWidth}px`;
        ind.style.height = `${on.offsetHeight}px`;
        if (instant || !last) {
          void ind.offsetWidth;
          ind.style.transition = '';
        }
        last = on;
      };
      place(true);
      const mo = new MutationObserver(() => place());
      mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['class'] });
      const ro = new ResizeObserver(() => place(true));
      ro.observe(el);
      destroyRef.onDestroy(() => {
        mo.disconnect();
        ro.disconnect();
      });
    });
  }
}
