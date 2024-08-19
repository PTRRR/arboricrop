<script lang="ts">
	import { onMount } from 'svelte';
	import { getCss } from '../../utils/css';
	import { clamp } from '../../utils/math';

	export let showTarget: boolean = false;

	const lineCount = 20;
	let map: HTMLDivElement;
	let currentX = -50;
	let currentY = -50;

	onMount(() => {
		console.log(map);
		let lock = false;
		let x = 0;
		let y = 0;

		const handlePointerDown = (event: MouseEvent) => {
			lock = true;
			x = event.clientX;
			y = event.clientY;
		};

		const handlePointerUp = () => {
			lock = false;
		};

		const handlePointerMove = (event: MouseEvent) => {
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

				x = event.clientX;
				y = event.clientY;
			}
		};

		map.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointermove', handlePointerMove);

		return () => {
			map.removeEventListener('mousedown', handlePointerDown);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('pointermove', handlePointerMove);
		};
	});
</script>

<div class="map" bind:this={map}>
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
	</div>
</div>

<style>
	.map {
		width: 100%;
		aspect-ratio: 1;
		border: solid 1px var(--black);
		position: relative;
		overflow: hidden;
		cursor: move;
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
</style>
