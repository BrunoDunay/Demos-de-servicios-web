import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DAY } from '../core/content';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { PlayInView } from '../shared/in-view-video';

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/**
 * "Un día en Umbral": la sección se fija y avanza de lado con el scroll. El cielo pasa de la
 * madrugada a la noche (estrellas, nubes y resplandor del sol) detrás de la fachada del club,
 * que apaga sus luces de día y enciende letrero y ventanas de noche, un reloj marca la hora de cada clase y cada tarjeta es una puerta con profundidad:
 * la foto se mueve al revés del scroll, como si te asomaras a la habitación.
 */
@Component({
  selector: 'app-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PlayInView],
  template: `
    <section class="day" aria-label="Un día en Umbral">
      <div class="pin">
        <div class="sky"></div>
        <div class="sunglow" aria-hidden="true"></div>
        <div class="stars" aria-hidden="true"><i></i><i></i></div>
        <div class="clouds" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <svg class="arc" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M40 290 Q500 -120 960 290" pathLength="1" />
        </svg>
        <span class="sun" aria-hidden="true"></span>
        <!-- Fachada del club: el cielo es transparente y deja ver el cielo animado; de noche se encienden letrero y ventanas. -->
        <div class="facade" aria-hidden="true">
          <img class="f-day" src="media/fachada-dia.webp" alt="" loading="lazy" />
          <img class="f-night" src="media/fachada-noche.webp" alt="" loading="lazy" />
          <img class="f-lights" src="media/fachada-luces.webp" alt="" loading="lazy" />
          <!-- Perfil de aluminio con tira LED en la orilla del techo (trazado sobre la silueta de la foto).
               De día se ve el perfil oscuro; al amanecer y desde el atardecer se enciende la luz. -->
          <svg class="led" viewBox="0 0 2400 1600" preserveAspectRatio="none">
            <defs>
              <filter id="led-glow" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
            </defs>
            @for (d of roof; track $index) {
              <path class="profile" [attr.d]="d" />
              <path class="glow" [attr.d]="d" filter="url(#led-glow)" />
              <path class="spill" [attr.d]="d" filter="url(#led-glow)" />
              <path class="core" [attr.d]="d" />
            }
          </svg>
        </div>
        <div class="shade" aria-hidden="true"></div>

        <div class="container head">
          <div>
            <span class="label">Un día en Umbral</span>
            <h2 class="h2">De la primera luz <em class="gold">a la última.</em></h2>
          </div>
          <div class="clock" aria-live="off"><b>{{ clock() }}</b><span>{{ phase() }}</span></div>
        </div>

        <div class="track">
          @for (s of stops; track s.time; let i = $index) {
            <article class="card" [class.is-on]="active() === i">
              <div class="door">
                <div class="room">
                  @if (s.video) {
                    <video class="media" [playInView]="'media/' + s.video + '.mp4'" [attr.poster]="'media/' + s.video + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
                  } @else {
                    <img class="media warm" [src]="'media/' + s.img + '-sm.webp'" [alt]="s.title" loading="lazy" />
                  }
                  <span class="glow"></span>
                  <span class="depth"></span>
                </div>
                <span class="sill"></span>
              </div>
              <span class="spill" aria-hidden="true"></span>
              <div class="info">
                <span class="time">{{ s.time }} <i>· {{ s.place }}</i></span>
                <h3>{{ s.title }}</h3>
                <p>{{ s.text }}</p>
              </div>
            </article>
          }
          <article class="card end">
            <h3>¿Cuál es <em class="gold">tu hora?</em></h3>
            <a routerLink="/disciplinas" fragment="horario" class="link-line">Ver el horario completo <app-icon name="arrow-right" [size]="16" /></a>
          </article>
        </div>

        <ol class="ticks" aria-hidden="true">
          @for (s of stops; track s.time; let i = $index) {
            <li [class.on]="active() >= i"><span>{{ s.time }}</span></li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .day { position: relative; --night: 0.8; --sx: 10%; --sy: 30%; }
    .pin { position: relative; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: clamp(18px, 3vh, 36px); }
    .sky { position: absolute; inset: 0; background: linear-gradient(180deg, var(--s1, #171a2c), var(--s2, #4a3346) 78%); }
        .sunglow { position: absolute; left: var(--sx); top: var(--sy); width: 70vmax; height: 70vmax; translate: -50% -50%; border-radius: 50%; background: radial-gradient(circle, rgb(255 214 160 / calc((1 - var(--night)) * 42%)), rgb(255 190 130 / calc((1 - var(--night)) * 12%)) 30%, transparent 60%); pointer-events: none; }
    /* Estrellas: dos capas de puntos; la segunda parpadea. Solo se ven de noche. */
    .stars { position: absolute; inset: 0 0 45% 0; opacity: var(--night); pointer-events: none; }
    .stars i { position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 34% 42%, #fff, transparent), radial-gradient(1.5px 1.5px at 58% 12%, #fff, transparent), radial-gradient(1px 1px at 76% 34%, #fff, transparent), radial-gradient(1px 1px at 88% 8%, #fff, transparent), radial-gradient(1px 1px at 22% 66%, #fff, transparent), radial-gradient(1.5px 1.5px at 46% 78%, #fff, transparent), radial-gradient(1px 1px at 66% 60%, #fff, transparent); background-size: 340px 260px; opacity: 0.55; }
    .stars i:last-child { background-size: 520px 380px; background-position: 120px 60px; animation: twinkle 4s ease-in-out infinite alternate; }
    @keyframes twinkle { from { opacity: 0.15; } to { opacity: 0.85; } }
    .clouds { position: absolute; inset: 0 0 40% 0; pointer-events: none; opacity: calc(0.35 + (1 - var(--night)) * 0.5); }
    .clouds i { position: absolute; width: 38vw; height: 9vw; border-radius: 50%; background: radial-gradient(ellipse, rgb(255 228 200 / 22%), transparent 70%); filter: blur(18px); animation: drift 80s linear infinite; }
    .clouds i:nth-child(1) { top: 14%; left: -10%; }
    .clouds i:nth-child(2) { top: 30%; left: 30%; width: 28vw; animation-duration: 110s; animation-delay: -40s; }
    .clouds i:nth-child(3) { top: 8%; left: 60%; width: 44vw; animation-duration: 95s; animation-delay: -20s; }
    .clouds i:nth-child(4) { top: 40%; left: 10%; width: 22vw; height: 6vw; animation-duration: 70s; animation-delay: -55s; }
    @keyframes drift { from { translate: -20vw 0; } to { translate: 120vw 0; } }
    .arc { position: absolute; left: 0; right: 0; top: 7%; width: 100%; height: 32vh; opacity: 0.7; }
    .arc path { fill: none; stroke: rgb(239 232 220 / 16%); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 0.004 0.008; }
    .sun { position: absolute; left: var(--sx); top: var(--sy); width: 16px; height: 16px; translate: -50% -50%; border-radius: 50%; background: var(--sun, #ffe2b0); box-shadow: 0 0 14px 4px var(--sun, #ffd08a), 0 0 50px 14px rgb(255 208 138 / 45%); transition: background-color 1s ease, box-shadow 1s ease; }
    .facade { position: absolute; inset: 0; pointer-events: none; }
    /* La fachada completa, apoyada abajo; los costados se funden con el cielo en lugar de recortarse. */
    .facade img { position: absolute; left: 50%; bottom: 14vh; width: min(96vw, 112vh); height: auto; aspect-ratio: 1472 / 992; translate: -50% 0; -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); }
    .f-day { opacity: calc((1 - var(--night)) * 0.85); filter: saturate(0.85); }
    .f-night { opacity: calc(var(--night) * 0.88); }
    /* Tira LED del techo: la misma caja y la misma máscara que la foto, así queda pegada a la orilla */
    .led { position: absolute; left: 50%; bottom: 14vh; width: min(96vw, 112vh); height: auto; aspect-ratio: 1472 / 992; translate: -50% 0; overflow: visible; -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); }
    .led path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    /* Perfil de aluminio: tapa la orilla del recorte; de día es lo único que se ve */
    .led .profile { stroke: #1d1c1a; stroke-width: 7; opacity: 0.95; }
    /* La luz: se enciende con la noche (apagada al mediodía) */
    .led .core { stroke: #fff4dc; stroke-width: 3.2; opacity: clamp(0, calc(var(--night) * 1.6), 1); }
    .led .glow { stroke: #ffcf8a; stroke-width: 16; opacity: clamp(0, calc(var(--night) * 1.25), 0.95); }
    /* Bañado de luz hacia abajo, sobre la fachada */
    .led .spill { stroke: #ffc77a; stroke-width: 60; opacity: clamp(0, calc(var(--night) * 0.32), 0.26); transform: translateY(26px); mix-blend-mode: screen; }
    .f-lights { mix-blend-mode: screen; opacity: calc(var(--night) * 1.15); animation: hum 6s steps(1) infinite; }
    @keyframes hum { 0%, 100% { filter: brightness(1); } 47% { filter: brightness(0.92); } 49% { filter: brightness(1.05); } }
    /* Velo para leer el título y las tarjetas sobre la fachada. */
    .shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgb(13 12 10 / 30%) 0%, transparent 22%, rgb(13 12 10 / 58%) 46%, rgb(13 12 10 / 92%) 74%, var(--bg) 100%); }

    .head { position: relative; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
    .h2 { margin-top: 18px; }
    .clock { text-align: right; }
    .clock b { display: block; font-family: var(--font-display); font-weight: 400; font-size: clamp(4rem, 9vw, 8.4rem); line-height: 0.9; font-variant-numeric: tabular-nums; }
    .clock span { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: var(--gold); }

    .track { position: relative; display: flex; align-items: flex-end; gap: clamp(28px, 3vw, 48px); width: max-content; padding-left: max(var(--gutter), calc((100vw - var(--container)) / 2)); padding-right: 30vw; will-change: transform; }
    .card { --px: 0; position: relative; flex: none; width: clamp(200px, 15.5vw, 250px); display: flex; flex-direction: column; opacity: 0.55; transform: scale(0.93); transform-origin: 50% 100%; transition: opacity 700ms ease, transform 900ms var(--ease-out); }
    .card.is-on { opacity: 1; transform: none; }
    /* Puerta: marco con bisel dorado, profundidad interior y un umbral iluminado. */
    .door { position: relative; padding: 9px 9px 0; border-radius: 1000px 1000px 0 0; background: linear-gradient(180deg, #3a3024, #1c1813 70%); box-shadow: inset 0 0 0 1px rgb(216 185 138 / 32%), inset 0 2px 0 rgb(255 236 204 / 12%), 0 30px 50px -24px rgb(0 0 0 / 80%); }
    .room { position: relative; aspect-ratio: 3 / 3.7; overflow: hidden; border-radius: 1000px 1000px 0 0; background: #0b0a08; }
    .media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: translateX(calc(var(--px) * -12%)) scale(1.3); will-change: transform; }
    .glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 100%, rgb(255 214 160 / 30%), transparent 60%); mix-blend-mode: screen; opacity: 0; transition: opacity 900ms ease; }
    .card.is-on .glow { opacity: 1; }
    /* Sombra del grosor del muro: más marcada del lado hacia el que se gira la puerta. */
    .depth { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; box-shadow: inset 0 18px 26px -10px rgb(0 0 0 / 70%), inset 0 0 22px 2px rgb(0 0 0 / 55%);
      background: linear-gradient(90deg, rgb(0 0 0 / calc(max(0, var(--px)) * 0.75)) 0%, transparent 16%, transparent 84%, rgb(0 0 0 / calc(max(0, var(--px) * -1) * 0.75)) 100%); }
    .sill { display: block; height: 7px; margin: 0 -9px; background: linear-gradient(180deg, #4a3d2c, #17130f); box-shadow: 0 1px 0 rgb(216 185 138 / 30%); }
    .spill { display: block; height: 46px; margin: 0 -10%; clip-path: polygon(12% 0, 88% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, rgb(243 213 161 / 26%), transparent); opacity: 0.25; transition: opacity 900ms ease; filter: blur(2px); }
    .card.is-on .spill { opacity: 1; }
    .info { margin-top: 2px; }
    .time { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.22em; color: var(--gold); }
    .time i { font-style: normal; color: var(--muted); letter-spacing: 0.16em; text-transform: uppercase; }
    .info h3 { margin-top: 6px; font-size: 1.9rem; }
    .info p { margin-top: 6px; font-size: 0.9rem; color: var(--ink-2); font-weight: 300; }
    .card.end { justify-content: center; gap: 24px; opacity: 1; transform: none; align-self: center; }
    .card.end h3 { font-size: clamp(2.4rem, 3.6vw, 3.4rem); }

    .ticks { position: relative; list-style: none; margin: 0 auto; padding: 0; width: min(var(--container), calc(100% - 2 * var(--gutter))); display: flex; justify-content: space-between; border-top: 1px solid var(--line); }
    .ticks li { position: relative; padding-top: 10px; font-size: 0.56rem; letter-spacing: 0.14em; color: var(--muted); transition: color 400ms ease; }
    .ticks li::before { content: ''; position: absolute; top: -3px; left: 50%; width: 5px; height: 5px; translate: -50% 0; border-radius: 50%; background: var(--line-2); transition: background-color 400ms ease, box-shadow 400ms ease; }
    .ticks li.on { color: var(--ink-2); }
    .ticks li.on::before { background: var(--gold); box-shadow: 0 0 8px var(--glow); }
    .ticks span { display: block; translate: -50% 0; margin-left: 2.5px; }

    @media (max-width: 900px) {
      .pin { height: auto; padding-block: 80px; }
      .head { flex-direction: column; align-items: flex-start; }
      .clock { text-align: left; }
      .track { overflow-x: auto; width: auto; padding-right: var(--gutter); scroll-snap-type: x mandatory; scrollbar-width: none; align-items: stretch; }
      .track::-webkit-scrollbar { display: none; }
      .card { width: 70vw; opacity: 1; transform: none; scroll-snap-align: start; }
      .card .glow, .card .spill { opacity: 1; }
      .ticks, .sun, .arc, .sunglow { display: none; }
    }
  `,
})
export class Day {
  protected readonly stops = DAY;
  protected readonly active = signal(0);
  protected readonly clock = signal(DAY[0].time);
  protected readonly phase = signal('Amanecer');
  /** Orillas del techo en coordenadas de la foto (2400 × 1600): marco de la pérgola, techo principal y techo bajo. */
  protected readonly roof = ['M204 334 L230 161 L736 308', 'M800 228 L2084 680', 'M2092 736 L2352 822'];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const day = host.querySelector<HTMLElement>('.day')!;
      const sky = host.querySelector<HTMLElement>('.sky')!;
      const { gsap } = useGsap();
      const setSky = (i: number, f: number) => {
        const a = DAY[i];
        const b = DAY[Math.min(DAY.length - 1, i + 1)];
        sky.style.setProperty('--s1', gsap.utils.interpolate(a.sky[0], b.sky[0], f));
        sky.style.setProperty('--s2', gsap.utils.interpolate(a.sky[1], b.sky[1], f));
      };
      // Cuánta "noche" hay a cada hora: estrellas y ventanas encendidas.
      const nightAt = (m: number) => gsap.utils.clamp(0, 1, m < 450 ? 0.85 - ((m - 360) / 90) * 0.85 : m > 1050 ? (m - 1050) / 160 : 0);
      setSky(0, 0);
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const section = day;
        const track = host.querySelector<HTMLElement>('.track')!;
        const arc = host.querySelector<SVGSVGElement>('.arc')!;
        const path = arc.querySelector<SVGPathElement>('path')!;
        const cards = Array.from(host.querySelectorAll<HTMLElement>('.card:not(.end)'));
        const total = path.getTotalLength();
        const distance = () => track.scrollWidth - innerWidth * 0.75;
        // Paralaje dentro de cada puerta según su distancia al centro de la pantalla.
        const doors = () => {
          const half = innerWidth / 2;
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            const px = gsap.utils.clamp(-1, 1, (r.left + r.width / 2 - half) / half);
            c.style.setProperty('--px', px.toFixed(3));
          }
        };
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance() * 1.15}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const pos = p * (DAY.length - 1);
              const i = Math.min(DAY.length - 2, Math.floor(pos));
              setSky(i, pos - i);
              this.active.set(Math.round(pos));
              // Reloj: se queda en la hora de la tarjeta activa y corre rápido a la siguiente a mitad del tramo.
              const e = Math.min(1, Math.max(0, (pos - i - 0.3) / 0.4));
              const f = e * e * (3 - 2 * e);
              const m = Math.round((toMin(DAY[i].time) + (toMin(DAY[i + 1].time) - toMin(DAY[i].time)) * f) / 5) * 5;
              this.clock.set(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
              this.phase.set(m < 8 * 60 ? 'Amanecer' : m < 16 * 60 ? 'Mediodía' : m < 19 * 60 ? 'Atardecer' : 'Noche');
              const night = nightAt(m);
              day.style.setProperty('--night', night.toFixed(3));
              // Sol sobre el arco (en px de la sección); de noche se vuelve luna.
              const pt = path.getPointAtLength(total * p);
              const ar = arc.getBoundingClientRect();
              const dr = day.getBoundingClientRect();
              day.style.setProperty('--sx', `${ar.left - dr.left + (pt.x / 1000) * ar.width}px`);
              day.style.setProperty('--sy', `${ar.top - dr.top + (pt.y / 300) * ar.height}px`);
              day.style.setProperty('--sun', p > 0.78 ? '#dfe6f5' : '#ffe2b0');
              doors();
            },
          },
        });
        doors();
      });
      destroyRef.onDestroy(() => mm.revert());
    });
  }
}
