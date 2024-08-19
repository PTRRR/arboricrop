<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import type { Field } from '../../utils/types';

	export let field: Field | undefined = undefined;
	export let onSave: ((field: Field) => void) | undefined = undefined;
	export let onDelete: ((id: string) => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;

	let id: HTMLInputElement;
	let name: HTMLInputElement;
	let type: HTMLInputElement;
</script>

<div class="field-form">
	<label for="">Id:</label>
	<input bind:this={id} type="text" value={field?.id || `fie-${createId()}`} />
	<label for="">Name:</label>
	<input bind:this={name} type="text" placeholder="Field name" value={field?.name || ''} />
	<label for="">Type:</label>
	<input bind:this={type} type="text" placeholder="Field type" value={field?.type || ''} />

	<slot />

	<Button
		on:click={() =>
			onSave?.({
				id: id.value,
				name: name.value,
				type: type.value
			})}
	>
		Save
	</Button>
	<Button on:click={() => onCancel?.()}>Cancel</Button>

	{#if field}
		<Button on:click={() => onDelete?.(id.value)}>Delete</Button>
	{/if}
</div>

<style>
	.field-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
