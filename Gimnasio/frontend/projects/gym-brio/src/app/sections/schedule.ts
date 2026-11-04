import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Booking } from '../core/booking';
import { SCHEDULE } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section" id="clases">
      <div class="container">
        <div class="top">
          <div>
            <span class="eyebrow" data-reveal>Clases grupales</span>
            <h2 class="section-title" data-reveal [revealDelay]="80">Elige tu día. Nosotros ponemos la música.</h2>
          </div>
          <div class="legend" data-reveal [revealDelay]="160">
            <span><i class="lv lv-1"></i> Tranqui</span>
            <span><i class="lv lv-2"></i> Moderada</span>
            <span><i class="lv lv-3"></i> Intensa</span>
          </div>
        </div>

        <div class="tabs" role="tablist" aria-label="Días de la semana" data-reveal [revealDelay]="120">
          <span class="indicator" [style.--x]="active()"></span>
          @for (d of schedule; track d.day; let i = $index) {
            <button type="button" role="tab" class="tab" [class.is-active]="active() === i" [attr.aria-selected]="active() === i" (click)="active.set(i)">
              <span class="long">{{ d.day }}</span><span class="short">{{ d.short }}</span>
            </button>
          }
        </div>

        @for (d of [current()]; track d.day) {
          <ul class="list" role="tabpanel" [attr.aria-label]="'Clases del ' + d.day">
            @for (c of d.classes; track c.time + c.name; let i = $index) {
              <li class="row" [style.--i]="i">
                <span class="time">{{ c.time }}</span>
                <span class="name"><b>{{ c.name }}</b><small>con {{ c.coach }} · {{ c.mins }} min</small></span>
                <span class="level" [attr.aria-label]="'Intensidad ' + c.level + ' de 3'">
                  @for (n of [1, 2, 3]; track n) {
                    <i [class.on]="n <= c.level"></i>
                  }
                </span>
                <button type="button" class="book" [attr.aria-label]="'Reservar ' + c.name + ' a las ' + c.time" (click)="book(d.day, c.time, c.name)">
                  Reservar <app-icon name="arrow-right" [size]="16" />
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </section>
  `,
  styles: `
    .top { display: flex; justify-content: space-between; align-items: end; gap: 24px; flex-wrap: wrap; }
    .legend { display: flex; gap: 16px; font-size: 0.85rem; color: var(--muted); }
    .legend span { display: inline-flex; align-items: center; gap: 6px; }
    .lv { width: 10px; height: 10px; border-radius: 50%; }
    .lv-1 { background: #9ad06a; } .lv-2 { background: #f5b301; } .lv-3 { background: #ff5a3c; }

    .tabs { --n: 6; position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr); margin-top: 36px; padding: 6px; border-radius: 999px; background: var(--surface); box-shadow: var(--shadow-sm); }
    .indicator { position: absolute; top: 6px; bottom: 6px; left: 6px; width: calc((100% - 12px) / var(--n)); border-radius: 999px; background: var(--ink); transform: translateX(calc(var(--x) * 100%)); transition: transform 500ms var(--ease-out); }
    .tab { position: relative; z-index: 1; min-height: 46px; border-radius: 999px; font-weight: 650; color: var(--muted); transition: color 300ms ease, scale 160ms cubic-bezier(0.23, 1, 0.32, 1); }
    .tab:active { scale: 0.96; }
    .tab.is-active { color: #fff; }
    @media (hover: hover) and (pointer: fine) { .tab:not(.is-active):hover { color: var(--ink); } }
    .short { display: none; }

    .list { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 10px; }
    .row {
      display: grid; grid-template-columns: 96px 1fr auto auto; align-items: center; gap: 20px; padding: 16px 16px 16px 24px; border-radius: 18px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line);
      animation: row-in 600ms var(--ease-out) both; animation-delay: calc(var(--i) * 55ms);
      transition: box-shadow 300ms ease, transform 300ms var(--ease-out);
    }
    @keyframes row-in { from { opacity: 0; transform: translateY(14px); } }
    .time { font-family: var(--font-display); font-size: 1.6rem; font-weight: 750; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
    .name { display: flex; flex-direction: column; }
    .name b { font-size: 1.08rem; }
    .name small { color: var(--muted); }
    .level { display: flex; gap: 4px; }
    .level i { width: 22px; height: 6px; border-radius: 4px; background: var(--line); }
    .level i.on { background: var(--brand); }
    .book { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; font-weight: 650; font-size: 0.9rem; background: var(--brand-soft); color: var(--brand); transition: background-color 250ms ease, color 250ms ease, transform 200ms var(--ease-out); }
    .book app-icon { transition: transform 300ms var(--ease-back); }
    .book:active { transform: scale(0.96); }
    @media (hover: hover) {
      .row:hover { box-shadow: inset 0 0 0 1.5px var(--brand), var(--shadow-sm); transform: translateX(4px); }
      .book:hover { background: var(--brand); color: #fff; }
      .book:hover app-icon { transform: translateX(3px); }
    }
    @media (max-width: 720px) {
      .long { display: none; } .short { display: inline; }
      .row { grid-template-columns: 70px 1fr auto; gap: 12px; padding: 14px; }
      .time { font-size: 1.25rem; }
      .level { display: none; }
      .book { padding: 10px 12px; font-size: 0; gap: 0; }
      .book app-icon { font-size: 1rem; }
    }
  `,
})
export class Schedule {
  private readonly booking = inject(Booking);
  protected readonly schedule = SCHEDULE;
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.schedule[this.active()]);

  protected book(day: string, time: string, name: string) {
    this.booking.choose(`${name} · ${day} ${time}`);
  }
}
