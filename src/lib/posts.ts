import type { Component } from 'svelte';

export interface PostMeta {
	slug: string;
	title: string;
	description: string;
	/** ISO date, e.g. 2026-10-13 */
	date: string;
	author?: string;
	draft?: boolean;
}

interface PostModule {
	default: Component;
	metadata: Omit<PostMeta, 'slug'>;
}

const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

const slugOf = (path: string) => path.slice(path.lastIndexOf('/') + 1, -'.md'.length);

// Drafts are visible in `bun run dev` and left out of production builds.
const isPublished = (meta: Omit<PostMeta, 'slug'>) => !meta.draft || import.meta.env.DEV;

export const posts: PostMeta[] = Object.entries(modules)
	.filter(([, mod]) => isPublished(mod.metadata))
	.map(([path, mod]) => ({ ...mod.metadata, slug: slugOf(path) }))
	.sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): { meta: PostMeta; content: Component } | null {
	const mod = modules[`/src/posts/${slug}.md`];
	if (!mod || !isPublished(mod.metadata)) return null;
	return { meta: { ...mod.metadata, slug }, content: mod.default };
}
