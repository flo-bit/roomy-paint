
<script lang="ts">
	import { page } from '$app/state';
	import { g, roomy } from '$lib/roomy.svelte';
	import { type EntityIdStr } from '$lib/roomy';
	import { goto } from '$app/navigation';
	import { Button } from 'fuchs';
	import { base } from '$app/paths';
	import { Painting } from '$lib/components';

	let { children } = $props();

	let showPainting = $state(false);

	$effect(() => {
		//const worldId = page.params.id;
		// TODO: we should use search params here
		const paintingId = page.url.searchParams.get('id');
		if (!paintingId) return;

		showPainting = true;


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

	async function createPainting() {
		const painting = await roomy.create(Painting);
		painting.commit();

		goto(base + `/paint?id=${painting.id}`);
	}
</script>

{#if showPainting}
	{@render children()}
{:else}
	<Button class="m-4" onclick={() => createPainting()}>New Painting</Button>
{/if}
