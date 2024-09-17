<script lang="ts">
	import { onMount } from 'svelte';
	import { getCss } from '../utils/css';
	import { clamp } from '../utils/math';
	import type { Location, MapLayer } from '../utils/types';
	import { useScrollLock } from '../stores';
	import Button from './Button.svelte';
	import Spacer from './Spacer.svelte';

	export let locations: Location[] = [];
	export let layers: MapLayer[] = [];
	export let showTarget: boolean = false;
	export let onChange: ((location: Location) => void) | undefined = undefined;
	export let ratio: number = 1;

	const scrollLock = useScrollLock();
	let selectedLayerId: string | undefined = (layers || [])[0]?.id;
	export const setSelectedLayerId = (id: string) => (selectedLayerId = id);

	$: {
		if (layers.length > 0 && typeof selectedLayerId === 'undefined') {
			selectedLayerId = layers[0].id;
		}
	}

	$: selectedLayers = layers.filter((it) => it.id === selectedLayerId);

	const lineCount = 20;
	let map: HTMLDivElement;
	let currentX = -50;
	let currentY = -50;

	let unlockTmeout: NodeJS.Timeout | undefined = undefined;
	const resetUnlockTimeout = () => {
		scrollLock.set(true);
		clearTimeout(unlockTmeout);
		unlockTmeout = setTimeout(() => {
			scrollLock.set(false);
		}, 500);
	};

	onMount(() => {
		let lock = false;
		let x = 0;
		let y = 0;

		onChange?.({
			x: Math.abs(currentX),
			y: Math.abs(currentY)
		});

		const handlePointerDown = (event: MouseEvent) => {
			event.preventDefault();
			lock = true;
			x = event.clientX;
			y = event.clientY;
			scrollLock.set(true);
		};

		const handlePointerUp = (event: MouseEvent) => {
			event.preventDefault();
			lock = false;
			scrollLock.set(false);
		};

		const handlePointerMove = (event: MouseEvent) => {
			event.preventDefault();
			if (lock) {
				const box = map.getBoundingClientRect();
				const width = box.width * 4;
				const height = box.height * 4;

				let deltaX = x - event.clientX;
				let deltaY = y - event.clientY;

				currentX -= (deltaX / width) * 100;
				currentY -= (deltaY / height) * 100;

				currentX = clamp(currentX, -100 + (box.width / width) * 50, -(box.width / width) * 50);
				currentY = clamp(currentY, -100 + (box.height / height) * 50, -(box.height / height) * 50);

				onChange?.({
					x: Math.abs(currentX),
					y: Math.abs(currentY)
				});

				resetUnlockTimeout();

				x = event.clientX;
				y = event.clientY;
			}
		};

		map.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointermove', handlePointerMove);

		return () => {
			map.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('pointermove', handlePointerMove);
		};
	});
</script>

<div
	class="map"
	style={getCss({
		'--ratio': ratio.toString()
	})}
>
	<div class="map__inner" bind:this={map}>
		{#if showTarget}
			<div class="map__target"></div>
		{/if}
		<div
			class="map__content"
			style={getCss({
				transform: `translate(${currentX}%, ${currentY}%)`
			})}
		>
			{#each { length: lineCount } as _, index}
				<div
					class="map__line map__line-horizontal"
					style={getCss({
						top: `${index * (100 / lineCount)}%`
					})}
				></div>
				<div
					class="map__line map__line-vertical"
					style={getCss({
						left: `${index * (100 / lineCount)}%`
					})}
				></div>
			{/each}
			{#each locations as location}
				<div
					class="map__location"
					style={getCss({
						left: `${location.x}%`,
						top: `${location.y}%`
					})}
				></div>
			{/each}
		</div>
	</div>
	<Spacer />
	<div class="map__buttons">
		<div class="map__buttons-inner">
			{#each layers as layer}
				<Button
					selected={selectedLayerId === layer.id}
					on:click={() =>
						selectedLayerId === layer.id
							? (selectedLayerId = undefined)
							: (selectedLayerId = layer.id)}
				>
					{layer.name}
				</Button>
			{/each}
		</div>
	</div>
</div>

<style>
	.map {
		display: flex;
		flex-direction: column;
		/* justify-items: stretch; */
		width: 100%;
		max-width: 100%;
		position: relative;
		overflow: hidden;
	}

	.map__inner {
		width: 100%;
		aspect-ratio: var(--ratio);
		border: solid 1px var(--black);
		position: relative;
		overflow: hidden;
		cursor: move;
		box-sizing: border-box;
	}

	.map__target {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		border: solid 1px var(--black);
		border-radius: 100%;
		z-index: 1;
	}

	.map__target::before,
	.map__target::after {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.map__target::before {
		width: 150%;
		border-top: solid 1px var(--black);
	}

	.map__target::after {
		height: 150%;
		border-left: solid 1px var(--black);
	}

	.map__content {
		position: absolute;
		width: 400%;
		height: 400%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.map__line {
		position: absolute;
	}

	.map__line-vertical {
		width: 0;
		height: 100%;
		border-left: dashed 1px var(--dark-gray);
	}

	.map__line-horizontal {
		width: 100%;
		height: 0;
		border-top: dashed 1px var(--dark-gray);
	}

	.map__location {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 10px;
		height: 10px;
		background-color: var(--black);
		border-radius: 100%;
	}

	.map__buttons {
		width: 100%;
		overflow: auto;
		box-sizing: border-box;
		padding-bottom: 1rem;
		margin-bottom: -1rem;
	}

	.map__buttons-inner {
		align-items: center;
		display: flex;
		gap: 0.5rem;
		overflow: hidden;
		white-space: nowrap;
		width: fit-content;
	}
</style>
