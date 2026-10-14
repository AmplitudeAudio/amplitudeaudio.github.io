<script lang="ts" module>
	export type IconName =
		| 'gamepad'
		| 'braces'
		| 'shuffle'
		| 'bolt'
		| 'plug'
		| 'school'
		| 'ambisonics'
		| 'pipeline'
		| 'waves'
		| 'package'
		| 'code'
		| 'integration'
		| 'book'
		| 'github'
		| 'discord'
		| 'mail'
		| 'x'
		| 'globe'
		| 'menu'
		| 'close';
</script>

<script lang="ts">
	let { name, size = 24 }: { name: IconName; size?: number } = $props();
</script>

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
	{#if name === 'gamepad'}
		<rect x="2" y="7" width="20" height="11" rx="5.5" />
		<path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 14h.01" />
	{:else if name === 'braces'}
		<path
			d="M8 4H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 4h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"
		/>
	{:else if name === 'shuffle'}
		<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
	{:else if name === 'bolt'}
		<path d="M13 2 4 14h8l-1 8 9-12h-8l1-8z" />
	{:else if name === 'plug'}
		<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4" />
	{:else if name === 'school'}
		<path d="M22 10 12 5 2 10l10 5 10-5z" />
		<path d="M6 12v5c3 2 9 2 12 0v-5" />
	{:else if name === 'ambisonics'}
		<circle cx="12" cy="12" r="3" />
		<circle cx="12" cy="12" r="7.5" />
		<path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2" />
	{:else if name === 'pipeline'}
		<rect x="3" y="3.5" width="6" height="5" rx="1.5" />
		<rect x="15" y="3.5" width="6" height="5" rx="1.5" />
		<rect x="9" y="15.5" width="6" height="5" rx="1.5" />
		<path d="M6 8.5V12h12V8.5M12 12v3.5" />
	{:else if name === 'waves'}
		<path d="M2 10c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
		<path d="M4 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0" />
	{:else if name === 'package'}
		<path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3z" />
		<path d="M3 7.5 12 12l9-4.5M12 12v9" />
	{:else if name === 'code'}
		<path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14" />
	{:else if name === 'integration'}
		<path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
		<rect x="8" y="8" width="8" height="8" rx="2" />
		<path d="M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
	{:else if name === 'book'}
		<path
			d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13"
		/>
	{:else if name === 'github'}
		<path
			d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
		/>
	{:else if name === 'discord'}
		<path d="M8 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0M14 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
		<path
			d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 1.428-11.5 1.388-1.015 2.782-1.34 4.237-1.5l.975 1.923a11.913 11.913 0 0 1 4.053 0l.972-1.923c1.5.16 3.043.485 4.5 1.5 2 5.667 2.167 9.833 1.5 11.5-.667 1.333-2 3-3.5 3-.5 0-2-2-2-3"
		/>
		<path d="M7 16.5c3.5 1 6.5 1 10 0" />
	{:else if name === 'mail'}
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3 7 9 6 9-6" />
	{:else if name === 'x'}
		<path d="M4 4l11.733 16h4.267L8.267 4z" />
		<path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
	{:else if name === 'globe'}
		<circle cx="12" cy="12" r="9" />
		<path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
	{:else if name === 'menu'}
		<path d="M4 7h16M4 12h16M4 17h16" />
	{:else if name === 'close'}
		<path d="M6 6l12 12M18 6 6 18" />
	{/if}
</svg>
