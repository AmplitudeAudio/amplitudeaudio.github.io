<script lang="ts">
	import { asset } from '$app/paths';
	import { m } from '#lib/paraglide/messages.js';
	import { links } from '#lib/site.ts';
	import Icon from '../Icon.svelte';

	const customMail = `mailto:${links.supportEmail}?subject=${encodeURIComponent(m.custom_mail_subject())}`;
</script>

<section id="integrations">
	<div class="container inner">
		<div class="section-head">
			<span class="eyebrow">{m.integrations_eyebrow()}</span>
			<h2 class="section-title">{m.integrations_title()}</h2>
			<p class="section-lead">{m.integrations_lead()}</p>
		</div>

		<ul class="grid">
			<li class="card integration">
				<div class="top">
					<span class="logo cyan"><Icon name="code" size={28} /></span>
					<span class="chip">{m.chip_core()}</span>
				</div>
				<h3>C++ SDK</h3>
				<p>{m.int_cpp_desc()}</p>
				<a class="link-arrow" href={links.getStarted}>{m.read_guide()}</a>
			</li>
			<li class="card integration">
				<div class="top">
					<span class="logo">
						<img src={asset('images/o3de_icon.svg')} alt="O3DE" width="32" height="32" />
					</span>
					<span class="chip">{m.chip_official()}</span>
				</div>
				<h3>O3DE</h3>
				<p>{m.int_o3de_desc()}</p>
				<a class="link-arrow" href={links.integrations.o3de}>{m.view_repo()}</a>
			</li>
			<li class="card integration">
				<div class="top">
					<span class="logo">
						<img src={asset('images/flax_icon.svg')} alt="Flax Engine" width="32" height="32" />
					</span>
					<span class="chip">{m.chip_official()}</span>
				</div>
				<h3>Flax Engine</h3>
				<p>{m.int_flax_desc()}</p>
				<a class="link-arrow" href={links.integrations.flax}>{m.view_repo()}</a>
			</li>
			<li class="card integration">
				<div class="top">
					<span class="logo">
						<img src={asset('images/godot_icon.svg')} alt="Godot" width="32" height="32" />
					</span>
					<span class="chip">{m.chip_coming_soon()}</span>
				</div>
				<h3>Godot</h3>
				<p>{m.int_godot_desc()}</p>
				<a class="link-arrow" href={links.integrations.godot}>{m.view_repo()}</a>
			</li>
			<li class="card integration">
				<div class="top">
					<span class="logo">
						<img src={asset('images/ezengine_icon.svg')} alt="ezEngine" width="32" height="32" />
					</span>
					<span class="chip">{m.chip_coming_soon()}</span>
				</div>
				<h3>ezEngine</h3>
				<p>{m.int_ezengine_desc()}</p>
				<a class="link-arrow" href={links.integrations.ezengine}>{m.view_repo()}</a>
			</li>
		</ul>

		<div class="card custom">
			<div class="custom-text">
				<span class="logo cyan"><Icon name="integration" size={28} /></span>
				<div class="custom-copy">
					<span class="eyebrow small">{m.custom_eyebrow()}</span>
					<h3 class="custom-title">{m.custom_title()}</h3>
					<p class="custom-desc">{m.custom_desc()}</p>
				</div>
			</div>
			<div class="custom-cta">
				<a class="btn" href={customMail}>{m.custom_cta()}</a>
				<span class="email">{links.supportEmail}</span>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		background: var(--surface-sunken);
		border-block: 1px solid var(--border-subtle);
	}

	.inner {
		padding-block: 96px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.integration {
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.logo {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border-radius: var(--radius-pill);
		background: var(--surface-strong);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cyan {
		color: var(--cyan);
	}

	h3 {
		font-size: 24px;
		font-weight: 700;
	}

	.integration p {
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-muted);
		flex-grow: 1;
	}

	.custom {
		padding: 40px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 28px 48px;
	}

	.custom-text {
		display: flex;
		gap: 24px;
		align-items: flex-start;
		flex: 1 1 520px;
		min-width: 0;
	}

	.custom-copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.eyebrow.small {
		font-size: 12px;
	}

	.custom-title {
		font-size: 26px;
		line-height: 1.2;
	}

	.custom-desc {
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-body);
		max-width: 640px;
	}

	.custom-cta {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.email {
		font-size: 13px;
		color: var(--ink-muted);
	}

	@media (max-width: 640px) {
		.custom {
			padding: 28px;
		}

		.custom-text {
			flex-direction: column;
		}
	}
</style>
