import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLANS, Plan } from '../core/content';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';

/** Patrón tipo QR (fijo, decorativo) para el reverso de la tarjeta: 21×21 con las tres esquinas de búsqueda. */
function qrPath(): string {
  const n = 21;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
    }
    return -1;
  };
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const f = finder(x, y);
      const on = f === -1 ? (x === 7 || y === 7 || x === n - 8 || y === n - 8 ? 0 : rnd() > 0.52) : f === 1;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

/**
 * Encabezado de Membresías: una tarjeta de socio en 3D que flota, se inclina hacia el cursor con
 * un reflejo dorado, gira al hacer clic (reverso con beneficios y acceso) y cambia de acabado
 * según el plan elegido: oro cálido (Gold), platino frío (Platinum) y negro con brillo helado (Diamond).
 */
@Component({
  selector: 'app-member-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <header class="hero" (pointermove)="point($event)" (pointerleave)="release()">
      <div class="halo" aria-hidden="true"></div>
      <div class="container grid">
        <div class="copy">
          <nav class="crumbs" aria-label="Migas de pan"><a routerLink="/">Inicio</a><span>/</span><span>Membresías</span></nav>
          <span class="label kicker">Membresías</span>
          <h1 class="title">Entra a <em class="gold">tu ritmo.</em></h1>
          <p class="lead sub">Sin inscripción y sin contratos forzosos. Elige tu ritmo y cámbialo cuando quieras.</p>
          <div class="ctas">
            <span class="cta"><a href="#planes" class="btn btn-solid" data-cursor="Ver">Ver membresías <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a></span>
            <a routerLink="/contacto" [queryParams]="{ interes: 'Recorrido por el club' }" class="btn btn-quiet">Agendar recorrido</a>
          </div>
        </div>

        <div class="stage">
          <span class="arch" aria-hidden="true"></span>
          <div class="float">
            <button type="button" class="card" [attr.data-plan]="plan().id" (click)="flip()" [attr.aria-pressed]="flipped()" [attr.aria-label]="'Tarjeta de socio ' + plan().name + '. Toca para girarla.'" data-cursor="Girar">
              <span class="inner">
                <span class="face front">
                  <span class="brush"></span>
                  <span class="row">
                    <span class="brand">
                      <svg viewBox="0 0 40 48" aria-hidden="true"><path d="M8 44V18a12 12 0 0 1 24 0v26" /><path class="beam" d="M20 12v32" /><path d="M2 44h36" /></svg>
                      <span class="foil">UMBRAL</span>
                    </span>
                    <svg class="nfc" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7a7 7 0 0 1 0 10M12 4a11 11 0 0 1 0 16M16 1.5a14 14 0 0 1 0 21" /></svg>
                  </span>
                  <span class="plan foil">{{ plan().name }}</span>
                  <span class="row bottom">
                    <span><small>Socio</small><b>N.º 0042 · 2026</b></span>
                    <span class="right"><small>Club</small><b>Aguascalientes</b></span>
                  </span>
                  <span class="glare"></span>
                  <span class="sweep"></span>
                </span>
                <span class="face back" [attr.aria-hidden]="!flipped()">
                  <span class="brush"></span>
                  <span class="band"></span>
                  <span class="perks">
                    <small>{{ plan().classes }}</small>
                    @for (f of perks(); track f) {
                      <span>{{ f }}</span>
                    }
                  </span>
                  <span class="row bottom">
                    <span><small>Acceso</small><b>05:30 – 22:00</b></span>
                    <svg class="qr" viewBox="-1 -1 23 23" aria-hidden="true"><path [attr.d]="qr" /></svg>
                  </span>
                  <span class="glare"></span>
                </span>
              </span>
            </button>
          </div>
          <span class="floor" aria-hidden="true"></span>

          <div class="chips" role="radiogroup" aria-label="Acabado de la tarjeta según la membresía">
            @for (p of plans; track p.id) {
              <button type="button" role="radio" [attr.aria-checked]="plan().id === p.id" [class.on]="plan().id === p.id" (click)="select(p)">
                <i [attr.data-plan]="p.id"></i>{{ p.name }}
              </button>
            }
          </div>
          <p class="summary"><em>{{ plan().note }}</em> · desde <b>{{ money(plan().monthly) }}</b> MXN al mes</p>
        </div>
      </div>
    </header>
  `,
  styles: `
    .hero { position: relative; min-height: 100svh; display: flex; align-items: center; padding: 140px 0 80px; overflow: hidden; }
    .halo { position: absolute; right: -10%; top: 50%; width: 70vw; height: 70vw; translate: 0 -50%; background: radial-gradient(circle, rgb(243 213 161 / 12%), transparent 60%); pointer-events: none; }
    .grid { position: relative; display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(30px, 5vw, 80px); align-items: center; }
    .crumbs { display: flex; gap: 10px; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 30px; }
    .crumbs a { transition: color 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .crumbs a:hover { color: var(--gold); } }
    .title { margin-top: 18px; font-size: clamp(3.4rem, 8vw, 8rem); line-height: 0.92; }
    .sub { margin-top: 24px; max-width: 460px; }
    .ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
    .ctas > span.cta { display: inline-flex; }

    .stage { position: relative; display: flex; flex-direction: column; align-items: center; perspective: 1600px; padding-top: 30px; }
    .arch { position: absolute; top: -6%; left: 50%; width: min(420px, 74%); aspect-ratio: 3 / 4; translate: -50% 0; border: 1px solid rgb(216 185 138 / 28%); border-bottom: 0; border-radius: 1000px 1000px 0 0; pointer-events: none; }
    .arch::after { content: ''; position: absolute; inset: 12% 14% 0; border-radius: inherit; background: radial-gradient(ellipse at 50% 30%, rgb(243 213 161 / 16%), transparent 70%); }
    .float { position: relative; width: min(480px, 100%); animation: bob 7s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { translate: 0 -8px; } 50% { translate: 0 10px; } }
    .card { --mx: 50%; --my: 30%; display: block; width: 100%; aspect-ratio: 1.586; padding: 0; perspective: 1200px; color: var(--ink); text-align: left; cursor: pointer; transition: scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .card:active { scale: 0.985; }
    .inner { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; will-change: transform; }
    .face {
      position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 7% 7.5%; border-radius: 18px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden;
      background: radial-gradient(120% 140% at 0% 0%, var(--c2), var(--c1) 60%);
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 14%), inset 0 1px 0 rgb(255 255 255 / 22%), 0 40px 80px -30px rgb(0 0 0 / 85%);
      transition: background 800ms ease;
    }
    .back { transform: rotateY(180deg); }
    .card[data-plan='gold'] { --c1: #2a2015; --c2: #7a5c36; --f1: #fbe7c2; --f2: #b48a52; }
    .card[data-plan='platinum'] { --c1: #2b2d30; --c2: #8a8f96; --f1: #ffffff; --f2: #b9bec5; }
    .card[data-plan='diamond'] { --c1: #050608; --c2: #1d2228; --f1: #e8f4ff; --f2: #8fb3cf; }
    .brush { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgb(255 255 255 / 3%) 0 1px, transparent 1px 3px); pointer-events: none; }
    .row { position: relative; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand svg { width: 22px; height: 26px; fill: none; stroke: var(--f2); stroke-width: 2; stroke-linecap: round; overflow: visible; }
    .brand .beam { stroke: var(--f1); filter: drop-shadow(0 0 3px var(--f1)); }
    .foil {
      background: linear-gradient(110deg, var(--f2) 20%, var(--f1) 45%, #fff 50%, var(--f1) 55%, var(--f2) 80%) var(--mx) 0 / 260% 100%;
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .brand .foil { font-size: clamp(0.7rem, 1vw, 0.85rem); font-weight: 600; letter-spacing: 0.5em; }
    .nfc { width: 24px; height: 24px; fill: none; stroke: var(--f2); stroke-width: 1.6; stroke-linecap: round; opacity: 0.8; }
    .plan { position: relative; font-family: var(--font-display); font-style: italic; font-size: clamp(2.2rem, 4.2vw, 3.4rem); line-height: 1; align-self: flex-start; padding-right: 6px; }
    .bottom { align-items: flex-end; }
    .bottom small { display: block; font-size: 0.52rem; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase; color: rgb(239 232 220 / 55%); }
    .bottom b { font-weight: 500; font-size: clamp(0.72rem, 1vw, 0.86rem); letter-spacing: 0.14em; }
    .bottom .right { text-align: right; }
    .glare { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; background: radial-gradient(circle at var(--mx) var(--my), rgb(255 255 255 / 55%), transparent 48%); }
    .glare::after { content: ''; position: absolute; inset: 0; mix-blend-mode: color-dodge; opacity: 0.22; background: linear-gradient(115deg, transparent 30%, rgb(255 214 170 / 70%) calc(var(--mx) - 10%), rgb(190 220 255 / 50%) var(--mx), rgb(255 190 220 / 50%) calc(var(--mx) + 10%), transparent 70%); }
    .sweep { position: absolute; inset: -20% auto -20% 0; width: 40%; background: linear-gradient(100deg, transparent, rgb(255 255 255 / 35%), transparent); transform: translateX(-160%) skewX(-12deg); pointer-events: none; }
    .band { position: absolute; left: 0; right: 0; top: 11%; height: 17%; background: linear-gradient(90deg, #0b0a09, #1b1814, #0b0a09); box-shadow: inset 0 -1px 0 rgb(255 255 255 / 8%); }
    .perks { position: relative; display: flex; flex-direction: column; gap: 4px; margin-top: 18%; font-size: clamp(0.62rem, 0.9vw, 0.78rem); color: rgb(239 232 220 / 88%); }
    .perks small { font-size: 0.56rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--f1); margin-bottom: 4px; }
    .perks span::before { content: '— '; color: var(--f2); }
    .qr { position: absolute; right: 7.5%; bottom: 9%; width: 18%; aspect-ratio: 1; padding: 4px; border-radius: 6px; background: #f4efe6; }
    .qr path { fill: #14120f; }
    .floor { width: 70%; height: 30px; margin-top: 36px; border-radius: 50%; background: radial-gradient(closest-side, rgb(0 0 0 / 75%), transparent); filter: blur(6px); will-change: transform; }

    .chips { position: relative; display: flex; gap: 8px; margin-top: 26px; padding: 5px; border-radius: 999px; box-shadow: inset 0 0 0 1px var(--line-2); }
    .chips button { display: inline-flex; align-items: center; gap: 9px; min-height: 40px; padding: 0 16px; border-radius: 999px; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-2); transition: background-color 400ms ease, color 400ms ease; }
    @media (hover: hover) and (pointer: fine) { .chips button:hover { color: var(--ink); } }
    .chips button.on { background: var(--ink); color: var(--bg); }
    .chips i { width: 10px; height: 10px; border-radius: 50%; }
    .chips i[data-plan='gold'] { background: linear-gradient(135deg, #fbe7c2, #9a7242); }
    .chips i[data-plan='platinum'] { background: linear-gradient(135deg, #ffffff, #8a8f96); }
    .chips i[data-plan='diamond'] { background: linear-gradient(135deg, #e8f4ff, #0b0d10); }
    .summary { margin-top: 16px; font-size: 0.9rem; color: var(--muted); }
    .summary em { font-family: var(--font-display); font-size: 1.1rem; color: var(--gold); }
    .summary b { color: var(--ink); font-weight: 600; }

    @media (max-width: 960px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding-top: 130px; }
      .stage { padding-top: 50px; }
    }
    @media (max-width: 480px) {
      .chips button { padding: 0 11px; letter-spacing: 0.1em; }
    }
  `,
})
export class MemberHero {
  protected readonly plans = PLANS;
  protected readonly plan = signal<Plan>(PLANS.find((p) => p.featured) ?? PLANS[0]);
  protected readonly perks = computed(() => this.plan().features.slice(0, 4));
  protected readonly flipped = signal(false);
  protected readonly qr = qrPath();

  // Estado de la animación: inclinación actual y objetivo, giro por clic y giro por cambio de plan.
  private readonly st = { rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 30, tmx: 50, tmy: 30, flip: 0, spin: 0, pointer: false };
  private card?: HTMLElement;
  private busy = false;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.card = host.querySelector<HTMLElement>('.card')!;
      const inner = host.querySelector<HTMLElement>('.inner')!;
      const floor = host.querySelector<HTMLElement>('.floor')!;
      const reduced = prefersReducedMotion();
      const { gsap, SplitText } = useGsap();
      const q = gsap.utils.selector(host);
      let raf = 0;
      let visible = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const s = this.st;
        // Sin cursor encima, la tarjeta se mece sola con un vaivén lento.
        if (!s.pointer && !reduced) {
          const t = (now - t0) / 1000;
          s.ty = Math.sin(t * 0.55) * 16;
          s.tx = Math.cos(t * 0.42) * 7;
          s.tmx = 50 + Math.sin(t * 0.55) * 30;
          s.tmy = 30 + Math.cos(t * 0.42) * 20;
        }
        const k = 0.08;
        s.rx += (s.tx - s.rx) * k;
        s.ry += (s.ty - s.ry) * k;
        s.mx += (s.tmx - s.mx) * k;
        s.my += (s.tmy - s.my) * k;
        inner.style.transform = `rotateX(${s.rx.toFixed(2)}deg) rotateY(${(s.ry + s.flip + s.spin).toFixed(2)}deg)`;
        this.card!.style.setProperty('--mx', `${s.mx.toFixed(1)}%`);
        this.card!.style.setProperty('--my', `${s.my.toFixed(1)}%`);
        floor.style.transform = `translateX(${(-s.ry * 1.6).toFixed(1)}px) scaleX(${(1 - Math.abs(s.rx) / 70).toFixed(3)})`;
      };
      raf = requestAnimationFrame(tick);
      const io = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)));
      io.observe(host);

      let split: { chars: Element[]; revert(): void } | undefined;
      const ctx = gsap.context(() => {
        if (reduced) return;
        // Entrada: la tarjeta cae girando desde abajo y un destello la recorre al asentarse.
        gsap.from(q('.float'), { y: 240, rotationX: 70, rotationZ: -14, opacity: 0, duration: 2.2, ease: 'expo.out', delay: 0.35 });
        gsap.fromTo(q('.front .sweep'), { xPercent: -160 }, { xPercent: 360, duration: 1.4, ease: 'power2.inOut', delay: 1.5 });
        gsap.from(q('.arch'), { scaleY: 0, transformOrigin: '50% 100%', opacity: 0, duration: 1.8, ease: 'expo.out', delay: 0.2 });
        gsap.from(q('.floor, .chips, .summary'), { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1.2 });
        gsap.from(q('.crumbs, .kicker, .sub, .ctas'), { opacity: 0, y: 20, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        gsap.to(q('.stage'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true } });
      }, host);
      if (!reduced) {
        document.fonts.ready.then(() => {
          split = SplitText.create(q('.title')[0], { type: 'chars,words', mask: 'words' });
          gsap.from(split.chars, { yPercent: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.25 });
        });
      }
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ctx.revert();
        split?.revert();
      });
    });
  }

  protected point(e: PointerEvent) {
    if (!this.card || e.pointerType !== 'mouse' || !hasFinePointer()) return;
    const r = this.card.getBoundingClientRect();
    // Normalizado respecto al centro de la tarjeta; el efecto alcanza todo el encabezado.
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2)));
    const s = this.st;
    s.pointer = true;
    s.ty = nx * 22;
    s.tx = -ny * 16;
    s.tmx = 50 + nx * 50;
    s.tmy = 50 + ny * 50;
  }

  protected release() {
    this.st.pointer = false;
  }

  protected flip() {
    const { gsap } = useGsap();
    this.flipped.update((v) => !v);
    gsap.to(this.st, { flip: this.flipped() ? 180 : 0, duration: prefersReducedMotion() ? 0 : 1.1, ease: 'back.out(1.4)', overwrite: 'auto' });
  }

  /** Cambia el acabado: la tarjeta da una vuelta completa y cambia de material a medio giro. */
  protected select(p: Plan) {
    if (p.id === this.plan().id || this.busy) return;
    if (prefersReducedMotion()) {
      this.plan.set(p);
      return;
    }
    const { gsap } = useGsap();
    this.busy = true;
    gsap.to(this.st, {
      spin: this.st.spin + 360,
      duration: 1.15,
      ease: 'power3.inOut',
      onUpdate: () => {
        // A media vuelta (canto de la tarjeta) se cambia el material sin que se note.
        if (this.plan().id !== p.id && (this.st.spin % 360) > 90) this.plan.set(p);
      },
      onComplete: () => {
        this.plan.set(p);
        this.st.spin %= 360;
        this.busy = false;
      },
    });
  }

  protected money(n: number) {
    return '$' + n.toLocaleString('es-MX');
  }
}
