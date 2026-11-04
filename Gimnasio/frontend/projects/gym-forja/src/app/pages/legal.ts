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
      'Forja Box Funcional (en adelante, “Forja”), con domicilio en Calle Fundidores 402, Zona Industrial, Aguascalientes, Ags., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      { h: 'Datos que recabamos', p: ['Nombre, número de WhatsApp, correo electrónico, fecha de nacimiento y, solo si tú lo compartes, información sobre lesiones o condiciones médicas relevantes para tu entrenamiento.'] },
      { h: 'Para qué los usamos', p: ['Agendar tu clase de prueba, administrar tu membresía, adaptar los entrenamientos a tu condición física y enviarte avisos sobre horarios, eventos y cambios en el box.', 'De forma secundaria, para enviarte promociones. Puedes pedir que dejemos de hacerlo en cualquier momento.'] },
      { h: 'Con quién los compartimos', p: ['No vendemos ni rentamos tus datos. Solo los compartimos con proveedores que nos ayudan a operar (por ejemplo, cobro de membresías), bajo acuerdos de confidencialidad.'] },
      { h: 'Tus derechos ARCO', p: ['Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a privacidad@forjabox.mx con tu nombre completo y una identificación. Respondemos en un plazo máximo de 20 días hábiles.'] },
      { h: 'Cambios a este aviso', p: ['Cualquier cambio se publicará en esta página y en la recepción del box.'] },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Octubre de 2026',
    intro: 'Al contratar una membresía o tomar una clase en Forja aceptas las siguientes condiciones. Están pensadas para que todos entrenemos seguros y con buen ambiente.',
    sections: [
      { h: 'Membresías y pagos', p: ['Las membresías se pagan por adelantado y son personales e intransferibles. La clase de prueba es gratuita una sola vez por persona.'] },
      { h: 'Reservas y cancelaciones', p: ['Las clases se reservan por WhatsApp. Si no puedes asistir, avisa con al menos 2 horas de anticipación para liberar tu lugar. Las clases no tomadas no son acumulables al siguiente mes.'] },
      { h: 'Salud y seguridad', p: ['Antes de tu primera clase llenarás un cuestionario de salud. Es tu responsabilidad informar al coach sobre lesiones o condiciones médicas. Recomendamos una valoración médica si tienes más de 40 años o no has hecho ejercicio en mucho tiempo.'] },
      { h: 'Uso de instalaciones', p: ['Regresa el equipo a su lugar, limpia tu área al terminar y usa calzado deportivo. El coach puede pedir a cualquier persona que se retire si pone en riesgo su seguridad o la de otros.'] },
      { h: 'Fotos y video', p: ['Durante clases y eventos tomamos fotos para nuestras redes. Si prefieres no aparecer, avísale al coach y lo respetamos.'] },
    ],
  },
};

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal">
      <div class="container narrow">
        <a routerLink="/" class="back">← Volver al inicio</a>
        <span class="tag">Legal · Actualizado {{ doc().updated }}</span>
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
    .legal { padding: 150px 0 100px; }
    .narrow { max-width: 820px; }
    .back { display: inline-block; margin-bottom: 30px; font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.1em; color: var(--muted); transition: color 200ms ease, transform 300ms var(--ease-expo); }
    .back:hover { color: var(--ember); transform: translateX(-4px); }
    h1 { margin-top: 18px; font-size: clamp(3rem, 8vw, 6.4rem); }
    .intro { margin-top: 26px; font-size: 1.15rem; color: var(--ink-2); }
    section { margin-top: 44px; padding-top: 28px; border-top: 1px solid var(--line); }
    h2 { display: flex; gap: 14px; align-items: baseline; font-size: 2rem; }
    h2 span { font-family: var(--font-mono); font-size: 0.8rem; color: var(--ember); }
    section p { margin-top: 12px; color: var(--ink-2); }
    .note { margin-top: 60px; padding: 16px 18px; border: 1px dashed var(--line-2); font-size: 0.85rem; color: var(--muted); }
  `,
})
export default class Legal {
  private readonly route = inject(ActivatedRoute);
  private readonly key = toSignal(this.route.data.pipe(map((d) => d['doc'] as string)), { initialValue: 'privacidad' });
  protected readonly doc = computed(() => DOCS[this.key()] ?? DOCS['privacidad']);

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    const d = DOCS[this.route.snapshot.data['doc']] ?? DOCS['privacidad'];
    title.setTitle(`${d.title} · Forja Box Funcional`);
    meta.updateTag({ name: 'description', content: d.intro.slice(0, 155) });
  }
}
