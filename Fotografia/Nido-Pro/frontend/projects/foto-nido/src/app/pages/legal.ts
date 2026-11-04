import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

const DOCS: Record<string, LegalDoc> = {
  privacidad: {
    title: 'Aviso de privacidad',
    updated: 'Octubre de 2026',
    intro:
      'Nido, estudio de fotografía de Inés Calvo (en adelante, “Nido”), con domicilio en Calle Hornedo 512, Zona Centro, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      { h: 'Datos que recabamos', p: ['Nombre, número de WhatsApp, correo electrónico, fecha probable de parto o fecha de la sesión y, si tú lo compartes, el nombre de tu bebé y datos relevantes para su cuidado durante la sesión (alergias o indicaciones médicas).'] },
      { h: 'Para qué los usamos', p: ['Agendar y preparar tu sesión, enviarte tu guía y tu galería, y avisarte de cambios de fecha.', 'De forma secundaria, para enviarte promociones de temporada. Puedes pedir que dejemos de hacerlo en cualquier momento.'] },
      { h: 'Fotografías de tu familia', p: ['Las fotos son tuyas para uso personal. Solo publicamos en redes o en este sitio las imágenes que tú autorices por escrito, y nunca con el nombre completo de tu bebé.'] },
      { h: 'Con quién los compartimos', p: ['No vendemos ni rentamos tus datos. Solo los compartimos con proveedores que nos ayudan a operar (galería en línea e impresión de álbumes), bajo acuerdos de confidencialidad.'] },
      { h: 'Tus derechos ARCO', p: ['Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a privacidad@nidoestudio.mx con tu nombre completo y una identificación. Respondemos en un plazo máximo de 20 días hábiles.'] },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Octubre de 2026',
    intro: 'Al apartar una sesión en Nido aceptas las siguientes condiciones. Están pensadas para que tu sesión sea tranquila y segura para tu bebé.',
    sections: [
      { h: 'Anticipo y pagos', p: ['La fecha se aparta con un anticipo de $1,000 que se descuenta del total. El resto se paga el día de la sesión, por transferencia, tarjeta o efectivo.'] },
      { h: 'Cambios de fecha', p: ['Puedes cambiar la fecha sin costo avisando con una semana de anticipación. Para newborn, la fecha se ajusta al nacimiento de tu bebé sin penalización.'] },
      { h: 'Seguridad del bebé', p: ['Ninguna pose se fuerza. Si el bebé no está cómodo, cambiamos de set o hacemos una pausa. Un adulto responsable debe estar presente durante toda la sesión.'] },
      { h: 'Entrega', p: ['Recibes 10 fotos en 5 días hábiles y la galería completa en 15 días hábiles. Las fotos se entregan editadas; los archivos sin editar no se entregan.'] },
      { h: 'Uso de las imágenes', p: ['Las fotos son para uso personal. Nido conserva los derechos de autor y solo usa imágenes en su portafolio con tu autorización por escrito.'] },
    ],
  },
};

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal">
      <div class="page narrow">
        <a routerLink="/" class="back">← Volver al inicio</a>
        <p class="folio"><span><b>Legal</b> · actualizado {{ doc().updated }}</span><span>Nido</span></p>
        <h1>{{ doc().title }}</h1>
        <p class="intro">{{ doc().intro }}</p>
        @for (s of doc().sections; track s.h; let i = $index) {
          <section>
            <h2><span>0{{ i + 1 }}</span>{{ s.h }}</h2>
            @for (p of s.p; track p) {
              <p>{{ p }}</p>
            }
          </section>
        }
        <p class="note">Documento de ejemplo para un sitio demo con marca ficticia. En un proyecto real lo revisa un abogado.</p>
      </div>
    </article>
  `,
  styles: `
    .legal { padding: 160px 0 110px; }
    .narrow { max-width: 820px; }
    .back { display: block; width: fit-content; margin-bottom: 30px; font-size: 0.85rem; font-weight: 600; color: var(--muted); transition: color 200ms ease, transform 400ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .back:hover { color: var(--hilo); transform: translateX(-4px); } }
    h1 { margin-top: 30px; font-size: clamp(3rem, 8vw, 6rem); }
    .intro { margin-top: 26px; font-size: 1.15rem; color: var(--ink-2); }
    section { margin-top: 44px; padding-top: 28px; border-top: 1px solid var(--line); }
    h2 { display: flex; gap: 14px; align-items: baseline; font-size: 2rem; }
    h2 span { font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; color: var(--hilo); }
    section p { margin-top: 12px; color: var(--ink-2); }
    .note { margin-top: 60px; padding: 16px 18px; border: 1px dashed var(--line-2); font-size: 0.88rem; color: var(--muted); }
  `,
})
export default class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly key = toSignal(this.route.data.pipe(map((d) => d['doc'] as string)), { initialValue: 'privacidad' });
  protected readonly doc = computed(() => DOCS[this.key()] ?? DOCS['privacidad']);

  constructor() {
    const d = DOCS[this.route.snapshot.data['doc']] ?? DOCS['privacidad'];
    inject(Title).setTitle(`${d.title} · Nido Fotografía`);
    inject(Meta).updateTag({ name: 'description', content: d.intro.slice(0, 155) });
  }
}
