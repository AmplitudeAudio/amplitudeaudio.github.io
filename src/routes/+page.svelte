<script lang="ts">
	import { site } from '#lib/site.ts';
	import Hero from '#lib/components/home/Hero.svelte';
	import FeatureLab from '#lib/components/home/FeatureLab.svelte';
	import EngineFeatures from '#lib/components/home/EngineFeatures.svelte';
	import Integrations from '#lib/components/home/Integrations.svelte';
	import OpenSource from '#lib/components/home/OpenSource.svelte';
	import Support from '#lib/components/home/Support.svelte';
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta property="og:title" content={site.title} />
</svelte:head>

<Hero />
<FeatureLab />
<EngineFeatures />
<Integrations />
<OpenSource />
<Support />
