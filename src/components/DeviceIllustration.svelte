<script lang="ts">
	import { onMount } from 'svelte';

	export let animate: boolean = true;
	export let led: boolean = true;
	export let usb: boolean = false;
	export let jack: boolean = false;
	export let button: boolean = false;

	export let mounted: boolean = !animate;
	const arrowWidth = 80;
	const arrowHeight = 100;
	const arrowHeadWidth = 40;

	onMount(() => {
		const timeout = setTimeout(() => {
			mounted = true;
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<div
	class="device-illustration"
	class:device-illustration--animate={animate}
	class:device-illustration--usb={usb && mounted}
	class:device-illustration--jack={jack && mounted}
	class:device-illustration--button={button && mounted}
>
	<div class="device-illustration__inner">
		{#if led}
			<div class="device-illustration__led"></div>
		{/if}

		{#if usb || jack}
			<img class="device-illustration__device" src="/images/device_caps.png" alt="" />
		{:else}
			<img class="device-illustration__device" src="/images/device_caps_closed.png" alt="" />
		{/if}

		<img class="device-illustration__usb" src="/images/usb.png" alt="" />
		<img class="device-illustration__jack" src="/images/jack.png" alt="" />

		<div class="device-illustration__button">
			<div class="device-illustration__button-arrow">
				<svg
					width={arrowWidth}
					height={arrowHeight + 20}
					xmlns="http://www.w3.org/2000/svg"
					viewBox={`0 0 ${arrowWidth} 120`}
				>
					<line
						x1={arrowWidth * 0.5}
						y1="0"
						x2={arrowWidth * 0.5}
						y2={arrowHeight}
						stroke="black"
						stroke-linecap="round"
					/>
					<polyline
						fill="none"
						stroke="black"
						points={`${arrowWidth * 0.5 - arrowHeadWidth * 0.5},${arrowHeadWidth * 0.5} ${arrowWidth * 0.5},0 ${arrowWidth * 0.5 + arrowHeadWidth * 0.5},${arrowHeadWidth * 0.5}`}
						stroke-linecap="round"
					/>
					<text x={arrowWidth * 0.5} y={arrowHeight + 20} text-anchor="middle">Push button</text>
				</svg>
			</div>
		</div>

		<img class="device-illustration__device" src="/images/device.png" alt="" />
	</div>
</div>

<style>
	.device-illustration {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.device-illustration__inner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	img {
		height: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.device-illustration__usb,
	.device-illustration__jack,
	.device-illustration__button {
		opacity: 0;
		top: 133%;
		pointer-events: none;
		left: 50%;
	}

	.device-illustration--animate .device-illustration__usb,
	.device-illustration--animate .device-illustration__jack,
	.device-illustration--animate .device-illustration__button {
		transition:
			top 0.6s ease-in-out,
			opacity 0.6s ease-in-out;
	}

	.device-illustration__jack {
		transition-delay: 0.4s;
	}

	.device-illustration--usb .device-illustration__usb {
		top: 83%;
		opacity: 1;
	}

	.device-illustration__jack {
		left: 50%;
	}

	.device-illustration--jack .device-illustration__jack {
		top: 83%;
		left: 50%;
		opacity: 1;
	}

	.device-illustration__button {
		left: calc(50% - 8svh);
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
	}

	.device-illustration__button-arrow {
		position: absolute;
		top: 0%;
		left: 50%;
		transform: translate(-50%, 0%);
		height: 10rem;
	}

	.device-illustration--button .device-illustration__button {
		top: 74%;
		opacity: 1;
	}

	@keyframes blink {
		from {
			background-color: rgb(191, 242, 133);
		}
		to {
			background-color: rgb(255, 255, 255);
		}
	}

	.device-illustration__led {
		position: absolute;
		top: 62%;
		left: calc(50% - 8svh);
		width: 2svh;
		height: 3svh;
		transform: translate(-50%, -50%);
		border-radius: 100%;
		filter: blur(5px);
		mix-blend-mode: multiply;
		background-color: rgb(191, 242, 133);
		z-index: 10;
		animation-name: blink;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}
</style>
