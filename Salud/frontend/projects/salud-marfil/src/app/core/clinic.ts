import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HOURS } from './content';
import { Motion } from './motion';

/** Estado compartido: tratamiento elegido (odontograma ↔ agenda) y navegación a secciones. */
@Injectable({ providedIn: 'root' })
export class Clinic {
  private readonly motion = inject(Motion);
  private readonly router = inject(Router);
  /** Motivo con el que se abre la agenda (lo llenan los botones "Agendar" de cada tratamiento). */
  readonly reason = signal('Revisión y limpieza');

  go(id: string) {
    const el = document.getElementById(id);
    if (el) this.motion.scrollTo(el);
    else this.router.navigate(['/'], { fragment: id });
  }

  book(reason?: string) {
    if (reason) this.reason.set(reason);
    this.go('agenda');
  }
}

/** ¿Está abierto ahora? Devuelve el texto para la píldora de estado. */
export function openStatus(now = new Date()): { open: boolean; text: string } {
  const today = HOURS[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  if (today && h >= today[0] && h < today[1]) return { open: true, text: `Abierto ahora · hasta las ${fmtHour(today[1])}` };
  for (let i = 0; i < 7; i++) {
    const d = (now.getDay() + i) % 7;
    const hours = HOURS[d];
    if (!hours) continue;
    if (i === 0 && h < hours[0]) return { open: false, text: `Cerrado · abre hoy a las ${fmtHour(hours[0])}` };
    if (i === 1) return { open: false, text: `Cerrado · abre mañana a las ${fmtHour(hours[0])}` };
    if (i > 1) return { open: false, text: `Cerrado · abre el ${['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][d]}` };
  }
  return { open: false, text: 'Cerrado' };
}

export function fmtHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const suffix = hh < 12 ? 'am' : 'pm';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${suffix}`;
}

export const money = (n: number) => '$' + n.toLocaleString('es-MX');

/** Enlace de WhatsApp sin número: WhatsApp deja elegir el contacto (es una demo). */
export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
