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
	let input: HTMLTextAreaElement | null = $state(null);

	onMount(() => {
		if (props.autoFocus) {
			input?.focus();
		}

		if (props.onvalue && props.defaultValue) {
			props.onvalue(props.defaultValue);
		}
	});
</script>

<div class="textarea-input">
	{#if props.label}
		<label for={props.name}>{props.label}</label>
	{/if}
	<textarea
		bind:value
		bind:this={input}
		spellcheck="false"
		oninput={() => props.onvalue?.(value)}
		name={props.name}
		placeholder={props.placeholder}
		class:textarea-input--readonly={props.readonly}
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
			background-color: rgb(235, 235, 235);
			border-radius: 5px;
			max-width: 100%;
			min-height: 10rem;
			outline: none;
			box-sizing: border-box;
			resize: vertical;
			font-weight: normal;
		}

		&--readonly {
			pointer-events: none;
			opacity: 0.8;
			color: gray;
		}
	}
</style>
