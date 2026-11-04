import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Builder } from './sections/builder';
import { Hero } from './sections/hero';
import { Menu } from './sections/menu';
import { Oven } from './sections/oven';
import { Place } from './sections/place';
import { Reviews } from './sections/reviews';
import { Visit } from './sections/visit';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Builder, Menu, Oven, Place, Reviews, Visit],
  template: `
    <app-hero />
    <app-builder />
    <app-menu />
    <app-oven />
    <app-place />
    <app-reviews />
    <app-visit />
  `,
})
export default class Home {}
