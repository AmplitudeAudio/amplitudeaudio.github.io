import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries and mdsvex output,
				// which still compiles to legacy component syntax.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md')
						? undefined
						: true
			},
			// GitHub Pages serves 404.html for unknown paths.
			adapter: adapter({ fallback: '404.html' }),
			// /blog/[slug] has no pages until the first post is published.
			prerender: { handleUnseenRoutes: 'warn' },
			preprocess: [mdsvex({ extensions: ['.md'] })],
			extensions: ['.svelte', '.md']
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// Static hosting: the locale comes from the URL only, never from a cookie.
			strategy: ['url', 'baseLocale']
		})
	]
});
