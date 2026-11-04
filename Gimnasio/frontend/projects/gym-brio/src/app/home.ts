import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Areas } from './sections/areas';
import { Benefits } from './sections/benefits';
import { Contact } from './sections/contact';
import { Hero } from './sections/hero';
import { Marquee } from './sections/marquee';
import { Plans } from './sections/plans';
import { Reviews } from './sections/reviews';
import { Schedule } from './sections/schedule';
import { Stats } from './sections/stats';
import { Team } from './sections/team';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Marquee, Benefits, Areas, Stats, Schedule, Plans, Team, Reviews, Contact],
  template: `
    <app-hero />
    <app-marquee />
    <app-benefits />
    <app-areas />
    <app-stats />
    <app-schedule />
    <app-plans />
    <app-team />
    <app-reviews />
    <app-contact />
  `,
})
export default class Home {}
