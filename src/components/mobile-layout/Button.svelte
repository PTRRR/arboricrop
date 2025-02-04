<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: {
		children: Snippet;
		fitWidth?: boolean;
		href?: string;
		disabled?: boolean;
		onclick?: () => void;
	} = $props();
</script>

{#snippet innerButton()}
	<span>
		{@render props.children()}
	</span>
{/snippet}

{#if props.href}
	<a
		class="button"
		class:button--fit-width={props.fitWidth}
		class:button--disabled={props.disabled}
		href={props.href}
		onclick={props.onclick}
	>
		{@render innerButton()}
	</a>
{:else}
	<button
		class="button"
		class:button--fit-width={props.fitWidth}
		class:button--disabled={props.disabled}
		disabled={props.disabled}
		onclick={props.onclick}
	>
		{@render innerButton()}
	</button>
{/if}

<style lang="scss">
	.button {
		background-color: lightgray;
		color: black;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		text-decoration: none;
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
