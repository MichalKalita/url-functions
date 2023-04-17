import { updateUrl } from 'create-url';
import type { UpdateUrlOptions } from 'create-url';
import { page } from '$app/stores';
import { derived } from 'svelte/store';
import type { RouteParam } from '@sveltejs/kit/types/internal';

// import { parse_route_id } from '@sveltejs/kit/src/utils/routing.js';
import { parse_route_id } from '../../node_modules/@sveltejs/kit/src/utils/routing.js';

type OptionsWithRealPath = Omit<UpdateUrlOptions, 'path'> &
	(
		| {
				path?: '..';
				params: never;
		  }
		| {
				path: '/';
				params: never;
		  }
		| {
				path: '/[...path]';
				params: {
					path: string[];
				};
		  }
		| {
				path: '/[id]';
				params: {
					id: string;
				};
		  }
		| {
				path: '/lang/[[lang]]';
				params?: {
					lang?: string;
				};
		  }
		| {
				path: '/sveltekit';
				params: never;
		  }
	);

function solvePath(path: string, paramValues: Record<string, string | string[]> = {}): string {
	const { params } = parse_route_id(path) as { params: RouteParam[] };

	for (const param of params) {
		const value = paramValues[param.name];
		if (value === undefined) {
			throw new Error(`Missing parameter ${param.name} for path ${path}`);
		}

		console.log('param', param, 'value', value);

		if (param.rest) {
			if (!Array.isArray(value)) {
				throw new Error(`Parameter ${param.name} for path ${path} is not an array`);
			}

			path = path.replace(`[...${param.name}]`, value.join('/'));
		} else if (param.optional) {
			path = path.replace(`[[${param.name}]]`, value as string);
		} else {
			path = path.replace(`[${param.name}]`, value as string);
		}
	}

	console.log('solved path', path);

	return path;
}

export const url = derived(page, ($page) => (options: OptionsWithRealPath) => {
	let path = options.path as string;
	if (path) {
		path = solvePath(path, { ...$page.params, ...options?.params });
	}

	return updateUrl($page.url)({ ...options, path }).toString();
});
