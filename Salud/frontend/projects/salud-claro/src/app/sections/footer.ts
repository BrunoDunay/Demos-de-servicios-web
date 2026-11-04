import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRACTICE } from '../core/content';
import { Practice } from '../core/practice';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { Arrow, Magnetic } from '../shared/magnetic';
import { MotionToggle } from '../shared/motion-toggle';
import { Tilt } from '../shared/tilt';

/** Pie con la tarjeta de presentación de Valeria (referencia: tarjeta verde con línea dorada), que se inclina en 3D. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon, MotionToggle, Tilt, Arrow, Magnetic],
  template: `
    <footer>
      <div class="page">
        <div class="top">
          <div class="cta">
            <h2>No tienes que tenerlo todo <span>resuelto</span> para empezar.</h2>
            <button type="button" class="btn peach t-learn" magnetic (click)="practice.book()">Agenda una sesión <app-arrow /></button>
          </div>
          <div tilt="14" class="card-wrap">
            <div class="bizcard t-tilt-card">
              <app-logo />
              <span class="gold"></span>
              <div class="lines">
                <p class="name">Valeria Ríos · Psicóloga clínica</p>
                <p>{{ p.phone }} · {{ p.email }}</p>
                <p>{{ p.address }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="cols">
          <div>
            <h3>Consultorio</h3>
            <button type="button" (click)="practice.go('temas')">¿Qué te trae?</button>
            <button type="button" (click)="practice.go('respira')">Respiración guiada</button>
            <button type="button" (click)="practice.go('tarifas')">Tarifas</button>
            <button type="button" (click)="practice.go('consultorio')">Horario y ubicación</button>
          </div>
          <div>
            <h3>Síguenos</h3>
            <p class="social">
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><app-icon name="instagram" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><app-icon name="facebook" /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok"><app-icon name="tiktok" /></a>
            </p>
          </div>
          <div>
            <h3>Legal</h3>
            <a routerLink="/aviso-de-privacidad">Aviso de privacidad</a>
            <a routerLink="/terminos">Términos y condiciones</a>
            <p class="small">Cédula profesional 0000000 (demo) · Línea de la Vida: 800 911 2000</p>
          </div>
        </div>
        <div class="bottom">
          <p>© {{ year }} Claro Psicología</p>
          <app-motion-toggle />
          <p class="demo">Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    footer { padding: clamp(70px, 9vw, 120px) 0 30px; background: var(--ink); color: oklch(86% 0.02 250); }
    .top { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; padding-bottom: 56px; border-bottom: 1px solid oklch(100% 0 0 / 0.1); }
    .cta { display: grid; gap: 26px; justify-items: start; }
    .cta h2 { font-size: clamp(2.6rem, 5.8vw, 4.8rem); text-transform: uppercase; color: var(--paper); }
    .cta h2 span { color: var(--peach); }
    .card-wrap { justify-self: center; width: min(100%, 420px); }
    .bizcard { position: relative; display: grid; gap: 22px; aspect-ratio: 1.7; padding: 26px 28px; border-radius: 18px; background: var(--sage-deep); color: var(--paper); box-shadow: 0 40px 70px -24px oklch(0% 0 0 / 0.7); overflow: hidden; }
    .gold { position: absolute; left: 0; right: 0; top: 58%; height: 4px; background: linear-gradient(90deg, var(--gold), oklch(86% 0.08 85), var(--gold)); rotate: -4deg; transform: translateZ(20px); }
    .lines { align-self: end; display: grid; gap: 2px; font-size: 0.84rem; }
    .name { font-weight: 700; font-size: 0.95rem; }
    .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding: 50px 0; }
    .cols > div { display: grid; align-content: start; gap: 10px; font-size: 0.95rem; }
    h3 { margin-bottom: 8px; font-family: var(--font-body); font-stretch: 100%; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--peach); }
    .cols button, .cols a { width: fit-content; text-align: left; transition: color 200ms ease, translate 300ms var(--ease-smooth-out); }
    @media (hover: hover) and (pointer: fine) { .cols button:hover, .cols a:hover { color: var(--paper); translate: 4px 0; } .social a:hover { background: var(--peach); color: var(--ink); } }
    .social { display: flex; gap: 8px; }
    .social a { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px oklch(100% 0 0 / 0.2); transition: background-color 250ms ease, color 250ms ease, scale 160ms var(--ease-out); }
    .social a:active { scale: 0.92; }
    .small { font-size: 0.78rem; color: oklch(66% 0.03 250); }
    .bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; padding-top: 24px; border-top: 1px solid oklch(100% 0 0 / 0.1); font-size: 0.84rem; }
    .bottom a { text-decoration: underline; text-underline-offset: 3px; }
    .demo { flex-basis: 100%; color: oklch(64% 0.03 250); }
    @media (max-width: 900px) { .top { grid-template-columns: 1fr; } .cols { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 520px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  protected readonly practice = inject(Practice);
  protected readonly p = PRACTICE;
  protected readonly year = new Date().getFullYear();
}
