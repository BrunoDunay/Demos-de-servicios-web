import { Routes } from '@angular/router';
import Home from './pages/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'aviso-de-privacidad', loadComponent: () => import('./pages/legal'), data: { doc: 'privacidad' } },
  { path: 'terminos', loadComponent: () => import('./pages/legal'), data: { doc: 'terminos' } },
  { path: '**', redirectTo: '' },
];
