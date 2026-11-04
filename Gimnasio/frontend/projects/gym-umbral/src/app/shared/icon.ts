import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Íconos de línea fina (24×24) dibujados a mano para Umbral.
const ICONS: Record<string, string> = {
  'arrow-right': '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  'arrow-down': '<path d="M12 4v16"/><path d="m6 14 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M3 9h18M3 15h18"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  spotify: '<circle cx="12" cy="12" r="9.5"/><path d="M7 9.5c3.5-1 7.5-.6 10.5 1M7.8 12.8c2.8-.7 5.8-.4 8.2.9M8.6 15.8c2-.4 4.2-.2 5.9.7"/>',
  towel: '<path d="M6 3h12v15a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M6 8h12M10 13h4"/>',
  drop: '<path d="M12 2.5s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.5 12 2.5 12 2.5z"/>',
  lock: '<rect x="4" y="10.5" width="16" height="11" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM7 19v2M17 19v2M5 11h14"/>',
  coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3M12 2.5v3"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="0.6"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6.1"/>',
  sparkle: '<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  bike: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M15 6h2l1.5 11M5.5 17 9 9h6l-3 8M8 6h3"/>',
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  reformer: '<path d="M2 15h20M4 15v4M20 15v4M7 15V9h6v6M17 9v6M7 9h10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
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
    stroke-linecap="round"
    stroke-linejoin="round"
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
  readonly stroke = input(1.4);
  readonly filled = input(false);
  protected readonly shapes = computed(() => SHAPES[this.name()] ?? []);
}
