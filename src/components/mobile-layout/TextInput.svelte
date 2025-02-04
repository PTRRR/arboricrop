<script lang="ts">
	import { onMount } from 'svelte';

	const props: {
		name?: string;
		label?: string;
		defaultValue?: string;
		placeholder?: string;
		autoFocus?: boolean;
		readonly?: boolean;
		onvalue?: (value: string) => void;
	} = $props();

	let value = $state(props.defaultValue || '');
	let input: HTMLInputElement | null = $state(null);

	onMount(() => {
		if (props.autoFocus) {
			input?.focus();
		}

		if (props.onvalue && props.defaultValue) {
			props.onvalue(props.defaultValue);
		}
	});
</script>

<div class="text-input">
	{#if props.label}
		<label for={props.name}>{props.label}</label>
	{/if}
	<input
		bind:value
		bind:this={input}
		oninput={() => props.onvalue?.(value)}
		name={props.name}
		placeholder={props.placeholder}
		type="text"
		class:text-input--readonly={props.readonly}
	/>
</div>

<style lang="scss">
	.text-input {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			text-transform: lowercase;
		}

		input {
			line-height: 1;
			font-size: inherit;
			font-family: inherit;
			font-weight: inherit;
			text-transform: lowercase;
			padding: 0.5rem;
			height: calc(var(--main-font-size) + 1rem);
			border: none;
			background-color: lightgray;
			border-radius: 5px;
			min-height: 2rem;
			outline: none;
			box-sizing: border-box;
		}

		&--readonly {
			pointer-events: none;
			opacity: 0.8;
			color: gray;
		}
	}
</style>
