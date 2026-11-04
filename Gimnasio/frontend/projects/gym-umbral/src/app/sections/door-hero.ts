import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../core/content';
import { hasFinePointer, prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';

interface Mote {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  ph: number;
}

/**
 * Encabezado de Contacto: una puerta en arco entreabierta con luz cálida que se derrama al piso.
 * El polvo flota en el haz (canvas), brilla más donde hay luz y se aparta en remolino al pasar el
 * cursor. Al hacer scroll la puerta se acerca, como si caminaras hacia ella.
 */
@Component({
  selector: 'app-door-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <header class="hero" (pointermove)="point($event)" (pointerleave)="leave()">
      <div class="scene" aria-hidden="true">
        <div class="rays"></div>
        <div class="door">
          <div class="spill"></div>
          <div class="inside"><img class="warm" src="media/recepcion-sm.webp" alt="" /></div>
          <div class="light"></div>
          <svg class="frame" viewBox="0 0 100 155" preserveAspectRatio="none"><path d="M1 155V50A49 49 0 0 1 99 50v105" pathLength="1" /></svg>
        </div>
      </div>
      <canvas class="dust" aria-hidden="true"></canvas>
      <div class="container content">
        <nav class="crumbs" aria-label="Migas de pan"><a routerLink="/">Inicio</a><span>/</span><span>Contacto</span></nav>
        <span class="label kicker">Contacto</span>
        <h1 class="title">La puerta está <em class="gold">abierta.</em></h1>
        <p class="lead sub">Escríbenos para reservar tu sesión de cortesía, agendar un recorrido o resolver cualquier duda. Respondemos en menos de una hora.</p>
        <div class="ctas">
          <span class="cta"><a href="#reserva" class="btn btn-solid" data-cursor="Entra">Reservar cortesía <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a></span>
          <span class="quick"><app-icon name="phone" [size]="16" />{{ contact.phone }}</span>
          <span class="quick"><app-icon name="mail" [size]="16" />{{ contact.email }}</span>
        </div>
      </div>
    </header>
  `,
  styles: `
    .hero { position: relative; min-height: 100svh; display: flex; align-items: center; padding: 140px 0 90px; overflow: hidden; background: radial-gradient(ellipse at 72% 80%, #1a150f, var(--bg) 60%); }
    .scene { position: absolute; inset: 0; pointer-events: none; }
    .door { --w: clamp(220px, 25vw, 400px); position: absolute; right: clamp(40px, 11vw, 200px); bottom: 20vh; width: var(--w); height: calc(var(--w) * 1.55); will-change: transform; }
    .inside { position: absolute; inset: 0; overflow: hidden; border-radius: 1000px 1000px 0 0; }
    .inside img { position: absolute; inset: -6%; width: 112%; height: 112%; object-fit: cover; filter: brightness(1.15) saturate(0.9) blur(1px); will-change: transform; }
    .light { position: absolute; inset: 0; border-radius: 1000px 1000px 0 0; background: radial-gradient(ellipse at 50% 92%, rgb(255 236 204 / 85%), rgb(243 196 140 / 35%) 45%, rgb(216 150 90 / 10%) 80%); mix-blend-mode: screen; animation: flicker 5s steps(1) infinite; }
    @keyframes flicker { 0%, 100% { opacity: 1; } 31% { opacity: 0.93; } 33% { opacity: 1; } 62% { opacity: 0.96; } 64% { opacity: 1; } 88% { opacity: 0.94; } }
    .door::before { content: ''; position: absolute; inset: -40% -90%; background: radial-gradient(ellipse at 50% 58%, rgb(243 213 161 / 26%), transparent 55%); pointer-events: none; }
    .frame { position: absolute; inset: -6px -6px 0; width: calc(100% + 12px); height: calc(100% + 6px); overflow: visible; }
    .frame path { fill: none; stroke: var(--gold); stroke-width: 0.45; filter: drop-shadow(0 0 2px rgb(243 213 161 / 80%)); }
    .spill { position: absolute; top: 100%; left: -110%; width: 320%; height: 20vh; clip-path: polygon(34.4% 0, 65.6% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, rgb(243 213 161 / 26%), rgb(243 213 161 / 6%) 45%, transparent 90%); filter: blur(5px); }
    .rays {
      position: absolute; right: calc(clamp(40px, 11vw, 200px) + clamp(220px, 25vw, 400px) / 2); bottom: calc(20vh + clamp(220px, 25vw, 400px) * 0.7); width: 260vmax; height: 260vmax; translate: 50% 50%;
      background: repeating-conic-gradient(from 0deg, rgb(243 213 161 / 4.5%) 0deg 1.2deg, transparent 1.2deg 11deg);
      -webkit-mask-image: radial-gradient(circle, #000 2%, transparent 19%); mask-image: radial-gradient(circle, #000 2%, transparent 19%);
      mix-blend-mode: screen; animation: turn 90s linear infinite;
    }
    @keyframes turn { to { rotate: 360deg; } }
    .dust { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .content { position: relative; }
    .crumbs { display: flex; gap: 10px; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 30px; }
    .crumbs a { pointer-events: auto; transition: color 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .crumbs a:hover { color: var(--gold); } }
    .title { margin-top: 18px; max-width: 9.5em; font-size: clamp(3.4rem, 8vw, 8rem); line-height: 0.92; }
    .sub { margin-top: 24px; max-width: 460px; }
    .ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 26px; margin-top: 36px; }
    .ctas > span.cta { display: inline-flex; }
    .quick { display: inline-flex; align-items: center; gap: 10px; font-size: 0.86rem; color: var(--ink-2); }
    .quick app-icon { color: var(--gold); }
    @media (max-width: 900px) {
      .hero { align-items: flex-end; padding-top: 60svh; }
      .door { --w: 46vw; right: 50%; translate: 50% 0; bottom: auto; top: 90px; opacity: 0.75; }
      .rays { display: none; }
      .spill { height: 14vh; }
    }
  `,
})
export class DoorHero {
  protected readonly contact = CONTACT;
  private readonly mouse = { x: -9999, y: -9999, on: false };
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private parallax?: (x: number, y: number) => void;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const host = this.host;
      const hero = host.querySelector<HTMLElement>('.hero')!;
      const canvas = host.querySelector<HTMLCanvasElement>('.dust')!;
      const door = host.querySelector<HTMLElement>('.door')!;
      const ctx2d = canvas.getContext('2d')!;
      const reduced = prefersReducedMotion();
      const { gsap, SplitText } = useGsap();
      const q = gsap.utils.selector(host);

      // Punto de luz suave pre-dibujado; cada mota es este sprite escalado (mucho más barato que gradientes).
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 32;
      const sg = sprite.getContext('2d')!;
      const grad = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,240,214,1)');
      grad.addColorStop(0.35, 'rgba(255,218,168,0.55)');
      grad.addColorStop(1, 'rgba(255,200,140,0)');
      sg.fillStyle = grad;
      sg.fillRect(0, 0, 32, 32);

      let w = 0;
      let h = 0;
      let dpr = 1;
      let motes: Mote[] = [];
      // Zona de luz en coordenadas del canvas: rectángulo de la puerta.
      let L = { x: 0, y: 0, w: 1, h: 1 };
      const measure = () => {
        const r = hero.getBoundingClientRect();
        dpr = Math.min(devicePixelRatio || 1, 1.75);
        w = r.width;
        h = r.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const d = door.getBoundingClientRect();
        L = { x: d.left - r.left, y: d.top - r.top, w: d.width, h: d.height };
        const count = Math.round(Math.min(340, (w * h) / 4200) * (w < 700 ? 0.6 : 1));
        motes = Array.from({ length: count }, () => {
          // Dos de cada tres nacen cerca de la luz para que el haz se vea poblado.
          const nearLight = Math.random() < 0.66;
          const cx = L.x + L.w / 2;
          return {
            x: nearLight ? cx + (Math.random() - 0.5) * L.w * 2.4 : Math.random() * w,
            y: nearLight ? L.y + Math.random() * (h - L.y) : Math.random() * h,
            z: 0.25 + Math.random() * 0.75,
            vx: 0,
            vy: 0,
            ph: Math.random() * Math.PI * 2,
          };
        });
      };

      /** Cuánta luz llega a un punto: dentro del arco, el halo alrededor y el derrame en el piso. */
      const lightAt = (x: number, y: number) => {
        const cx = L.x + L.w / 2;
        const cy = L.y + L.h * 0.6;
        const dx = (x - cx) / (L.w * 1.1);
        const dy = (y - cy) / (L.h * 0.9);
        let v = Math.exp(-(dx * dx + dy * dy) * 1.6);
        const bottom = L.y + L.h;
        if (y > bottom) {
          const t = Math.min(1, (y - bottom) / (h * 0.2));
          const half = (L.w / 2) * (1 + t * 2.2);
          if (Math.abs(x - cx) < half) v = Math.max(v, 0.75 * (1 - t * 0.6));
        }
        if (x > L.x && x < L.x + L.w && y > L.y && y < bottom) v = 1;
        return v;
      };

      let raf = 0;
      let visible = true;
      let last = performance.now();
      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);
        if (!visible) return;
        const dt = Math.min(2, (now - last) / 16.67);
        last = now;
        const t = now / 1000;
        // La puerta crece con el scroll: la zona de luz se recalcula en cada cuadro.
        const hr = hero.getBoundingClientRect();
        const dr = door.getBoundingClientRect();
        L = { x: dr.left - hr.left, y: dr.top - hr.top, w: dr.width, h: dr.height };
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx2d.clearRect(0, 0, w, h);
        ctx2d.globalCompositeOperation = 'lighter';
        const m = this.mouse;
        const R = 150;
        for (const p of motes) {
          // Deriva lenta tipo polvo en suspensión, un poco hacia arriba por el calor de la luz.
          const ax = Math.sin(t * 0.3 + p.ph) * 0.006 + Math.cos(p.y * 0.01 + t * 0.2) * 0.004;
          const ay = -0.004 * p.z + Math.cos(t * 0.25 + p.ph * 1.7) * 0.004;
          p.vx += ax * dt;
          p.vy += ay * dt;
          if (m.on) {
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / R) * 0.55 * p.z;
              // Empuje hacia afuera más un giro tangencial: se forma un remolino.
              p.vx += ((dx / d) * f + (-dy / d) * f * 0.9) * dt;
              p.vy += ((dy / d) * f + (dx / d) * f * 0.9) * dt;
            }
          }
          p.vx *= 0.965;
          p.vy *= 0.965;
          p.x += p.vx * dt * 1.6 * p.z;
          p.y += p.vy * dt * 1.6 * p.z;
          if (p.x < -20) p.x = w + 20;
          else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          else if (p.y > h + 20) p.y = -20;
          const light = lightAt(p.x, p.y);
          const tw = 0.65 + 0.35 * Math.sin(t * (1.2 + p.z) + p.ph * 3);
          const a = (0.07 + light * 0.9) * tw * p.z;
          if (a < 0.02) continue;
          const s = (1.4 + p.z * 4.2) * (0.8 + light * 0.5);
          ctx2d.globalAlpha = Math.min(1, a);
          ctx2d.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx2d.globalAlpha = 1;
      };

      measure();
      if (!reduced) raf = requestAnimationFrame(draw);
      else {
        draw(performance.now());
        cancelAnimationFrame(raf);
      }
      const ro = new ResizeObserver(() => measure());
      ro.observe(hero);
      const io = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)));
      io.observe(hero);

      // La foto del interior se mueve al revés del cursor: da profundidad detrás del marco.
      if (!reduced) {
        const img = q('.inside img')[0] as HTMLElement;
        const toX = gsap.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' });
        const toY = gsap.quickTo(img, 'y', { duration: 1.2, ease: 'power3.out' });
        this.parallax = (nx, ny) => {
          toX(-nx * 18);
          toY(-ny * 12);
        };
      }

      let split: { chars: Element[]; revert(): void } | undefined;
      const ctx = gsap.context(() => {
        if (reduced) return;
        // Entrada: el marco se dibuja, la luz se enciende desde el piso y el derrame se extiende.
        gsap.fromTo(q('.frame path'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.2 });
        gsap.from(q('.inside'), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: 0.6 });
        gsap.from(q('.light'), { opacity: 0, duration: 1.4, ease: 'power2.out', delay: 1 });
        gsap.from(q('.spill'), { scaleY: 0, transformOrigin: '50% 0%', opacity: 0, duration: 1.6, ease: 'expo.out', delay: 1.2 });
        gsap.from(q('.rays'), { opacity: 0, duration: 2.4, ease: 'power2.out', delay: 1.3 });
        gsap.from(canvas, { opacity: 0, duration: 2, delay: 1.2 });
        gsap.from(q('.crumbs, .kicker, .sub, .ctas'), { opacity: 0, y: 20, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        // Scroll: la puerta crece hacia ti y el texto se va.
        gsap.to(door, { scale: 1.9, yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(q('.content'), { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '80% top', scrub: true } });
      }, host);
      if (!reduced) {
        document.fonts.ready.then(() => {
          split = SplitText.create(q('.title')[0], { type: 'chars,words', mask: 'words' });
          gsap.from(split.chars, { yPercent: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.25 });
        });
      }
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        ctx.revert();
        split?.revert();
      });
    });
  }

  protected point(e: PointerEvent) {
    if (e.pointerType !== 'mouse' || !hasFinePointer()) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouse.x = e.clientX - r.left;
    this.mouse.y = e.clientY - r.top;
    this.mouse.on = true;
    this.parallax?.((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
  }

  protected leave() {
    this.mouse.on = false;
    this.parallax?.(0, 0);
  }
}
