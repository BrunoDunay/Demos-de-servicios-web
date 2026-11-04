import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Motion } from './motion';

/** Estado compartido del álbum: sección visible (para el encabezado), índice abierto y reserva. */
@Injectable({ providedIn: 'root' })
export class Album {
  private readonly motion = inject(Motion);
  private readonly router = inject(Router);
  /** Título que se muestra en el encabezado, como el cabezal de página de un libro. */
  readonly running = signal('');
  readonly indexOpen = signal(false);
  readonly session = signal('newborn');
  readonly pack = signal('la que me recomiendes');

  go(id: string) {
    this.indexOpen.set(false);
    const el = document.getElementById(id);
    // En las páginas legales la sección no existe: se navega al inicio con el fragmento.
    if (el)
      requestAnimationFrame(() => {
        this.motion.resume();
        this.motion.scrollTo(el);
      });
    else this.router.navigate(['/'], { fragment: id });
  }

  book(session?: string, pack?: string) {
    if (session) this.session.set(session);
    if (pack) this.pack.set(pack);
    this.go('reserva');
  }
}

/** Arma el enlace de WhatsApp. Sin número: WhatsApp deja elegir el contacto (es una demo). */
export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
