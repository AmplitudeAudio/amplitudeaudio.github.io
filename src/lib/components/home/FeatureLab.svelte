<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import {
		FeatureLabScene,
		interauralDelayMs,
		maxDistance,
		rtpcPitch,
		type AttenuationShape,
		type CanvasLabels,
		type LabMode
	} from '#lib/sim/feature-lab.ts';
	import { fitCanvas } from '#lib/sim/render.ts';
	import { isOnScreen, startLoop } from '#lib/sim/loop.ts';

	const DENSITY = 64;
	// Scroll progress through the section: zoom in until INTRO_END, step through the
	// modes, then zoom back out after OUTRO_START.
	const INTRO_END = 0.12;
	const OUTRO_START = 0.88;
	const SCREENS_PER_SECTION = 6;

	const modes: { id: LabMode; title: () => string; desc: () => string; label: () => string }[] = [
		{
			id: 'attenuation',
			title: m.mode_attenuation_title,
			desc: m.mode_attenuation_desc,
			label: m.mode_attenuation_label
		},
		{
			id: 'occlusion',
			title: m.mode_occlusion_title,
			desc: m.mode_occlusion_desc,
			label: m.mode_occlusion_label
		},
		{
			id: 'reflections',
			title: m.mode_reflections_title,
			desc: m.mode_reflections_desc,
			label: m.mode_reflections_label
		},
		{ id: 'hrtf', title: m.mode_hrtf_title, desc: m.mode_hrtf_desc, label: m.mode_hrtf_label },
		{ id: 'rtpc', title: m.mode_rtpc_title, desc: m.mode_rtpc_desc, label: m.mode_rtpc_label }
	];

	const shapes: { id: AttenuationShape; label: () => string }[] = [
		{ id: 'sphere', label: m.shape_sphere },
		{ id: 'box', label: m.shape_box },
		{ id: 'capsule', label: m.shape_capsule },
		{ id: 'cone', label: m.shape_cone }
	];

	const labels: CanvasLabels = {
		source: m.canvas_source(),
		listener: m.canvas_listener(),
		wall: m.canvas_wall(),
		front: m.canvas_front(),
		maxDistance: m.canvas_max_distance(),
		engine: m.canvas_engine(),
		pitch: m.canvas_pitch(),
		rpm: m.canvas_rpm()
	};

	let modeIndex = $state(0);
	let shape = $state<AttenuationShape>('sphere');
	let params = $state<Record<LabMode, number>>({
		attenuation: 0.55,
		occlusion: 0.75,
		reflections: 0.3,
		hrtf: 0.22,
		rtpc: 0.45
	});
	let stageHeight = $state(820);
	// The site header is sticky too, so the stage pins just below it.
	let stageTop = $state(0);

	const mode = $derived(modes[modeIndex]);
	const param = $derived(params[mode.id]);

	const readout = $derived.by(() => {
		switch (mode.id) {
			case 'attenuation': {
				const shapeLabel = shapes.find((s) => s.id === shape)!.label();
				return `${shapeLabel} · ${Math.round(maxDistance(param) * 40)} m`;
			}
			case 'occlusion':
				return m.readout_occluded({ value: Math.round(param * 100) });
			case 'reflections':
				return m.readout_absorbed({ value: Math.round(param * 100) });
			case 'hrtf':
				return `${Math.round(param * 360)}° · ITD ${interauralDelayMs(param).toFixed(2)} ms`;
			case 'rtpc':
				return m.readout_rpm({
					rpm: Math.round(800 + param * 6200).toLocaleString(),
					pitch: rtpcPitch(param).toFixed(2)
				});
		}
	});

	let section: HTMLDivElement;
	let panel: HTMLDivElement;
	let progress: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let modeList: HTMLUListElement;
	const scene = new FeatureLabScene();
	let zoom = 0;
	let scrolledIndex = -1;

	function measureStage() {
		stageTop = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
		const ih = window.innerHeight - stageTop;
		// Very tall viewports (embedded previews) would make the section enormous.
		stageHeight = ih > 1300 ? 820 : Math.max(560, Math.round(ih));
	}

	function scrollSpan() {
		const r = section.getBoundingClientRect();
		return { rect: r, span: r.height - stageHeight };
	}

	function pick(i: number) {
		const { rect, span } = scrollSpan();
		if (span > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
			const target = INTRO_END + ((OUTRO_START - INTRO_END) * (i + 0.5)) / modes.length;
			window.scrollTo({
				top: window.scrollY + rect.top - stageTop + target * span,
				behavior: 'smooth'
			});
		}
		scrolledIndex = i;
		modeIndex = i;
	}

	function updateFromScroll() {
		const { rect, span } = scrollSpan();
		const prog = span > 0 ? Math.max(0, Math.min(1, (stageTop - rect.top) / span)) : 0;
		const ease = (u: number) => u * u * (3 - 2 * u);
		zoom =
			prog < INTRO_END
				? ease(prog / INTRO_END)
				: prog > OUTRO_START
					? ease((1 - prog) / (1 - OUTRO_START))
					: 1;
		panel.style.transform = `scale(${(0.8 + 0.2 * zoom).toFixed(4)})`;
		panel.style.borderRadius = `${(28 * (1 - zoom)).toFixed(1)}px`;

		const mid = Math.max(0, Math.min(0.9999, (prog - INTRO_END) / (OUTRO_START - INTRO_END)));
		progress.style.transform = `scaleY(${mid.toFixed(4)})`;

		const inView = rect.top < window.innerHeight && rect.bottom > 0;
		if (span > 0 && inView && prog > 0 && prog < 1) {
			const idx = Math.floor(mid * modes.length);
			if (idx !== scrolledIndex) {
				scrolledIndex = idx;
				modeIndex = idx;
			}
		}
	}

	// On narrow screens the modes are a horizontal strip; keep the active one visible.
	$effect(() => {
		const button = modeList.children[modeIndex] as HTMLElement | undefined;
		if (!button || modeList.scrollWidth <= modeList.clientWidth) return;
		modeList.scrollTo({
			left: button.offsetLeft - (modeList.clientWidth - button.offsetWidth) / 2,
			behavior: 'smooth'
		});
	});

	onMount(() => {
		measureStage();
		const stop = startLoop((t, dt) => {
			updateFromScroll();
			if (!isOnScreen(canvas)) return;
			const fit = fitCanvas(canvas);
			if (!fit) return;
			scene.draw(fit.ctx, fit.w, fit.h, {
				mode: mode.id,
				shape,
				param,
				t,
				dt,
				zoom,
				density: DENSITY,
				labels
			});
		});
		return stop;
	});
