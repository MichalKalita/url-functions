import { updateUrl } from '../src/index';

const ident = <T>(value: T): T => value;
const iterateNumber = (input: string | null) => Number(input || 1) + 1;

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
		expect(updateUrl('/?a=b')({ query: { a: 'c' } }).toString()).toBe('/?a=c');
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
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { c: 'd' },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b&c=d');
	});

	test('set query with array', () => {
		expect(updateUrl(new URL('https://example.com'))({ query: { a: ['b', 'c'] } }).toString()).toBe(
			'https://example.com/?a=b&a=c'
		);
	});

	test('set query with existing query with array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { c: ['d', 'e'] },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b&c=d&c=e');
	});

	test('empty query with keep query does not affect query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ query: {}, keepQuery: true }).toString()
		).toBe('https://example.com/?a=b');
		expect(updateUrl(new URL('https://example.com?a=b'))({ keepQuery: true }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});

	test('empty query will delete all query without keepQuery', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({ query: {}, keepQuery: false }).toString()
		).toBe('https://example.com/');
		expect(updateUrl(new URL('https://example.com?a=b'))({ keepQuery: false }).toString()).toBe(
			'https://example.com/'
		);
	});

	test('undefined and null query item will not change query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: undefined },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b');

		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: null },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b');
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

	test('false delete query with keepQuery', () => {
		expect(
			updateUrl(new URL('https://example.com/?activated&a=b'))({
				query: { activated: false },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b');
	});

	describe.each([true, false])('query functions, keepQuery = %s', (keepQuery) => {
		test('ident function keep value', () => {
			expect(
				updateUrl(new URL('https://example.com/?a=b'))({
					query: { a: ident },
					keepQuery
				}).toString()
			).toBe('https://example.com/?a=b');
		});

		test('iterate page number', () => {
			expect(
				updateUrl(new URL('https://example.com/'))({
					query: { page: iterateNumber },
					keepQuery
				}).toString()
			).toBe('https://example.com/?page=2');
			expect(
				updateUrl(new URL('https://example.com/?page=2'))({
					query: { page: iterateNumber },
					keepQuery
				}).toString()
			).toBe('https://example.com/?page=3');
		});
	});
});

describe('clear query', () => {
	test('clear query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { c: 'd' }
			}).toString()
		).toBe('https://example.com/?c=d');
	});

	test('query array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: ['c', 'd'] }
			}).toString()
		).toBe('https://example.com/?a=c&a=d');
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				query: { d: ['e', 'f'] }
			}).toString()
		).toBe('https://example.com/?d=e&d=f');
	});

	test('only clear query', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({}).toString()).toBe(
			'https://example.com/'
		);
	});
});

describe('keep query', () => {
	test('keep query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { c: 'd' },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b&c=d');
	});

	test('keep query array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				query: { d: ['e', 'f'] },
				keepQuery: true
			}).toString()
		).toBe('https://example.com/?a=b&a=c&d=e&d=f');
	});

	test('only keep query', () => {
		expect(updateUrl(new URL('https://example.com?a=b'))({ keepQuery: true }).toString()).toBe(
			'https://example.com/?a=b'
		);
	});
});

describe('array query', () => {
	test('update query with array will rewrite array', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b&a=c'))({
				query: { a: ['d', 'e'] }
			}).toString()
		).toBe('https://example.com/?a=d&a=e');
	});

	test('update query with undefined will not change query', () => {
		expect(
			updateUrl(new URL('https://example.com?a=b'))({
				query: { a: undefined },
				keepQuery: true
			}).toString()
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

describe('hash', () => {
	test('update hash', () => {
		expect(updateUrl(new URL('https://example.com'))({ hash: 'a' }).toString()).toBe(
			'https://example.com/#a'
		);
	});

	test('hash is deleted by default', () => {
		expect(updateUrl(new URL('https://example.com#b'))({}).toString()).toBe('https://example.com/');
	});

	describe('update hash with function', () => {
		test('iterate hash number (empty hash)', () => {
			expect(
				updateUrl(new URL('https://example.com'))({
					hash: iterateNumber
				}).toString()
			).toBe('https://example.com/#2');
		});
		test('iterate hash number (hash = #2)', () => {
			expect(
				updateUrl(new URL('https://example.com/#2'))({
					hash: iterateNumber
				}).toString()
			).toBe('https://example.com/#3');
		});

		test.each(['#a', ''])('ident function keep actual hash ( hash = "%s" )', (hashValue) => {
			expect(
				updateUrl(new URL(`https://example.com/${hashValue}`))({
					hash: ident
				}).toString()
			).toBe(`https://example.com/${hashValue}`);
		});
	});
});
