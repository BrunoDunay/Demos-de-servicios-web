import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Agents } from './sections/agents';
import { Calculator } from './sections/calculator';
import { Contact } from './sections/contact';
import { Hero } from './sections/hero';
import { Listings } from './sections/listings';
import { Process } from './sections/process';
import { Services } from './sections/services';
import { Stats } from './sections/stats';
import { Testimonials } from './sections/testimonials';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Stats, Listings, Services, Calculator, Process, Agents, Testimonials, Contact],
  template: `
    <app-hero />
    <app-stats />
    <app-listings />
    <app-services />
    <app-calculator />
    <app-process />
    <app-agents />
    <app-testimonials />
    <app-contact />
  `,
})
export default class Home {}
