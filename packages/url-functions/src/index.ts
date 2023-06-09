type QueryValue = string | number | boolean | (string | number)[] | null | undefined;
type QueryValueFn = (currentValue: string | null) => QueryValue;
type HashFn = (currentHash: string) => string | number;
export type QueryOptions = Record<string, QueryValue | QueryValueFn>;

type URLOptions = {
	protocol?: string | 'http' | 'https';
	path?: string;
	query?: QueryOptions;
	hash?: string | HashFn;
};

export type CreateUrlOptions = URLOptions & {
	hostname: string;
};

export type UpdateUrlOptions = URLOptions & {
	hostname?: string;
	/**
	 * Default: false
	 * If true, all query params will be kept
	 */
	keepQuery?: boolean;
};

export function createUrl(options: CreateUrlOptions): URL {
	const url = new URL((options.protocol || 'https') + '://' + options.hostname);

	// set path
	if (options.path) {
		url.pathname = options.path;
	}

	// set query
	if (options.query) {
		Object.entries(options.query).forEach(([key, value]) => {
			const realValue = unwrapQueryValue(url.searchParams, key, value);
			setQueryItem(url.searchParams, key, realValue);
		});
	}

	// set fragment
	if (options.hash) {
		url.hash = typeof options.hash === 'function' ? '' + options.hash(url.hash) : options.hash;
	}

	return url;
}

export const updateUrl =
	(previous: URL | string) =>
	(update: UpdateUrlOptions): URL => {
		const url = new URL(previous); // clone object

		if (update.path) {
			url.pathname = resolvePath(url.pathname, update.path);
		}

		// update protocol
		if (update.protocol) {
			url.protocol = update.protocol;
		}

		// update domain
		if (update.hostname) {
			url.hostname = update.hostname;
		}

		// remove all query params
		if (!update.keepQuery && !update.query) {
			url.search = '';
		} else if (update.query) {
			// rewrite all query params
			if (!update.keepQuery) {
				const params = new URLSearchParams();
				Object.entries(update.query).forEach(([key, value]) => {
					// Real value is read from original query parameters, not new empty ones
					const realValue = unwrapQueryValue(url.searchParams, key, value);
					setQueryItem(params, key, realValue);
				});
				url.search = params.toString();
			} else {
				// update existing query params
				Object.entries(update.query).forEach(([key, value]) => {
					const realValue = unwrapQueryValue(url.searchParams, key, value);
					setQueryItem(url.searchParams, key, realValue);
				});
			}
		}

		// update hash
		if (update.hash) {
			url.hash =
				typeof update.hash === 'function' ? '' + update.hash(url.hash.slice(1)) : update.hash;
		} else {
			// Hash is always removed if not set
			url.hash = '';
		}

		return url;
	};

const unwrapQueryValue = (
	params: URLSearchParams,
	key: string,
	value: QueryValue | QueryValueFn
): QueryValue => (typeof value === 'function' ? value(params.get(key)) : value);

const setQueryItem = (params: URLSearchParams, key: string, realValue: QueryValue) => {
	if (Array.isArray(realValue)) {
		// remove existing values and add new ones
		params.delete(key);
		realValue.forEach((v) => {
			// Only numbers and non-empty strings are allowed
			if (typeof v === 'number' || (typeof v === 'string' && v.length > 0)) {
				params.append(key, '' + v);
			}
		});
	} else if (realValue === false) {
		params.delete(key);
	} else if (realValue === true) {
		params.set(key, '');
	} else if (typeof realValue === 'string' || typeof realValue === 'number') {
		params.set(key, '' + realValue);
	}
};

const pathSegments = (path: string): string[] =>
	path
		.replace(/^\/|\/$/g, '')
		.split('/')
		.filter((i) => i);

// Path with .. on start will be resolved to root
export const resolvePath = (previous: string, next: string): string => {
	if (next.startsWith('/')) {
		// absolute path
		return next;
	}

	if (next.startsWith('../') || next === '..') {
		// up level path
		const parts = pathSegments(next);

		// Find how many levels we need to go up
		let level = 0;
		while (parts[level] === '..') {
			level++;
		}

		// TODO: keep last slash??
		return '/' + [...pathSegments(previous).slice(0, -level), ...parts.slice(level)].join('/');
	}

	// Remove / from previous and add next
	return '/' + [...pathSegments(previous), ...pathSegments(next)].join('/');
};

// Library will be importable as `import UrlFunctions from 'url-functions'`
export default {
	createUrl,
	updateUrl,
	resolvePath
};
