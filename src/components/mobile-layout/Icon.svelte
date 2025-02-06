<script lang="ts">
	import { getCss } from '../../utils/css';

	export type IconName = 'add' | 'navigate' | 'warning' | 'check' | 'cross';
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
	{:else if icon === 'cross'}
		<span class="icon__cross">+</span>
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
			font-size: 32px;
			width: 24px;
			height: 24px;
		}

		&__cross {
			transform: rotate(45deg) translate(5%, -5%);
		}
	}
</style>
