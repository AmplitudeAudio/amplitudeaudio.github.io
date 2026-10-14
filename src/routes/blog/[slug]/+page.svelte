<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { formatDate, localHref } from '#lib/i18n.ts';
	import { site } from '#lib/site.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} · {site.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="container">
	<a class="back" href={localHref('/blog/')}>{m.blog_back()}</a>
	<header>
		<time datetime={data.meta.date}>{formatDate(data.meta.date, getLocale())}</time>
		<h1 lang="en">{data.meta.title}</h1>
		{#if data.meta.author}<p class="author">{data.meta.author}</p>{/if}
	</header>
	<div class="prose" lang="en">
		<Content />
	</div>
</article>

<style>
	article {
		max-width: 800px;
		padding-block: 72px 96px;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.back {
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-soft);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 32px;
		border-bottom: 1px solid var(--border);
	}

	time {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--brand);
	}

	h1 {
		font-size: 44px;
		line-height: 1.1;
		font-weight: 800;
	}

	.author {
		color: var(--ink-muted);
	}

	.prose {
		font-size: 17px;
		line-height: 1.75;
		color: var(--ink-body);
	}

	.prose :global(h2) {
		margin: 48px 0 16px;
		font-size: 28px;
		line-height: 1.25;
		color: var(--ink);
	}

	.prose :global(h3) {
		margin: 36px 0 12px;
		font-size: 22px;
		color: var(--ink);
	}

	.prose :global(p),
	.prose :global(ul),
	.prose :global(ol),
	.prose :global(pre),
	.prose :global(blockquote) {
		margin: 0 0 20px;
	}

	.prose :global(li) {
		margin-bottom: 8px;
	}

	.prose :global(strong) {
		color: var(--ink);
	}

	.prose :global(a) {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.prose :global(blockquote) {
		padding-left: 20px;
		border-left: 2px solid var(--accent);
		color: var(--ink-muted);
	}

	.prose :global(code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		background: var(--surface-strong);
		border-radius: 6px;
		padding: 2px 6px;
	}

	.prose :global(pre) {
		overflow-x: auto;
		padding: 20px 24px;
		background: var(--surface-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		line-height: 1.6;
	}

	.prose :global(pre code) {
		background: none;
		padding: 0;
		font-size: 14px;
		color: var(--ink-soft);
	}

	.prose :global(.token.comment) {
		color: var(--ink-muted);
	}

	.prose :global(.token.keyword),
	.prose :global(.token.tag) {
		color: var(--cyan);
	}

	.prose :global(.token.string),
	.prose :global(.token.attr-value) {
		color: #a8d8a0;
	}

	.prose :global(.token.number),
	.prose :global(.token.boolean) {
		color: #f0b37e;
	}

	.prose :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius-lg);
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 34px;
		}
	}
</style>
