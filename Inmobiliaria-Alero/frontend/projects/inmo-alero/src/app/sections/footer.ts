import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, NAV } from '../core/content';
import { whatsappLink } from '../core/search';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, MotionToggle],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="cta">
          <h2>Tu próxima casa <em>está más cerca</em> de lo que crees.</h2>
          <a class="btn btn-brass" href="#contacto">Agendar visita <span class="arrow"><app-icon name="arrow-right" [size]="16" /></span></a>
        </div>
        <div class="cols">
          <div class="brand">
            <app-logo [light]="true" />
            <p>Inmobiliaria en Aguascalientes. Compra, venta, renta y asesoría de crédito con la misma asesora de principio a fin.</p>
            <div class="social">
              <a href="#" aria-label="Instagram de Alero"><app-icon name="instagram" /></a>
              <a href="#" aria-label="Facebook de Alero"><app-icon name="facebook" /></a>
              <a href="#" aria-label="TikTok de Alero"><app-icon name="tiktok" /></a>
            </div>
          </div>
          <nav aria-label="Pie de página">
            <h3>Explora</h3>
            @for (n of nav; track n.href) {
              <a [href]="n.href">{{ n.label }}</a>
            }
          </nav>
          <div>
            <h3>Oficina</h3>
            <p>{{ contact.address }}<br />{{ contact.city }}</p>
            <p class="phone">{{ contact.phone }}</p>
            <p>{{ contact.email }}</p>
          </div>
          <div>
            <h3>Horario</h3>
            @for (h of contact.hours; track h.days) {
              <p><span>{{ h.days }}</span> {{ h.time }}</p>
            }
            <p class="note">Visitas a propiedades también en domingo, con cita.</p>
          </div>
        </div>
        <div class="bottom">
          <span>© 2026 Alero Bienes Raíces</span>
          <app-motion-toggle />
          <span>Sitio demo con marca ficticia · Diseño y desarrollo: <a href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></span>
        </div>
      </div>
      <a class="wa" [href]="wa" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
        <app-icon name="chat" [size]="26" />
      </a>
    </footer>
  `,
  styles: `
    .footer { background: var(--pine); color: rgb(255 255 255 / 72%); padding: clamp(56px, 8vw, 96px) 0 28px; }
    .cta { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; padding-bottom: 48px; border-bottom: 1px solid rgb(255 255 255 / 12%); }
    .cta h2 { color: #fff; font-size: clamp(2.2rem, 5vw, 3.8rem); max-width: 760px; }
    .cta em { color: var(--brass-2); }
    .cols { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr 1fr; gap: 32px; padding: 48px 0; }
    .brand p { margin-top: 16px; max-width: 300px; }
    h3 { color: #fff; font-size: 1rem; margin-bottom: 14px; font-family: var(--font-body); font-weight: 700; letter-spacing: 0; }
    nav { display: flex; flex-direction: column; gap: 8px; }
    nav a { width: fit-content; transition: color 200ms ease, transform 300ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { nav a:hover { color: var(--brass-2); transform: translateX(4px); } }
    .cols p span { display: inline-block; min-width: 130px; color: rgb(255 255 255 / 50%); }
    .phone { margin-top: 8px; color: #fff; font-weight: 600; }
    .note { margin-top: 10px; font-size: 0.85rem; color: rgb(255 255 255 / 55%); }
    .social { display: flex; gap: 8px; margin-top: 20px; }
    .social a { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: rgb(255 255 255 / 8%); color: #fff; transition: background-color 250ms ease, color 250ms ease, transform 300ms var(--ease-back); }
    @media (hover: hover) and (pointer: fine) { .social a:hover { background: var(--brass); color: var(--ink); transform: translateY(-3px); } }
    .bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding-top: 24px; border-top: 1px solid rgb(255 255 255 / 12%); font-size: 0.85rem; color: rgb(255 255 255 / 50%); }
    .bottom a { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
    .wa { position: fixed; right: 20px; bottom: 20px; z-index: 40; display: grid; place-items: center; width: 60px; height: 60px; border-radius: 50%; background: #25d366; color: #fff; box-shadow: 0 12px 30px -8px rgb(37 211 102 / 60%); transition: transform 300ms var(--ease-back); }
    .wa::before { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid #25d366; animation: ring 2.4s ease-out infinite; }
    @media (hover: hover) and (pointer: fine) { .wa:hover { transform: scale(1.08) rotate(-6deg); } }
    .wa:active { transform: scale(0.95); }
    @keyframes ring { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.6); opacity: 0; } }
    @media (max-width: 860px) { .cols { grid-template-columns: 1fr 1fr; } .brand { grid-column: 1 / -1; } }
    @media (max-width: 480px) { .cols { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  protected readonly nav = NAV;
  protected readonly contact = CONTACT;
  protected readonly wa = whatsappLink('¡Hola, Alero! Quiero información sobre una propiedad.');
}
