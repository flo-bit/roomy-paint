<script lang="ts">
	import { g, roomy } from '$lib/roomy.svelte';
	import { DrawnPoint } from '$lib/components';
	import { derivePromise } from '$lib/utils.svelte';
	import ColorSelect from '$lib/color-select/ColorSelect.svelte';
	import Button from '$lib/button/Button.svelte';
	import { createDraggable, Draggable } from 'animejs';

	let points = derivePromise([], async () => (g.painting ? await g.painting.points.items() : []));

	async function addPoint(x: number, y: number) {
		const point = await roomy.create(DrawnPoint);
		point.x = x;
		point.y = y;
		point.color = selected;

		point.commit();
		g.painting?.points.push(point);
		g.painting?.commit();

		selectedPoint = point;
	}

	function clicked(event: MouseEvent) {
		if (!event.target) return;
		// Get the container's position relative to the viewport
		const rect = (event.target as HTMLElement).getBoundingClientRect();

		// Calculate the click's position relative to the container
		let x = event.clientX - rect.left - 8;
		let y = event.clientY - rect.top - 8;

		// snap to 16
		x = Math.round(x / 16) * 16;
		y = Math.round(y / 16) * 16;

		addPoint(x, y);
	}

	let columns = 20;
	let rows = 32;

	let width = columns * 16;
	let height = rows * 16;

	let selected = $state('red');

	let selectedPoint = $state<DrawnPoint | null>(null);

	function isSelected(point: DrawnPoint) {
		return selectedPoint?.id === point.id;
	}

	let draggables: Record<string, Draggable> = $state({});

	let moving: Record<string, boolean> = $state({});

	$effect(() => {
		// create draggable for all points
		points.value.forEach((point) => {
			if (draggables[point.id]) {
				// dont overwrite the position if it's currently being moved
				if (!moving[point.id]) {
					draggables[point.id].x = point.x;
					draggables[point.id].y = point.y;
				}

				return;
			}

			const draggable = createDraggable(`#${point.id.replaceAll(':', '')}`, {
				onSettle: (event) => {
					// round to nearest 16
					point.x = Math.round(draggable.x / 16) * 16;
					point.y = Math.round(draggable.y / 16) * 16;

					point.commit();

					g.painting?.commit();

					setTimeout(() => {
						moving[point.id] = false;
					}, 100);
				},
				onGrab: () => {
					selectedPoint = point;
					selected = point.color;

					moving[point.id] = true;
				},
				snap: 16,
				container: '.container',
				velocityMultiplier: 0.01
			});

			draggable.x = point.x;
			draggable.y = point.y;

			draggables[point.id] = draggable;
		});
	});
</script>

<div class="p-4">
	<div
		class="border-base-800 bg-base-900/20 relative container mx-auto overflow-hidden rounded-lg border"
		style="width: {width}px; height: {height}px;"
	>
		{#each Array(rows) as _, index}
			<div
				class="border-base-800 absolute right-0 left-0 border border-dashed"
				style="top: {16 * index}px;"
			></div>
		{/each}

		{#each Array(columns) as _, index}
			<div
				class="border-base-800 absolute top-0 bottom-0 border border-dashed"
				style="left: {16 * index}px;"
			></div>
		{/each}

		{#each points.value as point}
			<button
				class="absolute top-0 left-0 z-10 {isSelected(point) ? 'outline-2 outline-white' : ''}"
				onclick={() => {
					point.color = selected;
					point.commit();
					g.painting?.commit();

					selectedPoint = point;
				}}
				id={`${point.id.replaceAll(':', '')}`}
			>
				<div class="h-4 w-4" style="background-color: {point.color};"></div>
				<span class="sr-only">{point.color}</span>
			</button>
		{/each}

		<button class="absolute inset-0 cursor-pointer bg-black/50" onclick={clicked}>
			<span class="sr-only">Add point</span>
		</button>
	</div>

	<ColorSelect
		colors={[
			'red',
			'blue',
			'green',
			'yellow',
			'purple',
			'orange',
			'pink',
			'brown',
			'gray',
			'black',
			'white'
		]}
		bind:selected
		class="bg-base-900/50 mx-auto mt-4 flex w-fit flex-wrap rounded-lg p-2"
		onselected={(color) => {
			console.log('color', color);
			if (selectedPoint && typeof color === 'string') {
				console.log('changing color', color);
				selectedPoint.color = color;
				selectedPoint.commit();
				g.painting?.commit();
			}
		}}
	/>

	<Button
		onclick={() => {
			// copy current url
			navigator.clipboard.writeText(window.location.href);
		}}
		class="mt-4">Share drawing & draw together</Button
	>
</div>
