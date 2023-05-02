import { updateUrl } from '../src/index';

test('change protocol', () => {
	expect(updateUrl(new URL('https://example.com'))({ protocol: 'http' }).toString()).toBe(
		'http://example.com/'
	);
});

test('change hostname', () => {
	expect(updateUrl(new URL('https://example.com'))({ hostname: 'example.org' }).toString()).toBe(
		'https://example.org/'
	);
});

// Not implemented yet
xdescribe('relative path', () => {
	test('root path', () => {
		expect(updateUrl('/')({}).toString()).toBe('/');
	});
	test('set pathname', () => {
		expect(updateUrl('/')({ path: 'a' }).toString()).toBe('/a');
	});
	test('set query', () => {
		expect(updateUrl('/')({ query: { a: 'b' } }).toString()).toBe('/?a=b');
	});
	test('update query', () => {
		expect(updateUrl('/?a=b')({ query: { a: 'c' }, clearQuery: true }).toString()).toBe('/?a=c');
	});
	test('set hash', () => {
		expect(updateUrl('/')({ hash: 'a' }).toString()).toBe('/#a');
	});
	test('hostname', () => {
		// Default protocol is https
		expect(updateUrl('/')({ hostname: 'example.com' }).toString()).toBe('https://example.com/');
		expect(updateUrl('/')({ hostname: 'example.com', protocol: 'ftp' }).toString()).toBe(
			'ftp://example.com/'
		);
	});
});

describe('query', () => {
	test('set query', () => {
		expect(updateUrl(new URL('https://example.com'))({ query: { a: 'b' } }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});

	test('add query to existing', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({ query: { c: 'd' } }).toString()).toBe(
			'https://example.com/?a=b&c=d'
		);
	});

	test('set query with array', () => {
		expect(updateUrl(new URL('https://example.com'))({ query: { a: ['b', 'c'] } }).toString()).toBe(
			'https://example.com/?a=b&a=c'
		);
	});

	test('set query with existing query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ query: { c: ['d', 'e'] } }).toString()
		).toBe('https://example.com/?a=b&c=d&c=e');
	});

	test('empty query dont affects query', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({ query: {} }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});

	test('undefined and null query item will not change query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ query: { a: undefined } }).toString()
		).toBe('https://example.com/?a=b');

		expect(updateUrl(new URL('https://example.com?a=b'))({ query: { a: null } }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});

	test('true set query', () => {
		expect(
			updateUrl(new URL('https://example.com'))({ query: { activated: true } }).toString()
		).toBe('https://example.com/?activated='); // TODO: update to make possible create query parameter without =
	});

	test('false delete query', () => {
		expect(
			updateUrl(new URL('https://example.com/?activated'))({
				query: { activated: false }
			}).toString()
		).toBe('https://example.com/');
	});
});

describe('clear query', () => {
	test('clear query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: 'c' },
				clearQuery: true
			}).toString()
		).toBe('https://example.com/?a=c');
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { c: 'd' },
				clearQuery: true
			}).toString()
		).toBe('https://example.com/?c=d');
	});

	test('query array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: ['c', 'd'] },
				clearQuery: true
			}).toString()
		).toBe('https://example.com/?a=c&a=d');
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				query: { d: ['e', 'f'] },
				clearQuery: true
			}).toString()
		).toBe('https://example.com/?d=e&d=f');
	});

	test('only clear query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				clearQuery: true
			}).toString()
		).toBe('https://example.com/');
	});
});

describe('array query', () => {
	test('update query with array will rewrite array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				query: { a: ['d', 'e'] },
				clearQuery: true
			}).toString()
		).toBe('https://example.com/?a=d&a=e');
	});

	test('update query with undefined will not change query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ query: { a: undefined } }).toString()
		).toBe('https://example.com/?a=b');
	});
});

describe('path changes', () => {
	test('go lvl up', () => {
		expect(updateUrl(new URL('https://example.com/a'))({ path: '..' }).toString()).toBe(
			'https://example.com/'
		);
		expect(updateUrl(new URL('https://example.com/a/b'))({ path: '../..' }).toString()).toBe(
			'https://example.com/'
		);
		expect(updateUrl(new URL('https://example.com/a/b/c'))({ path: '../../..' }).toString()).toBe(
			'https://example.com/'
		);
	});

	test('go lvl up and other path', () => {
		expect(updateUrl(new URL('https://example.com/a/b/c'))({ path: '../d' }).toString()).toBe(
			'https://example.com/a/b/d'
		);
		expect(
			updateUrl(new URL('https://example.com/a/b/c'))({
				path: '../../../../../../d/e/f'
			}).toString()
		).toBe('https://example.com/d/e/f');
	});
});
