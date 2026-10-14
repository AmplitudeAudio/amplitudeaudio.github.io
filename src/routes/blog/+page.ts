import { posts } from '#lib/posts.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({ posts });
