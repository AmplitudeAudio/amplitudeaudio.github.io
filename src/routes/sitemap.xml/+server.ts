import { locales, localizeHref } from '#lib/paraglide/runtime.js';
import { posts } from '#lib/posts.ts';
import { site } from '#lib/site.ts';

export const prerender = true;

const pages = ['/', '/blog/', '/privacy-policy/', ...posts.map((p) => `/blog/${p.slug}/`)];

export function GET() {
	const urls = pages.flatMap((path) =>
		locales.map((locale) => {
			const alternates = locales
				.map(
					(alt) =>
						`<xhtml:link rel="alternate" hreflang="${alt}" href="${site.url}${localizeHref(path, { locale: alt })}"/>`
				)
				.join('');
			return `<url><loc>${site.url}${localizeHref(path, { locale })}</loc>${alternates}</url>`;
		})
	);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
