import { Injectable, computed, signal } from '@angular/core';
import { CONTACT } from './content';

export interface Line {
  name: string;
  price: number;
  qty: number;
}

/** La bolsa del pedido para llevar. Se abre como panel lateral y se manda armada por WhatsApp. */
@Injectable({ providedIn: 'root' })
export class Order {
  readonly lines = signal<Line[]>([]);
  readonly open = signal(false);
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly total = computed(() => this.lines().reduce((n, l) => n + l.qty * l.price, 0));
  /** Cambia cada vez que se agrega algo, para animar la bolsa. */
  readonly bump = signal(0);
  /** Último producto agregado (para el aviso breve). */
  readonly last = signal('');

  add(name: string, price: number) {
    this.lines.update((ls) => {
      const found = ls.find((l) => l.name === name);
      return found ? ls.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { name, price, qty: 1 }];
    });
    this.last.set(name);
    this.bump.update((n) => n + 1);
  }

  change(name: string, delta: number) {
    this.lines.update((ls) => ls.map((l) => (l.name === name ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  }

  qty(name: string) {
    return this.lines().find((l) => l.name === name)?.qty ?? 0;
  }
}

/** Arma el enlace de WhatsApp. Sin número: WhatsApp deja elegir el contacto (es una demo). */
export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export const money = (n: number) => `$${n.toLocaleString('es-MX')}`;

/** Hora actual en horas decimales (9:30 → 9.5). */
export const nowHours = (d = new Date()) => d.getHours() + d.getMinutes() / 60;

const fmt = (v: number) => `${Math.floor(v)}:${v % 1 ? '30' : '00'}`;

/** ¿Está abierto ahora? Para el letrero colgante y la puerta. */
export function openStatus(now = new Date()): { open: boolean; line: string } {
  const day = now.getDay();
  const h = nowHours(now);
  const today = CONTACT.hours.find((x) => x.from.includes(day))!;
  if (h >= today.open && h < today.close) return { open: true, line: `Hoy cerramos a las ${fmt(today.close)}` };
  if (h < today.open) return { open: false, line: `Hoy abrimos a las ${fmt(today.open)}` };
  const next = CONTACT.hours.find((x) => x.from.includes((day + 1) % 7))!;
  return { open: false, line: `Mañana abrimos a las ${fmt(next.open)}` };
}
