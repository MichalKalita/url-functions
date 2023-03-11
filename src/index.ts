export type UpdateUrlOptions = {
	path?: string;
};

export function createUrl(previous: URL, update: UpdateUrlOptions): URL {
	return previous;
}
