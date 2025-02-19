<script lang="ts">
	import type { Snippet } from 'svelte';
	import StepSeparation, { type StepSeparationAction } from '../layout/StepSeparation.svelte';
	import { getCss } from '../../utils/css';

	interface Props {
		children?: Snippet;
		label?: string | Snippet;
		description?: string;
		alignItems?: 'flex-end';
		padding?: string;
		sticky?: string;
		stickyDirection?: 'top' | 'bottom';
		Direction?: string;
		zIndex?: string;
		backgroundColor?: string;
		fill?: boolean;
		width?: string;
		height?: string;
		style?: Partial<CSSStyleDeclaration>;
		innerStyle?: Partial<CSSStyleDeclaration>;
		actions?: StepSeparationAction[];
		border?: boolean;
	}

	const {
		children,
		label,
		description,
		alignItems,
		padding = '1rem 1rem',
		sticky,
		stickyDirection = 'top',
		zIndex,
		backgroundColor,
		fill,
		width,
		height,
		style,
		innerStyle,
		actions,
		border
	}: Props = $props();

	const computedStyle = $derived(
		getCss({
			position: Boolean(sticky) ? 'sticky' : undefined,
			alignSelf: Boolean(sticky) ? 'flex-start' : undefined,
			top: stickyDirection === 'top' ? sticky : undefined,
			bottom: stickyDirection === 'bottom' ? sticky : undefined,
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
	class:section--border={border}
	style={computedStyle}
>
	<div class="section__inner" style={computedInnerStyle}>
		{#if label}
			<StepSeparation {label} {description} {actions} />
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
			border-radius: 1rem;
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

			#{$this}--border & {
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 1rem;
					width: calc(100% - 2rem);
					border-top: solid 1px var(--grey);
				}
			}
		}
	}
</style>
