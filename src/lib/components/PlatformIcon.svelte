<script lang="ts" module>
	export type Platform = 'windows' | 'macos' | 'linux' | 'ios' | 'android';
</script>

<script lang="ts">
	import { LINUX_PATH } from './linux-path.ts';

	let { platform, size = 22 }: { platform: Platform; size?: number } = $props();
</script>

{#if platform === 'windows'}
	<svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z" />
	</svg>
{:else if platform === 'macos'}
	<svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<path
			d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
		/>
	</svg>
{:else if platform === 'linux'}
	<svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
		<path d={LINUX_PATH} />
	</svg>
{:else if platform === 'ios'}
	<svg
		aria-hidden="true"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<rect x="6" y="2" width="12" height="20" rx="3" />
		<path d="M11 18.5h2" />
	</svg>
{:else if platform === 'android'}
	<svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
		<path d="M3 17a9 9 0 0 1 18 0z" fill="currentColor" />
		<path
			d="M7 9.2 5.2 6.2M17 9.2l1.8-3"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
		<circle cx="8.6" cy="13.5" r="1.1" fill="var(--surface)" />
		<circle cx="15.4" cy="13.5" r="1.1" fill="var(--surface)" />
	</svg>
{/if}
