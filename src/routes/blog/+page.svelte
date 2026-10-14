<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { formatDate, localHref } from '#lib/i18n.ts';
	import { site } from '#lib/site.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const locale = getLocale();
</script>

<svelte:head>
	<title>{m.blog_title()} · {site.title}</title>
	<meta property="og:title" content="{m.blog_title()} · {site.title}" />
</svelte:head>

<section class="container page">
	<header class="section-head">
		<span class="eyebrow">{m.blog_title()}</span>
		<h1 class="section-title">{m.blog_description()}</h1>
		{#if locale !== 'en'}
			<p class="note">{m.blog_english_only()}</p>
		{/if}
	</header>

	{#if data.posts.length === 0}
		<p class="empty">{m.blog_empty()}</p>
	{:else}
		<ul class="posts">
			{#each data.posts as post (post.slug)}
				<li class="card post">
					<time datetime={post.date}>{formatDate(post.date, locale)}</time>
					<h2><a href={localHref(`/blog/${post.slug}/`)}>{post.title}</a></h2>
					<p lang="en">{post.description}</p>
					<a
						class="link-arrow"
						href={localHref(`/blog/${post.slug}/`)}
						aria-hidden="true"
						tabindex="-1">{m.blog_read_more()}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.page {
		padding-block: 96px;
		display: flex;
		flex-direction: column;
		gap: 48px;
	}

	.note {
		font-size: 15px;
		color: var(--ink-muted);
	}

	.empty {
		font-size: 18px;
		color: var(--ink-muted);
	}

	.posts {
		display: grid;
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.post {
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	time {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--brand);
	}

	h2 {
		font-size: 26px;
		line-height: 1.25;
	}

	h2 a {
		color: var(--ink);
	}

	p {
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-muted);
	}
</style>
