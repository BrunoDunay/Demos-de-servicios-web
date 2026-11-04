import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { PlayInView } from '../shared/in-view-video';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

const PANELS = [
  { title: 'Estudio Reformer', text: 'Doce reformers de maple y luz que baja con la respiración.', img: 'reformer-warm', video: 'v-reformer' },
  { title: 'Sala de Ride', text: 'Oscuridad, aros de luz y sonido que se siente en el pecho.', img: 'ride-rojo' },
  { title: 'Sala de pesas', text: 'Gimnasio completo con cardio frente al jardín y coach de piso.', img: 'gym-ventanal' },
  { title: 'Estudio de Fuerza', text: 'Peso libre con técnica de estudio y grupos de ocho.', img: 'fuerza-sala', video: 'v-pila' },
  { title: 'Vestidores', text: 'Piedra, madera ahumada, regaderas de lluvia y amenidades de autor.', img: 'vestidor-umbral' },
  { title: 'Sauna', text: 'Calor seco infrarrojo para cerrar el día.', img: 'sauna', video: 'v-piedras' },
];

/** Acordeón del club: el panel bajo el cursor se abre y reproduce su video; los demás se recogen. */
@Component({
  selector: 'app-club-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, SplitLines, Reveal, PlayInView],
  template: `
    <section class="section club">
      <div class="container">
        <div class="head">
          <div>
            <span class="label" data-reveal>El espacio</span>
            <h2 class="h2" splitLines>Un club diseñado<br />para <em class="gold">quedarte.</em></h2>
          </div>
          <a routerLink="/club" class="link-line" data-reveal>Recorrerlo en 3D <app-icon name="arrow-right" [size]="16" /></a>
        </div>
        <div class="accordion" data-reveal="fade" (pointerleave)="open.set(0)">
          @for (p of panels; track p.title; let i = $index) {
            <a routerLink="/club" class="panel" [class.is-open]="open() === i" (pointerenter)="open.set(i)" (focus)="open.set(i)" data-cursor="Ver">
              @if (p.video) {
                <video [playInView]="'media/' + p.video + '.mp4'" [attr.poster]="'media/' + p.video + '-poster.jpg'" muted loop playsinline preload="none" aria-hidden="true"></video>
              } @else {
                <img class="warm" [src]="'media/' + p.img + '-sm.webp'" [alt]="p.title" />
              }
              <span class="shade"></span>
              <span class="num">0{{ i + 1 }}</span>
              <span class="vertical">{{ p.title }}</span>
              <span class="info">
                <b>{{ p.title }}</b>
                <small>{{ p.text }}</small>
              </span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 56px; }
    .h2 { margin-top: 20px; }
    .accordion { display: flex; gap: 10px; height: clamp(440px, 68svh, 680px); }
    .panel { position: relative; flex: 1; min-width: 0; overflow: hidden; background: var(--bg-3); transition: flex 900ms var(--ease-out); }
    .panel.is-open { flex: 4.2; }
    .panel:first-child { border-radius: 260px 0 0 0; }
    .panel:last-child { border-radius: 0 260px 0 0; }
    .panel img, .panel video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); transition: transform 1.4s var(--ease-out), filter 800ms ease; filter: brightness(0.6) saturate(0.7); }
    .panel.is-open img, .panel.is-open video { transform: scale(1); filter: brightness(1) saturate(1); }
    .shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgb(13 12 10 / 90%), transparent 55%); }
    .num { position: absolute; top: 22px; left: 22px; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.22em; color: var(--gold); }
    .vertical { position: absolute; left: 50%; bottom: 28px; transform-origin: left bottom; transform: translateX(0.6em) rotate(-90deg); white-space: nowrap; font-family: var(--font-display); font-size: 1.6rem; transition: opacity 500ms ease; }
    .panel.is-open .vertical { opacity: 0; }
    .info { position: absolute; left: 30px; right: 30px; bottom: 28px; display: flex; flex-direction: column; gap: 6px; opacity: 0; transform: translateY(18px); transition: opacity 500ms ease, transform 800ms var(--ease-out); }
    .panel.is-open .info { opacity: 1; transform: none; transition-delay: 250ms; }
    .info b { font-family: var(--font-display); font-weight: 400; font-size: clamp(2rem, 3vw, 3rem); line-height: 1; white-space: nowrap; }
    .info small { font-size: 0.92rem; color: var(--ink-2); font-weight: 300; max-width: 380px; }
    @media (max-width: 900px) {
      .accordion { flex-direction: column; height: auto; }
      .panel, .panel.is-open { flex: none; height: 300px; }
      .panel:first-child { border-radius: 160px 160px 0 0; }
      .panel:last-child { border-radius: 0; }
      .panel img, .panel video { filter: none; transform: none; }
      .vertical { display: none; }
      .info { opacity: 1; transform: none; }
    }
  `,
})
export class ClubPreview {
  protected readonly panels = PANELS;
  protected readonly open = signal(0);
}
