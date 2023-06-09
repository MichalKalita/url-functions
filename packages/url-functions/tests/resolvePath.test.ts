import { resolvePath } from '../src/index';

test('resolvePath with change level', () => {
	expect(resolvePath('/a/b/c', '/d')).toBe('/d');
	expect(resolvePath('/a/b/c', 'd')).toBe('/a/b/c/d');
	expect(resolvePath('/a/b/c', '../d')).toBe('/a/b/d');
	expect(resolvePath('/a/b/c', '../../d')).toBe('/a/d');
	expect(resolvePath('/a/b/c', '../../../d')).toBe('/d');
	expect(resolvePath('/a/b/c', '../../../../d')).toBe('/d');
	expect(resolvePath('/a/b/c', '../../../../d/e')).toBe('/d/e');
	expect(resolvePath('/a/b/c', '../../../../d/e/f')).toBe('/d/e/f');

	expect(resolvePath('/a/b/c', 'd')).toBe('/a/b/c/d');
});

test('go lvl up', () => {
	expect(resolvePath('/a/b/c', '..')).toBe('/a/b');
	expect(resolvePath('/a/b/c', '../..')).toBe('/a');
	expect(resolvePath('/a/b/c', '../../..')).toBe('/');
	expect(resolvePath('/a/b/c', '../../../..')).toBe('/');
});

test('root is always root', () => {
	expect(resolvePath('/a', '/b')).toBe('/b');
	expect(resolvePath('/a', '/b/c')).toBe('/b/c');
});

test('resolve empty path', () => {
	expect(resolvePath('', '')).toBe('/');
	expect(resolvePath('', '/')).toBe('/');
	expect(resolvePath('/', '')).toBe('/');
	expect(resolvePath('/', '/')).toBe('/');
});

test('resolvePath with same level', () => {
	expect(resolvePath('a', 'b')).toBe('/a/b');
	expect(resolvePath('a', '')).toBe('/a');
	expect(resolvePath('', 'a')).toBe('/a');
});
