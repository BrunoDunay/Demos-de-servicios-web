import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { DISCIPLINES } from '../core/content';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** Disciplinas como señalética de box: letreros-flecha que cambian el panel de la derecha. */
@Component({
  selector: 'app-disciplines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  template: `
    <section class="section disciplines" id="disciplinas" (pointerenter)="paused.set(true)" (pointerleave)="paused.set(false)">
      <div class="container">
        <div class="head">
          <span class="tag" data-reveal>Disciplinas</span>
          <h2 class="title-xl" data-reveal [revealDelay]="80">Elige tu <span class="outline">camino</span></h2>
        </div>
        <div class="layout">
          <div class="signs" role="tablist" aria-label="Disciplinas">
            <span class="rail rail-1" aria-hidden="true"></span>
            <span class="rail rail-2" aria-hidden="true"></span>
            @for (d of items; track d.name; let i = $index) {
              <button
                type="button"
                role="tab"
                class="sign"
                [class.is-active]="active() === i"
                [class.alt]="i % 2 === 1"
                [attr.aria-selected]="active() === i"
                [attr.aria-controls]="'panel-disciplina'"
                data-reveal="left"
                [revealDelay]="i * 70"
                (click)="select(i)"
              >
                <span class="chev" aria-hidden="true"></span>
                <app-icon [name]="d.icon" [size]="26" />
                <span class="txt"><b>{{ d.name }}</b><small>{{ d.sub }}</small></span>
                @if (active() === i && autoplay() && !paused()) {
                  <span class="progress" aria-hidden="true"></span>
                }
              </button>
            }
          </div>

          <div class="panel" id="panel-disciplina" role="tabpanel" data-reveal="right" [revealDelay]="150">
            <div class="shots">
              @for (d of items; track d.name; let i = $index) {
                <img class="shot photo-bw" [class.is-active]="active() === i" [src]="'media/' + d.img + '-sm.webp'" [attr.srcset]="'media/' + d.img + '-sm.webp 720w, media/' + d.img + '.webp 1200w'" sizes="(max-width: 980px) 92vw, 52vw" [alt]="d.name" width="720" height="480" />
              }
              <span class="index"><b>0{{ active() + 1 }}</b>/0{{ items.length }}</span>
            </div>
            @for (d of [current()]; track d.name) {
              <div class="info">
                <h3>{{ d.name }}</h3>
                <p>{{ d.text }}</p>
                <dl>
                  @for (s of d.specs; track s[0]) {
                    <div><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
                  }
                </dl>
                <a class="btn" href="#contacto" data-cursor="PROBAR">Probar {{ d.name.toLowerCase() }} <span class="arrow"><app-icon name="arrow-right" [size]="18" /></span></a>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .disciplines { background: var(--bg-2); }
    .head { margin-bottom: 56px; }
    .head .title-xl { margin-top: 18px; }
    .layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(28px, 4vw, 64px); align-items: start; }
    .signs { position: relative; display: flex; flex-direction: column; gap: 12px; padding-right: 40px; }
    .rail { position: absolute; top: -10px; bottom: -10px; width: 6px; background: var(--ember); }
    .rail-1 { right: 18px; }
    .rail-2 { right: 6px; background: var(--bg-3); }
    .sign {
      position: relative; display: grid; grid-template-columns: 34px 34px 1fr; align-items: center; gap: 16px; min-height: 84px; padding: 0 22px 0 18px; text-align: left;
      background: var(--bg-3); color: var(--ink-2); clip-path: polygon(30px 0, 100% 0, 100% 100%, 30px 100%, 0 50%);
      transition: transform 600ms var(--ease-expo), background-color 300ms ease, color 300ms ease;
    }
    .chev { width: 30px; height: 46px; background: var(--muted); clip-path: polygon(100% 0, 60% 50%, 100% 100%, 40% 100%, 0 50%, 40% 0); transition: background-color 300ms ease, transform 500ms var(--ease-expo); }
    .sign.alt .chev { background: var(--ember); }
    .sign app-icon { color: var(--ember); }
    .txt { display: flex; flex-direction: column; }
    .txt b { font-family: var(--font-display); font-weight: 400; font-size: 1.7rem; letter-spacing: 0.03em; text-transform: uppercase; line-height: 1; }
    .txt small { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ember); margin-top: 6px; }
    .sign:hover { color: var(--ink); transform: translateX(8px); }
    .sign:hover .chev { transform: translateX(-4px); }
    .sign.is-active { transform: translateX(26px); background: #26262a; color: var(--ink); }
    .sign.is-active .chev { background: var(--ember); transform: translateX(-6px); filter: drop-shadow(0 0 10px var(--ember)); }
    .progress { position: absolute; left: 30px; right: 0; bottom: 0; height: 3px; background: var(--ember); transform-origin: left; animation: fill 5s linear forwards; }
    @keyframes fill { from { transform: scaleX(0); } }

    .panel { position: sticky; top: 100px; }
    .shots { position: relative; aspect-ratio: 16 / 11; overflow: hidden; background: var(--bg-3); }
    .shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; clip-path: inset(0 0 0 100%); transition: clip-path 0s 0.9s; z-index: 1; }
    .shot.is-active { clip-path: inset(0 0 0 0); transition: clip-path 0.9s var(--ease-expo); z-index: 2; animation: kenburns 9s ease-out both; }
    @keyframes kenburns { from { scale: 1.12; } to { scale: 1; } }
    .index { position: absolute; z-index: 3; right: 18px; bottom: 14px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-2); }
    .index b { font-family: var(--font-display); font-weight: 400; font-size: 2.6rem; color: var(--ink); margin-right: 4px; }
    .info { padding-top: 26px; animation: info-in 700ms var(--ease-expo) both; }
    @keyframes info-in { from { opacity: 0; transform: translateY(18px); } }
    .info h3 { font-size: clamp(2.4rem, 4vw, 3.6rem); }
    .info p { margin-top: 12px; color: var(--ink-2); max-width: 560px; }
    dl { display: grid; grid-template-columns: repeat(3, 1fr); margin: 24px 0 28px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    dl div { padding: 14px 0; border-left: 1px solid var(--line); padding-left: 16px; }
    dl div:first-child { border-left: 0; padding-left: 0; }
    dt { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
    dd { margin: 4px 0 0; font-family: var(--font-display); font-size: 1.6rem; text-transform: uppercase; }

    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
      .signs { flex-direction: row; overflow-x: auto; padding: 0 0 8px; gap: 10px; scrollbar-width: none; margin-inline: calc(var(--gutter) * -1); padding-inline: var(--gutter); }
      .signs::-webkit-scrollbar { display: none; }
      .rail { display: none; }
      .sign { flex: 0 0 auto; min-height: 70px; grid-template-columns: 26px 1fr; padding-right: 22px; }
      .sign app-icon { display: none; }
      .sign.is-active { transform: none; }
      .panel { position: static; }
    }
  `,
})
export class Disciplines {
  protected readonly items = DISCIPLINES;
  protected readonly active = signal(0);
  protected readonly autoplay = signal(true);
  protected readonly paused = signal(false);
  protected readonly current = computed(() => this.items[this.active()]);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const id = setInterval(() => {
        if (this.autoplay() && !this.paused()) this.active.update((i) => (i + 1) % this.items.length);
      }, 5000);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected select(i: number) {
    this.autoplay.set(false);
    this.active.set(i);
  }
}
