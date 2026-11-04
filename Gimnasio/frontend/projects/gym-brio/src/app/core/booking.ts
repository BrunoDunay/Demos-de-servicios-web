import { Injectable, signal } from '@angular/core';

/** Guarda lo que el visitante eligió (clase o plan) para prellenar el formulario de contacto. */
@Injectable({ providedIn: 'root' })
export class Booking {
  readonly interest = signal('Clase de prueba gratis');

  choose(value: string) {
    this.interest.set(value);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Arma el enlace de WhatsApp. Sin número: WhatsApp deja elegir el contacto (es una demo). */
export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
