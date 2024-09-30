<script lang="ts">
	import { onMount } from 'svelte';

	export let animate: boolean = false;
	export let usb: boolean = false;
	export let jack: boolean = false;
	export let button: boolean = false;

	const arrowWidth = 80;
	const arrowHeight = 100;
	const arrowHeadWidth = 40;

	onMount(() => {
		const timeout = setTimeout(() => {
			animate = false;
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<div class="device-illustration" class:device-illustration--start={animate}>
	<div class="device-illustration__inner">
		<img class="device-illustration__device" src="/images/device_caps.png" alt="" />

		{#if usb}
			<img class="device-illustration__usb" src="/images/usb.png" alt="" />
		{/if}

		{#if jack}
			<img class="device-illustration__jack" src="/images/jack.png" alt="" />
		{/if}

		{#if button}
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
		{/if}

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
		top: 83%;
		left: 50%;
		transition:
			top 1s ease-in-out,
			opacity 1s ease-in-out;
	}

	.device-illustration__jack {
		transition-delay: 0.4s;
	}

	.device-illustration__usb {
		left: 51%;
	}

	.device-illustration--start .device-illustration__usb,
	.device-illustration--start .device-illustration__jack,
	.device-illustration--start .device-illustration__button {
		opacity: 0;
		top: 133%;
	}

	.device-illustration__button {
		position: absolute;
		top: 79%;
		left: 30%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
	}

	.device-illustration__button-arrow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 10rem;
	}
</style>
