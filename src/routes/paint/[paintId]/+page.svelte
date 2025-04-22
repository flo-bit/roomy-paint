<script lang="ts">
	import { g, roomy } from '$lib/roomy.svelte';
	import { DrawnPoint } from '$lib/components';
	import { derivePromise } from '$lib/utils.svelte';
	import { Button, PopoverColorPicker, toast } from 'fuchs';
	import { createDraggable, Draggable } from 'animejs';

	let points = derivePromise([], async () => (g.painting ? await g.painting.points.items() : []));

	async function addPoint(x: number, y: number) {
		const point = await roomy.create(DrawnPoint);
		point.x = x;
		point.y = y;
		point.r = rgb.r;
		point.g = rgb.g;
		point.b = rgb.b;

		point.commit();
		g.painting?.points.push(point);
		g.painting?.commit();

		selectedPoint = null;
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

					setTimeout(() => {
						moving[point.id] = false;
					}, 100);
				},
				onGrab: () => {
					selectedPoint = point;
					rgb.r = point.r;
					rgb.g = point.g;
					rgb.b = point.b;

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

	let rgb = $state({
		r: 1,
		g: 0,
		b: 0
	});

	$effect(() => {
		console.log('rgb', rgb);
		selected = `rgb(${rgb.r * 255}, ${rgb.g * 255}, ${rgb.b * 255})`;
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
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button
				class="absolute top-0 left-0 z-10 {isSelected(point) ? 'outline-2 outline-white' : ''}"
				onclick={() => {
					// point.r = rgb.r;
					// point.g = rgb.g;
					// point.b = rgb.b;
					// point.commit();
					// g.painting?.commit();

					selectedPoint = point;
				}}
				id={`${point.id.replaceAll(':', '')}`}
			>
				<div
					class="h-4 w-4"
					style="background-color: rgb({point.r * 255}, {point.g * 255}, {point.b * 255});"
				></div>
			</button>
		{/each}

		<button class="absolute inset-0 cursor-pointer bg-black/50" onclick={clicked}>
			<span class="sr-only">Add point</span>
		</button>
	</div>


	<div class="flex w-full flex-col items-end mt-4 mx-auto max-w-xs gap-4">
		<PopoverColorPicker bind:rgb class="w-fit" />


		<!-- <Button
			onclick={async () => {
				if (!selectedPoint) return;
				// find the index of the point
				const index = (await g.painting?.points.items())?.findIndex((point) => point.id === selectedPoint.id) ?? -1;
				console.log('index', index);
				if (index === -1) return;
				g.painting?.points.remove(index);
				g.painting?.commit();

				selectedPoint = null;
			}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
				<path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
			  </svg>
			  
			  Remove point</Button
		> -->

		<Button
			onclick={() => {
				// copy current url
				navigator.clipboard.writeText(window.location.href);
				toast('Share link copied to clipboard', {description: 'Send to your friends to draw together'});
			}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
				<path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
			  </svg>
			  
			  Share drawing</Button
		>

		<Button
			onclick={() => {
				g.painting?.points.delete();
				g.painting?.commit();
			}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
				<path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
			  </svg>
			  
			  Clear drawing</Button
		>
	</div>
</div>
