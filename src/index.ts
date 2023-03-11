type QueryValue = string | string[] | null | undefined;
export type QueryOptions = Record<string, QueryValue>;

type URLOptions = {
	protocol?: string | 'http' | 'https';
	path?: string;
	setQuery?: QueryOptions;
	hash?: string;
};

export type CreateUrlOptions = URLOptions & {
	hostname: string;
};

export type UpdateUrlOptions = URLOptions & {
	hostname?: string;
	updateQuery?: QueryOptions;
};

export function createUrl(options: CreateUrlOptions): URL {
	const url = new URL((options.protocol || 'https') + '://' + options.hostname);

	// set path
	if (options.path) {
		url.pathname = options.path;
	}

	// set query
	if (options.setQuery) {
		const params = new URLSearchParams();
		Object.entries(options.setQuery).forEach(([key, value]) => setQueryItem(params, key, value));
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

		// update protocol
		if (update.protocol) {
			url.protocol = update.protocol;
		}

		// update domain
		if (update.hostname) {
			url.hostname = update.hostname;
		}

		// set query
		if (update.setQuery) {
			const params = new URLSearchParams();
			Object.entries(update.setQuery).forEach(([key, value]) => setQueryItem(params, key, value));
			url.search = params.toString();
		}

		// update query
		if (update.updateQuery) {
			Object.entries(update.updateQuery).forEach(([key, value]) =>
				setQueryItem(url.searchParams, key, value)
			);
		}

		// update fragment
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
			params.append(key, v);
		});
	} else {
		if (value === null) {
			params.delete(key);
		} else if (value !== undefined) {
			params.set(key, value);
		}
	}
}
