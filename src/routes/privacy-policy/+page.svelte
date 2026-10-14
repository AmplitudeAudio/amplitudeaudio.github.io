<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { links, site } from '#lib/site.ts';

	const items = [
		m.privacy_item_1(),
		m.privacy_item_2(),
		m.privacy_item_3(),
		m.privacy_item_4(),
		m.privacy_item_5(),
		m.privacy_item_6()
	];
	const [before, after] = m.privacy_contact({ email: '\u0000' }).split('\u0000');
</script>

<svelte:head>
	<title>{m.privacy_title()} · {site.title}</title>
	<meta name="description" content={m.privacy_description()} />
</svelte:head>

<article class="container">
	<h1 class="section-title">{m.privacy_title()}</h1>
	<p class="tldr"><strong>TL;DR</strong>: {m.privacy_tldr()}</p>
	<h2>{m.privacy_visitors()}</h2>
	<ul>
		{#each items as item (item)}
			<li>{item}</li>
		{/each}
	</ul>
	<h2>{m.privacy_contact_title()}</h2>
	<p>{before}<a href="mailto:{links.supportEmail}">{links.supportEmail}</a>{after}</p>
	<p class="effective">{m.privacy_effective()}</p>
</article>

<style>
	article {
		max-width: 800px;
		padding-block: 96px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		font-size: 17px;
		line-height: 1.7;
		color: var(--ink-body);
	}

	.tldr strong {
		color: var(--ink);
	}

	h2 {
		margin-top: 24px;
		font-size: 26px;
		color: var(--ink);
	}

	ul {
		margin: 0;
		padding-left: 22px;
	}

	.effective {
		font-size: 14px;
		color: var(--ink-muted);
	}
</style>
