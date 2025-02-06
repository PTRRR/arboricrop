<script lang="ts">
	import { Button, type Builder } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { useNavigationHistory } from '../../stores';
	import { getCss } from '../../utils/css';
	import Icon, { type IconName } from './Icon.svelte';

	const {
		children,
		fitWidth = false,
		href = undefined,
		disabled = false,
		onclick = undefined,
		preventHistory = undefined,
		type = 'normal',
		builders = undefined,
		size = 'normal',
		selected = false,
		icon,
		iconColor,
		backgroundColor
	}: {
		children?: Snippet;
		fitWidth?: boolean;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
		preventHistory?: boolean;
		type?: 'normal' | 'error';
		builders?: Builder[];
		size?: 'small' | 'normal' | 'big';
		selected?: boolean;
		icon?: IconName;
		iconColor?: string;
		backgroundColor?: string;
	} = $props();

	const { preventNavigationHistory } = useNavigationHistory();
	const buttonStyle = getCss({ backgroundColor });
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
		class:button--icon={icon}
		style={buttonStyle}
		onclick={() => {
			if (preventHistory) {
				$preventNavigationHistory = true;
			}
			onclick?.();
		}}
	>
		{#if icon}
			<div class="button__icon">
				<Icon {icon} color={iconColor} />
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
	}

	.button {
		background-color: transparent;
		color: black;
		font-family: inherit;
		font-size: var(--mid-font-size);
		font-weight: 500;
		text-transform: lowercase;
		border: none;
		padding: 0.5rem 0;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		gap: 0.3rem;

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

		&--selected,
		&:hover {
			// background-color: var(--grey);
		}

		&--icon {
			// padding: 5px 10px 5px 5px;
		}

		&__icon {
			background-color: var(--black);
			width: 24px;
			height: 24px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 5px;
		}

		&__content {
			line-height: 1;
		}

		span {
			display: block;
			line-height: 1;
		}
	}
</style>
