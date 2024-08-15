<script lang="ts">
	import { getCss } from '../../utils/css';

	export let ratio: number | undefined = undefined;
	export let placeholder: string | undefined = undefined;
</script>

<div
	class="image"
	style={getCss({
		aspectRatio: ratio ? ratio.toString() : undefined
	})}
>
	<span>{placeholder || 'image'}</span>
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

	.image::before,
	.image::after {
		position: absolute;
		top: 50%;
		left: 50%;
		content: '';
		height: 200%;
		border-left: solid 1px var(--dark-gray);
	}

	.image::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.image::after {
		transform: translate(-50%, -50%) rotate(-45deg);
	}
	span {
		background-color: var(--light-gray);
		position: relative;
		z-index: 1;
		display: block;
		padding: 0.5rem;
		text-align: center;
	}
</style>
