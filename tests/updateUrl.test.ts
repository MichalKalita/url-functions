import { updateUrl } from '../src/index';

test('change protocol', () => {
	const url = new URL('https://example.com');

	expect(updateUrl(url)({ protocol: 'http' }).toString()).toBe('http://example.com/');
});

test('change hostname', () => {
	const url = new URL('https://example.com');

	expect(updateUrl(url)({ hostname: 'example.org' }).toString()).toBe('https://example.org/');
});

test('set query', () => {
	const url = new URL('https://example.com');

	expect(updateUrl(url)({ setQuery: { a: 'b' } }).toString()).toBe('https://example.com/?a=b');
});

test('set query with existing query', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ setQuery: { c: 'd' } }).toString()).toBe('https://example.com/?c=d');
});

test('set query with array', () => {
	const url = new URL('https://example.com');

	expect(updateUrl(url)({ setQuery: { a: ['b', 'c'] } }).toString()).toBe(
		'https://example.com/?a=b&a=c'
	);
});

test('set query with existing query with array', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ setQuery: { c: ['d', 'e'] } }).toString()).toBe(
		'https://example.com/?c=d&c=e'
	);
});

test('set empty query to remove all', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ setQuery: {} }).toString()).toBe('https://example.com/');
});

test('update query', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ updateQuery: { a: 'c' } }).toString()).toBe('https://example.com/?a=c');
});

test('update query with existing query', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ updateQuery: { c: 'd' } }).toString()).toBe(
		'https://example.com/?a=b&c=d'
	);
});

test('update query with array', () => {
	const url = new URL('https://example.com?a=b');

	expect(updateUrl(url)({ updateQuery: { a: ['c', 'd'] } }).toString()).toBe(
		'https://example.com/?a=c&a=d'
	);
});

test('update query with existing query with array', () => {
	const url = new URL('https://example.com?a=b&a=c');

	expect(updateUrl(url)({ updateQuery: { d: ['e', 'f'] } }).toString()).toBe(
		'https://example.com/?a=b&a=c&d=e&d=f'
	);
});
