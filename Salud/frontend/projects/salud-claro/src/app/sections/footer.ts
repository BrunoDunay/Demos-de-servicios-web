import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRACTICE } from '../core/content';
import { Practice } from '../core/practice';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon, MotionToggle],
  template: `
    <footer>
      <div class="page">
        <div class="cta">
          <h2>No tienes que tenerlo todo <em>resuelto</em> para empezar.</h2>
          <button type="button" class="btn amber" (click)="clinic.book()">Agenda una sesión <app-icon name="arrow-right" [size]="18" /></button>
        </div>
        <div class="cols">
          <div class="brand">
            <app-logo />
            <p>Psicoterapia para adultos, parejas y adolescentes en Aguascalientes y en línea.</p>
          </div>
          <div>
            <h3>Contacto</h3>
            <p>{{ c.address }}<br />{{ c.city }}</p>
            <p>{{ c.phone }}<br />{{ c.email }}</p>
          </div>
          <div>
            <h3>Consultorio</h3>
            <button type="button" (click)="clinic.go('temas')">¿Qué te trae?</button>
            <button type="button" (click)="clinic.go('respira')">Respiración guiada</button>
            <button type="button" (click)="clinic.go('tarifas')">Tarifas</button>
            <button type="button" (click)="clinic.go('consultorio')">Horario y ubicación</button>
          </div>
          <div>
            <h3>Síguenos</h3>
            <p class="social">
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><app-icon name="instagram" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><app-icon name="facebook" /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok"><app-icon name="tiktok" /></a>
            </p>
            <p class="cofepris">Psic. Valeria Ríos · Cédula profesional 0000000 (demo)<br />Línea de la Vida: 800 911 2000</p>
          </div>
        </div>
        <div class="bottom">
          <p>© {{ year }} Claro Psicología · <a routerLink="/aviso-de-privacidad">Aviso de privacidad</a> · <a routerLink="/terminos">Términos</a></p>
          <app-motion-toggle />
          <p class="demo">Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    footer { padding: clamp(70px, 9vw, 120px) 0 30px; background: var(--deep); color: oklch(82% 0.02 150); }
    .cta { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 24px; padding-bottom: 56px; border-bottom: 1px solid oklch(34% 0.03 165); }
    .cta h2 { max-width: 16ch; font-size: clamp(2.3rem, 5.4vw, 4.2rem); color: var(--mist); }
    .cta em { color: var(--amber); }
    .cols { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; padding: 50px 0; }
    .brand { display: grid; align-content: start; gap: 14px; color: var(--mist); }
    .brand p { color: oklch(78% 0.02 150); max-width: 30ch; }
    h3 { margin-bottom: 12px; font-family: var(--font-body); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--amber); }
    .cols > div { display: grid; align-content: start; gap: 10px; font-size: 0.95rem; }
    .cols button { text-align: left; width: fit-content; transition: color 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .cols button:hover, .bottom a:hover, .social a:hover { color: var(--mist); } }
    .social { display: flex; gap: 8px; }
    .social a { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px oklch(36% 0.03 165); transition: color 200ms ease, scale 160ms var(--ease-out); }
    .social a:active { scale: 0.92; }
    .cofepris { font-size: 0.78rem; color: oklch(66% 0.02 150); }
    .bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; padding-top: 24px; border-top: 1px solid oklch(34% 0.03 165); font-size: 0.84rem; }
    .bottom a { text-decoration: underline; text-underline-offset: 3px; transition: color 200ms ease; }
    .demo { flex-basis: 100%; color: oklch(64% 0.02 150); }
    @media (max-width: 900px) { .cols { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
    @media (max-width: 520px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  protected readonly clinic = inject(Practice);
  protected readonly c = PRACTICE;
  protected readonly year = new Date().getFullYear();
}
