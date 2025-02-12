<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		direction?: 'vertical' | 'horizontal';
		style?: Partial<CSSStyleDeclaration>;
		gap?: CSSStyleDeclaration['gap'];
	}

	const { children, direction = 'vertical', style, gap = '1rem' }: Props = $props();

	const computedStyle = $derived(
		getCss({
			gap,
			...(style || {})
		})
	);
</script>

<div
	class="stack"
	class:stack--vertical={direction === 'vertical'}
	class:stack--horizontal={direction === 'horizontal'}
	style={computedStyle}
>
	{@render children?.()}
</div>

<style lang="scss">
	.stack {
		display: flex;

		&--vertical {
			flex-direction: column;
		}

		&--horizontal {
			flex-direction: row;
		}
	}
</style>
