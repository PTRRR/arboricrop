<script lang="ts">
	import { getCss } from '../../utils/css';

	export type IconName =
		| 'add'
		| 'navigate'
		| 'down'
		| 'warning'
		| 'check'
		| 'cross'
		| 'back'
		| 'question';
	export type IconSize = 'normal' | 'large' | 'small';

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
	class:icon--small={size === 'small'}
	style={getCss({ color })}
>
	{#if icon === 'add'}
		<span>+</span>
	{:else if icon === 'warning'}
		<span>!</span>
	{:else if icon === 'navigate'}
		<span>></span>
	{:else if icon === 'down'}
		<span class="icon__down">></span>
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
	{:else if icon === 'question'}
		<span>?</span>
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

		&--small {
			font-size: 12px;
			width: calc(1em - 5px);
			height: calc(1em - 5px);
		}

		&--normal {
			font-size: 22px;
		}

		&--large {
			font-size: var(--big-font-size);
			width: 34px;
			height: 34px;
		}

		&__cross {
			transform: rotate(45deg) translate(5%, -5%);
		}

		&__check {
			width: 0.55em;
			height: 0.55em;
		}

		&__down {
			transform: rotate(90deg);
		}
	}
</style>
