import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Agenda } from '../sections/agenda';
import { Hero } from '../sections/hero';
import { Location } from '../sections/location';
import { Odontogram } from '../sections/odontogram';
import { Prices } from '../sections/prices';
import { Reviews } from '../sections/reviews';
import { Team } from '../sections/team';
import { Visit } from '../sections/visit';
import { Whitening } from '../sections/whitening';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Odontogram, Whitening, Visit, Team, Prices, Reviews, Agenda, Location],
  template: `
    <app-hero />
    <app-odontogram />
    <app-whitening />
    <app-visit />
    <app-team />
    <app-prices />
    <app-reviews />
    <app-agenda />
    <app-location />
  `,
})
export default class Home {
  constructor() {
    inject(Title).setTitle('Marfil · Dentista en Aguascalientes | Odontología general y estética');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Clínica dental en Aguascalientes: limpieza, blanqueamiento, resinas, ortodoncia con alineadores, implantes y odontopediatría. Valoración con radiografía por $350 y precios por escrito.',
    });
  }
}
