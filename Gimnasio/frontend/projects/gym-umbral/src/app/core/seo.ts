import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export const SITE = 'https://demo-gym-umbral.vercel.app';

/** SEO por página: título, descripción, Open Graph y canonical desde el `data` de cada ruta. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  init(router: Router, route: ActivatedRoute) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let r = route;
      while (r.firstChild) r = r.firstChild;
      const data = r.snapshot.data;
      const path = router.url.split(/[?#]/)[0];
      this.apply(data['title'] ?? 'Umbral · Boutique fitness club', data['description'] ?? '', path);
    });
  }

  apply(title: string, description: string, path: string) {
    this.title.setTitle(title);
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:url', content: SITE + path });
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = SITE + (path === '/' ? '/' : path);
  }
}
