import { updateUrl } from 'create-url';
import type { UpdateUrlOptions } from 'create-url';
import { page } from '$app/stores';
import { derived } from 'svelte/store';

// TODO: use svelte types to setup path and params types

export const url = derived(
	page,
	($page) => (options: UpdateUrlOptions) => updateUrl($page.url)(options).toString()
);
