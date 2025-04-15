<script lang="ts">
	import { goto } from '$app/navigation';
	import { roomy } from '$lib/roomy.svelte';
	import { Painting } from '$lib/components';
	import { Button } from '$lib/button';

	async function createPainting() {
		const painting = await roomy.create(Painting);
		painting.commit();

		goto(`/paint/${painting.id}`);
	}
</script>

<Button class="m-4" onclick={createPainting}>Create Painting</Button>
