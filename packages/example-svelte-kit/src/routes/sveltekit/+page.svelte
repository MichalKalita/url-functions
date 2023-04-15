<script lang="ts">
	import { url } from '$lib/url';
</script>

<h1>Page with svelte plugin usage</h1>
<a href={$url({ path: '/' })}>Root</a>

<a href={$url({ query: { page: (p) => Number(p) + 1 } })}>Next page</a>

<a href={$url({ path: '/[...path]' })}>link</a>
