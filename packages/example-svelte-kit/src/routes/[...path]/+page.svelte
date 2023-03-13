<script lang="ts">
	import { page } from '$app/stores';

	import { updateUrl } from 'create-url';

	$: url = updateUrl($page.url);

	$: lastPath = $page.url.pathname.split('/').pop() || '';
	$: nextPath = lastPath ? String.fromCharCode(lastPath.charCodeAt(lastPath.length - 1) + 1) : 'a';
</script>

<h1>
	Page '{$page.params.path}'
</h1>

<p>Page with [...path] in router</p>

<a href={url({ path: '..' })}>Go level up and keep all parameters</a>
<a href={url({ path: nextPath })}>Go to next page and keep all parameters</a>
