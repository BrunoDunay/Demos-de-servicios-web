import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPARE, PACKS, PLANS } from '../core/content';
import { Faq } from '../sections/faq';
import { PlanCards } from '../sections/plan-cards';
import { Icon } from '../shared/icon';
import { MemberHero } from '../sections/member-hero';
import { SplitLines } from '../shared/pointer';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-membresias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MemberHero, PlanCards, Faq, RouterLink, Icon, SplitLines, Reveal],
  template: `
    <app-member-hero />

    <section class="section plans" id="planes">
      <div class="container">
        <div class="top">
          <h2 class="h2" splitLines>Tres formas de <em class="gold">ser socio.</em></h2>
          <div class="billing" role="radiogroup" aria-label="Forma de pago" data-reveal>
            <span class="pill" [class.right]="annual()"></span>
            <button type="button" role="radio" [attr.aria-checked]="!annual()" [class.on]="!annual()" (click)="annual.set(false)">Mensual</button>
            <button type="button" role="radio" [attr.aria-checked]="annual()" [class.on]="annual()" (click)="annual.set(true)">Anual <small>−15%</small></button>
          </div>
        </div>
        <app-plan-cards [annual]="annual()" />
      </div>
    </section>

    <section class="section compare">
      <div class="container">
        <span class="label" data-reveal>Comparativa</span>
        <h2 class="h2" splitLines>Todo, <em class="gold">lado a lado.</em></h2>
        <div class="table-wrap" data-reveal>
          <table>
            <thead>
              <tr>
                <th scope="col"><span class="visually-hidden">Característica</span></th>
                @for (p of plans; track p.id) {
                  <th scope="col" [class.feat]="p.featured">{{ p.name }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of compare; track row.feature) {
                <tr>
                  <th scope="row">{{ row.feature }}</th>
                  @for (v of row.values; track $index; let i = $index) {
                    <td [class.feat]="plans[i].featured">
                      @if (v === true) {
                        <app-icon name="check" [size]="18" /><span class="visually-hidden">Incluido</span>
                      } @else if (v === false) {
                        <span class="no" aria-label="No incluido">—</span>
                      } @else {
                        {{ v }}
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section packs">
      <div class="container">
        <div class="packs-head">
          <div>
            <span class="label" data-reveal>Sin membresía</span>
            <h2 class="h2" splitLines>Paquetes de <em class="gold">clases.</em></h2>
          </div>
          <p class="lead" data-reveal>Para los que viajan, los que prueban o los que prefieren decidir cada semana.</p>
        </div>
        <div class="packs-grid">
          @for (p of packs; track p.name; let i = $index) {
            <a routerLink="/contacto" [queryParams]="{ interes: i === 0 ? 'Primera sesión de cortesía' : 'Paquete de clases', clase: p.name }" class="pack" data-reveal [revealDelay]="i * 90" data-cursor="ELEGIR">
              <span class="pack-name">{{ p.name }}</span>
              <b>{{ p.price === 0 ? 'Cortesía' : '$' + p.price.toLocaleString('es-MX') }}</b>
              <small>{{ p.note }}</small>
              <span class="go"><app-icon name="arrow-up-right" [size]="18" /></span>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="section faq-sec">
      <div class="container faq-grid">
        <div>
          <span class="label" data-reveal>Dudas frecuentes</span>
          <h2 class="h2" splitLines>Antes de <em class="gold">cruzar.</em></h2>
          <a routerLink="/contacto" class="link-line more" data-reveal>Ver todas las preguntas <app-icon name="arrow-right" [size]="16" /></a>
        </div>
        <app-faq [limit]="4" />
      </div>
    </section>
  `,
  styles: `
    .top { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 56px; }
    .billing { position: relative; display: grid; grid-template-columns: 1fr 1fr; padding: 5px; border-radius: 999px; box-shadow: inset 0 0 0 1px var(--line-2); }
    .pill { position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 999px; background: var(--gold); transition: transform 700ms var(--ease-out); }
    .pill.right { transform: translateX(100%); }
    .billing button { position: relative; z-index: 1; min-height: 46px; padding: 0 26px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-2); transition: color 500ms ease; }
    .billing button.on { color: var(--bg); }
    .billing small { margin-left: 6px; font-size: 0.66rem; }
    .compare { background: var(--bg-2); }
    .compare .h2 { margin-top: 20px; }
    .table-wrap { margin-top: 50px; overflow-x: auto; }
    table { width: 100%; min-width: 640px; border-collapse: collapse; }
    th, td { padding: 20px 16px; text-align: center; border-bottom: 1px solid var(--line); font-weight: 300; }
    thead th { font-family: var(--font-display); font-size: 1.9rem; font-weight: 400; }
    tbody th { text-align: left; font-weight: 500; color: var(--ink-2); padding-left: 0; }
    td app-icon { display: inline-flex; color: var(--gold); }
    .no { color: var(--muted); }
    .feat { background: rgb(216 185 138 / 6%); }
    thead .feat { color: var(--gold); }
    tbody tr { transition: background-color 400ms ease; }
    @media (hover: hover) and (pointer: fine) { tbody tr:hover { background: rgb(239 232 220 / 3%); } }
    .packs-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; }
    .packs-head .h2 { margin-top: 20px; }
    .packs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .pack { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 32px 28px; box-shadow: inset 0 0 0 1px var(--line); transition: background-color 500ms ease, box-shadow 500ms ease, transform 700ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .pack:hover { background: var(--bg-2); box-shadow: inset 0 0 0 1px var(--gold); transform: translateY(-6px); } }
    .pack-name { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); }
    .pack b { font-family: var(--font-display); font-weight: 400; font-size: 2.8rem; line-height: 1; margin-top: 18px; }
    .pack small { color: var(--muted); }
    .go { position: absolute; top: 24px; right: 24px; color: var(--muted); transition: color 400ms ease, transform 600ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .pack:hover .go { color: var(--gold); transform: translate(3px, -3px); } }
    .faq-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(32px, 6vw, 100px); align-items: start; }
    .faq-grid .h2 { margin-top: 20px; }
    .more { margin-top: 30px; }
    @media (max-width: 900px) { .packs-grid { grid-template-columns: 1fr 1fr; } .faq-grid { grid-template-columns: 1fr; } }
  `,
})
export default class Membresias {
  protected readonly annual = signal(false);
  protected readonly plans = PLANS;
  protected readonly compare = COMPARE;
  protected readonly packs = PACKS;
}
