<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { links } from '#lib/site.ts';
	import Icon, { type IconName } from '../Icon.svelte';

	const tiles: { icon: IconName; href: string; title: string; desc: string }[] = [
		{
			icon: 'book',
			href: links.docs,
			title: m.support_docs_title(),
			desc: m.support_docs_desc()
		},
		{
			icon: 'github',
			href: links.issues,
			title: m.support_issues_title(),
			desc: m.support_issues_desc()
		},
		{
			icon: 'discord',
			href: links.discord,
			title: m.support_discord_title(),
			desc: m.support_discord_desc()
		},
		{
			icon: 'mail',
			href: `mailto:${links.supportEmail}`,
			title: m.support_contact_title(),
			desc: m.support_contact_desc()
		}
	];
</script>

<section class="container">
	<div class="head">
		<h2>{m.support_title()}</h2>
		<p>{m.support_lead()}</p>
	</div>
	<ul>
		{#each tiles as tile (tile.icon)}
			<li>
				<a class="tile" href={tile.href}>
					<span class="icon-badge"><Icon name={tile.icon} size={22} /></span>
					<span class="title">{tile.title}</span>
					<span class="desc">{tile.desc}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	section {
		padding-bottom: 96px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	h2 {
		font-size: 32px;
		font-weight: 800;
	}

	.head p {
		font-size: 17px;
		color: var(--ink-muted);
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tile {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 22px 24px;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		color: var(--ink);
		transition: border-color 150ms var(--ease);
	}

	.tile:hover {
		text-decoration: none;
		border-color: var(--brand);
	}

	.icon-badge {
		width: 44px;
		height: 44px;
	}

	.title {
		font-weight: 700;
		font-size: 17px;
	}

	.desc {
		font-size: 14px;
		color: var(--ink-muted);
	}
</style>
