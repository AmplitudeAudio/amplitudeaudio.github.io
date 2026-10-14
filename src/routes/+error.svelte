<script lang="ts">
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages.js';
	import { localHref } from '#lib/i18n.ts';
	import { site } from '#lib/site.ts';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? m.notfound_title() : m.error_title()} · {site.title}</title>
</svelte:head>

<section class="container">
	<span class="code">{page.status}</span>
	<h1 class="section-title">{notFound ? m.notfound_title() : m.error_title()}</h1>
	{#if notFound}<p>{m.notfound_desc()}</p>{/if}
	<a class="btn" href={localHref('/')}>{m.error_home()}</a>
</section>

<style>
	section {
		min-height: 60vh;
		padding-block: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 20px;
	}

	.code {
		font-family: var(--font-mono);
		font-size: 72px;
		font-weight: 600;
		line-height: 1;
	}

	p {
		font-size: 18px;
		color: var(--ink-muted);
	}
</style>
