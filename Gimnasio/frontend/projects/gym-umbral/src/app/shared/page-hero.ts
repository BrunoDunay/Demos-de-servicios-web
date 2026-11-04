import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { prefersReducedMotion, useGsap } from '../core/motion';

/** Encabezado de páginas internas: foto con parallax, título que entra letra por letra y migas de pan. */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="hero">
      <div class="media">
        <img class="warm" [src]="'media/' + img() + '.webp'" [attr.srcset]="'media/' + img() + '-sm.webp 720w, media/' + img() + '.webp 1600w'" sizes="100vw" alt="" fetchpriority="high" />
      </div>
      <div class="shade"></div>
      <div class="container content">
        <nav class="crumbs" aria-label="Migas de pan"><a routerLink="/">Inicio</a><span>/</span><span>{{ crumb() }}</span></nav>
        <span class="label kicker">{{ kicker() }}</span>
        <h1 class="title"><ng-content /></h1>
        <p class="lead sub">{{ subtitle() }}</p>
      </div>
      <div class="scroll" aria-hidden="true"><i></i></div>
    </header>
  `,
  styles: `
    .hero { position: relative; min-height: 86svh; display: flex; align-items: flex-end; padding: 160px 0 90px; overflow: hidden; }
    .media { position: absolute; inset: -8% 0; }
    .media img { width: 100%; height: 100%; object-fit: cover; }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgb(13 12 10 / 70%) 0%, rgb(13 12 10 / 25%) 40%, rgb(13 12 10 / 92%) 100%); }
    .content { position: relative; }
    .crumbs { display: flex; gap: 10px; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 34px; }
    .crumbs a { transition: color 300ms ease; }
    @media (hover: hover) and (pointer: fine) { .crumbs a:hover { color: var(--gold); } }
    .title { margin-top: 22px; font-size: clamp(3.6rem, 10vw, 10rem); line-height: 0.92; }
    .sub { margin-top: 26px; }
    .scroll { position: absolute; right: var(--gutter); bottom: 90px; width: 1px; height: 90px; background: var(--line-2); overflow: hidden; }
    .scroll i { position: absolute; left: 0; top: 0; width: 1px; height: 40%; background: var(--gold); animation: drip 2.2s var(--ease-in-out) infinite; }
    @keyframes drip { from { transform: translateY(-100%); } to { transform: translateY(260%); } }
    @media (max-width: 700px) { .scroll { display: none; } }
  `,
})
export class PageHero {
  readonly img = input.required<string>();
  readonly kicker = input('');
  readonly crumb = input('');
  readonly subtitle = input('');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const { gsap, SplitText } = useGsap();
      const q = gsap.utils.selector(host);
      let split: { chars: Element[]; revert(): void } | undefined;
      const ctx = gsap.context(() => {
        gsap.fromTo(q('.media img'), { scale: 1.18 }, { scale: 1, duration: 2.2, ease: 'expo.out' });
        gsap.to(q('.media'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.from(q('.crumbs, .kicker, .sub'), { opacity: 0, y: 20, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
      }, host);
      document.fonts.ready.then(() => {
        split = SplitText.create(q('.title')[0], { type: 'chars,words', mask: 'words' });
        gsap.from(split.chars, { yPercent: 110, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.25 });
      });
      destroyRef.onDestroy(() => {
        ctx.revert();
        split?.revert();
      });
    });
  }
}
