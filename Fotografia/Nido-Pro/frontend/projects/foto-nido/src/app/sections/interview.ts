import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INTERVIEW } from '../core/content';
import { Reveal } from '../shared/reveal';
import { Drift, Running } from '../shared/running';

/** La fotógrafa contada como entrevista de revista: preguntas cortas, respuestas suyas. */
@Component({
  selector: 'app-interview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Drift, Running],
  template: `
    <section class="section interview" id="ines" running="Inés, en sus palabras">
      <div class="page">
        <p class="folio" data-reveal><span><b>Inés Calvo</b> · fotógrafa desde 2017</span><span>p. 40</span></p>
        <div class="layout">
          <figure class="portrait">
            <div class="frame" data-reveal="photo" drift>
              <img src="media/ines-sm.webp" srcset="media/ines-sm.webp 720w, media/ines.webp 1000w" sizes="(max-width: 900px) 80vw, 30vw"
                alt="Inés Calvo con su cámara colgada al hombro" width="1000" height="1500" loading="lazy" />
            </div>
            <figcaption class="caption">Inés en el estudio de Hornedo, una mañana sin sesiones.</figcaption>
          </figure>
          <div class="talk">
            <h2 data-reveal>“Mi trabajo es que tú descanses mientras yo <em>cuido los detalles</em>.”</h2>
            <dl>
              @for (x of qa; track x.q; let i = $index) {
                <div data-reveal [revealDelay]="i * 80">
                  <dt>{{ x.q }}</dt>
                  <dd>{{ x.a }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .interview { background: var(--paper-2); }
    .layout { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: clamp(40px, 7vw, 120px); margin-top: clamp(40px, 6vw, 80px); align-items: start; }
    .portrait { margin: 0; position: sticky; top: 110px; }
    .frame { aspect-ratio: 2 / 3; overflow: hidden; }
    .frame img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
    figcaption { margin-top: 10px; }
    h2 { font-size: clamp(2.2rem, 4.4vw, 4.2rem); line-height: 1.02; }
    h2 em { color: var(--hilo); }
    dl { margin: clamp(40px, 5vw, 70px) 0 0; display: grid; gap: 34px; }
    dl div { display: grid; grid-template-columns: 200px 1fr; gap: 24px; padding-top: 22px; border-top: 1px solid var(--line); }
    dt { font-family: var(--font-display); font-style: italic; font-size: 1.5rem; line-height: 1.1; }
    dd { margin: 0; max-width: 52ch; font-size: 1.08rem; color: var(--ink-2); }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .portrait { position: static; max-width: 360px; }
      dl div { grid-template-columns: 1fr; gap: 8px; }
    }
  `,
})
export class Interview {
  protected readonly qa = INTERVIEW;
}
