import { Injectable, signal } from '@angular/core';

/**
 * Estado del diente 3D. La sección de tratamientos marca su lugar (toothSlot="treat") y el escenario
 * (shared/tooth-stage.ts) lo dibuja ahí. Durante la intro no se dibuja.
 */
@Injectable({ providedIn: 'root' })
export class ToothStage {
  readonly mode = signal<'intro' | 'page'>('intro');
  readonly slots = new Map<string, HTMLElement>();
  /** Giro extra que pide la sección de tratamientos (cada tratamiento muestra otra cara del diente). */
  readonly turn = signal(0);
  /** Golpe de giro rápido (al elegir un tratamiento). */
  spin = 0;
  land() {
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
