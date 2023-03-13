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

describe('relative path', () => {
	test('root path', () => {
		expect(updateUrl('/')({}).toString()).toBe('/');
	});
	test('set pathname', () => {
		expect(updateUrl('/')({ path: 'a' }).toString()).toBe('/a');
	});
	test('set query', () => {
		expect(updateUrl('/')({ setQuery: { a: 'b' } }).toString()).toBe('/?a=b');
	});
	test('update query', () => {
		expect(updateUrl('/?a=b')({ updateQuery: { a: 'c' } }).toString()).toBe('/?a=c');
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

describe('set query', () => {
	test('set query', () => {
		expect(updateUrl(new URL('https://example.com'))({ setQuery: { a: 'b' } }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});

	test('set query with existing query', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({ setQuery: { c: 'd' } }).toString()).toBe(
			'https://example.com/?c=d'
		);
	});

	test('set query with array', () => {
		expect(
			updateUrl(new URL('https://example.com'))({ setQuery: { a: ['b', 'c'] } }).toString()
		).toBe('https://example.com/?a=b&a=c');
	});

	test('set query with existing query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ setQuery: { c: ['d', 'e'] } }).toString()
		).toBe('https://example.com/?c=d&c=e');
	});

	test('set empty query to remove all', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({ setQuery: {} }).toString()).toBe(
			'https://example.com/'
		);
	});
});

describe('update query', () => {
	test('update query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ updateQuery: { a: 'c' } }).toString()
		).toBe('https://example.com/?a=c');
	});

	test('update query with existing query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ updateQuery: { c: 'd' } }).toString()
		).toBe('https://example.com/?a=b&c=d');
	});

	test('update query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ updateQuery: { a: ['c', 'd'] } }).toString()
		).toBe('https://example.com/?a=c&a=d');
	});

	test('update query with existing query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				updateQuery: { d: ['e', 'f'] }
			}).toString()
		).toBe('https://example.com/?a=b&a=c&d=e&d=f');
	});
});

describe('set and update query', () => {
	test('set query and update query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				setQuery: { c: 'd' },
				updateQuery: { e: 'f' }
			}).toString()
		).toBe('https://example.com/?c=d&e=f');
	});

	test('set empty query to remove all and update query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				setQuery: {},
				updateQuery: { e: 'f' }
			}).toString()
		).toBe('https://example.com/?e=f');
	});

	test('set query and update query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				setQuery: { c: ['d'] },
				updateQuery: { e: ['f', 'g'] }
			}).toString()
		).toBe('https://example.com/?c=d&e=f&e=g');
	});
});

describe('array query', () => {
	test('update query with array will rewrite array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				updateQuery: { a: ['d', 'e'] }
			}).toString()
		).toBe('https://example.com/?a=d&a=e');
	});

	test('update query with null will remove query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ updateQuery: { a: null } }).toString()
		).toBe('https://example.com/');
	});

	test('update query with undefined will not change query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ updateQuery: { a: undefined } }).toString()
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
		expect(updateUrl(new URL('https://example.com/a/b/c'))({ path: '../../d' }).toString()).toBe(
			'https://example.com/d'
		);
		expect(updateUrl(new URL('https://example.com/a/b/c'))({ path: '../../d/e' }).toString()).toBe(
			'https://example.com/d/e'
		);
	});
});
