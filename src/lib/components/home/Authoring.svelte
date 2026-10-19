<script lang="ts">
	import { asset } from '$app/paths';
	import { m } from '#lib/paraglide/messages.js';
	import { links } from '#lib/site.ts';

	const cliFeatures = [
		m.cli_feat_license(),
		m.cli_feat_platforms(),
		m.cli_feat_agents(),
		m.cli_feat_completions()
	];

	const studioFeatures = [
		m.studio_feat_assets(),
		m.studio_feat_release(),
		m.studio_feat_profile(),
		m.studio_feat_audience()
	];
</script>

{#snippet check()}
	<svg
		class="check"
		aria-hidden="true"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M5 12.5l4.5 4.5L19 7.5" />
	</svg>
{/snippet}

<section id="authoring" class="container" aria-labelledby="authoring-title">
	<div class="section-head">
		<span class="eyebrow">{m.authoring_eyebrow()}</span>
		<h2 id="authoring-title" class="section-title">{m.authoring_title()}</h2>
		<p class="section-lead">{m.authoring_lead()}</p>
	</div>

	<div class="grid">
		<article class="cli">
			<div class="rule" aria-hidden="true"></div>
			<div class="body">
				<div class="top">
					<img src={asset('images/cli_icon.svg')} alt={m.cli_icon_alt()} width="56" height="56" />
					<span class="tags">
						<span class="tag">{m.chip_free().toUpperCase()}</span>
						<span class="tag">{m.chip_open_source().toUpperCase()}</span>
					</span>
				</div>
				<div class="heading">
					<h3>{m.cli_title()}</h3>
					<p class="desc">{m.cli_desc()}</p>
				</div>
				<ul class="features">
					{#each cliFeatures as feature (feature)}
						<li>{@render check()}<span>{feature}</span></li>
					{/each}
				</ul>
				<div class="actions">
					<a class="cli-btn" href={links.cli}>{m.cli_get()}</a>
					<a class="cli-link" href={links.cliReleases}>{m.cli_github()}</a>
				</div>
			</div>
		</article>

		<article class="studio">
			<div class="rule" aria-hidden="true"></div>
			<div class="body">
				<div class="top">
					<img
						src={asset('images/studio_icon.png')}
						alt={m.studio_icon_alt()}
						width="56"
						height="56"
					/>
					<span class="tags">
						<span class="pill">{m.chip_paid()}</span>
						<span class="pill"
							><span class="dot" aria-hidden="true"></span>{m.chip_early_access()}</span
						>
					</span>
				</div>
				<div class="heading">
					<h3>{m.studio_title()}</h3>
					<p class="desc">{m.studio_desc()}</p>
				</div>
				<ul class="features">
					{#each studioFeatures as feature (feature)}
						<li>{@render check()}<span>{feature}</span></li>
					{/each}
				</ul>
				<div class="actions">
					<a class="studio-btn" href={links.studio}>{m.studio_learn()}</a>
				</div>
			</div>
		</article>
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
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: 20px;
		align-items: stretch;
	}

	article {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.rule {
		height: 2px;
	}

	.body {
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		flex-grow: 1;
	}

	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.top img {
		width: 56px;
		height: 56px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.heading {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.desc {
		font-size: 16px;
		line-height: 1.6;
	}

	.features {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 16px;
		line-height: 1.5;
	}

	.features li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.check {
		flex-shrink: 0;
		margin-top: 2px;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		padding-top: 4px;
	}

	/* CLI card: follows the cli-dark role tokens of the Amplitude design system. */
	.cli {
		--cli-primary: #a78bfa;
		--cli-accent: #cdc2fc;
		--cli-surface: #101114;
		--cli-line: #262a31;
		--cli-ink: #e4e5ea;
		--cli-muted: #9aa0ab;
		--cli-on-brand: #101114;
		--cli-code-bg: #011627;
		--cli-code-ink: #d6deeb;

		background: var(--cli-surface);
		border: 1px solid var(--cli-line);
		border-radius: 2px;
		font-family: var(--font-sans);
	}

	.cli .rule {
		background: var(--cli-primary);
	}

	.cli .tag {
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 20px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--cli-ink);
		border: 1px solid var(--cli-line);
		border-radius: 2px;
		padding: 2px 8px;
	}

	.cli h3 {
		font-family: var(--font-mono);
		font-size: 24px;
		line-height: 1.3;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink-strong);
	}

	.cli .desc {
		color: var(--cli-muted);
	}

	.cli .features {
		color: var(--cli-ink);
	}

	.cli .check {
		color: var(--cli-accent);
	}

	.code {
		background: var(--cli-code-bg);
		border: 1px solid var(--cli-line);
		border-radius: 2px;
		overflow: hidden;
		margin-top: 4px;
	}

	.code-label {
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 20px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--cli-muted);
		padding: 10px 16px;
		border-bottom: 1px solid var(--cli-line);
	}

	pre {
		margin: 0;
		padding: 16px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.8;
		color: var(--cli-code-ink);
		scrollbar-color: #353841 transparent;
	}

	.comment {
		color: var(--cli-muted);
	}

	.cli .actions {
		margin-top: auto;
	}

	.cli-btn,
	.cli-link {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 14px;
		line-height: 24px;
	}

	.cli-btn {
		background: var(--cli-primary);
		color: var(--cli-on-brand);
		padding: 10px 20px;
		border-radius: 2px;
		transition: background 150ms var(--ease);
	}

	.cli-btn:hover {
		background: #b9a3fb;
		text-decoration: none;
	}

	.cli-link {
		color: var(--ink-strong);
	}

	/* Studio card: Hubot Sans, 4px corners, red signal color. */
	.studio {
		background: var(--surface-raised);
		border: 1px solid var(--border);
		border-radius: 4px;
		font-family: 'Hubot Sans', system-ui, Arial, sans-serif;
	}

	.studio .rule {
		background: #d22e2e;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		line-height: 24px;
		font-weight: 600;
		color: var(--ink-soft);
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		padding: 0 12px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-pill);
		background: #d22e2e;
	}

	.studio h3 {
		font-size: 30px;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.025em;
	}

	.studio .desc {
		font-weight: 300;
		color: var(--ink-body);
	}

	.studio .features {
		font-weight: 300;
		color: #dee2e6;
	}

	.studio .check {
		color: var(--brand);
	}

	.note {
		background: #17181c;
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 16px;
		margin-top: 4px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
	}

	.note-title {
		font-size: 14px;
		line-height: 24px;
		font-weight: 600;
		color: var(--ink-strong);
	}

	.note-desc {
		font-size: 15px;
		line-height: 1.6;
		font-weight: 300;
		color: var(--ink-body);
	}

	.studio-btn {
		color: var(--ink-strong);
		font-weight: 600;
		font-size: 14px;
		line-height: 24px;
		padding: 10px 20px;
		border: 1px solid #6c757d;
		border-radius: 4px;
		transition: background 150ms var(--ease);
	}

	.studio-btn:hover {
		background: #23262f;
		text-decoration: none;
	}

	@media (max-width: 400px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.body {
			padding: 24px;
		}
	}
</style>
