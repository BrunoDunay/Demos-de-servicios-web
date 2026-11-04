import { Injectable, signal } from '@angular/core';

/**
 * Estado del diente 3D que viaja por la página. Las secciones marcan "lugares" (shared/tooth-slot.ts)
 * y el escenario (shared/tooth-stage.ts) dibuja el diente encima del lugar activo:
 * intro → portada → centro del menú de tratamientos, mezclando entre ellos según el scroll.
 */
@Injectable({ providedIn: 'root' })
export class ToothStage {
  readonly mode = signal<'intro' | 'page'>('intro');
  readonly slots = new Map<string, HTMLElement>();
  /** Giro extra que pide la sección de tratamientos (cada tratamiento muestra otra cara del diente). */
  readonly turn = signal(0);
  /** Golpe de giro rápido (al elegir un tratamiento). */
  spin = 0;
  /** Hasta cuándo el diente vuela despacio a su lugar (al terminar la intro). */
  flyUntil = 0;

  land() {
    this.flyUntil = performance.now() + 1600;
    this.spin = 0.8;
    this.mode.set('page');
  }

  register(name: string, el: HTMLElement) {
    this.slots.set(name, el);
  }

  unregister(name: string, el: HTMLElement) {
    if (this.slots.get(name) === el) this.slots.delete(name);
  }

  setTurn(index: number) {
    this.turn.set(index);
    this.spin = 1;
  }
}
