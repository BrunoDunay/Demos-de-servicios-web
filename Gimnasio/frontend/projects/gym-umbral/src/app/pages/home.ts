import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArchCta } from '../sections/arch-cta';
import { Atelier } from '../sections/atelier';
import { ClubPreview } from '../sections/club-preview';
import { CoachesRow } from '../sections/coaches-row';
import { Day } from '../sections/day';
import { DisciplinesScene } from '../sections/disciplines-scene';
import { HomeHero } from '../sections/home-hero';
import { Manifesto } from '../sections/manifesto';
import { Numbers } from '../sections/numbers';
import { PlanCards } from '../sections/plan-cards';
import { Reel } from '../sections/reel';
import { Testimonials } from '../sections/testimonials';
import { Icon } from '../shared/icon';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeHero, Manifesto, DisciplinesScene, Day, ClubPreview, Numbers, CoachesRow, PlanCards, Testimonials, Atelier, Reel, ArchCta, RouterLink, Icon, SplitLines, Reveal],
  template: `
    <app-home-hero />
    <app-manifesto />
    <app-disciplines-scene />
    <app-day />
    <app-club-preview />
    <app-numbers />
    <app-coaches-row />

    <section class="section plans">
      <div class="container">
        <div class="head">
          <div>
            <span class="label" data-reveal>Membresías</span>
            <h2 class="h2" splitLines>Elige cómo <em class="gold">entrar.</em></h2>
          </div>
          <a routerLink="/membresias" class="link-line" data-reveal>Comparar membresías <app-icon name="arrow-right" [size]="16" /></a>
        </div>
        <app-plan-cards />
      </div>
    </section>

    <app-testimonials />
    <app-atelier />
    <app-reel />
    <app-arch-cta />
  `,
  styles: `
    .plans .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 56px; }
    .plans .h2 { margin-top: 20px; }
  `,
})
export default class Home {}
