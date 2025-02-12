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
		height?: string;
		innerStyle?: Partial<CSSStyleDeclaration>;
	}

	const {
		children,
		label,
		alignItems,
		padding = '1rem',
		sticky,
		zIndex,
		backgroundColor,
		fill,
		width,
		height,
		innerStyle
	}: Props = $props();

	const computedStyle = $derived(
		getCss({
			position: Boolean(sticky) ? 'sticky' : undefined,
			alignSelf: Boolean(sticky) ? 'flex-start' : undefined,
			top: sticky,
			zIndex,
			width,
			height,
			flex: width ? '0 0 auto' : undefined
		})
	);

	const computedInnerStyle = $derived(
		getCss({
			...innerStyle,
			padding,
			backgroundColor
		})
	);
</script>

<div
	class="section"
	class:section--align-end={alignItems === 'flex-end'}
	class:section--fill={fill}
	style={computedStyle}
>
	<div class="section__inner" style={computedInnerStyle}>
		{#if label}
			<StepSeparation {label} />
		{/if}
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.section {
		$this: &;
		padding: var(--section-padding);
		position: relative;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		&--fill {
			flex: 1 1 auto;
		}

		&__inner {
			overflow: hidden;
			position: relative;
			background-color: var(--white);
			border-radius: 0.8rem;
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			/* border: solid 1px var(--light-grey); */
			box-sizing: border-box;
			height: 100%;

			#{$this}--align-end & {
				align-items: flex-end;
			}
		}
	}
</style>
