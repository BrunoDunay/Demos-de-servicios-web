import { Routes } from '@angular/router';
import { leavePage } from './core/transition';
import Home from './pages/home';

// Cada ruta trae su título y descripción para el SEO (los aplica core/seo.ts) y usa el telón al salir.
export const routes: Routes = [
  {
    path: '',
    component: Home,
    canDeactivate: [leavePage],
    data: {
      title: 'Umbral · Boutique fitness club en Aguascalientes',
      description: 'Reformer, Ride, Fuerza, sala de pesas, movilidad, entrenamiento uno a uno y recovery, con vestidores de autor. Tu primera sesión es por nuestra cuenta.',
    },
  },
  {
    path: 'disciplinas',
    loadComponent: () => import('./pages/disciplinas'),
    canDeactivate: [leavePage],
    data: {
      title: 'Disciplinas · Reformer, Ride, Fuerza y más | Umbral',
      description: 'Pilates Reformer, indoor cycling y entrenamiento de fuerza en grupos pequeños. Consulta el horario semanal y reserva tu clase.',
    },
  },
  {
    path: 'club',
    loadComponent: () => import('./pages/club'),
    canDeactivate: [leavePage],
    data: {
      title: 'El club · Estudios, vestidores y sauna | Umbral',
      description: '1,400 m² con sala de pesas, estudios privados, vestidores con amenidades, sauna infrarrojo, barra de café y estacionamiento.',
    },
  },
  {
    path: 'membresias',
    loadComponent: () => import('./pages/membresias'),
    canDeactivate: [leavePage],
    data: {
      title: 'Membresías y paquetes de clases | Umbral',
      description: 'Membresías Gold, Platinum y Diamond sin inscripción. Paquetes de 1, 5 y 10 clases y primera sesión de cortesía.',
    },
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto'),
    canDeactivate: [leavePage],
    data: {
      title: 'Contacto y reservas | Umbral',
      description: 'Reserva tu sesión de cortesía por WhatsApp, agenda un recorrido o resuelve tus dudas. Av. de las Jacarandas 1200, Aguascalientes.',
    },
  },
  {
    path: 'aviso-de-privacidad',
    loadComponent: () => import('./pages/legal'),
    canDeactivate: [leavePage],
    data: { doc: 'privacidad', title: 'Aviso de privacidad | Umbral', description: 'Cómo tratamos y protegemos tus datos personales en Umbral Boutique Fitness Club.' },
  },
  {
    path: 'terminos',
    loadComponent: () => import('./pages/legal'),
    canDeactivate: [leavePage],
    data: { doc: 'terminos', title: 'Términos y condiciones | Umbral', description: 'Condiciones de membresías, reservas, cancelaciones y uso de instalaciones de Umbral.' },
  },
  { path: '**', redirectTo: '' },
];
