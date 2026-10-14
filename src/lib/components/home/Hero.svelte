<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { links } from '#lib/site.ts';
	import { HeroField } from '#lib/sim/hero-field.ts';
	import { fitCanvas } from '#lib/sim/render.ts';
	import { isOnScreen, startLoop } from '#lib/sim/loop.ts';
	import PlatformIcon, { type Platform } from '../PlatformIcon.svelte';

	const platforms: { id: Platform; name: string }[] = [
		{ id: 'windows', name: 'Windows' },
		{ id: 'macos', name: 'macOS' },
		{ id: 'linux', name: 'Linux' },
		{ id: 'ios', name: 'iOS' },
		{ id: 'android', name: 'Android' }
	];

	const DOT_SPACING = 22;

	let canvas: HTMLCanvasElement;
	const field = new HeroField();
	let now = 0;

	function local(e: PointerEvent) {
		const r = canvas.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	}

	onMount(() =>
		startLoop((t) => {
			now = t;
			if (!isOnScreen(canvas)) return;
			const fit = fitCanvas(canvas);
			if (fit) field.draw(fit.ctx, fit.w, fit.h, t, DOT_SPACING);
		})
	);
</script>

<!-- Pointer tracking only drives decoration; the content stays fully usable without it. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	class="hero"
	onpointermove={(e) => field.setPointer(local(e))}
	onpointerleave={() => field.setPointer(null)}
	onpointerdown={(e) => {
		const p = local(e);
		field.emit(p.x, p.y, now);
	}}
>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
	<div class="content">
		<p class="badge"><span class="dot" aria-hidden="true"></span>{m.hero_badge()}</p>
		<h1>Amplitude <span class="gradient-text">Audio SDK</span></h1>
		<p class="lead">{m.hero_lead()}</p>
		<p class="body">{m.hero_body()}</p>
		<div class="ctas">
			<a class="btn btn-lg" href={links.getStarted}>{m.cta_get_started()}</a>
			<a class="link-arrow" href={links.github}>{m.hero_star()}</a>
		</div>
		<div class="platforms">
			<span class="runs-on">{m.hero_runs_on()}</span>
			<ul aria-label={m.hero_platforms()}>
				{#each platforms as p (p.id)}
					<li><PlatformIcon platform={p.id} />{p.name}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.content {
		position: relative;
		max-width: 880px;
		margin: 0 auto;
		padding: 128px var(--gutter) 136px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 24px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 6px 14px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background: #17181c;
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-pill);
		background: var(--accent);
	}

	h1 {
		font-size: 64px;
		line-height: 1.02;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.005em;
	}

	.lead {
		font-size: 22px;
		line-height: 1.45;
	}

	.body {
		font-size: 17px;
		line-height: 1.6;
		color: var(--ink-muted);
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 12px 24px;
		margin-top: 4px;
	}

	.ctas .link-arrow {
		font-size: 17px;
	}

	.platforms {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 10px 20px;
		color: var(--ink-soft);
	}

	.runs-on {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.platforms ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.platforms li {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
	}

	@media (max-width: 640px) {
		.content {
			padding-block: 88px 96px;
		}

		h1 {
			font-size: 42px;
		}

		.lead {
			font-size: 19px;
		}
	}
</style>
