import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Íconos de línea (24×24) dibujados a mano para Forja.
const ICONS: Record<string, string> = {
  'arrow-right': '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  'arrow-down': '<path d="M12 4v16"/><path d="m6 14 6 6 6-6"/>',
  barbell: '<path d="M2 12h20M5.5 8v8M8.5 6v12M15.5 6v12M18.5 8v8"/>',
  kettlebell: '<path d="M9 9.5V7a3 3 0 0 1 6 0v2.5"/><circle cx="12" cy="15" r="6"/>',
  rings: '<path d="M7 2v8.5M17 2v8.5"/><circle cx="7" cy="14.5" r="3.5"/><circle cx="17" cy="14.5" r="3.5"/>',
  pulse: '<path d="M2 12h4l2.5-6 4 12 2.5-6H22"/>',
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  door: '<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><path d="M3 21h18M14.5 12h.01"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  target: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  pause: '<path d="M8 4.5v15M16 4.5v15"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  menu: '<path d="M3 8h18M3 16h18"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
};

type Shape =
  | { t: 'path'; d: string }
  | { t: 'circle'; cx: string; cy: string; r: string }
  | { t: 'rect'; x: string; y: string; w: string; h: string; rx: string };

// Convierte el marcado en figuras que la plantilla dibuja sin innerHTML (así funciona en el prerender).
const attr = (tag: string, name: string) => tag.match(new RegExp(` ${name}="([^"]*)"`))?.[1] ?? '0';
const SHAPES: Record<string, Shape[]> = Object.fromEntries(
  Object.entries(ICONS).map(([key, markup]) => [
    key,
    (markup.match(/<(path|circle|rect) [^>]*>/g) ?? []).map((tag): Shape => {
      if (tag.startsWith('<path')) return { t: 'path', d: attr(tag, 'd') };
      if (tag.startsWith('<circle')) return { t: 'circle', cx: attr(tag, 'cx'), cy: attr(tag, 'cy'), r: attr(tag, 'r') };
      return { t: 'rect', x: attr(tag, 'x'), y: attr(tag, 'y'), w: attr(tag, 'width'), h: attr(tag, 'height'), rx: attr(tag, 'rx') };
    }),
  ]),
);

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'icon' },
  template: `<svg
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 24 24"
    [attr.fill]="filled() ? 'currentColor' : 'none'"
    stroke="currentColor"
    [attr.stroke-width]="stroke()"
    stroke-linecap="square"
    stroke-linejoin="miter"
  >
    @for (s of shapes(); track $index) {
      @switch (s.t) {
        @case ('path') {
          <path [attr.d]="$any(s).d" />
        }
        @case ('circle') {
          <circle [attr.cx]="$any(s).cx" [attr.cy]="$any(s).cy" [attr.r]="$any(s).r" />
        }
        @case ('rect') {
          <rect [attr.x]="$any(s).x" [attr.y]="$any(s).y" [attr.width]="$any(s).w" [attr.height]="$any(s).h" [attr.rx]="$any(s).rx" />
        }
      }
    }
  </svg>`,
  styles: `:host{display:inline-flex;line-height:0}`,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(20);
  readonly stroke = input(2);
  readonly filled = input(false);
  protected readonly shapes = computed(() => SHAPES[this.name()] ?? []);
}
