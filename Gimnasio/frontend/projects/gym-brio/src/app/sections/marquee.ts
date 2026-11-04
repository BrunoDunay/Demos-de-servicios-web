import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="band" aria-label="Pesas, cardio, funcional, spinning, yoga y coach en piso">
      @for (copy of [0, 1]; track copy) {
        <div class="track" [attr.aria-hidden]="true">
          @for (word of words; track word) {
            <span class="word">{{ word }}</span>
            <app-icon name="sparkle" [size]="26" [stroke]="1.6" />
          }
        </div>
      }
    </div>
  `,
  styles: `
    .band { display: flex; overflow: hidden; background: var(--brand); color: #fff; padding: 22px 0; transform: rotate(-1.2deg) scale(1.02); margin-block: -6px; }
    .track { display: flex; align-items: center; gap: 28px; padding-right: 28px; flex: none; animation: slide 28s linear infinite; }
    .word { font-family: var(--font-display); font-size: clamp(1.6rem, 3.4vw, 2.6rem); font-weight: 750; letter-spacing: -0.03em; white-space: nowrap; }
    app-icon { color: var(--lime); }
    @media (hover: hover) and (pointer: fine) { .band:hover .track { animation-play-state: paused; } }
    @keyframes slide { to { transform: translateX(-100%); } }
  `,
})
export class Marquee {
  protected readonly words = ['Pesas', 'Cardio', 'Funcional', 'Spinning', 'Yoga', 'Coach en piso', 'Sin inscripción'];
}
