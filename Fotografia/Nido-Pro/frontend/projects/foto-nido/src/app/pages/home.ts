import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CHAPTERS } from '../core/content';
import { ChapterView } from '../sections/chapter';
import { ContactSheet } from '../sections/contact-sheet';
import { Day } from '../sections/day';
import { Hero } from '../sections/hero';
import { Interview } from '../sections/interview';
import { Letters } from '../sections/letters';
import { Rates } from '../sections/rates';
import { Reserve } from '../sections/reserve';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, ChapterView, ContactSheet, Interview, Day, Rates, Letters, Reserve],
  template: `
    <app-hero />
    @for (c of chapters; track c.id; let i = $index) {
      <app-chapter [chapter]="c" [variant]="i + 1" />
    }
    <app-contact-sheet />
    <app-interview />
    <app-day />
    <app-rates />
    <app-letters />
    <app-reserve />
  `,
})
export default class Home {
  protected readonly chapters = CHAPTERS;

  constructor() {
    inject(Title).setTitle('Nido · Fotografía newborn y familia en Aguascalientes');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Nido es el estudio de Inés Calvo: fotografía de recién nacidos, maternidad, familia y primer año en Aguascalientes. Sesiones sin prisa, en un estudio tibio y seguro.',
    });
  }
}
