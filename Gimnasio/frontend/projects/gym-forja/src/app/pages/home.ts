import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Coaches } from '../sections/coaches';
import { Contact } from '../sections/contact';
import { Disciplines } from '../sections/disciplines';
import { Gallery } from '../sections/gallery';
import { Hero } from '../sections/hero';
import { Manifesto } from '../sections/manifesto';
import { Movements } from '../sections/movements';
import { Plans } from '../sections/plans';
import { Schedule } from '../sections/schedule';
import { Stats } from '../sections/stats';
import { Testimonials } from '../sections/testimonials';
import { Ticker } from '../sections/ticker';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Ticker, Manifesto, Disciplines, Stats, Schedule, Movements, Coaches, Plans, Gallery, Testimonials, Contact],
  template: `
    <app-hero />
    <app-ticker />
    <app-manifesto />
    <app-disciplines />
    <app-stats />
    <app-schedule />
    <app-movements />
    <app-coaches />
    <app-plans />
    <app-gallery />
    <app-testimonials />
    <app-contact />
  `,
})
export default class Home {
  constructor() {
    inject(Title).setTitle('Forja · Box funcional en Aguascalientes');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Forja es un box de entrenamiento funcional en Aguascalientes: crosstraining, halterofilia y gimnástica en grupos chicos, con coach en cada clase. Tu primera clase es gratis.',
    });
  }
}
