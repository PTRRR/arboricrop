<script lang="ts">
	import { onMount } from 'svelte';
	import { getCss } from '../utils/css';
	import type { Phone } from '../utils/phones';
	import ScrollArea from './ScrollArea.svelte';

	export let phone: Phone;
	let image: HTMLImageElement;
	let aspectRatio: string | undefined = undefined;

	$: appStyle = getCss({ aspectRatio });
	$: appInnerStyle = getCss({
		width: `${phone.widthScale * 100}%`,
		height: `${phone.heightScale * 100}%`
	});

	const onLoad = () => {
		const { width, height } = image;
		aspectRatio = (width / height).toString();
	};

	onMount(() => {
		if (image) {
			onLoad();
		}
	});
</script>

<div
	class="mobile"
	style={getCss({
		'--mobile-width': `calc((100svh - 2rem) * ${aspectRatio})`,
		'--mobile-height': 'calc(100svh - 2rem)',
		'--mobile-app-width': `calc(var(--mobile-width) * ${phone.widthScale})`,
		'--mobile-app-height': `calc(var(--mobile-height) * ${phone.heightScale})`
	})}
>
	<div class="mobile__content">
		{#if aspectRatio}
			<div class="mobile__app" style={appStyle}>
				<div id="mobile-portal" class="mobile__portal"></div>
				<div class="mobile__app-inner" style={appInnerStyle}>
					<ScrollArea>
						<slot />
					</ScrollArea>
				</div>
			</div>
		{/if}
		<img bind:this={image} src={phone.src} on:load={() => onLoad()} alt="" />
	</div>
</div>

<style>
	.mobile {
		padding: 1em;
		height: 100svh;
		box-sizing: border-box;
	}

	.mobile__content {
		position: relative;
		height: 100%;
	}

	.mobile__app {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100%;
	}

	.mobile__app-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100%;
		width: 100%;
		border-radius: 5.3svh;
		overflow: hidden;
	}

	.mobile__portal {
		position: absolute;
		width: 30svw;
		height: 100%;
		top: 50%;
		left: calc(100% + var(--gap) * 3);
		transform: translate(0, -50%);
		z-index: 1000;
	}

	img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100%;
		opacity: 1;
		pointer-events: none;
	}

	@media (max-aspect-ratio: 11/9) {
		.mobile__portal {
			display: none;
		}
	}

	@media screen and (max-width: 700px) {
		img {
			display: none;
		}

		.mobile {
			padding: 0;
			height: 100svh;
			box-sizing: border-box;
		}

		.mobile__app,
		.mobile__app-inner {
			height: 100% !important;
			width: 100% !important;
			border-radius: 0;
		}
	}
</style>
