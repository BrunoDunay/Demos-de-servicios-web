import { Injectable, computed, signal } from '@angular/core';
import { BUDGETS, Deal, Kind, PROPERTIES, Property, Zone } from './content';

/** Estado compartido: filtros del buscador, favoritos, ficha abierta y lo que se manda al formulario. */
@Injectable({ providedIn: 'root' })
export class Search {
  readonly deal = signal<Deal | 'todas'>('todas');
  readonly kind = signal<Kind | 'todas'>('todas');
  readonly zone = signal<Zone | 'todas'>('todas');
  readonly budget = signal(0);
  readonly favorites = signal<string[]>([]);
  readonly open = signal<Property | null>(null);
  readonly intent = signal('Quiero comprar');
  readonly property = signal('');

  readonly results = computed(() => {
    const deal = this.deal();
    const max = deal === 'todas' ? Infinity : BUDGETS[deal][this.budget()]?.max ?? Infinity;
    return PROPERTIES.filter(
      (p) =>
        (deal === 'todas' || p.deal === deal) &&
        (this.kind() === 'todas' || p.kind === this.kind()) &&
        (this.zone() === 'todas' || p.zone === this.zone()) &&
        p.price <= max,
    );
  });

  reset() {
    this.deal.set('todas');
    this.kind.set('todas');
    this.zone.set('todas');
    this.budget.set(0);
  }

  toggleFavorite(id: string) {
    this.favorites.update((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  /** Lleva al formulario de contacto con la propiedad ya elegida. */
  schedule(p: Property) {
    this.intent.set(p.deal === 'venta' ? 'Quiero comprar' : 'Quiero rentar');
    this.property.set(`${p.id} · ${p.title}`);
    this.open.set(null);
    requestAnimationFrame(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  ask(intent: string) {
    this.intent.set(intent);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export const price = (p: Pick<Property, 'price' | 'deal'>) => `$${p.price.toLocaleString('es-MX')}${p.deal === 'renta' ? ' /mes' : ''}`;

export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
