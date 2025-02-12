<script lang="ts">
	import type { Snippet } from 'svelte';
	import StepSeparation from '../layout/StepSeparation.svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		label?: string;
		alignItems?: 'flex-end';
		padding?: string;
		sticky?: string;
		zIndex?: string;
		backgroundColor?: string;
	}

	const { children, label, alignItems, padding, sticky, zIndex, backgroundColor }: Props = $props();
</script>

<div
	class="section"
	class:section--align-end={alignItems === 'flex-end'}
	style={getCss({
		position: Boolean(sticky) ? 'sticky' : undefined,
		top: sticky,
		zIndex
	})}
>
	<div class="section__inner" style={getCss({ padding, backgroundColor })}>
		{#if label}
			<StepSeparation {label} />
		{/if}
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.section {
		$this: &;
		padding: 0.5rem;
		position: relative;

		&__inner {
			overflow: hidden;
			position: relative;
			background-color: var(--white);
			border-radius: 0.5rem;
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 1.5rem;

			#{$this}--align-end & {
				align-items: flex-end;
			}
		}
	}
</style>
