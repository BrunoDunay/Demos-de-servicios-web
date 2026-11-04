import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, viewChild } from '@angular/core';
import { BUDGETS, Deal, Kind, Zone } from '../core/content';
import { Search } from '../core/search';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="hero" id="inicio">
      <div class="bg" #bg>
        <img src="media/hero.webp" srcset="media/hero-sm.webp 720w, media/hero.webp 1920w" sizes="100vw"
          alt="Casa moderna de dos plantas con cochera amplia y jardín" width="1920" height="1282" fetchpriority="high" />
      </div>
      <div class="shade"></div>
      <div class="container inner">
        <span class="kicker intro" style="--i: 0">Inmobiliaria en Aguascalientes · desde 2014</span>
        <h1 class="title">
          <span class="line intro" style="--i: 1">Encuentra la casa</span>
          <span class="line intro" style="--i: 2">donde <em>te quedas</em>.</span>
        </h1>
        <p class="lead intro" style="--i: 3">Casas y departamentos revisados uno por uno, con papeles en orden y asesoría de crédito incluida.</p>

        <form class="finder intro" style="--i: 4" (submit)="go($event)" role="search" aria-label="Buscar propiedades">
          <div class="deal" role="radiogroup" aria-label="Operación">
            @for (d of deals; track d.value) {
              <button type="button" role="radio" [attr.aria-checked]="search.deal() === d.value" [class.on]="search.deal() === d.value" (click)="setDeal(d.value)">{{ d.label }}</button>
            }
          </div>
          <div class="fields">
            <label>
              <span>Tipo</span>
              <select (change)="search.kind.set($any(val($event)))">
                <option value="todas" [selected]="search.kind() === 'todas'">Cualquiera</option>
                <option value="casa" [selected]="search.kind() === 'casa'">Casa</option>
                <option value="departamento" [selected]="search.kind() === 'departamento'">Departamento</option>
              </select>
            </label>
            <label>
              <span>Zona</span>
              <select (change)="search.zone.set($any(val($event)))">
                <option value="todas">Toda la ciudad</option>
                @for (z of zones; track z) {
                  <option [value]="z" [selected]="search.zone() === z">{{ z }}</option>
                }
              </select>
            </label>
            <label>
              <span>Presupuesto</span>
              <select (change)="search.budget.set(+val($event))" [disabled]="search.deal() === 'todas'">
                @for (b of budgets(); track b.label; let i = $index) {
                  <option [value]="i" [selected]="search.budget() === i">{{ b.label }}</option>
                }
              </select>
            </label>
            <button class="btn btn-brass go" type="submit"><app-icon name="search" [size]="18" /> Buscar</button>
          </div>
        </form>
      </div>
      <div class="badge intro" style="--i: 5">
        <b>{{ count() }}</b>
        <span>propiedades disponibles<br />esta semana</span>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; padding: 140px 0 clamp(56px, 8vw, 96px); color: #fff; overflow: hidden; isolation: isolate; }
    .bg { position: absolute; inset: 0; z-index: -2; }
    .bg img { width: 100%; height: 115%; object-fit: cover; object-position: 60% 50%; animation: settle 2.2s var(--ease-out) both; will-change: transform; transform: translateY(var(--sy, 0)); }
    @keyframes settle { from { scale: 1.12; } to { scale: 1; } }
    .shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgb(13 26 21 / 82%) 0%, rgb(13 26 21 / 50%) 45%, rgb(13 26 21 / 5%) 80%), linear-gradient(0deg, rgb(13 26 21 / 55%), transparent 45%); }
    .intro { animation: rise 900ms var(--ease-out) both; animation-delay: calc(var(--i) * 100ms + 200ms); }
    @keyframes rise { from { opacity: 0; transform: translateY(26px); } }
    .kicker { display: inline-block; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--brass-2); }
    .title { margin-top: 18px; font-size: clamp(3rem, 7.4vw, 6.6rem); line-height: 0.98; }
    .line { display: block; }
    .title em { color: var(--brass-2); }
    .lead { margin-top: 20px; max-width: 520px; font-size: 1.12rem; color: rgb(255 255 255 / 85%); }

    .finder { margin-top: 36px; max-width: 900px; color: var(--ink); }
    .deal { display: inline-flex; gap: 4px; padding: 5px; border-radius: 14px 14px 0 0; background: rgb(255 255 255 / 92%); }
    .deal button { min-height: 40px; padding: 0 18px; border-radius: 10px; font-weight: 650; font-size: 0.92rem; color: var(--muted); transition: background-color 300ms ease, color 300ms ease; }
    .deal button.on { background: var(--pine); color: #fff; }
    @media (hover: hover) and (pointer: fine) { .deal button:not(.on):hover { color: var(--pine); } }
    .fields { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 8px; padding: 10px; border-radius: 0 16px 16px 16px; background: #fff; box-shadow: var(--shadow-lg); }
    label { display: flex; flex-direction: column; gap: 2px; padding: 8px 14px; border-radius: 12px; transition: background-color 250ms ease; }
    label:focus-within { background: var(--bg); }
    @media (hover: hover) and (pointer: fine) { label:hover { background: var(--bg); } }
    label span { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
    select { appearance: none; border: 0; padding: 2px 22px 2px 0; background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e3a2f' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") right center / 16px no-repeat; font-weight: 650; font-size: 1rem; cursor: pointer; }
    select:focus { outline: none; }
    select:disabled { opacity: 0.45; cursor: not-allowed; }
    .go { min-height: 100%; padding: 0 26px; }

    .badge { position: absolute; right: var(--gutter); bottom: clamp(56px, 8vw, 96px); display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 18px; background: rgb(255 255 255 / 14%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 22%); }
    .badge b { font-family: var(--font-display); font-weight: 400; font-size: 2.6rem; line-height: 1; color: var(--brass-2); }
    .badge span { font-size: 0.85rem; line-height: 1.35; }

    @media (max-width: 1180px) { .badge { display: none; } }
    @media (max-width: 760px) {
      .hero { min-height: auto; padding-top: 128px; }
      .fields { grid-template-columns: 1fr 1fr; border-radius: 0 16px 16px 16px; }
      .fields label:nth-child(3) { grid-column: 1 / -1; }
      .go { grid-column: 1 / -1; min-height: 52px; }
    }
  `,
})
export class Hero {
  protected readonly search = inject(Search);
  private readonly bg = viewChild.required<ElementRef<HTMLElement>>('bg');
  protected readonly zones: Zone[] = ['Norte', 'Poniente', 'Oriente', 'Sur'];
  protected readonly deals: { value: Deal | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'venta', label: 'Comprar' },
    { value: 'renta', label: 'Rentar' },
  ];
  protected readonly budgets = computed(() => {
    const d = this.search.deal();
    return d === 'todas' ? [{ label: 'Elige comprar o rentar', max: Infinity }] : BUDGETS[d];
  });
  protected readonly count = computed(() => this.search.results().length);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Parallax suave de la foto al bajar.
    afterNextRender(() => {
      if (document.documentElement.classList.contains('reduce-motion')) return;
      const img = this.bg().nativeElement.querySelector('img')!;
      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, innerHeight);
          img.style.setProperty('--sy', `${(-y * 0.12).toFixed(1)}px`);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected setDeal(d: Deal | 'todas') {
    this.search.deal.set(d);
    this.search.budget.set(0);
  }

  protected val(e: Event) {
    return (e.target as HTMLSelectElement).value as Kind & Zone & string;
  }

  protected go(e: Event) {
    e.preventDefault();
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
