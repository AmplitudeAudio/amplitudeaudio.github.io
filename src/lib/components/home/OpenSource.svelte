<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import { links } from '#lib/site.ts';
</script>

<section class="container">
	<div class="card band">
		<svg
			class="arcs"
			aria-hidden="true"
			viewBox="0 0 400 400"
			width="520"
			height="520"
			fill="none"
			stroke-width="2"
			stroke-linecap="round"
		>
			<circle cx="200" cy="200" r="10" fill="var(--cyan)" stroke="none" />
			{#each [40, 80, 120, 160] as r, i (r)}
				{@const stroke = i === 2 ? 'var(--accent)' : 'var(--cyan)'}
				{@const opacity = [1, 0.8, 0.6, 0.35][i]}
				<path d="M200 {200 - r}a{r} {r} 0 0 1 0 {r * 2}" {stroke} {opacity} />
				<path d="M200 {200 - r}a{r} {r} 0 0 0 0 {r * 2}" {stroke} {opacity} />
			{/each}
		</svg>
		<div class="copy">
			<span class="eyebrow">{m.oss_eyebrow()}</span>
			<h2 class="section-title">{m.oss_title()}</h2>
			<p>{m.oss_desc()}</p>
			<div class="ctas">
				<a class="btn" href={links.github}>{m.oss_star()}</a>
				<a class="link-arrow" href={links.contributing}>{m.oss_contribute()}</a>
				<a class="link-arrow" href={links.docs}>{m.oss_docs()}</a>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding-block: 96px;
	}

	.band {
		position: relative;
		overflow: hidden;
		border-radius: 32px;
		padding: 64px 48px;
	}

	.arcs {
		position: absolute;
		right: -260px;
		top: 50%;
		margin-top: -260px;
		opacity: 0.55;
	}

	.copy {
		position: relative;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	p {
		font-size: 18px;
		line-height: 1.6;
		color: var(--ink-body);
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		margin-top: 8px;
	}

	@media (max-width: 760px) {
		.band {
			padding: 40px 28px;
		}

		.arcs {
			opacity: 0.2;
		}
	}
</style>