</script>

<svelte:window onresize={measureStage} />

<section id="features" class="lab">
	<div class="container head">
		<div class="section-head">
			<span class="eyebrow">{m.lab_eyebrow()}</span>
			<h2 class="section-title">{m.lab_title()}</h2>
			<p class="section-lead">{m.lab_lead()}</p>
		</div>
	</div>

	<div class="track" bind:this={section} style:height="{stageHeight * SCREENS_PER_SECTION}px">
		<div class="stage" style:top="{stageTop}px" style:height="{stageHeight}px">
			<div class="panel" bind:this={panel}>
				<canvas bind:this={canvas} aria-hidden="true"></canvas>
				<p class="visually-hidden" aria-live="polite">
					{m.lab_aria({ title: mode.title(), desc: mode.desc() })}
				</p>
				<div class="overlay">
					<div class="modes">
						<div class="progress-track" aria-hidden="true">
							<div class="progress" bind:this={progress}></div>
						</div>
						<ul bind:this={modeList}>
							{#each modes as item, i (item.id)}
								<li>
									<button
										type="button"
										class="mode"
										class:selected={i === modeIndex}
										aria-pressed={i === modeIndex}
										onclick={() => pick(i)}
									>
										<span class="num">0{i + 1}</span>
										<span class="text">
											<span class="title">{item.title()}</span>
											{#if i === modeIndex}
												<span class="desc">{item.desc()}</span>
											{/if}
										</span>
									</button>
								</li>
							{/each}
						</ul>
					</div>

					<div class="controls">
						{#if mode.id === 'attenuation'}
							<div class="shapes" role="group" aria-label={m.lab_shape_group()}>
								<span class="control-label">{m.lab_shape()}</span>
								{#each shapes as s (s.id)}
									<button
										type="button"
										class="shape"
										class:selected={s.id === shape}
										aria-pressed={s.id === shape}
										onclick={() => (shape = s.id)}>{s.label()}</button
									>
								{/each}
							</div>
						{/if}
						<label class="control-label" for="lab-param">{mode.label()}</label>
						<input
							id="lab-param"
							type="range"
							min="0"
							max="1"
							step="0.01"
							bind:value={params[mode.id]}
							aria-valuetext={readout}
						/>
						<output for="lab-param">{readout}</output>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.lab {
		border-top: 1px solid var(--border-subtle);
	}

	.head {
		padding-block: 96px 24px;
	}

	.track {
		position: relative;
	}

	.stage {
		position: sticky;
		overflow: hidden;
	}

	.panel {
		position: absolute;
		inset: 0;
		background: var(--surface-sunken);
		border: 1px solid var(--border);
		border-radius: 28px;
		overflow: hidden;
		transform: scale(0.8);
		transform-origin: 50% 50%;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		padding: 32px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
	}

	.modes,
	.controls {
		pointer-events: auto;
	}

	.modes {
		display: flex;
		gap: 14px;
		align-self: flex-start;
		max-width: 340px;
	}

	.progress-track {
		position: relative;
		width: 2px;
		flex-shrink: 0;
		border-radius: 2px;
		background: var(--border);
	}

	.progress {
		position: absolute;
		inset: 0;
		border-radius: 2px;
		background: var(--cyan);
		transform-origin: 50% 0;
		transform: scaleY(0);
	}

	.modes ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mode {
		width: 100%;
		text-align: left;
		font: inherit;
		color: var(--ink-soft);
		cursor: pointer;
		background: rgba(10, 14, 18, 0.78);
		border: 1px solid #1b2731;
		border-radius: 18px;
		padding: 10px 16px;
		display: flex;
		gap: 12px;
		align-items: baseline;
		transition:
			background 150ms var(--ease),
			border-color 150ms var(--ease);
	}

	.mode:hover {
		background: var(--surface-strong);
	}

	.mode.selected {
		color: var(--ink);
		background: rgba(22, 32, 42, 0.92);
		border-color: var(--brand);
		padding-block: 12px;
	}

	.num {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ink-muted);
	}

	.selected .num {
		color: var(--cyan);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.title {
		font-size: 15px;
		font-weight: 600;
	}

	.selected .title {
		font-size: 16px;
		font-weight: 700;
	}

	.desc {
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-body);
	}

	.controls {
		align-self: flex-end;
		width: 100%;
		max-width: 640px;
		background: rgba(10, 14, 18, 0.88);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 14px 20px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 20px;
	}

	.shapes {
		flex: 1 1 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}

	.control-label {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-soft);
		min-width: 120px;
	}

	.shape {
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		min-height: 40px;
		padding: 8px 16px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--border);
		background: transparent;
		color: var(--ink-soft);
	}

	.shape:hover {
		background: var(--surface-strong);
	}

	.shape.selected {
		font-weight: 700;
		border-color: var(--brand);
		background: var(--brand);
		color: var(--on-brand);
	}

	input[type='range'] {
		flex: 1 1 160px;
		min-width: 140px;
		height: 28px;
		accent-color: var(--brand);
	}

	output {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--cyan);
		min-width: 180px;
		text-align: right;
	}

	@media (max-width: 760px) {
		.overlay {
			padding: 16px;
		}

		.modes {
			max-width: none;
			align-self: stretch;
		}

		.progress-track {
			display: none;
		}

		.modes ul {
			position: relative;
			flex-direction: row;
			overflow-x: auto;
			scrollbar-width: none;
		}

		.mode {
			white-space: nowrap;
		}

		.desc {
			display: none;
		}

		.control-label {
			min-width: 0;
		}

		output {
			min-width: 0;
			text-align: left;
		}
	}
</style>
