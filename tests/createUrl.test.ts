// Test all scenarios for createUrl function

import { createUrl } from '../src/index';

test('create url', () => {
	expect(createUrl({ hostname: 'example.com' }).toString()).toBe('https://example.com/');
	expect(createUrl({ hostname: 'example.com', protocol: 'http' }).toString()).toBe(
		'http://example.com/'
	);
	expect(createUrl({ hostname: 'example.com', path: 'hello' }).toString()).toBe(
		'https://example.com/hello'
	);
	expect(createUrl({ hostname: 'example.com', setQuery: { a: 'b' } }).toString()).toBe(
		'https://example.com/?a=b'
	);
	expect(createUrl({ hostname: 'example.com', setQuery: { a: ['b', 'c'] } }).toString()).toBe(
		'https://example.com/?a=b&a=c'
	);
	expect(createUrl({ hostname: 'example.com', hash: 'hello' }).toString()).toBe(
		'https://example.com/#hello'
	);
	expect(
		createUrl({ hostname: 'example.com', path: 'hello', setQuery: { a: 'b' } }).toString()
	).toBe('https://example.com/hello?a=b');
	expect(
		createUrl({ hostname: 'example.com', path: 'hello', setQuery: { a: ['b', 'c'] } }).toString()
	).toBe('https://example.com/hello?a=b&a=c');
	expect(
		createUrl({
			hostname: 'example.com',
			path: 'hello',
			setQuery: { a: 'b' },
			hash: 'hello'
		}).toString()
	).toBe('https://example.com/hello?a=b#hello');
});
