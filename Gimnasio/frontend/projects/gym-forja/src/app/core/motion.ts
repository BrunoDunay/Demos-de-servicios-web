import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

let registered = false;

/** Registra los plugins de GSAP una sola vez (solo en el navegador). */
export function useGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

// Las demos muestran el movimiento siempre (es lo que se presume); quien lo necesite lo apaga con el botón
// "Reducir movimiento" del pie de página, que agrega la clase .reduce-motion a <html>.
export const prefersReducedMotion = () => typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');
export const hasFinePointer = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Scroll suave (Lenis) sincronizado con ScrollTrigger, y estado de la intro del logo. */
@Injectable({ providedIn: 'root' })
export class Motion {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);
  readonly introDone = signal(false);
  private lenis?: Lenis;

  start() {
    if (!this.isBrowser || this.lenis) return;
    const { gsap, ScrollTrigger } = useGsap();
    if (!prefersReducedMotion()) {
      this.lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    document.addEventListener('click', this.onAnchorClick, true);

    // Al navegar con fragmento (/#planes) se desplaza con suavidad; al cambiar de página vuelve arriba.
    let lastPath = location.pathname;
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const tree = this.router.parseUrl((e as NavigationEnd).urlAfterRedirects);
      const path = (e as NavigationEnd).urlAfterRedirects.split(/[?#]/)[0];
      const changedPage = path !== lastPath;
      lastPath = path;
      requestAnimationFrame(() => {
        if (changedPage) this.scrollTo(0, true);
        const el = tree.fragment ? document.getElementById(tree.fragment) : null;
        if (el) setTimeout(() => this.scrollTo(el, false), changedPage ? 120 : 0);
        ScrollTrigger.refresh();
      });
    });
  }

  stop() {
    this.lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  }

  resume() {
    this.lenis?.start();
    document.documentElement.style.overflow = '';
  }

  scrollTo(target: HTMLElement | number, immediate = false) {
    if (this.lenis) this.lenis.scrollTo(target, { offset: -70, immediate, duration: 1.4 });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  }

  // Los enlaces "#seccion" se desplazan con Lenis en lugar del salto nativo.
  private readonly onAnchorClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a');
    const href = link?.getAttribute('href');
    if (!href || href === '#' || !href.startsWith('#')) return;
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    e.preventDefault();
    this.scrollTo(el);
  };
}
