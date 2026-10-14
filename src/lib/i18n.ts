import { resolve } from '$app/paths';
import type { Path } from '$app/types';
import { localizeHref, type Locale } from '#lib/paraglide/runtime.js';

export const localeNames: Record<Locale, string> = {
	en: 'English',
	fr: 'Français',
	ja: '日本語',
	zh: '中文'
};

/** An internal link in the current (or given) locale. */
export function localHref(path: string, locale?: Locale): string {
	return resolve(localizeHref(path, locale ? { locale } : undefined) as Path);
}

const dateLocales: Record<Locale, string> = { en: 'en-US', fr: 'fr-FR', ja: 'ja-JP', zh: 'zh-CN' };

export function formatDate(iso: string, locale: Locale): string {
	return new Date(iso).toLocaleDateString(dateLocales[locale], {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
