<script lang="ts">
	import { asset } from '$app/paths';
	import { m } from '#lib/paraglide/messages.js';
	import { localHref } from '#lib/i18n.ts';
	import { links } from '#lib/site.ts';
	import Icon from './Icon.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let open = $state(false);
	const home = localHref('/');
</script>

<header>
	<nav class="container" aria-label={m.nav_main()}>
		<a class="logo" href={home}>
			<img src={asset('favicon-512x512.png')} alt="Amplitude Audio SDK" width="123" height="34" />
		</a>
		<button
			class="menu-toggle"
			type="button"
			aria-expanded={open}
			aria-controls="site-menu"
			aria-label={m.nav_menu()}
			onclick={() => (open = !open)}
		>
			<Icon name={open ? 'close' : 'menu'} />
		</button>
		<div id="site-menu" class="menu" class:open>
			<ul class="links">
				<li><a href="{home}#features" onclick={() => (open = false)}>{m.nav_features()}</a></li>
				<li><a href="{home}#engine" onclick={() => (open = false)}>{m.nav_engine()}</a></li>
				<li><a href="{home}#authoring" onclick={() => (open = false)}>{m.nav_authoring()}</a></li>
				<li>
					<a href="{home}#integrations" onclick={() => (open = false)}>{m.nav_integrations()}</a>
				</li>
				<li><a href={links.docs}>{m.nav_docs()}</a></li>
				<li><a href={localHref('/blog/')}>{m.nav_blog()}</a></li>
				<li><a href={links.github}>{m.nav_github()}</a></li>
			</ul>
			<div class="actions">
				<LanguageSwitcher />
				<a class="btn btn-sm" href={links.getStarted}>{m.cta_get_started()}</a>
			</div>
		</div>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: rgba(10, 14, 18, 0.92);
		backdrop-filter: blur(6px);
		border-bottom: 1px solid var(--border-subtle);
	}

	header::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 2px;
		background: linear-gradient(90deg, var(--brand), var(--accent));
		pointer-events: none;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 16px 32px;
		padding-block: 14px;
	}

	.logo img {
		height: 34px;
		width: auto;
	}

	.menu {
		display: flex;
		align-items: center;
		gap: 16px 32px;
		flex-grow: 1;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		flex-grow: 1;
		font-size: 15px;
		font-weight: 600;
	}

	.links a {
		color: var(--ink-soft);
	}

	.links a:hover {
		color: var(--ink-strong);
		text-decoration: none;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.menu-toggle {
		display: none;
		margin-left: auto;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: var(--ink);
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		cursor: pointer;
	}

	@media (max-width: 900px) {
		nav {
			flex-wrap: wrap;
		}

		.menu-toggle {
			display: inline-flex;
		}

		.menu {
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			align-items: stretch;
			padding-bottom: 12px;
		}

		.menu.open {
			display: flex;
		}

		.links {
			flex-direction: column;
			gap: 0;
		}

		.links a {
			display: block;
			padding: 10px 0;
		}

		.actions {
			justify-content: space-between;
		}
	}
</style>
