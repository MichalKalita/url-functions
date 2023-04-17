<script lang="ts">
	import { page } from '$app/stores';
	import { url } from '$lib/url';

	$: number = Number($page.url.searchParams.get('number')) || 0;
	$: array = $page.url.searchParams.getAll('a') || [];
	$: urlQueryObject = Array.from($page.url.searchParams.entries()).reduce((acc, [key, value]) => {
		if (key in acc) {
			if (Array.isArray(acc[key])) {
				acc[key].push(value);
			} else {
				acc[key] = [acc[key], value];
			}
		} else {
			acc[key] = value;
		}

		return acc;
	}, {});
</script>

<div class="note">Layout <span>+layout.svelte</span></div>
<div class="box">
	<h1>Examples, how to use with link tools</h1>
	<div class="actions">
		<a href="#query">native link with hash</a>
		<a href={$url({ hash: 'query' })}>Generated link with hash</a>

		<a href={$url({ clearQuery: true })}>Reset all queries and hash</a>

		<a href={$url({ clearQuery: true, query: { key: 'value' } })}>Rewrite query</a>
	</div>

	<div class="note mt-5">Page parameters <span>{$page.route.id}</span></div>
	<div class="box">
		<pre>{JSON.stringify($page.params, null, 2)}</pre>
	</div>

	<div class="note mt-5">URL Query</div>
	<div class="box">
		<pre>{JSON.stringify(urlQueryObject, null, 2)}</pre>

		<div class="note mt-5">Number <span>{number}</span></div>
		<div class="box actions">
			<a href={$url({ query: { number: (n) => Number(n || 0) + 1 } })}>
				Increment number <span>{'url({ query: { number: (n) => Number(n || 0) + 1 } })'}</span>
			</a>
			<a href={$url({ query: { number: (n) => Number(n || 0) - 1 } })}>
				Decrement <span>{'url({ query: { number: (n) => Number(n || 0) - 1 } })'}</span>
			</a>
		</div>

		<div class="note mt-5">Array <span>[{array.join(', ')}]</span></div>
		<div class="box actions">
			<a href={$url({ query: { a: [...array, Number(array.at(-1) || 0) + 1] } })}>
				Add item to list <span
					>{'url({ query: { a: [...array, Number(array.at(-1) || 0) + 1] } })'}</span
				>
			</a>
			<a href={$url({ query: { a: array.slice(1) } })}>
				Remove first <span>{'url({ query: { a: array.slice(1) } })'}</span>
			</a>
			<a href={$url({ query: { a: array.slice(0, -1) } })}>
				Remove last <span>{'url({ query: { a: array.slice(0, -1) } })'}</span>
			</a>
		</div>
	</div>

	<div class="note mt-5">Page in path <span>{$page.route.id}</span></div>
	<div class="box">
		<slot />
	</div>
</div>

<style>
	.box {
		border: 1px solid black;
		padding: 5px;
	}

	.note {
		background: black;
		color: white;
		display: inline-block;
		padding: 2px 5px;
	}

	.note span {
		font-family: monospace;
		color: rgb(240, 214, 66);
	}

	.mt-5 {
		margin-top: 5px;
	}

	pre {
		margin: 0;
	}

	a {
		text-decoration: none;
	}
	a:hover,
	a:focus {
		text-decoration: underline;
	}
	a span {
		font-family: monospace;
		color: rgb(230, 2, 2);
	}

	.actions {
		display: flex;
		flex-direction: column;
	}
</style>
