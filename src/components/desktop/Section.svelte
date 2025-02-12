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
		fill?: boolean;
		width?: string;
	}

	const {
		children,
		label,
		alignItems,
		padding,
		sticky,
		zIndex,
		backgroundColor,
		fill,
		width
	}: Props = $props();
</script>

<div
	class="section"
	class:section--align-end={alignItems === 'flex-end'}
	class:section--fill={fill}
	style={getCss({
		position: Boolean(sticky) ? 'sticky' : undefined,
		alignSelf: Boolean(sticky) ? 'flex-start' : undefined,
		top: sticky,
		zIndex,
		width
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
		width: 100%;
		box-sizing: border-box;

		&--fill {
			flex: 1 1 auto;
		}

		&__inner {
			overflow: hidden;
			position: relative;
			background-color: var(--white);
			border-radius: 0.5rem;
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			/* border: solid 1px var(--grey); */
			box-sizing: border-box;
			background-color: var(--light-grey);

			#{$this}--align-end & {
				align-items: flex-end;
			}
		}
	}
</style>
