<script lang="ts">
	import { page } from '$app/stores';
	import { updateUrl } from 'create-url';

	$: url = updateUrl($page.url);
	$: number = Number($page.url.searchParams.get('number')) || 0;
	$: array = $page.url.searchParams.getAll('a') || [];
</script>

<h1>SvelteKit usage example</h1>

<a href={url({ deleteQuery: true, hash: '' })}>Reset all queries and hash</a>

<div>
	<h2 id="query">Query</h2>
	<a href="#query">native link with hash</a>
	<a href={url({ hash: 'query' })}>Generated link with hash</a>
	<p>Number: {number}</p>
	<a href={url({ query: { number: (n) => Number(n || 0) + 1 } })}>Increment</a>
	<a href={url({ query: { number: (n) => Number(n || 0) - 1 } })}>Decrement</a>
</div>

<div>
	<h2 id="query-array">Update array in query</h2>
	<p>Array: [{array.join(', ')}]</p>
	<a href={url({ query: { a: [...array, Number(array.at(-1) || 0) + 1] } })}>Add item to list</a>
	<a href={url({ query: { a: array.slice(1) } })}>Remove first</a>
	<a href={url({ query: { a: array.slice(0, -1) } })}>Remove last</a>
</div>
