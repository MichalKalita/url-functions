type QueryValue = string | string[] | null | undefined;
export type QueryOptions = Record<string, QueryValue>;

type URLOptions = {
	protocol?: string | 'http' | 'https';
	path?: string;
	query?: QueryOptions;
	hash?: string;
};

export type CreateUrlOptions = URLOptions & {
	hostname: string;
};

export type UpdateUrlOptions = URLOptions & {
	hostname?: string;
	deleteQuery?: boolean;
};

export function createUrl(options: CreateUrlOptions): URL {
	const url = new URL((options.protocol || 'https') + '://' + options.hostname);

	// set path
	if (options.path) {
		url.pathname = options.path;
	}

	// set query
	if (options.query) {
		const params = new URLSearchParams();
		Object.entries(options.query).forEach(([key, value]) => setQueryItem(params, key, value));
		url.search = params.toString();
	}

	// set fragment
	if (options.hash) {
		url.hash = options.hash;
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
		if (update.deleteQuery && !update.query) {
			url.search = '';
		} else if (update.query) {
			// rewrite all query params
			if (update.deleteQuery) {
				const params = new URLSearchParams();
				Object.entries(update.query).forEach(([key, value]) => setQueryItem(params, key, value));
				url.search = params.toString();
			} else {
				// update existing query params
				Object.entries(update.query).forEach(([key, value]) =>
					setQueryItem(url.searchParams, key, value)
				);
			}
		}

		// update hash
		if (update.hash) {
			url.hash = update.hash;
		}

		return url;
	};

function setQueryItem(params: URLSearchParams, key: string, value: QueryValue) {
	if (Array.isArray(value)) {
		// remove existing values and add new ones
		params.delete(key);
		value.forEach((v) => {
			// Only numbers and non empty strings are allowed
			if (typeof v === 'number' || (typeof v === 'string' && v.length > 0)) {
				params.append(key, v);
			}
		});
	} else {
		if (value === null) {
			params.delete(key);
		} else if (value !== undefined || typeof value === 'string' || typeof value === 'number') {
			params.set(key, value);
		}
	}
}

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

	if (next.startsWith('../')) {
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
