<script lang="ts">
	import { getCss } from '../../utils/css';

	export let ratio: number | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => onClick?.()}
	class="image"
	class:image--clickable={Boolean(onClick)}
	style={getCss({
		aspectRatio: ratio ? ratio.toString() : undefined
	})}
>
	<span>{placeholder || 'image'}</span>
	<svg class="cross" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
		<line x1="0" y1="0" x2="100%" y2="100%" />
		<line x1="100%" y1="0" x2="0" y2="100%" />
	</svg>
</div>

<style>
	.image {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--dark-gray);
		border: solid 1px var(--dark-gray);
		overflow: hidden;
	}

	.cross {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		stroke: var(--dark-gray);
		stroke-width: 1;
		stroke-dasharray: 3, 3;
	}

	.image--clickable {
		cursor: pointer;
	}

	.image--clickable:hover,
	.image--clickable:hover span {
		background-color: var(--white);
	}

	span {
		background-color: var(--light-gray);
		position: relative;
		z-index: 1;
		display: inline-block;
		padding: 1rem;
		text-align: center;
		max-width: 20rem;
	}
</style>
