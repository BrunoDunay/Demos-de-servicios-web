import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { CONTACT, NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, RouterLink, MotionToggle],
  template: `
    <footer class="footer" [class.compact]="isHome()">
      <!-- En el inicio la invitación ya está en el cierre en arco; aquí no se repite. -->
      @if (!isHome()) {
      <div class="container top">
        <div class="invite">
          <span class="label">Te esperamos</span>
          <h2 class="h2">La puerta está <em class="gold">abierta.</em></h2>
        </div>
        <span class="cta"><a routerLink="/contacto" class="btn btn-solid" data-cursor="ENTRA">Reservar cortesía <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></a></span>
      </div>
      }
      <div class="container cols">
        <div class="brand">
          <app-logo />
          <p>Boutique fitness club en Aguascalientes. Reformer, Ride, Fuerza y sala de pesas, con recovery, spa privado y vestidores de autor.</p>
        </div>
        <nav aria-label="Páginas">
          <h3>Explora</h3>
          <a routerLink="/">Inicio</a>
          @for (n of nav; track n.path) {
            <a [routerLink]="n.path">{{ n.label }}</a>
          }
        </nav>
        <div>
          <h3>Visítanos</h3>
          <p>{{ contact.address }}<br />{{ contact.city }}</p>
          @for (h of contact.hours; track h.days) {
            <p class="hours"><span>{{ h.days }}</span>{{ h.time }}</p>
          }
        </div>
        <div>
          <h3>Escríbenos</h3>
          <p><a href="#" class="plain">{{ contact.email }}</a><br />{{ contact.phone }}</p>
          <div class="social">
            <a href="#" aria-label="Instagram de Umbral"><app-icon name="instagram" [size]="18" /></a>
            <a href="#" aria-label="Facebook de Umbral"><app-icon name="facebook" [size]="18" /></a>
            <a href="#" aria-label="Playlists de Umbral en Spotify"><app-icon name="spotify" [size]="18" /></a>
          </div>
        </div>
      </div>
      <div class="container bottom">
        <span>© 2026 Umbral Boutique Fitness Club</span>
        <nav aria-label="Legal">
          <a routerLink="/aviso-de-privacidad">Aviso de privacidad</a>
          <a routerLink="/terminos">Términos</a>
        </nav>
        <app-motion-toggle />
        <span>Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></span>
      </div>
    </footer>
  `,
  styles: `
    .footer { position: relative; padding-top: clamp(90px, 11vw, 160px); background: var(--bg-2); overflow: hidden; }
    .footer.compact { padding-top: 10px; }
    .top { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; padding-bottom: 70px; border-bottom: 1px solid var(--line); }
    .top .h2 { margin-top: 18px; }
    .top > span { display: inline-flex; }
    .cols { display: grid; grid-template-columns: 1.5fr 1fr 1.2fr 1.1fr; gap: 40px; padding: 70px 0 40px; }
    .brand p { margin-top: 22px; max-width: 340px; color: var(--muted); font-weight: 300; }
    h3 { font-family: var(--font-body); font-size: 0.66rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }
    nav { display: flex; flex-direction: column; gap: 10px; }
    nav a { width: fit-content; color: var(--ink-2); transition: color 300ms ease, transform 500ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { nav a:hover { color: var(--ink); transform: translateX(6px); } }
    .cols p { color: var(--ink-2); font-weight: 300; }
    .hours { margin-top: 10px; font-size: 0.92rem; }
    .hours span { display: block; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
    @media (hover: hover) and (pointer: fine) { .plain:hover { color: var(--gold); } }
    .social { display: flex; gap: 10px; margin-top: 20px; }
    .social a { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--line-2); transition: background-color 400ms ease, color 400ms ease, transform 500ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .social a:hover { background: var(--gold); color: var(--bg); transform: translateY(-3px); } }
    .bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 26px 0 30px; border-top: 1px solid var(--line); font-size: 0.78rem; color: var(--muted); }
    .bottom nav { flex-direction: row; gap: 22px; }
    .bottom span a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
    @media (max-width: 900px) { .cols { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
    @media (max-width: 520px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  private readonly router = inject(Router);
  private readonly path = () => this.router.url.split(/[?#]/)[0];
  protected readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.path() === '/'),
    ),
    { initialValue: this.path() === '/' },
  );
  protected readonly nav = NAV;
  protected readonly contact = CONTACT;
}
