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
      'Marfil Odontología (en adelante, “Marfil”), con domicilio en Av. Universidad 1102, local 4, Bosques del Prado, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      { h: 'Datos que recabamos', p: ['Identificación y contacto: nombre, fecha de nacimiento, teléfono, WhatsApp y correo.', 'Datos de salud, que la ley considera sensibles: antecedentes médicos, alergias, medicamentos, radiografías, fotografías clínicas y el expediente de tus tratamientos. Te pediremos tu consentimiento por escrito para tratarlos.'] },
      { h: 'Para qué los usamos', p: ['Para valorarte, planear y darte tratamiento, integrar tu expediente clínico conforme a la NOM-004-SSA3-2012, agendar y recordarte tus citas, y emitir tus facturas.', 'De forma secundaria, para avisarte de promociones o de tu siguiente revisión. Puedes pedirnos que dejemos de hacerlo en cualquier momento.'] },
      { h: 'Expediente clínico', p: ['Tu expediente se conserva al menos cinco años desde la última atención, como marca la norma. Es confidencial y solo lo consultan los especialistas que te atienden.'] },
      { h: 'Con quién los compartimos', p: ['No vendemos ni rentamos tus datos. Solo los compartimos, con tu autorización, con laboratorios dentales y de imagen que participan en tu tratamiento, y con tu aseguradora si nos pides el informe para un reembolso.'] },
      { h: 'Tus derechos ARCO', p: ['Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos, o revocar tu consentimiento, escribiendo a privacidad@marfildental.mx con tu nombre completo y una identificación. Respondemos en un máximo de 20 días hábiles.'] },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Noviembre de 2026',
    intro: 'Estas condiciones aplican a las citas y tratamientos que agendas en Marfil. Están escritas para que sepas qué esperar, sin letras chiquitas.',
    sections: [
      { h: 'Citas', p: ['Las citas se confirman por WhatsApp. Si no puedes llegar, avísanos con 24 horas de anticipación para darle el espacio a otro paciente.', 'Con 15 minutos de retraso, es posible que tengamos que reagendar para no afectar a los siguientes pacientes.'] },
      { h: 'Presupuestos', p: ['El plan de tratamiento por escrito tiene vigencia de 60 días. Si durante el tratamiento encontramos algo que cambie el plan, te lo explicamos y lo autorizas antes de hacerlo.'] },
      { h: 'Pagos', p: ['Aceptamos efectivo, transferencia y tarjetas. Los meses sin intereses aplican con tarjetas participantes en ortodoncia, implantes y carillas.'] },
      { h: 'Garantías', p: ['Resinas: 1 año. Coronas y carillas: 3 años. Implantes: 5 años. Las garantías requieren tus revisiones cada 6 meses y no cubren golpes ni el uso de los dientes como herramienta.'] },
      { h: 'Precios del sitio', p: ['Los precios publicados son “desde” e incluyen IVA. El precio final depende de tu valoración y queda por escrito antes de empezar.'] },
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
        <p class="pill">Legal · actualizado {{ doc().updated }}</p>
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
    .legal { padding: 150px 0 110px; }
    .narrow { max-width: 820px; }
    .back { display: block; width: fit-content; margin-bottom: 30px; font-size: 0.9rem; font-weight: 650; color: var(--muted); transition: color 200ms ease, translate 400ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .back:hover { color: var(--royal); translate: -4px 0; } }
    h1 { margin-top: 22px; font-size: clamp(2.8rem, 7vw, 5rem); }
    .intro { margin-top: 24px; font-size: 1.12rem; color: var(--ink-2); }
    section { margin-top: 40px; padding-top: 26px; border-top: 1px solid var(--line); }
    h2 { display: flex; gap: 14px; align-items: baseline; font-size: 1.8rem; font-weight: 500; }
    h2 span { font-family: var(--font-body); font-size: 0.8rem; font-weight: 700; color: var(--royal); }
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
    inject(Title).setTitle(`${d.title} · Marfil Odontología`);
    inject(Meta).updateTag({ name: 'description', content: d.intro.slice(0, 155) });
  }
}
