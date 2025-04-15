<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { roomy, g } from '$lib/roomy.svelte';
	import { Painting } from '$lib/components';
	import { type EntityIdStr } from '@roomy-chat/sdk';

	let { children } = $props();

	$effect(() => {
		const paintingId = page.params.paintId;
		roomy
			.open(Painting, paintingId as EntityIdStr)
			.then((painting) => {
				g.painting = painting;
			})
			.catch((e) => {
				console.error('Error opening painting', e);
				goto('/');
			});
	});
</script>

{@render children()}
