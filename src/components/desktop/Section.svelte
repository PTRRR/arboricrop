<script lang="ts">
	import type { Snippet } from 'svelte';
	import StepSeparation from '../layout/StepSeparation.svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		label?: string;
		alignItems?: 'flex-end';
		padding?: string;
	}

	const { children, label, alignItems, padding }: Props = $props();
</script>

<div class="section" class:section--align-end={alignItems === 'flex-end'}>
	<div class="section__inner" style={getCss({ padding })}>
		{#if label}
			<StepSeparation {label} />
		{/if}
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.section {
		$this: &;
		padding: 0.1rem;

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
