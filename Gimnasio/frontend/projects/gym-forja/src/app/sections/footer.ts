import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, NAV } from '../core/content';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, RouterLink, MotionToggle],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="cols">
          <div class="brand">
            <app-logo />
            <p>Box de entrenamiento funcional en Aguascalientes. Grupos chicos, coach en cada clase y una comunidad que no te deja solo.</p>
          </div>
          <nav aria-label="Secciones">
            <h3>Box</h3>
            @for (n of nav; track n.href) {
              <a routerLink="/" [fragment]="n.href.slice(1)">{{ n.label }}</a>
            }
          </nav>
          <div>
            <h3>Horario</h3>
            @for (h of contact.hours; track h.days) {
              <p><span>{{ h.days }}</span>{{ h.time }}</p>
            }
          </div>
          <div>
            <h3>Síguenos</h3>
            <div class="social">
              <a href="#" aria-label="Instagram de Forja"><app-icon name="instagram" /></a>
              <a href="#" aria-label="Facebook de Forja"><app-icon name="facebook" /></a>
              <a href="#" aria-label="YouTube de Forja"><app-icon name="youtube" /></a>
            </div>
            <p class="addr">{{ contact.address }}<br />{{ contact.city }}</p>
          </div>
        </div>
      </div>
      <div class="container bottom">
        <span>© 2026 Forja Box Funcional</span>
        <nav aria-label="Legal">
          <a routerLink="/aviso-de-privacidad">Aviso de privacidad</a>
          <a routerLink="/terminos">Términos y condiciones</a>
        </nav>
        <app-motion-toggle />
        <span>Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></span>
      </div>
    </footer>
  `,
  styles: `
    .footer { position: relative; padding-top: clamp(64px, 8vw, 110px); background: var(--bg); border-top: 1px solid var(--line); overflow: hidden; }
    .cols { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 32px; }
    .brand p { margin-top: 18px; max-width: 340px; color: var(--muted); }
    h3 { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.18em; color: var(--ember); margin-bottom: 16px; }
    nav { display: flex; flex-direction: column; gap: 8px; }
    nav a, .bottom a { width: fit-content; color: var(--ink-2); transition: color 200ms ease, transform 300ms var(--ease-expo); }
    nav a:hover { color: var(--ink); transform: translateX(6px); }
    .cols p { color: var(--ink-2); font-size: 0.95rem; }
    .cols p span { display: inline-block; min-width: 92px; color: var(--muted); font-family: var(--font-mono); font-size: 0.75rem; }
    .social { display: flex; gap: 8px; }
    .social a { display: grid; place-items: center; width: 46px; height: 46px; border: 1px solid var(--line-2); transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease, transform 300ms var(--ease-expo); }
    .social a:hover { background: var(--ember); border-color: var(--ember); color: var(--bg); transform: translateY(-4px); }
    .addr { margin-top: 16px; }
    .bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-top: clamp(40px, 6vw, 70px); padding: 22px 0 28px; border-top: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
    .bottom nav { flex-direction: row; gap: 18px; }
    .bottom a:hover { color: var(--ember); }
    .bottom span a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
    @media (max-width: 860px) { .cols { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
  `,
})
export class Footer {
  protected readonly nav = NAV;
  protected readonly contact = CONTACT;
}
