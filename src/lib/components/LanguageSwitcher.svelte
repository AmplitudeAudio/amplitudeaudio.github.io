<script lang="ts">
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, locales } from '#lib/paraglide/runtime.js';
	import { localHref, localeNames } from '#lib/i18n.ts';
	import Icon from './Icon.svelte';

	const current = getLocale();
	const basePath = $derived(deLocalizeHref(page.url.pathname));
</script>

<details class="switcher">
	<summary aria-label={m.language()}>
		<Icon name="globe" size={18} />
		<span>{localeNames[current]}</span>
	</summary>
	<ul>
		{#each locales as locale (locale)}
			<li>
				<!-- A full reload re-evaluates every message in the new locale. -->
				<a
					href={localHref(basePath, locale)}
					hreflang={locale}
					lang={locale}
					aria-current={locale === current ? 'true' : undefined}
					data-sveltekit-reload>{localeNames[locale]}</a
				>
			</li>
		{/each}
	</ul>
</details>

<style>
	.switcher {
		position: relative;
	}

	summary {
		list-style: none;
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 6px 12px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		color: var(--ink-soft);
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		color: var(--ink-strong);
	}

	ul {
		position: absolute;
		right: 0;
		top: calc(100% + 8px);
		z-index: 20;
		min-width: 160px;
		margin: 0;
		padding: 6px;
		list-style: none;
		background: var(--surface-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
	}

	a {
		display: block;
		padding: 8px 12px;
		border-radius: 8px;
		color: var(--ink-soft);
		font-size: 14px;
	}

	a:hover {
		background: var(--surface-strong);
		color: var(--ink-strong);
		text-decoration: none;
	}

	a[aria-current='true'] {
		color: var(--cyan);
		font-weight: 700;
	}
</style>
