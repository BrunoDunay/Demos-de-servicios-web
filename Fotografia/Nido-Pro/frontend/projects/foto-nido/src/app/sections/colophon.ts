import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../core/content';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

/** Colofón: la última página del álbum, con los datos de impresión y los créditos. */
@Component({
  selector: 'app-colophon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, MotionToggle, RouterLink],
  template: `
    <footer class="colophon">
      <div class="page grid">
        <div class="brand">
          <app-logo />
          <p>Este álbum se compuso con Cormorant Garamond y Public Sans. Las fotos son de sesiones en el estudio de Hornedo y en campos de Jesús María y Calvillo.</p>
        </div>
        <div class="col">
          <h2>Estudio</h2>
          <p>{{ contact.studio }}<br />{{ contact.city }}</p>
          <p>{{ contact.hours }}</p>
        </div>
        <div class="col">
          <h2>Contacto</h2>
          <p>{{ contact.phone }}<br />{{ contact.email }}</p>
          <p><a class="thread" href="#">{{ '@' + contact.instagram }}</a></p>
        </div>
        <div class="col">
          <h2>Legal</h2>
          <p><a class="thread" routerLink="/aviso-de-privacidad">Aviso de privacidad</a></p>
          <p><a class="thread" routerLink="/terminos">Términos</a></p>
        </div>
      </div>
      <div class="page bottom">
        <span>© 2026 Nido · Inés Calvo, fotógrafa</span>
        <app-motion-toggle />
        <span>Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></span>
      </div>
    </footer>
  `,
  styles: `
    .colophon { padding: clamp(70px, 9vw, 120px) 0 30px; border-top: 1px solid var(--ink); }
    .grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
    .brand p { margin-top: 18px; max-width: 38ch; font-family: var(--font-display); font-style: italic; font-size: 1.2rem; line-height: 1.4; color: var(--ink-2); }
    h2 { font-family: var(--font-body); font-size: 0.74rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
    .col p { font-size: 0.95rem; }
    .col p + p { margin-top: 8px; }
    .col .thread { padding: 2px 0; font-size: 0.74rem; }
    .bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-top: 70px; padding-top: 18px; border-top: 1px solid var(--line); font-size: 0.82rem; color: var(--muted); }
    .bottom a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
  `,
})
export class Colophon {
  protected readonly contact = CONTACT;
}
