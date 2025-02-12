<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		direction?: 'vertical' | 'horizontal';
	}

	const { children, direction = 'vertical' }: Props = $props();
</script>

<div
	class="stack"
	class:stack--vertical={direction === 'vertical'}
	class:stack--horizontal={direction === 'horizontal'}
>
	{@render children?.()}
</div>

<style lang="scss">
	.stack {
		display: flex;

		&--vertical {
			flex-direction: column;
		}

		&--horzontal {
			flex-direction: row;
		}
	}
</style>
