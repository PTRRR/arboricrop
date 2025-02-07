<script lang="ts">
	import { onMount } from 'svelte';

	let {
		name,
		label,
		defaultValue,
		value = $bindable(undefined),
		placeholder,
		autoFocus,
		readonly,
		onvalue,
		type
	}: {
		name?: string;
		label?: string;
		defaultValue?: string;
		value?: string;
		placeholder?: string;
		autoFocus?: boolean;
		readonly?: boolean;
		onvalue?: (value: string) => void;
		type?: 'text' | 'password';
	} = $props();

	let input: HTMLInputElement | null = $state(null);

	if (defaultValue) {
		value = defaultValue;
	}

	onMount(() => {
		if (autoFocus) {
			input?.focus();
		}

		if (onvalue && defaultValue) {
			onvalue(defaultValue);
		}
	});
</script>

<div class="text-input">
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	<input
		bind:value
		bind:this={input}
		oninput={() => onvalue?.(value || '')}
		{name}
		{placeholder}
		{type}
		class:text-input--readonly={readonly}
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
			background-color: rgb(235, 235, 235);
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
