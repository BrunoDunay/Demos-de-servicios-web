import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="hero" id="inicio">
      <div class="blob blob-a" aria-hidden="true"></div>
      <div class="blob blob-b" aria-hidden="true"></div>
      <div class="container grid">
        <div class="copy">
          <span class="chip intro" style="--i: 0"><span class="live"></span> Gimnasio de barrio · Aguascalientes</span>
          <h1 class="title">
            <span class="line intro" style="--i: 1">Entrena cerca.</span>
            <span class="line intro" style="--i: 2">Siéntete
              <span class="mark">mejor<svg viewBox="0 0 240 24" preserveAspectRatio="none" aria-hidden="true"><path d="M3 16C46 6 96 5 142 10s78 9 95-2" /></svg></span>.</span>
          </h1>
          <p class="lead intro" style="--i: 3">
            Pesas, cardio y clases grupales a cinco minutos de tu casa. Sin inscripción y con coach en piso todo el día.
          </p>
          <div class="actions intro" style="--i: 4">
            <a class="btn btn-primary" href="#contacto">
              Agenda tu clase gratis <span class="btn-icon"><app-icon name="arrow-right" [size]="16" /></span>
            </a>
            <a class="btn btn-ghost" href="#planes">Ver planes</a>
          </div>
          <div class="proof intro" style="--i: 5">
            <div class="faces" aria-hidden="true">
              <img src="media/coach-ana-sm.webp" alt="" width="40" height="40" />
              <img src="media/coach-luis-sm.webp" alt="" width="40" height="40" />
              <img src="media/coach-sofia-sm.webp" alt="" width="40" height="40" />
              <span>+600</span>
            </div>
            <div>
              <div class="stars" aria-label="Calificación 4.9 de 5">
                @for (s of [1, 2, 3, 4, 5]; track s) {
                  <app-icon name="star" [size]="15" [filled]="true" [stroke]="1.5" />
                }
                <strong>4.9</strong>
              </div>
              <small>Vecinos que ya entrenan en Brío</small>
            </div>
          </div>
        </div>

        <div class="visual intro" style="--i: 2" #visual>
          <div class="photo">
            <img
              src="media/hero.webp"
              srcset="media/hero-sm.webp 720w, media/hero.webp 1400w"
              sizes="(max-width: 900px) 92vw, 46vw"
              alt="Socia de Brío sonriendo en el área de pesas"
              width="1400"
              height="933"
              fetchpriority="high"
            />
          </div>
          <div class="badge badge-open"><span class="live"></span> Abierto hoy <b>5:00 – 23:00</b></div>
          <div class="badge badge-class">
            <span class="badge-icon"><app-icon name="flame" [size]="18" /></span>
            <span><b>Funcional · 7:00 pm</b><small>Quedan 4 lugares</small></span>
          </div>
          <div class="sticker" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs><path id="ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
              <text><textPath href="#ring" textLength="272" lengthAdjust="spacing">PRIMERA CLASE · GRATIS · </textPath></text>
            </svg>
            <app-icon name="sparkle" [size]="30" [stroke]="1.8" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; padding: clamp(120px, 16vw, 168px) 0 clamp(64px, 8vw, 104px); overflow: hidden; }
    .blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.55; pointer-events: none; }
    .blob-a { width: 520px; height: 520px; background: #c9d0ff; top: -160px; right: -120px; animation: drift 14s ease-in-out infinite alternate; }
    .blob-b { width: 380px; height: 380px; background: #eaffb0; bottom: -140px; left: -120px; animation: drift 18s ease-in-out infinite alternate-reverse; }
    @keyframes drift { to { transform: translate(-40px, 30px) scale(1.08); } }

    .grid { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
    .intro { animation: rise 900ms var(--ease-out) both; animation-delay: calc(var(--i) * 90ms + 80ms); }
    @keyframes rise { from { opacity: 0; transform: translateY(26px); } }

    .chip { background: rgb(255 255 255 / 70%); }
    .live { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 0 rgb(22 163 74 / 50%); animation: ping 2s ease-out infinite; }
    @keyframes ping { 70% { box-shadow: 0 0 0 8px rgb(22 163 74 / 0%); } 100% { box-shadow: 0 0 0 0 rgb(22 163 74 / 0%); } }

    .title { margin-top: 22px; font-size: clamp(2.9rem, 5.7vw, 5.2rem); letter-spacing: -0.045em; line-height: 0.98; }
    .line { display: block; }
    .mark { position: relative; display: inline-block; color: var(--brand); isolation: isolate; }
    .mark svg { position: absolute; left: -2%; bottom: -0.06em; width: 104%; height: 0.32em; z-index: -1; overflow: visible; }
    .mark path { fill: none; stroke: var(--lime); stroke-width: 14; stroke-linecap: round; stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw 900ms var(--ease-out) 900ms forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }

    .lead { margin-top: 22px; max-width: 470px; font-size: 1.125rem; color: var(--muted); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
    .proof { display: flex; align-items: center; gap: 16px; margin-top: 40px; }
    .faces { display: flex; }
    .faces img, .faces span { width: 42px; height: 42px; border-radius: 50%; border: 3px solid var(--bg); object-fit: cover; margin-left: -10px; }
    .faces img:first-child { margin-left: 0; }
    .faces span { display: grid; place-items: center; background: var(--lime); font-size: 0.72rem; font-weight: 800; }
    .stars { display: flex; align-items: center; gap: 2px; color: #f5b301; }
    .stars app-icon { fill: currentColor; }
    .stars strong { margin-left: 6px; color: var(--ink); }
    .proof small { color: var(--muted); font-size: 0.85rem; }

    .visual { position: relative; transform: translate3d(var(--px, 0), var(--py, 0), 0); transition: transform 600ms var(--ease-out); }
    .photo { aspect-ratio: 5 / 6; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); background: var(--bg-2); }
    .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 28% 45%; transform: scale(1.04) translate3d(calc(var(--px, 0) * -0.6), calc(var(--py, 0) * -0.6), 0); transition: transform 600ms var(--ease-out); }

    .badge { position: absolute; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 18px; background: rgb(255 255 255 / 86%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: var(--shadow); font-size: 0.875rem; white-space: nowrap; animation: bob 5s ease-in-out infinite; }
    .badge b { font-weight: 700; }
    .badge small { display: block; color: var(--muted); font-size: 0.78rem; }
    .badge-open { top: 8%; left: -9%; }
    .badge-class { bottom: 10%; right: -6%; animation-delay: -2.4s; }
    .badge-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; background: var(--brand); color: #fff; }
    @keyframes bob { 50% { transform: translateY(-8px); } }

    .sticker { position: absolute; left: -7%; bottom: -5%; width: 118px; height: 118px; display: grid; place-items: center; border-radius: 50%; background: var(--lime); box-shadow: var(--shadow); }
    .sticker svg { position: absolute; inset: 0; animation: spin 16s linear infinite; }
    .sticker text { font-size: 12px; font-weight: 800; fill: var(--ink); font-family: var(--font-body); }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .visual { max-width: 520px; margin-inline: auto; width: 100%; }
      .photo { aspect-ratio: 4 / 4.4; }
      .badge-open { left: -2%; }
      .badge-class { right: -2%; }
      .sticker { width: 96px; height: 96px; left: auto; right: 6%; top: -6%; bottom: auto; }
    }
  `,
})
export class Hero {
  private readonly visual = viewChild.required<ElementRef<HTMLElement>>('visual');

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Parallax ligero de la foto con el cursor (solo con mouse).
    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      if (document.documentElement.classList.contains('reduce-motion')) return;
      const el = this.visual().nativeElement;
      let frame = 0;
      const onMove = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const x = (e.clientX / innerWidth - 0.5) * 18;
          const y = (e.clientY / innerHeight - 0.5) * 14;
          el.style.setProperty('--px', `${x.toFixed(1)}px`);
          el.style.setProperty('--py', `${y.toFixed(1)}px`);
        });
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('pointermove', onMove));
    });
  }
}
