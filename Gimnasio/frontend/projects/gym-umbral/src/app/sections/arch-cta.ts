import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { prefersReducedMotion, useGsap } from '../core/motion';
import { Icon } from '../shared/icon';
import { PlayInView } from '../shared/in-view-video';

interface Puff {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  rot: number;
  vr: number;
}

/**
 * Cierre "Cruza el umbral": una puerta en arco con video crece con el scroll hasta cubrir la
 * pantalla. Con la puerta casi cerrada el video está velado por humo (canvas) y un ligero
 * desenfoque; al abrirse, el humo se disipa, el video se enfoca y aparece la invitación.
 */
@Component({
  selector: 'app-arch-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PlayInView],
  template: `
    <section class="arch-cta" aria-label="Reserva tu primera sesión">
      <div class="pin">
        <p class="above"><span>Cruza</span><span>el umbral</span></p>
        <div class="window">
          <video playInView="media/h-vapor.mp4" poster="media/h-vapor-poster.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>
          <canvas class="smoke" aria-hidden="true"></canvas>
          <div class="shade"></div>
          <div class="content container">
            <span class="label">Primera sesión</span>
            <h2 class="display">Tu primera sesión<br />va por <em class="gold">nuestra cuenta.</em></h2>
            <p class="lead">Elige disciplina y horario. Te recibimos con toalla, agua y un recorrido por el club.</p>
            <span class="cta"><a routerLink="/contacto" class="btn btn-solid" data-cursor="Entra">Reservar cortesía <span class="arrow"><app-icon name="arrow-right" [size]="14" /></span></a></span>
          </div>
        </div>
        <span class="rim" aria-hidden="true"></span>
      </div>
    </section>
  `,
  styles: `
    .arch-cta { position: relative; }
    .pin { position: relative; height: 100svh; overflow: hidden; display: grid; place-items: center; }
    .above { position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: center; padding: 0 var(--gutter); margin: 0; font-family: var(--font-display); font-size: clamp(3rem, 9vw, 9rem); line-height: 1; pointer-events: none; }
    .above span:last-child { font-style: italic; color: var(--gold); }
    .window { position: absolute; inset: 0; clip-path: inset(14% 37% 8% 37% round 999px 999px 0 0); background: #1a1611; }
    .window video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.25); filter: blur(var(--blur, 3px)) brightness(0.9); }
    .smoke { position: absolute; inset: 0; width: 100%; height: 100%; opacity: var(--smoke, 1); pointer-events: none; }
    /* Contorno de luz de la puerta, sigue al recorte mientras crece y se apaga al abrirse. */
    .rim { position: absolute; top: 14%; left: 37%; right: 37%; bottom: 8%; border: 1px solid rgb(243 213 161 / 70%); border-bottom: 0; border-radius: 999px 999px 0 0; box-shadow: 0 0 24px rgb(243 213 161 / 35%), inset 0 0 30px rgb(243 213 161 / 18%); pointer-events: none; }
    .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(13 12 10 / 86%), rgb(13 12 10 / 30%)); opacity: 0; }
    .content { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 24px; opacity: 0; }
    @media (max-width: 900px) {
      .window { clip-path: none; }
      .window video { filter: none; }
      .shade, .content { opacity: 1; }
      .smoke { opacity: 0.35; }
      .above, .rim { display: none; }
    }
  `,
})
export class ArchCta {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const { gsap } = useGsap();
      const q = gsap.utils.selector(host);
      const win = q('.window')[0] as HTMLElement;
      const canvas = q('.smoke')[0] as HTMLCanvasElement;
      const ctx2d = canvas.getContext('2d')!;
      if (prefersReducedMotion()) {
        gsap.set(win, { clipPath: 'none', '--blur': '0px', '--smoke': 0.2 });
        gsap.set(q('.shade, .content'), { opacity: 1 });
        gsap.set(q('.rim'), { opacity: 0 });
        return;
      }

      // Bocanada de humo pre-dibujada: un círculo muy suave con bordes irregulares.
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 256;
      const sg = sprite.getContext('2d')!;
      for (let k = 0; k < 14; k++) {
        const x = 128 + (Math.random() - 0.5) * 90;
        const y = 128 + (Math.random() - 0.5) * 90;
        const r = 50 + Math.random() * 60;
        const g = sg.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(206,194,176,0.075)');
        g.addColorStop(1, 'rgba(206,194,176,0)');
        sg.fillStyle = g;
        sg.fillRect(0, 0, 256, 256);
      }

      let w = 0;
      let h = 0;
      let puffs: Puff[] = [];
      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        w = win.clientWidth;
        h = win.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        // El humo se concentra en la franja de la puerta (centro), donde se ve al inicio.
        puffs = Array.from({ length: 34 }, () => ({
          x: w * (0.32 + Math.random() * 0.36),
          y: h * (0.1 + Math.random() * 0.95),
          r: Math.min(w, h) * (0.22 + Math.random() * 0.3),
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.15 - Math.random() * 0.35,
          a: 0.35 + Math.random() * 0.4,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.002,
        }));
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(win);

      let raf = 0;
      let visible = false;
      const draw = () => {
        raf = requestAnimationFrame(draw);
        if (!visible) return;
        ctx2d.clearRect(0, 0, w, h);
        ctx2d.globalCompositeOperation = 'screen';
        for (const p of puffs) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y < -p.r) {
            p.y = h + p.r * 0.6;
            p.x = w * (0.32 + Math.random() * 0.36);
          }
          ctx2d.save();
          ctx2d.globalAlpha = p.a;
          ctx2d.translate(p.x, p.y);
          ctx2d.rotate(p.rot);
          ctx2d.drawImage(sprite, -p.r, -p.r, p.r * 2, p.r * 2);
          ctx2d.restore();
        }
      };
      raf = requestAnimationFrame(draw);
      const io = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)));
      io.observe(host);

      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        gsap.set(win, { '--blur': '3px', '--smoke': 1 });
        gsap
          .timeline({ scrollTrigger: { trigger: q('.arch-cta')[0], start: 'top top', end: '+=150%', pin: true, scrub: 0.8 } })
          .to(q('.above span:first-child'), { xPercent: -60, opacity: 0, ease: 'none', duration: 0.6 }, 0)
          .to(q('.above span:last-child'), { xPercent: 60, opacity: 0, ease: 'none', duration: 0.6 }, 0)
          .fromTo(win, { clipPath: 'inset(14% 37% 8% 37% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0)
          .fromTo(q('.rim'), { top: '14%', left: '37%', right: '37%', bottom: '8%', opacity: 1 }, { top: '0%', left: '0%', right: '0%', bottom: '0%', opacity: 0, ease: 'power2.inOut', duration: 1 }, 0)
          .to(q('.window video'), { scale: 1, ease: 'none', duration: 1 }, 0)
          // El humo se disipa y el video se enfoca mientras la puerta se abre.
          .to(win, { '--smoke': 0.12, '--blur': '0px', ease: 'power1.in', duration: 0.8 }, 0.15)
          .to(q('.shade'), { opacity: 1, duration: 0.4 }, 0.6)
          .fromTo(q('.content'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.7);
      });
      destroyRef.onDestroy(() => {
        mm.revert();
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
      });
    });
  }
}
