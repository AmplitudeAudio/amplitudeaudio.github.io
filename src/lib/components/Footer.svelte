<script lang="ts">
	import { asset } from '$app/paths';
	import { m } from '#lib/paraglide/messages.js';
	import { localHref } from '#lib/i18n.ts';
	import { links } from '#lib/site.ts';
	import Icon from './Icon.svelte';
</script>

<footer>
	<div class="container inner">
		<div class="brand">
			<img
				src={asset('images/logo.svg')}
				alt="Amplitude Audio"
				class="h-auto w-48 object-contain"
			/>
			<span>{m.footer_license()}</span>
			<span>{m.footer_copyright()}</span>
		</div>
		<div class="side">
			<ul class="links">
				<li><a class="muted" href={links.docs}>{m.nav_docs()}</a></li>
				<li><a class="muted" href={localHref('/blog/')}>{m.nav_blog()}</a></li>
				<li><a class="muted" href={localHref('/privacy-policy/')}>{m.footer_privacy()}</a></li>
				<li><a class="muted" href={links.studio}>Studio</a></li>
				<li><a class="muted" href={links.cli}>CLI</a></li>
			</ul>
			<ul class="social" aria-label={m.footer_social()}>
				<li>
					<a href={links.discord} aria-label="Discord"><Icon name="discord" size={20} /></a>
				</li>
				<li>
					<a href={links.x} aria-label="X (formerly Twitter)"><Icon name="x" size={18} /></a>
				</li>
				<li>
					<a href={links.github} aria-label="GitHub"><Icon name="github" size={20} /></a>
				</li>
			</ul>
		</div>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--border-subtle);
	}

	.inner {
		padding-block: 40px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 13px;
		color: var(--ink-muted);
	}

	.brand img {
		height: 28px;
		width: auto;
		align-self: flex-start;
	}

	.side {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 14px;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.links {
		gap: 8px 24px;
		font-size: 14px;
		font-weight: 600;
	}

	.muted {
		color: var(--ink-soft);
	}

	.muted:hover {
		color: var(--ink-strong);
		text-decoration: none;
	}

	.social {
		gap: 8px;
	}

	.social a {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-pill);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ink-soft);
	}

	.social a:hover {
		color: var(--ink-strong);
		border-color: var(--brand);
	}

	@media (max-width: 640px) {
		.side {
			align-items: flex-start;
		}
	}
</style>
