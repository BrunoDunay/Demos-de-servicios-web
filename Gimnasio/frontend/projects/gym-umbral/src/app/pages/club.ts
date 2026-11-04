import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubTour } from '../club3d/club-tour';
import { AMENITIES } from '../core/content';
import { Motion, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { PlayInView } from '../shared/in-view-video';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

interface Space {
  img: string;
  video?: string;
  title: string;
  text: string;
  facts: string[];
}

const SPACES: Space[] = [
  { img: 'reformer-warm', video: 'v-reformer', title: 'Estudio Reformer', text: 'Doce máquinas de maple, espejo de muro a muro y luz que baja al ritmo de la respiración.', facts: ['12 reformers', 'Duela de maple', 'Luz regulable'] },
  { img: 'gym-sala', title: 'Sala de pesas', text: 'Un gimnasio completo para entrenar por tu cuenta: peso libre, cardio frente al jardín y coach de piso.', facts: ['Mancuernas 2–40 kg', 'Caminadoras y escaladoras', 'Abierto 5:30–22:00'] },
  { img: 'ride-led', title: 'Sala de Ride', text: 'Oscuridad total, aros de luz que siguen la música y sonido que se siente en el pecho.', facts: ['20 bicis', 'Sonido 360°', 'Métricas en pantalla'] },
  { img: 'fuerza-sala', video: 'v-fuerza-2', title: 'Estudio de Fuerza', text: 'Peso libre, rack olímpico y un espacio privado para sesiones uno a uno.', facts: ['Mancuernas 2–40 kg', 'Rack olímpico', 'Estudio privado'] },
  { img: 'vestidor-umbral', title: 'Vestidores', text: 'Lockers digitales, regaderas de lluvia, amenidades de autor y toallas de algodón turco.', facts: ['Lockers con código', 'Regaderas de lluvia', 'Secadoras profesionales'] },
  { img: 'sauna', video: 'v-sauna', title: 'Sauna y Recovery', text: 'Quince minutos de calor seco para recuperar músculo y bajar las revoluciones.', facts: ['Infrarrojo', 'Hasta 4 personas', 'Incluido desde Platinum'] },
];

const GALLERY = [
  { img: 'reformer-flow', alt: 'Socia en el Reformer con luz cálida' },
  { img: 'ride-rojo', alt: 'Bici de Ride con luz roja' },
  { img: 'lockers-banca', alt: 'Vestidores con banca de madera' },
  { img: 'club', alt: 'Área de entrenamiento con anillos de luz' },
  { img: 'toallas', alt: 'Toallas de algodón en el tocador' },
  { img: 'fuerza-1', alt: 'Entrenamiento de fuerza' },
  { img: 'reformer-dark', alt: 'Estudio de Reformer al anochecer' },
  { img: 'gym-ventanal', alt: 'Sala de pesas frente al ventanal' },
  { img: 'senaletica', alt: 'Señalética retroiluminada' },
  { img: 'locker-digital', alt: 'Locker con cerradura digital' },
  { img: 'spa', alt: 'Zona de recuperación' },
  { img: 'barra', alt: 'Barra en el estudio de fuerza' },
  { img: 'gym-pasillo', alt: 'Pasillo de la sala de pesas' },
  { img: 'ride-sombra', alt: 'Clase de Ride a oscuras' },
];

@Component({
  selector: 'app-club',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClubTour, RouterLink, Icon, SplitLines, Reveal, PlayInView],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <app-club-tour />

    <section class="section intro">
      <div class="container intro-grid">
        <h2 class="h2" splitLines>Luz cálida, materiales nobles y <em class="gold">cero prisa.</em></h2>
        <div class="intro-copy">
          <p class="lead" data-reveal>Diseñamos Umbral como una casa: duela de maple, concreto pulido, madera ahumada y luz indirecta que cambia según la hora. Cada estudio tiene su propio sonido y su propio aroma.</p>
          <div class="facts" data-reveal>
            <div><b>900</b><span>m² de club</span></div>
            <div><b>3</b><span>estudios privados</span></div>
            <div><b>1</b><span>sauna infrarrojo</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="spaces" aria-label="Espacios del club">
      <div class="spaces-pin">
        <div class="spaces-head container">
          <span class="label">Los espacios</span>
          <span class="count"><b>{{ '0' + (space() + 1) }}</b> / 0{{ spaces.length }}</span>
        </div>
        <div class="track">
          @for (s of spaces; track s.title; let i = $index) {
            <article class="panel" [class.is-on]="space() === i">
              <div class="media">
                @if (s.video) {
                  <video [playInView]="'media/' + s.video + '.mp4'" [attr.poster]="'media/' + s.video + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
                } @else {
                  <img class="warm" [src]="'media/' + s.img + '.webp'" [attr.srcset]="'media/' + s.img + '-sm.webp 720w, media/' + s.img + '.webp 1400w'" sizes="(max-width: 900px) 90vw, 64vw" [alt]="s.title" loading="lazy" />
                }
              </div>
              <div class="copy">
                <span class="num">0{{ i + 1 }}</span>
                <h3>{{ s.title }}</h3>
                <p>{{ s.text }}</p>
                <ul>
                  @for (f of s.facts; track f) {
                    <li>{{ f }}</li>
                  }
                </ul>
              </div>
            </article>
          }
        </div>
        <div class="spaces-bar container"><i [style.transform]="'scaleX(' + spacesProgress() + ')'"></i></div>
      </div>
    </section>

    <section class="section amenities">
      <div class="container">
        <span class="label" data-reveal>Incluido en tu visita</span>
        <h2 class="h2" splitLines>Los detalles que <em class="gold">se notan.</em></h2>
        <div class="am-grid">
          @for (a of amenities; track a.title; let i = $index) {
            <div class="am" data-reveal [revealDelay]="i * 70">
              <span class="ico"><app-icon [name]="a.icon" [size]="26" /></span>
              <b>{{ a.title }}</b>
              <span>{{ a.text }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section gallery">
      <div class="container">
        <div class="g-head">
          <div>
            <span class="label" data-reveal>Galería</span>
            <h2 class="h2" splitLines>Así se <em class="gold">siente.</em></h2>
          </div>
          <p class="lead" data-reveal>Toca cualquier foto para verla en grande.</p>
        </div>
        <div class="masonry">
          @for (g of gallery; track g.img; let i = $index) {
            <button type="button" class="g-item" data-reveal [revealDelay]="(i % 4) * 90" (click)="openAt(i)" (pointermove)="tilt($event)" (pointerleave)="untilt($event)" [attr.aria-label]="'Ver foto: ' + g.alt" data-cursor="Ampliar">
              <img class="warm" [src]="'media/' + g.img + '-sm.webp'" [alt]="g.alt" loading="lazy" />
              <span class="sheen" aria-hidden="true"></span>
            </button>
          }
        </div>
      </div>
    </section>

    <section class="section cta">
      <div class="container cta-inner">
        <h2 class="display" splitLines>Ven a <em class="gold">conocerlo.</em></h2>
        <a routerLink="/contacto" class="btn btn-solid" data-reveal data-cursor="Entra">Agendar recorrido <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a>
      </div>
    </section>

    @if (lightbox() !== null) {
      <div class="lightbox" [class.closing]="closing()" role="dialog" aria-modal="true" [attr.aria-label]="'Foto: ' + current()?.alt" (click)="close()">
        <button type="button" class="lb-close" (click)="close()" aria-label="Cerrar"><app-icon name="close" [size]="24" /></button>
        <button type="button" class="lb-nav lb-prev" (click)="step(-1, $event)" aria-label="Foto anterior"><app-icon name="arrow-left" [size]="24" /></button>
        @for (g of [current()]; track g?.img) {
          <figure class="lb-fig" (click)="$event.stopPropagation()" (touchstart)="touchStart($event)" (touchend)="touchEnd($event)">
            <img [src]="'media/' + g?.img + '.webp'" [alt]="g?.alt" />
            <figcaption>{{ g?.alt }} <span>{{ (lightbox() ?? 0) + 1 }} / {{ gallery.length }}</span></figcaption>
          </figure>
        }
        <button type="button" class="lb-nav lb-next" (click)="step(1, $event)" aria-label="Foto siguiente"><app-icon name="arrow-right" [size]="24" /></button>
      </div>
    }
  `,
  styles: `
    .intro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 100px); align-items: end; }
    .facts { display: flex; gap: 40px; margin-top: 40px; }
    .facts b { display: block; font-family: var(--font-display); font-weight: 400; font-size: 3.6rem; line-height: 1; color: var(--gold); }
    .facts span { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }

    .spaces { position: relative; }
    .spaces-pin { position: relative; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
    .spaces-head { display: flex; justify-content: space-between; align-items: baseline; }
    .count { font-size: 0.7rem; letter-spacing: 0.2em; color: var(--muted); }
    .count b { font-family: var(--font-display); font-weight: 400; font-size: 2.2rem; letter-spacing: 0; color: var(--ink); margin-right: 6px; }
    .track { display: flex; gap: 4vw; padding-left: max(var(--gutter), calc((100vw - var(--container)) / 2)); padding-right: 18vw; width: max-content; will-change: transform; }
    .panel { position: relative; flex: none; width: min(64vw, 980px); height: 66svh; display: grid; grid-template-columns: 1fr; }
    .media { position: absolute; inset: 0; overflow: hidden; border-radius: 280px 280px 0 0; background: var(--bg-3); }
    .panel:nth-child(even) .media { border-radius: 0; }
    .media img, .media video { position: absolute; inset: 0 -12%; width: 124%; height: 100%; object-fit: cover; }
    .media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgb(13 12 10 / 88%), transparent 55%); }
    .copy { position: relative; align-self: end; padding: 0 clamp(22px, 3vw, 44px) clamp(22px, 3vw, 40px); max-width: 560px; }
    .num { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.24em; color: var(--gold); }
    .copy h3 { margin-top: 10px; font-size: clamp(2.4rem, 4.4vw, 4.4rem); }
    .copy p { margin-top: 12px; color: var(--ink-2); font-weight: 300; }
    .copy ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 0; padding: 0; }
    .copy li { padding: 6px 12px; border-radius: 999px; font-size: 0.72rem; color: var(--ink-2); box-shadow: inset 0 0 0 1px var(--line-2); background: rgb(13 12 10 / 45%); }
    .copy > * { opacity: 0.35; transform: translateY(16px); transition: opacity 800ms ease, transform 900ms var(--ease-out); }
    .panel.is-on .copy > * { opacity: 1; transform: none; }
    .panel.is-on .copy > :nth-child(2) { transition-delay: 60ms; }
    .panel.is-on .copy > :nth-child(3) { transition-delay: 120ms; }
    .panel.is-on .copy > :nth-child(4) { transition-delay: 180ms; }
    .spaces-bar { height: 1px; background: var(--line-2); }
    .spaces-bar i { display: block; height: 1px; background: var(--gold); transform-origin: left; }

    .amenities { background: var(--bg-2); }
    .amenities .h2 { margin-top: 20px; }
    .am-grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 56px; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
    .am { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 34px 28px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); overflow: hidden; transition: background-color 500ms ease; }
    .am::before { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: translateX(-100%); transition: transform 900ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .am:hover { background: var(--bg-3); } }
    @media (hover: hover) and (pointer: fine) { .am:hover::before { transform: translateX(100%); } }
    .ico { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; color: var(--gold); margin-bottom: 14px; box-shadow: inset 0 0 0 1px var(--line-2); transition: transform 700ms var(--ease-out), box-shadow 500ms ease, background-color 500ms ease; }
    @media (hover: hover) and (pointer: fine) { .am:hover .ico { transform: translateY(-4px); box-shadow: inset 0 0 0 1px var(--gold), 0 0 28px -6px rgb(243 213 161 / 60%); background: rgb(216 185 138 / 8%); } }
    .am b { font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; }
    .am > span:last-child { font-size: 0.9rem; color: var(--muted); font-weight: 300; }

    .g-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; }
    .g-head .h2 { margin-top: 20px; }
    .masonry { columns: 4 240px; column-gap: 14px; }
    .g-item { position: relative; display: block; width: 100%; margin-bottom: 14px; overflow: hidden; break-inside: avoid; background: var(--bg-3); transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform 600ms var(--ease-out), scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .g-item:active { scale: 0.985; }
    .g-item img { width: 100%; transition: transform 1.2s var(--ease-out), filter 600ms ease; }
    .sheen { position: absolute; inset: 0; background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(243 213 161 / 26%), transparent 45%); opacity: 0; transition: opacity 500ms ease; mix-blend-mode: screen; }
    @media (hover: hover) and (pointer: fine) { .g-item:hover img { transform: scale(1.06); filter: none; } }
    @media (hover: hover) and (pointer: fine) { .g-item:hover .sheen { opacity: 1; } }
    .cta-inner { display: flex; justify-content: space-between; align-items: center; gap: 30px; flex-wrap: wrap; }

    .lightbox { position: fixed; inset: 0; z-index: 140; display: grid; grid-template-columns: 80px 1fr 80px; align-items: center; background: rgb(13 12 10 / 94%); backdrop-filter: blur(10px); animation: lb-in 500ms var(--ease-out); }
    @keyframes lb-in { from { opacity: 0; } }
    .lightbox.closing { animation: lb-out 220ms ease forwards; pointer-events: none; }
    .lightbox.closing .lb-fig { transition: transform 220ms var(--ease-out); transform: scale(0.97); }
    @keyframes lb-out { to { opacity: 0; } }
    .lb-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 16px; animation: fig-in 700ms var(--ease-out); }
    @keyframes fig-in { from { opacity: 0; transform: scale(0.96); filter: blur(6px); } }
    .lb-fig img { max-height: 80svh; max-width: 100%; object-fit: contain; }
    figcaption { font-size: 0.8rem; color: var(--ink-2); display: flex; gap: 18px; }
    figcaption span { color: var(--gold); letter-spacing: 0.14em; }
    .lb-nav, .lb-close { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--line-2); justify-self: center; transition: background-color 400ms ease, color 400ms ease; }
    @media (hover: hover) and (pointer: fine) { .lb-nav:hover, .lb-close:hover { background: var(--gold); color: var(--bg); } }
    .lb-close { position: absolute; top: 24px; right: 24px; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .lb-close:active { scale: 0.92; }
    @media (max-width: 900px) {
      .intro-grid { grid-template-columns: 1fr; }
      .spaces-pin { height: auto; display: block; padding-block: 60px; }
      .spaces-head { margin-bottom: 24px; }
      .track { flex-direction: column; width: auto; padding: 0 var(--gutter); gap: 18px; }
      .panel { width: 100%; height: 72svh; }
      .copy > * { opacity: 1; transform: none; }
      .spaces-bar { display: none; }
      .am-grid { grid-template-columns: 1fr 1fr; }
      .lightbox { grid-template-columns: 1fr; }
      .lb-nav { position: absolute; bottom: 30px; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
      .lb-nav:active { scale: 0.92; }
      .lb-prev { left: 30%; } .lb-next { right: 30%; }
    }
  `,
})
export default class Club {
  private readonly motion = inject(Motion);
  protected readonly spaces = SPACES;
  protected readonly amenities = AMENITIES;
  protected readonly gallery = GALLERY;
  protected readonly space = signal(0);
  protected readonly spacesProgress = signal(0);
  protected readonly lightbox = signal<number | null>(null);
  protected readonly current = computed(() => (this.lightbox() === null ? null : this.gallery[this.lightbox()!]));
  private touchX = 0;
  private touchY = 0;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap } = useGsap();
      const mm = gsap.matchMedia();
      // Escritorio: la galería de espacios se fija y avanza de lado con el scroll.
      mm.add('(min-width: 901px)', () => {
        const section = host.querySelector<HTMLElement>('.spaces')!;
        const track = host.querySelector<HTMLElement>('.track')!;
        const panels = gsap.utils.toArray<HTMLElement>('.panel', track);
        const distance = () => track.scrollWidth - innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              this.spacesProgress.set(self.progress);
              this.space.set(Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1))));
            },
          },
        });
        // Dentro de cada panel la imagen se mueve más lento que el panel: profundidad.
        panels.forEach((p) => {
          const media = p.querySelector('img, video');
          if (!media) return;
          gsap.fromTo(media, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } });
        });
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }

  protected tilt(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  }

  protected untilt(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  }

  protected openAt(i: number) {
    this.lightbox.set(i);
    this.motion.stop();
  }

  protected readonly closing = signal(false);

  /** Cierra con un desvanecido corto (más rápido que la entrada). */
  protected close() {
    if (this.lightbox() === null || this.closing()) return;
    const done = () => {
      this.closing.set(false);
      this.lightbox.set(null);
      this.motion.resume();
    };
    if (document.documentElement.classList.contains('reduce-motion')) return done();
    this.closing.set(true);
    setTimeout(done, 220);
  }

  protected step(dir: number, e?: Event) {
    e?.stopPropagation();
    const n = this.gallery.length;
    this.lightbox.update((i) => ((((i ?? 0) + dir) % n) + n) % n);
  }

  protected onKey(e: KeyboardEvent) {
    if (this.lightbox() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }

  protected touchStart(e: TouchEvent) {
    this.touchX = e.changedTouches[0].clientX;
    this.touchY = e.changedTouches[0].clientY;
  }

  protected touchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (dy > 90 && dy > Math.abs(dx)) return this.close();
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }
}
