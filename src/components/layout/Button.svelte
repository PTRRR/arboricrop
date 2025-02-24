<script module lang="ts">
	export type ButtonIconOrder = 'inverted' | 'normal';
	export type ButtonSize = 'small' | 'normal' | 'big';
</script>

<script lang="ts">
	import { Button, type Builder } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { useNavigationHistory } from '../../stores';
	import { getCss } from '../../utils/css';
	import Icon, { type IconName, type IconSize } from '../mobile-layout/Icon.svelte';

	const {
		children,
		fitWidth = false,
		href = undefined,
		disabled = false,
		onclick = undefined,
		preventHistory = undefined,
		builders = undefined,
		size = 'normal',
		selected = false,
		icon,
		iconColor,
		iconBackgroundColor,
		backgroundColor,
		borderColor,
		iconSize,
		iconOrder = 'normal',
		padding = false,
		color,
		fontSize,
		underline
	}: {
		children?: Snippet;
		fitWidth?: boolean;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
		preventHistory?: boolean;
		builders?: Builder[];
		size?: ButtonSize;
		selected?: boolean;
		icon?: IconName;
		iconColor?: string;
		iconSize?: IconSize;
		iconBackgroundColor?: string;
		backgroundColor?: string;
		borderColor?: string;
		iconOrder?: ButtonIconOrder;
		padding?: boolean | string;
		color?: string;
		fontSize?: string;
		underline?: boolean;
	} = $props();

	const { preventNavigationHistory } = useNavigationHistory();
	const buttonStyle = $derived(
		getCss({
			backgroundColor,
			padding: typeof padding === 'string' ? padding : undefined,
			color,
			fontSize,
			border: borderColor ? `solid 1px var(--dark-grey) ` : undefined
		})
	);
</script>

{#snippet innerButton()}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="button"
		class:button--fit-width={fitWidth}
		class:button--disabled={disabled}
		class:button--big={size === 'big'}
		class:button--small={size === 'small'}
		class:button--selected={selected}
		class:button--background-color={backgroundColor}
		class:button--inverted-icon={iconOrder === 'inverted'}
		class:button--padding={padding}
		class:button--underline={underline}
		style={buttonStyle}
		onclick={() => {
			if (preventHistory) {
				$preventNavigationHistory = true;
			}
			onclick?.();
		}}
	>
		{#if icon}
			<div class="button__icon" style={getCss({ backgroundColor: iconBackgroundColor })}>
				<Icon {icon} color={iconColor} size={iconSize} />
			</div>
		{/if}

		{#if children}
			<div class="button__content">
				{@render children()}
			</div>
		{/if}
	</div>
{/snippet}

{#if href}
	<a {href} class="root-button">
		{@render innerButton()}
	</a>
{:else}
	<Button.Root class="root-button" {disabled} {builders}>
		{@render innerButton()}
	</Button.Root>
{/if}

<style lang="scss">
	:global(.root-button) {
		padding: 0;
		border: none;
		outline: none;
		background-color: transparent;
		text-decoration: none;
		font-family: inherit;
		font-size: inherit;
	}

	.button {
		$this: &;
		background-color: transparent;
		color: black;
		font-family: inherit;
		font-size: var(--mid-font-size);
		font-weight: 500;
		text-transform: lowercase;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.4rem;

		&--padding {
			padding: 0.5rem 0;
		}

		&--inverted-icon {
			flex-direction: row-reverse;
		}

		&--fit-width {
			width: 100%;
		}

		&--disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		&--big {
			padding: 0.8rem 0.5rem;
		}

		&--small {
			padding: 0.2rem 0.5rem;
		}

		&--underline {
			text-decoration: underline;
		}

		// &--selected,
		// &:hover {
		//   background-color: var(--grey);
		// }

		&--selected {
			background-color: var(--dark-grey) !important;
		}

		&--background-color#{&}--padding {
			padding: 5px;
		}

		&__icon {
			background-color: var(--black);
			border-radius: 5px;
			padding: 5px;
			box-sizing: border-box;

			#{$this}--background-color & {
				border-radius: 3px;
			}
		}

		&__content {
			line-height: 1;
			white-space: nowrap;
		}
	}
</style>
