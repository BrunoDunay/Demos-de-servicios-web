import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DAY_NAMES, HOURS, PRACTICE } from '../core/content';
import { spiral } from '../core/doodles';
import { Practice } from '../core/practice';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { Arrow } from '../shared/arrow';
import { MotionToggle } from '../shared/motion-toggle';
import { Tilt } from '../shared/tilt';

const MARK = spiral(16, 16, 13, 2.6, 60);

/**
 * Pie con la tarjeta de presentación de Lucía. Hay dos propuestas mientras Bruno elige:
 * B (por defecto): tarjeta de cita de papel que se voltea al tocarla y la fecha se escribe sola.
 * A (?tarjeta=a): tarjeta verde con línea dorada que se inclina en 3D.
 */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon, MotionToggle, Tilt, Arrow],
  template: `
    <footer>
      <div class="page">
        <div class="top">
          <div class="cta">
            <h2>No tienes que tenerlo todo <span>resuelto</span> para empezar.</h2>
            <button type="button" class="btn peach t-learn" (click)="practice.book()">Agenda una sesión <app-arrow /></button>
          </div>
          @if (variant() === 'a') {
            <div tilt="14" class="card-wrap">
              <div class="bizcard t-tilt-card">
                <app-logo />
                <span class="gold"></span>
                <div class="lines">
                  <p class="name">Lucía Arenas · Psicóloga clínica</p>
                  <p>{{ p.phone }} · {{ p.email }}</p>
                  <p>{{ p.address }}</p>
                </div>
              </div>
            </div>
          } @else {
            <!-- Propuesta B: tarjeta de cita de papel. Al tocarla se voltea y la fecha se escribe sola. -->
            <div class="card-wrap b">
              <button type="button" class="appt" [class.flipped]="flipped()" (click)="flip()" [attr.aria-label]="flipped() ? 'Ver el frente de la tarjeta' : 'Voltear la tarjeta'">
                <span class="face front">
                  <span class="tape"></span>
                  <svg class="spiral" viewBox="0 0 32 32" aria-hidden="true"><path [attr.d]="mark" /><circle cx="16" cy="16" r="2.2" /></svg>
                  <span class="who">Lucía Arenas</span>
                  <span class="role hand">psicóloga clínica · terapia cognitivo-conductual</span>
                  <span class="contact">{{ p.phone }}<br />{{ p.email }}<br />{{ p.address }}</span>
                  <span class="hint hand">voltéala ↺</span>
                </span>
                <span class="face back">
                  <span class="title">Tu próxima cita</span>
                  <span class="row"><small>día</small><span class="ink hand">{{ nextDay() }}</span></span>
                  <span class="row"><small>hora</small><span class="ink hand">5:00 pm</span></span>
                  <span class="row"><small>dónde</small><span class="ink hand">consultorio o en línea</span></span>
                  <span class="bye hand">nos vemos ♡</span>
                  <span class="brand">claro · psicología</span>
                </span>
              </button>
            </div>
          }
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
    /* Propuesta B: tarjeta de cita en papel crema que se voltea */
    .card-wrap.b { filter: drop-shadow(0 30px 28px oklch(0% 0 0 / 0.5)); }
    .appt { position: relative; display: block; width: 100%; aspect-ratio: 1.7; text-align: left; transform-style: preserve-3d; transform: perspective(1400px) rotateY(0deg); rotate: -3deg; transition: transform 900ms var(--ease-bounce), rotate 500ms var(--ease-bounce), translate 500ms var(--ease-bounce); }
    .appt.flipped { transform: perspective(1400px) rotateY(180deg); rotate: 2deg; }
    @media (hover: hover) and (pointer: fine) {
      .appt:hover { rotate: 0deg; translate: 0 -6px; }
      .appt:hover .spiral { rotate: -200deg; }
      .appt:hover .hint { opacity: 1; translate: 0 0; }
    }
    .appt:active { scale: 0.98; }
    .face { position: absolute; inset: 0; display: grid; padding: 24px 26px; background:
        radial-gradient(circle at 20% 30%, oklch(100% 0 0 / 0.5), transparent 40%),
        repeating-linear-gradient(0deg, oklch(27% 0.055 255 / 0.015) 0 2px, transparent 2px 4px), var(--card);
      color: var(--ink); backface-visibility: hidden; -webkit-backface-visibility: hidden;
      clip-path: polygon(0 1%, 18% 0, 40% 1.2%, 63% 0, 85% 1%, 100% 0, 99.4% 30%, 100% 62%, 99.2% 100%, 70% 99%, 45% 100%, 20% 98.8%, 0 100%, 0.8% 60%); }
    .front { grid-template-columns: auto 1fr; grid-template-rows: auto auto 1fr auto; column-gap: 14px; align-items: center; }
    .front .tape { top: 6px; right: 20px; left: auto; rotate: 8deg; }
    .spiral { grid-row: span 2; width: 54px; height: 54px; overflow: visible; color: var(--sage-deep); transition: rotate 900ms var(--ease-smooth-out); }
    .spiral path { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
    .spiral circle { fill: var(--peach); }
    .who { font-family: var(--font-display); font-stretch: 75%; font-size: 2rem; font-weight: 800; line-height: 0.9; text-transform: uppercase; }
    .role { font-size: 1.15rem; line-height: 1.1; color: var(--sage-deep); }
    .contact { grid-column: 1 / -1; align-self: end; max-width: 74%; font-size: 0.8rem; line-height: 1.45; color: var(--ink-2); }
    .hint { position: absolute; right: 22px; bottom: 16px; font-size: 1.2rem; color: var(--peach-deep); opacity: 0.75; translate: 0 4px; transition: opacity 300ms ease, translate 400ms var(--ease-bounce); }
    .back { transform: rotateY(180deg); align-content: start; gap: 6px; background: repeating-linear-gradient(transparent 0 31px, oklch(64% 0.065 245 / 0.25) 31px 32px), var(--peach-soft); }
    .title { font-family: var(--font-display); font-stretch: 75%; font-size: 1.5rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
    .row { display: grid; grid-template-columns: 4.2em 1fr; align-items: baseline; }
    .row small { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
    /* La letra aparece de izquierda a derecha, como si se escribiera en ese momento */
    .ink { font-size: 1.6rem; line-height: 1; color: var(--navy); clip-path: inset(0 100% 0 0); }
    .appt.flipped .ink { clip-path: inset(0 0 0 0); transition: clip-path 900ms linear; }
    .appt.flipped .row:nth-of-type(2) .ink { transition-delay: 450ms; }
    .appt.flipped .row:nth-of-type(3) .ink { transition-delay: 1100ms; }
    .appt.flipped .row:nth-of-type(4) .ink { transition-delay: 1700ms; }
    .bye { position: absolute; right: 22px; bottom: 14px; font-size: 1.5rem; color: var(--peach-deep); opacity: 0; rotate: -6deg; scale: 0.6; }
    .appt.flipped .bye { opacity: 1; scale: 1; transition: opacity 300ms ease 2.5s, scale 500ms var(--ease-bounce) 2.5s; }
    .brand { position: absolute; left: 26px; bottom: 16px; font-family: var(--font-hand); font-size: 1rem; color: var(--sage-deep); }
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
  /** Propuesta de tarjeta: "b" (cita de papel, la nueva) o "a" (verde con línea dorada) con ?tarjeta=a en la dirección. */
  protected readonly variant = signal<'a' | 'b'>('b');
  protected readonly flipped = signal(false);
  protected readonly nextDay = signal('jueves 12');
  protected readonly mark = MARK;

  constructor() {
    afterNextRender(() => {
      if (new URLSearchParams(location.search).get('tarjeta') === 'a') this.variant.set('a');
      // El siguiente día con consulta (a partir de mañana), para la fecha escrita a mano
      const d = new Date();
      do d.setDate(d.getDate() + 1); while (!HOURS[d.getDay()]);
      this.nextDay.set(`${DAY_NAMES[d.getDay()].toLowerCase()} ${d.getDate()}`);
    });
  }

  protected flip() {
    this.flipped.set(!this.flipped());
  }
  protected readonly p = PRACTICE;
  protected readonly year = new Date().getFullYear();
}
