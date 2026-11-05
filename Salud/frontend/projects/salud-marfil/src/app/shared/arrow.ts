import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Flecha de "Ver más" de transitions.dev: al pasar el cursor avanza y sus brazos se abren en flecha. */
@Component({
  selector: 'app-arrow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 't-learn-chevron' },
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path class="t-learn-line" d="M3 8h7" />
    <path class="t-learn-arm t-learn-arm-top" d="M6.5 4.5 10 8" />
    <path class="t-learn-arm t-learn-arm-bot" d="M6.5 11.5 10 8" />
  </svg>`,
})
export class Arrow {}
