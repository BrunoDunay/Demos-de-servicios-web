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
    updated: 'Noviembre de 2026',
    intro:
      'Valeria Ríos, psicóloga (en adelante, “Claro”), con domicilio en Av. Héroe de Nacozari Sur 1520, int. 3, Las Américas, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      { h: 'Datos que recabamos', p: ['Nombre, teléfono, correo y datos de facturación.', 'Datos sensibles sobre tu salud emocional y tu historia personal, que compartes en sesión. Solo los tratamos con tu consentimiento expreso y por escrito.'] },
      { h: 'Para qué los usamos', p: ['Para darte atención psicológica, llevar tu expediente, agendar y confirmar sesiones y emitir facturas. No usamos tus datos con fines publicitarios.'] },
      { h: 'Confidencialidad y sus límites', p: ['Lo que compartes en sesión es confidencial, conforme al Código Ético del Psicólogo. Solo podría romperse si existe riesgo grave para tu vida o la de otra persona, o por orden de una autoridad judicial; si llegara a pasar, te lo informaríamos.'] },
      { h: 'Sesiones en línea', p: ['Usamos plataformas de videollamada con cifrado. Las sesiones nunca se graban.'] },
      { h: 'Tus derechos ARCO', p: ['Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos, o revocar tu consentimiento, escribiendo a privacidad@claropsicologia.mx con tu nombre y una identificación. Respondemos en un máximo de 20 días hábiles.'] },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Noviembre de 2026',
    intro: 'Estas condiciones aplican a las sesiones que agendas en Claro. Son pocas y están pensadas para cuidar tu proceso.',
    sections: [
      { h: 'Sesiones', p: ['Las sesiones individuales y de adolescentes duran 50 minutos; las de pareja, 75. Si llegas tarde, la sesión termina a la hora acordada.'] },
      { h: 'Cancelaciones', p: ['Puedes cancelar o mover tu sesión sin costo avisando con 24 horas de anticipación. Con menos tiempo, la sesión se cobra.'] },
      { h: 'Pagos', p: ['El pago se hace al inicio de cada sesión, por transferencia, tarjeta o efectivo. El paquete de 4 sesiones se paga por adelantado y tiene vigencia de 6 semanas.'] },
      { h: 'Menores de edad', p: ['Para atender a menores se necesita el consentimiento firmado de madre, padre o tutor. Lo que el adolescente comparte en sesión es confidencial, salvo situaciones de riesgo.'] },
      { h: 'Urgencias', p: ['Claro no es un servicio de urgencias. En una crisis, llama a la Línea de la Vida (800 911 2000) o al 911.'] },
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
        <p class="kicker">Legal · actualizado {{ doc().updated }}</p>
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
    .legal { padding: 140px 0 110px; }
    .narrow { max-width: 820px; }
    .back { display: block; width: fit-content; margin-bottom: 30px; font-size: 0.9rem; font-weight: 650; color: var(--muted); transition: color 200ms ease, translate 400ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .back:hover { color: var(--peach-deep); translate: -4px 0; } }
    h1 { margin-top: 18px; font-size: clamp(3rem, 8vw, 6rem); text-transform: uppercase; }
    .intro { margin-top: 24px; font-size: 1.12rem; color: var(--ink-2); }
    section { margin-top: 40px; padding-top: 26px; border-top: 1px solid var(--line); }
    h2 { display: flex; gap: 14px; align-items: baseline; font-size: 2rem; text-transform: uppercase; }
    h2 span { font-family: var(--font-body); font-size: 0.8rem; font-weight: 700; color: var(--peach-deep); }
    section p { margin-top: 12px; color: var(--ink-2); }
    .note { margin-top: 56px; padding: 16px 18px; border-radius: var(--radius-s); border: 1px dashed var(--line-2); font-size: 0.88rem; color: var(--muted); }
  `,
})
export default class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly key = toSignal(this.route.data.pipe(map((d) => d['doc'] as string)), { initialValue: 'privacidad' });
  protected readonly doc = computed(() => DOCS[this.key()] ?? DOCS['privacidad']);

  constructor() {
    const d = DOCS[this.route.snapshot.data['doc']] ?? DOCS['privacidad'];
    inject(Title).setTitle(`${d.title} · Claro Psicología`);
    inject(Meta).updateTag({ name: 'description', content: d.intro.slice(0, 155) });
  }
}
