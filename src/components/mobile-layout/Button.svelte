<script lang="ts">
	import { Button, type Builder } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { useNavigationHistory } from '../../stores';
	import { getCss } from '../../utils/css';

	const props: {
		children: Snippet;
		fitWidth?: boolean;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
		preventHistory?: boolean;
		type?: 'normal' | 'error';
		builders?: Builder[];
	} = $props();

	const { preventNavigationHistory } = useNavigationHistory();
	const buttonStyle =
		props.type === 'error'
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
		class:button--fit-width={props.fitWidth}
		class:button--disabled={props.disabled}
		style={buttonStyle}
		onclick={() => {
			if (props.preventHistory) {
				$preventNavigationHistory = true;
			}
			props.onclick?.();
		}}
	>
		{@render props.children()}
	</div>
{/snippet}

{#if props.href}
	<a href={props.href}>
		{@render innerButton()}
	</a>
{:else}
	<Button.Root disabled={props.disabled} builders={props.builders}>
		{@render innerButton()}
	</Button.Root>
{/if}

<style lang="scss">
	:global(button, a) {
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
		padding: 0.5rem;
		border-radius: 5px;
		cursor: pointer;
		text-align: left;
		box-sizing: border-box;

		&--fit-width {
			width: 100%;
		}

		&--disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		&:hover {
			background-color: grey;
		}

		span {
			display: block;
			line-height: 1;
		}
	}
</style>
