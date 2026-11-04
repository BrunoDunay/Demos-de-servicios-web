import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { About } from '../sections/about';
import { Agenda } from '../sections/agenda';
import { Breathe } from '../sections/breathe';
import { Hero } from '../sections/hero';
import { Location } from '../sections/location';
import { Therapy } from '../sections/therapy';
import { Topics } from '../sections/topics';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Topics, Breathe, Therapy, About, Agenda, Location],
  template: `
    <app-hero />
    <app-topics />
    <app-breathe />
    <app-therapy />
    <app-about />
    <app-agenda />
    <app-location />
  `,
})
export default class Home {
  constructor() {
    inject(Title).setTitle('Claro · Psicóloga en Aguascalientes | Terapia individual, de pareja y en línea');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Psicoterapia con Valeria Ríos en Aguascalientes y en línea: ansiedad, duelo, autoestima, estrés, terapia de pareja y adolescentes. Primera sesión de valoración por $600.',
    });
  }
}
