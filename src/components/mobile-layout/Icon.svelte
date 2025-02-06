<script lang="ts">
	import { getCss } from '../../utils/css';

	export type IconName = 'add' | 'navigate' | 'warning' | 'check' | 'cross';
	const {
		icon,
		color = 'var(--white)',
		size = 'normal'
	}: { icon: IconName; color?: string; size?: 'normal' | 'large' } = $props();
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
	{:else}
		<span>+</span>
	{/if}
</div>

<style lang="scss">
	.icon {
		span {
			font-weight: 500;
			line-height: 1;
			font-family: inherit;
		}

		&--normal {
			font-size: 22px;
		}

		&--large {
			font-size: 35px;
		}
	}
</style>
