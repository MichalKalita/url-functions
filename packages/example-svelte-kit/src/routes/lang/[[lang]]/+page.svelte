<script lang="ts">
	import { page } from '$app/stores';
	import { url } from '$lib/url';

	$: lang = $page.params.lang;
</script>

<h1>Example for language switching</h1>

Actual language is {lang}.

<a href={$url({ path: '/lang/[[lang]]' })}> Lang </a>

<a href={$url({ path: '/lang/[[lang]]', params: { lang: 'cs' } })}> Lang </a>
