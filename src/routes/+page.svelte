<script lang="ts">
	import { goto } from '$app/navigation';
	import { g, roomy } from '$lib/roomy.svelte';
	import { Painting } from '$lib/components';
	import { Button } from 'fuchs';
	import { base } from '$app/paths';

	async function createPainting() {
		g.painting = undefined;

		const painting = await roomy.create(Painting);
		painting.commit();

		goto(base + `/paint?id=${painting.id}`);
	}
</script>

<Button class="m-4" onclick={createPainting}>Create Painting</Button>
