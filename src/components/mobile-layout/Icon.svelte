<script lang="ts">
	import { getCss } from '../../utils/css';

	export type IconName = 'add' | 'navigate' | 'warning' | 'check' | 'cross' | 'back';
	export type IconSize = 'normal' | 'large';

	const {
		icon,
		color = 'var(--white)',
		size = 'normal'
	}: {
		icon: IconName;
		color?: string;
		size?: IconSize;
	} = $props();
</script>

<div
	class="icon"
	class:icon--normal={size === 'normal'}
	class:icon--large={size === 'large'}
	style={getCss({ color })}
>
	{#if icon === 'add'}
		<span>+</span>
	{:else if icon === 'warning'}
		<span>!</span>
	{:else if icon === 'navigate'}
		<span>></span>
	{:else if icon === 'back'}
		<span>{'<'}</span>
	{:else if icon === 'cross'}
		<span class="icon__cross">+</span>
	{:else if icon === 'check'}
		<svg
			class="icon__check"
			viewBox="0 0 12 12"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			xml:space="preserve"
			style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;"
		>
			<g transform="matrix(1,0,0,1,-688.244,-176.129)">
				<g transform="matrix(1,0,0,1,689.244,181.488)">
					<path
						d="M0,1.18L4.326,5.539L9.78,-4.359"
						style={`fill:none;fill-rule:nonzero;stroke:${color};stroke-width:2px;`}
					/>
				</g>
			</g>
		</svg>
	{:else}
		<span>+</span>
	{/if}
</div>

<style lang="scss">
	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 18px;
		height: 18px;
		overflow: hidden;

		span {
			display: block;
			font-weight: 500;
			font-family: inherit;
		}

		&--normal {
			font-size: 22px;
		}

		&--large {
			font-size: var(--big-font-size);
			width: 38px;
			height: 38px;
		}

		&__cross {
			transform: rotate(45deg) translate(5%, -5%);
		}

		&__check {
			width: 0.55em;
			height: 0.55em;
		}
	}
</style>
