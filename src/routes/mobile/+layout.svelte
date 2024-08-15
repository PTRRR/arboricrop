<script lang="ts">
	import { onMount } from 'svelte';
	import { getCss } from '../../utils/css';
	import { type Phone, iphone } from '../../utils/phones';

	let phone: Phone = iphone;
	let image: HTMLImageElement;
	let aspectRatio: string | undefined = undefined;

	$: appStyle = getCss({ aspectRatio });
	$: appInnerStyle = getCss({
		width: `${phone.widthScale * 100}%`,
		height: `${phone.heightScale * 100}%`
	});

	onMount(() => {
		const { width, height } = image;
		aspectRatio = (width / height).toString();
	});
</script>

<div class="mobile">
	<div class="mobile__content">
		{#if aspectRatio}
			<div class="mobile__app" style={appStyle}>
				<div class="mobile__app-inner" style={appInnerStyle}>
					<slot />
				</div>
			</div>
		{/if}
		<img bind:this={image} src={phone.src} alt="" />
	</div>
</div>

<style>
	.mobile {
		padding: 1em;
		height: 100vh;
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
		border-radius: 5.3vh;
		overflow: hidden;
		background-color: var(--light-gray);
	}

	img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100%;
		opacity: 1;
	}
</style>
