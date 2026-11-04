import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../core/content';
import { Logo } from '../shared/logo';
import { MotionToggle } from '../shared/motion-toggle';

/** Pie corto: el toldo otra vez como remate y una sola línea de datos. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, MotionToggle],
  template: `
    <footer class="foot">
      <div class="valance" aria-hidden="true"></div>
      <div class="container row">
        <app-logo />
        <p class="info">{{ contact.address }} · {{ contact.phone }}</p>
        <app-motion-toggle />
      </div>
      <div class="container credits">
        <span>© 2026 Tilde Café</span>
        <span>Sitio demo con marca ficticia · Diseño y desarrollo: <a class="link" href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></span>
      </div>
    </footer>
  `,
  styles: `
    .foot { background: var(--crema-2); padding-bottom: 26px; }
    .valance {
      height: 34px; transform: scaleY(-1);
      background: repeating-linear-gradient(90deg, var(--jitomate) 0 32px, var(--leche) 32px 64px);
      -webkit-mask: radial-gradient(16px 14px at 16px 20px, #000 98%, transparent) 0 0 / 32px 34px repeat-x, linear-gradient(#000 0 0) top / 100% 20px no-repeat;
      mask: radial-gradient(16px 14px at 16px 20px, #000 98%, transparent) 0 0 / 32px 34px repeat-x, linear-gradient(#000 0 0) top / 100% 20px no-repeat;
    }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; padding: 34px 0 22px; }
    .info { font-weight: 700; }
    .credits { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 18px; border-top: 2px dashed var(--line); font-size: 0.88rem; }
    .credits .link { font-weight: 700; text-underline-offset: 3px; }
  `,
})
export class Footer {
  protected readonly contact = CONTACT;
}
