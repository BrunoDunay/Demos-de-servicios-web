import { Routes } from '@angular/router';
import Home from './home';

// Básico: una sola página con secciones.
export const routes: Routes = [
  { path: '', component: Home },
  { path: '**', redirectTo: '' },
];
