<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { deLocalizeHref, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { site } from '#lib/site.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const basePath = $derived(deLocalizeHref(page.url.pathname));
</script>

<svelte:head>
	<meta name="description" content={m.meta_description()} />
	<meta property="og:site_name" content={site.title} />
	<meta property="og:image" content={`${site.url}/cover.png`} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@amaudiosdk" />
	{#each locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href={`${site.url}${localizeHref(basePath, { locale })}`}
		/>
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={`${site.url}${localizeHref(basePath, { locale: 'en' })}`}
	/>
</svelte:head>

<a class="skip-link" href="#main">{m.skip_to_content()}</a>
<Header />
<main id="main">
	{@render children()}
</main>
<Footer />

<style>
	.skip-link {
		position: absolute;
		left: 16px;
		top: -48px;
		z-index: 40;
		background: var(--brand);
		color: var(--on-brand);
		font-weight: 700;
		padding: 8px 16px;
		border-radius: var(--radius-pill);
	}

	.skip-link:focus {
		top: 16px;
	}
</style>
