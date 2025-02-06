<script lang="ts">
	import { Button, type Builder } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { useNavigationHistory } from '../../stores';
	import { getCss } from '../../utils/css';

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
		selected = false
	}: {
		children: Snippet;
		fitWidth?: boolean;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
		preventHistory?: boolean;
		type?: 'normal' | 'error';
		builders?: Builder[];
		size?: 'small' | 'normal' | 'big';
		selected?: boolean;
	} = $props();

	const { preventNavigationHistory } = useNavigationHistory();
	const buttonStyle =
		type === 'error'
			? getCss({
					color: '#ff3333',
					backgroundColor: '#ffc7c7'
				})
			: '';
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
		style={buttonStyle}
		onclick={() => {
			if (preventHistory) {
				$preventNavigationHistory = true;
			}
			onclick?.();
		}}
	>
		{@render children()}
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
	}

	.button {
		background-color: lightgray;
		color: black;
		font-family: inherit;
		font-size: var(--main-font-size);
		font-weight: 500;
		text-transform: lowercase;
		border: none;
		padding: 0.5rem 0.5rem;
		border-radius: 5px;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;

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
			background-color: grey;
		}

		span {
			display: block;
			line-height: 1;
		}
	}
</style>
