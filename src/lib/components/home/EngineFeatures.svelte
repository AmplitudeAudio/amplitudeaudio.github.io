<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import Icon, { type IconName } from '../Icon.svelte';

	type Item = { icon: IconName; title: string; desc: string };

	const core: Item[] = [
		{ icon: 'gamepad', title: m.engine_games_title(), desc: m.engine_games_desc() },
		{ icon: 'braces', title: m.engine_data_title(), desc: m.engine_data_desc() },
		{ icon: 'shuffle', title: m.engine_platforms_title(), desc: m.engine_platforms_desc() },
		{ icon: 'bolt', title: m.engine_fast_title(), desc: m.engine_fast_desc() },
		{ icon: 'plug', title: m.engine_plugins_title(), desc: m.engine_plugins_desc() },
		{ icon: 'school', title: m.engine_learning_title(), desc: m.engine_learning_desc() }
	];

	const more: Item[] = [
		{ icon: 'ambisonics', title: m.more_ambisonics_title(), desc: m.more_ambisonics_desc() },
		{ icon: 'pipeline', title: m.more_pipeline_title(), desc: m.more_pipeline_desc() },
		{ icon: 'waves', title: m.more_effects_title(), desc: m.more_effects_desc() },
		{ icon: 'package', title: m.more_packages_title(), desc: m.more_packages_desc() }
	];
</script>

<section id="engine" class="container">
	<div class="section-head">
		<span class="eyebrow">{m.engine_eyebrow()}</span>
		<h2 class="section-title">{m.engine_title()}</h2>
	</div>

	<ul class="grid core">
		{#each core as item (item.icon)}
			<li class="card item">
				<span class="icon-badge"><Icon name={item.icon} /></span>
				<h3>{item.title}</h3>
				<p>{item.desc}</p>
			</li>
		{/each}
	</ul>

	<div class="more">
		<h3 class="more-title">{m.more_title()}</h3>
		<ul class="grid">
			{#each more as item (item.icon)}
				<li class="card more-item">
					<div class="bar" aria-hidden="true"></div>
					<div class="more-body">
						<span class="more-icon"><Icon name={item.icon} size={26} /></span>
						<h4>{item.title}</h4>
						<p>{item.desc}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	section {
		padding-block: 96px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.core {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.item {
		padding: 28px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	h3 {
		font-size: 20px;
		font-weight: 700;
	}

	p {
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-muted);
	}

	.more {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 32px;
	}

	.more-title {
		font-size: 28px;
		font-weight: 800;
	}

	.more-item {
		overflow: hidden;
	}

	.bar {
		height: 4px;
		background: linear-gradient(90deg, var(--brand), var(--accent));
	}

	.more-body {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.more-icon {
		color: var(--brand);
	}

	h4 {
		font-size: 18px;
		font-weight: 700;
	}

	@media (max-width: 400px) {
		.core {
			grid-template-columns: 1fr;
		}
	}
</style>
