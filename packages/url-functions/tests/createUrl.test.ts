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
	expect(createUrl({ hostname: 'example.com', query: { a: 'b' } }).toString()).toBe(
		'https://example.com/?a=b'
	);
	expect(createUrl({ hostname: 'example.com', query: { a: ['b', 'c'] } }).toString()).toBe(
		'https://example.com/?a=b&a=c'
	);
	expect(createUrl({ hostname: 'example.com', hash: 'hello' }).toString()).toBe(
		'https://example.com/#hello'
	);
	expect(createUrl({ hostname: 'example.com', path: 'hello', query: { a: 'b' } }).toString()).toBe(
		'https://example.com/hello?a=b'
	);
	expect(
		createUrl({ hostname: 'example.com', path: 'hello', query: { a: ['b', 'c'] } }).toString()
	).toBe('https://example.com/hello?a=b&a=c');
	expect(
		createUrl({
			hostname: 'example.com',
			path: 'hello',
			query: { a: 'b' },
			hash: 'hello'
		}).toString()
	).toBe('https://example.com/hello?a=b#hello');
});

test('create url query with null and undefined are ignored', () => {
	expect(createUrl({ hostname: 'example.com', query: { a: null } }).toString()).toBe(
		'https://example.com/'
	);
	expect(createUrl({ hostname: 'example.com', query: { a: undefined } }).toString()).toBe(
		'https://example.com/'
	);

	// With existing query and null and undefined
	expect(createUrl({ hostname: 'example.com', query: { a: 'b', c: null } }).toString()).toBe(
		'https://example.com/?a=b'
	);
	expect(createUrl({ hostname: 'example.com', query: { a: 'b', c: undefined } }).toString()).toBe(
		'https://example.com/?a=b'
	);
});

test('create url with invalid types in query', () => {
	// @ts-ignore
	expect(createUrl({ hostname: 'example.com', query: { a: { b: 'c' } } }).toString()).toBe(
		'https://example.com/'
	);
	expect(
		// @ts-ignore
		createUrl({ hostname: 'example.com', query: { a: [1, 2, { x: 'y' }] } }).toString()
	).toBe('https://example.com/?a=1&a=2');
});

test('create url with invalid query with empty array items will be ignored', () => {
	expect(createUrl({ hostname: 'example.com', query: { a: ['b', ''] } }).toString()).toBe(
		'https://example.com/?a=b'
	);
	// @ts-ignore
	expect(createUrl({ hostname: 'example.com', query: { a: ['b', undefined] } }).toString()).toBe(
		'https://example.com/?a=b'
	);
	// @ts-ignore
	expect(createUrl({ hostname: 'example.com', query: { a: ['b', null] } }).toString()).toBe(
		'https://example.com/?a=b'
	);

	expect(createUrl({ hostname: 'example.com', query: { a: [''] } }).toString()).toBe(
		'https://example.com/'
	);
	// @ts-ignore
	expect(createUrl({ hostname: 'example.com', query: { a: [undefined] } }).toString()).toBe(
		'https://example.com/'
	);
	// @ts-ignore
	expect(createUrl({ hostname: 'example.com', query: { a: [null] } }).toString()).toBe(
		'https://example.com/'
	);
});

describe('query', () => {
	test('update function have null input', () => {
		const updateFunction = jest.fn((value) => value);
		expect(createUrl({ hostname: 'example.com', query: { a: updateFunction } }).toString()).toBe(
			'https://example.com/'
		);
		expect(updateFunction).toBeCalledWith(null);
	});
});

describe('hash', () => {
	test('update function have empty string input', () => {
		const updateFunction = jest.fn((value) => value);
		expect(createUrl({ hostname: 'example.com', hash: updateFunction }).toString()).toBe(
			'https://example.com/'
		);
		expect(updateFunction).toBeCalledWith('');
	});
});
