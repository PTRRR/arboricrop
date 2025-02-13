<script lang="ts">
	import type { Snippet } from 'svelte';
	import StepSeparation, { type StepSeparationAction } from '../layout/StepSeparation.svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		label?: string | Snippet;
		alignItems?: 'flex-end';
		padding?: string;
		sticky?: string;
		zIndex?: string;
		backgroundColor?: string;
		fill?: boolean;
		width?: string;
		height?: string;
		style?: Partial<CSSStyleDeclaration>;
		innerStyle?: Partial<CSSStyleDeclaration>;
		actions?: StepSeparationAction[];
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
		style,
		innerStyle,
		actions
	}: Props = $props();

	const computedStyle = $derived(
		getCss({
			position: Boolean(sticky) ? 'sticky' : undefined,
			alignSelf: Boolean(sticky) ? 'flex-start' : undefined,
			top: sticky,
			zIndex,
			width,
			height,
			flex: width ? '0 0 auto' : undefined,
			...style
		})
	);

	const computedInnerStyle = $derived(
		getCss({
			padding,
			backgroundColor,
			...innerStyle
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
			<StepSeparation {label} {actions} />
		{/if}

		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.section {
		$this: &;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		&--fill {
			flex: 1 1 auto;
		}

		&__inner {
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
