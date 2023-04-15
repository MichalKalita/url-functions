<script lang="ts">
	import { page } from '$app/stores';

	$: lang = $page.params.lang;
</script>

<h1>Example for language switching</h1>

Actual language is {lang}.
