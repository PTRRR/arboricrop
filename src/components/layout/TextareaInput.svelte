<script lang="ts">
	import { onMount } from 'svelte';

	let {
		name,
		label,
		defaultValue,
		value = $bindable(),
		placeholder,
		autoFocus,
		readonly,
		onvalue
	}: {
		name?: string;
		label?: string;
		defaultValue?: string;
		value?: string;
		placeholder?: string;
		autoFocus?: boolean;
		readonly?: boolean;
		onvalue?: (value: string) => void;
	} = $props();

	let input: HTMLTextAreaElement | null = $state(null);

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

<div class="textarea-input">
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	<textarea
		bind:value
		bind:this={input}
		spellcheck="false"
		oninput={() => onvalue?.(value || '')}
		{name}
		{placeholder}
		class:textarea-input--readonly={readonly}
	></textarea>
</div>

<style lang="scss">
	.textarea-input {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			text-transform: lowercase;
		}

		textarea {
			line-height: 1;
			font-size: inherit;
			font-family: inherit;
			font-weight: inherit;
			text-transform: lowercase;
			padding: 0.5rem;
			height: calc(var(--main-font-size) + 1rem);
			border: none;
			background-color: var(--grey);
			border-radius: 5px;
			max-width: 100%;
			min-height: 10rem;
			outline: none;
			box-sizing: border-box;
			resize: vertical;
		}

		&--readonly {
			pointer-events: none;
			opacity: 0.8;
			color: gray;
		}
	}
</style>
