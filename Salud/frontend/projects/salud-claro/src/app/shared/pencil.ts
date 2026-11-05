import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../core/motion';

interface Pt {
  x: number;
  y: number;
  t: number;
}

interface Stroke {
  pts: Pt[];
  color: string;
  width: number;
  /** Momento en que se soltó el mouse (0 mientras se sigue dibujando). */
  end: number;
}

/** Cuánto dura un rayón después de soltar el mouse, y cuánto tarda en borrarse. */
const STAY = 650;
const FADE = 450;
/** Largo de la estela del lápiz, en milisegundos de movimiento. */
const TRAIL_MS = 170;

/**
 * Lápiz que sigue al cursor (solo con mouse): una línea corta de grafito va detrás del puntero.
 * Al hacer clic se dibuja un garabato pequeño y al mantener presionado se raya encima de la página,
 * cada rayón de un color distinto de la paleta; todos se borran en poco más de un segundo.
 * Es un lienzo fijo sin eventos de puntero: no estorba a los botones ni a los enlaces.
 */
@Component({
  selector: 'app-pencil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host { position: fixed; inset: 0; z-index: 90; pointer-events: none; }
    canvas { width: 100%; height: 100%; }
  `,
})
export class Pencil {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!hasFinePointer()) return;
      const canvas = this.canvas().nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const css = getComputedStyle(document.documentElement);
      const palette = ['--peach-deep', '--sage-deep', '--dusty', '--ink', '--gold', '--peach'].map((v) => css.getPropertyValue(v).trim() || '#c46a3c');
      const graphite = css.getPropertyValue('--ink-2').trim() || '#3b4a66';
      let lastColor = -1;
      const pickColor = () => {
        let i = Math.floor(Math.random() * palette.length);
        if (i === lastColor) i = (i + 1) % palette.length;
        lastColor = i;
        return palette[i];
      };

      let dpr = 1;
      const resize = () => {
        dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
      };
      resize();

      const trail: Pt[] = [];
      const strokes: Stroke[] = [];
      let current: Stroke | null = null;
      let down: Pt | null = null;
      let moved = false;
      let raf = 0;

      const kick = () => {
        if (!raf) raf = requestAnimationFrame(draw);
      };

      /** Línea suave por los puntos (curvas por los puntos medios). */
      const path = (pts: Pt[]) => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
      };

      const draw = () => {
        raf = 0;
        const now = performance.now();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Rayones: trazo principal y uno más fino desfasado (textura de lápiz de color)
        for (let i = strokes.length - 1; i >= 0; i--) {
          const s = strokes[i];
          const age = s.end ? now - s.end : 0;
          if (age > STAY + FADE) {
            strokes.splice(i, 1);
            continue;
          }
          if (s.pts.length < 2) continue;
          const a = age < STAY ? 1 : 1 - (age - STAY) / FADE;
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = 0.8 * a;
          ctx.lineWidth = s.width;
          path(s.pts);
          ctx.stroke();
          ctx.globalAlpha = 0.35 * a;
          ctx.lineWidth = s.width * 0.45;
          ctx.save();
          ctx.translate(0.9, 0.7);
          path(s.pts);
          ctx.stroke();
          ctx.restore();
        }

        // Estela del lápiz: se adelgaza y se aclara hacia la cola
        while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
        if (trail.length > 1) {
          for (let i = 1; i < trail.length; i++) {
            const k = i / (trail.length - 1);
            ctx.strokeStyle = graphite;
            ctx.globalAlpha = 0.55 * k;
            ctx.lineWidth = 0.6 + 1.6 * k;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
            ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        if (trail.length > 1 || strokes.length) kick();
      };

      /** Garabato chico al hacer clic: un lazo con algo de temblor, nunca igual. */
      const doodle = (x: number, y: number) => {
        const t = performance.now();
        const r = 9 + Math.random() * 9;
        const turns = 1.3 + Math.random() * 0.9;
        const start = Math.random() * Math.PI * 2;
        const pts: Pt[] = [];
        const n = 22;
        for (let i = 0; i <= n; i++) {
          const a = start + (i / n) * turns * Math.PI * 2;
          const rr = r * (0.8 + Math.random() * 0.35) * (1 - (i / n) * 0.25);
          pts.push({ x: x + Math.cos(a) * rr * 1.25, y: y + Math.sin(a) * rr, t });
        }
        strokes.push({ pts, color: pickColor(), width: 2 + Math.random() * 1.4, end: t });
        kick();
      };

      const editable = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]');

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;
        const p = { x: e.clientX, y: e.clientY, t: performance.now() };
        trail.push(p);
        if (trail.length > 40) trail.shift();
        if (down) {
          if (!moved && Math.hypot(p.x - down.x, p.y - down.y) > 5) {
            moved = true;
            document.documentElement.classList.add('scribbling');
            getSelection()?.removeAllRanges();
            current = { pts: [down], color: pickColor(), width: 2.2 + Math.random() * 1.6, end: 0 };
            strokes.push(current);
          }
          if (current) current.pts.push({ x: p.x + (Math.random() - 0.5) * 0.8, y: p.y + (Math.random() - 0.5) * 0.8, t: p.t });
        }
        kick();
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || prefersReducedMotion() || editable(e)) return;
        down = { x: e.clientX, y: e.clientY, t: performance.now() };
        moved = false;
      };
      const onUp = () => {
        if (!down) return;
        if (current) current.end = performance.now();
        else if (!moved) doodle(down.x, down.y);
        current = null;
        down = null;
        document.documentElement.classList.remove('scribbling');
        kick();
      };

      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerdown', onDown, { passive: true });
      addEventListener('pointerup', onUp, { passive: true });
      addEventListener('blur', onUp);
      addEventListener('resize', resize);
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        removeEventListener('pointermove', onMove);
        removeEventListener('pointerdown', onDown);
        removeEventListener('pointerup', onUp);
        removeEventListener('blur', onUp);
        removeEventListener('resize', resize);
      });
    });
  }
}
