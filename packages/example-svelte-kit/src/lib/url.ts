import { updateUrl } from 'create-url';
import type { UpdateUrlOptions } from 'create-url';
import { page } from '$app/stores';
import { derived } from 'svelte/store';

import { create_manifest_data } from '@sveltejs/kit/src/core/sync/create_manifest_data';

// TODO: use svelte types to setup path and params types

// import '../../.svelte-kit/types/route_meta_data.json';

import type route_meta_data from '../../.svelte-kit/types/route_meta_data.json';

const manifestData = create_manifest_data();


type OptionsWithRealPath = UpdateUrlOptions & {
	path?: keyof typeof route_meta_data;
};

export const url = derived(
	page,
	($page) => (options: OptionsWithRealPath) => updateUrl($page.url)(options).toString()
);
