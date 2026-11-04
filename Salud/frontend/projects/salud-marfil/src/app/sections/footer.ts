import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLINIC } from '../core/content';
import { Clinic } from '../core/clinic';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { Arrow, Magnetic } from '../shared/magnetic';
import { MotionToggle } from '../shared/motion-toggle';
import { Tilt } from '../shared/tilt';

/** Pie azul noche: la tarjeta de presentación de la clínica (se inclina en 3D) y "marfil" gigante recortado abajo. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon, MotionToggle, Tilt, Arrow, Magnetic],
  template: `
    <footer>
      <div class="page">
        <div class="top">
          <div class="cta">
            <h2>¿Hace cuánto fue tu última <b>revisión</b>?</h2>
            <button type="button" class="btn on-dark t-learn" magnetic (click)="clinic.book()">Agendar cita <app-arrow /></button>
          </div>
          <div tilt="14" class="card-wrap">
            <div class="bizcard t-tilt-card">
              <app-logo />
              <div class="lines">
                <p>{{ c.address }}</p>
                <p>{{ c.city }}</p>
                <p><b>{{ c.phone }}</b> · {{ c.email }}</p>
              </div>
              <svg class="big-tooth" viewBox="0 0 32 32" aria-hidden="true"><path d="M10.2 5.5c-3.4 0-5.4 2.6-5.4 6 0 2.6 1 4.5 2 6.6.9 2.2 1.1 4.7 1.8 7.1.5 1.9 1.2 3.3 2.6 3.3 2 0 2.1-3.7 2.8-6.2.4-1.2.9-1.8 1.6-1.8s1.2.6 1.6 1.8c.7 2.5.8 6.2 2.8 6.2 1.4 0 2.1-1.4 2.6-3.3.7-2.4.9-4.9 1.8-7.1 1-2.1 2-4 2-6.6 0-3.4-2-6-5.4-6-2.4 0-3.6 1.2-5.4 1.2s-3-1.2-5.4-1.2z" /></svg>
            </div>
          </div>
        </div>
        <div class="cols">
          <div>
            <h3>Clínica</h3>
            <button type="button" (click)="clinic.go('tratamientos')">Tratamientos</button>
            <button type="button" (click)="clinic.go('simulador')">Simulador de blanqueamiento</button>
            <button type="button" (click)="clinic.go('precios')">Precios y plan familiar</button>
            <button type="button" (click)="clinic.go('visitanos')">Horario y ubicación</button>
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
            <p class="cofepris">Aviso de funcionamiento COFEPRIS 0000000 (demo) · Responsable sanitario: Dra. Renata Ibarra</p>
          </div>
        </div>
        <div class="bottom">
          <p>© {{ year }} Marfil Odontología</p>
          <app-motion-toggle />
          <p class="demo">Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></p>
        </div>
      </div>
      <p class="giant word" aria-hidden="true">marfil</p>
    </footer>
  `,
  styles: `
    footer { position: relative; padding: clamp(70px, 9vw, 120px) 0 clamp(90px, 16vw, 230px); background: var(--night); color: oklch(84% 0.03 250); overflow: hidden; }
    .top { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; padding-bottom: 56px; border-bottom: 1px solid oklch(100% 0 0 / 0.1); }
    .cta { display: grid; gap: 26px; justify-items: start; }
    .cta h2 { font-size: clamp(2.4rem, 5.2vw, 4.2rem); color: var(--white); }
    .cta b { color: var(--sky); }
    .card-wrap { justify-self: center; width: min(100%, 420px); }
    /* Tarjeta de presentación (referencia "Renata"): azul con el diente en grande y datos de contacto */
    .bizcard { position: relative; display: grid; gap: 40px; aspect-ratio: 1.7; padding: 26px 28px; border-radius: 20px; color: var(--white); background: linear-gradient(135deg, var(--royal-2), var(--royal) 45%, var(--navy)); box-shadow: 0 40px 70px -24px oklch(0% 0 0 / 0.7), inset 0 1px 0 oklch(100% 0 0 / 0.3); overflow: hidden; }
    .lines { align-self: end; display: grid; gap: 2px; font-size: 0.84rem; color: oklch(92% 0.02 250); }
    .big-tooth { position: absolute; right: -30px; top: -10px; width: 200px; fill: none; stroke: oklch(100% 0 0 / 0.18); stroke-width: 0.8; transform: translateZ(30px); }
    .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding: 50px 0; }
    .cols > div { display: grid; align-content: start; gap: 10px; font-size: 0.95rem; }
    h3 { margin-bottom: 8px; font-family: var(--font-body); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sky); }
    .cols button, .cols a { width: fit-content; text-align: left; transition: color 200ms ease, translate 300ms var(--ease-smooth-out); }
    @media (hover: hover) and (pointer: fine) { .cols button:hover, .cols a:hover { color: var(--white); translate: 4px 0; } .social a:hover { background: var(--white); color: var(--navy); } }
    .social { display: flex; gap: 8px; }
    .social a { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px oklch(100% 0 0 / 0.2); transition: background-color 250ms ease, color 250ms ease, scale 160ms var(--ease-out); }
    .social a:active { scale: 0.92; }
    .cofepris { font-size: 0.76rem; color: oklch(64% 0.03 250); }
    .bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; padding-top: 24px; border-top: 1px solid oklch(100% 0 0 / 0.1); font-size: 0.84rem; }
    .bottom a { text-decoration: underline; text-underline-offset: 3px; }
    .demo { flex-basis: 100%; color: oklch(62% 0.03 250); }
    .word { left: 50%; bottom: -0.2em; translate: -50% 0; font-size: clamp(9rem, 32vw, 30rem); color: oklch(50% 0.2 263 / 0.18); }
    @media (max-width: 900px) { .top { grid-template-columns: 1fr; } .cols { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 520px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  protected readonly clinic = inject(Clinic);
  protected readonly c = CLINIC;
  protected readonly year = new Date().getFullYear();
}
