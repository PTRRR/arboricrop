<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		direction?: 'vertical' | 'horizontal';
		style?: Partial<CSSStyleDeclaration>;
		gap?: CSSStyleDeclaration['gap'];
		justifyContent?: CSSStyleDeclaration['justifyContent'];
		alignItems?: CSSStyleDeclaration['alignItems'];
	}

	const {
		children,
		direction = 'vertical',
		style,
		gap,
		justifyContent,
		alignItems
	}: Props = $props();

	const computedStyle = $derived(
		getCss({
			gap,
			justifyContent,
			alignItems,
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
	:global(.stack--vertical > .section + .section) {
		margin-top: 4rem;
	}

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
